import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PROJECT_LEAD_BUSY, PROJECT_LEAD_MESSAGE_TYPE, PROJECT_LEAD_TIMEOUT, PROJECT_LEAD_TIMEOUT_MS } from '../constants/project-lead';
import { getProjectLeadEndpoint, submitProjectLead } from '../fetchers/project-lead';
import { validateProjectLead } from '../lib/validations/project-lead';
import { PROJECT_LEAD_FIXTURE, PROJECT_LEAD_TEST_ENDPOINT } from './project-lead-fixtures';

describe('project lead validation', () => {
  it('accepts the complete planner payload', () => {
    expect(validateProjectLead(PROJECT_LEAD_FIXTURE)).toEqual({});
  });

  it.each([
    ['name', ' '], ['name', 'a'.repeat(121)], ['phone', '123'], ['phone', 'call me 9876543210'],
    ['phone', '1'.repeat(16)], ['email', 'client@'], ['location', ' '], ['typology', 'Unknown'],
    ['scope', 'Unknown'], ['timeline', 'Unknown'], ['budget', 4], ['budget', 26], ['budget', 151], ['budget', NaN],
  ])('rejects invalid %s: %s', (field, value) => {
    expect(validateProjectLead({ ...PROJECT_LEAD_FIXTURE, [field]: value })).toHaveProperty(field);
  });

  it('requires custom project text only for Other', () => {
    expect(validateProjectLead({ ...PROJECT_LEAD_FIXTURE, typology: 'Other' })).toHaveProperty('typologyOther');
    expect(validateProjectLead({ ...PROJECT_LEAD_FIXTURE, typology: 'Other', typologyOther: 'Clinic' })).toEqual({});
  });
});

describe('Apps Script submission transport', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_GOOGLE_APPS_SCRIPT_URL', PROJECT_LEAD_TEST_ENDPOINT);
    vi.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation(() => {});
  });
  afterEach(() => vi.unstubAllEnvs());

  const reply = (data: unknown, origin = 'https://abc-script.googleusercontent.com') => {
    window.dispatchEvent(new MessageEvent('message', { origin, data }));
  };
  const success = { type: PROJECT_LEAD_MESSAGE_TYPE, requestId: PROJECT_LEAD_FIXTURE.requestId, ok: true };

  it.each([undefined, '', 'https://evil.test/exec', 'https://script.google.com/macros/s/id/dev', 'https://script.google.com/macros/s/id/exec?x=1'])('disables missing/invalid endpoints: %s', async (value) => {
    vi.stubEnv('VITE_GOOGLE_APPS_SCRIPT_URL', value);
    expect(getProjectLeadEndpoint()).toBeNull();
    await expect(submitProjectLead(PROJECT_LEAD_FIXTURE, new AbortController().signal)).rejects.toThrow('unavailable');
    expect(document.querySelector('iframe')).toBeNull();
  });

  it('POSTs all fields without navigation and waits for a verified save confirmation', async () => {
    const pending = submitProjectLead(PROJECT_LEAD_FIXTURE, new AbortController().signal);
    const form = document.querySelector<HTMLFormElement>('form')!;
    const frame = document.querySelector<HTMLIFrameElement>('iframe')!;
    expect(form.method).toBe('post');
    expect(form.action).toBe(PROJECT_LEAD_TEST_ENDPOINT);
    expect(form.target).toBe(frame.name);
    expect(JSON.parse(String(new FormData(form).get('payload')))).toEqual(PROJECT_LEAD_FIXTURE);
    expect(new FormData(form).get('websiteOrigin')).toBe(window.location.origin);
    expect(HTMLFormElement.prototype.submit).toHaveBeenCalledOnce();
    let resolved = false;
    void pending.then(() => { resolved = true; });
    frame.dispatchEvent(new Event('load'));
    reply(success, 'https://evil.test');
    reply(success, 'https://script.google.com.evil.test');
    reply(success, 'http://script.google.com');
    reply({ ...success, requestId: 'wrong-nonce' });
    reply({ ...success, type: 'unrelated' });
    reply({ ...success, ok: 'true' });
    reply(null);
    await Promise.resolve();
    expect(resolved).toBe(false);
    reply(success);
    await expect(pending).resolves.toBeUndefined();
    expect(document.querySelector('iframe')).toBeNull();
    expect(document.querySelector('form')).toBeNull();
  });

  it('surfaces script rejection instead of reporting success', async () => {
    const pending = submitProjectLead(PROJECT_LEAD_FIXTURE, new AbortController().signal);
    const assertion = expect(pending).rejects.toThrow(PROJECT_LEAD_BUSY);
    reply({ ...success, ok: false, code: 'busy' });
    await assertion;
    expect(document.querySelector('iframe')).toBeNull();
  });

  it('times out and removes listeners and DOM nodes', async () => {
    vi.useFakeTimers();
    const pending = submitProjectLead(PROJECT_LEAD_FIXTURE, new AbortController().signal);
    const assertion = expect(pending).rejects.toThrow(PROJECT_LEAD_TIMEOUT);
    await vi.advanceTimersByTimeAsync(PROJECT_LEAD_TIMEOUT_MS);
    await assertion;
    expect(document.querySelector('iframe')).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
    reply(success); // Late confirmation has no pending listener.
  });

  it('aborts and cleans up when the form is unmounted', async () => {
    const controller = new AbortController();
    const pending = submitProjectLead(PROJECT_LEAD_FIXTURE, controller.signal);
    const assertion = expect(pending).rejects.toMatchObject({ name: 'AbortError' });
    controller.abort();
    await assertion;
    expect(document.querySelector('iframe')).toBeNull();
    expect(document.querySelector('form')).toBeNull();
    await expect(submitProjectLead(PROJECT_LEAD_FIXTURE, controller.signal)).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('cleans up if native form submission is blocked', async () => {
    vi.mocked(HTMLFormElement.prototype.submit).mockImplementation(() => { throw new Error('blocked'); });
    await expect(submitProjectLead(PROJECT_LEAD_FIXTURE, new AbortController().signal)).rejects.toThrow('unavailable');
    expect(document.querySelector('iframe')).toBeNull();
    expect(document.querySelector('form')).toBeNull();
  });
});
