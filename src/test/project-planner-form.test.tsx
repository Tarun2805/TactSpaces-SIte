import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjectPlannerForm } from '../components/forms/project-planner-form';
import { submitProjectLead } from '../fetchers/project-lead';
import { PROJECT_LEAD_TIMEOUT } from '../constants/project-lead';
import { PROJECT_LEAD_TEST_ENDPOINT } from './project-lead-fixtures';

vi.mock('../fetchers/project-lead', async (original) => ({
  ...await original<typeof import('../fetchers/project-lead')>(),
  submitProjectLead: vi.fn(),
}));

function reachContactStep() {
  fireEvent.click(screen.getByRole('button', { name: /Villa/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
  fireEvent.click(screen.getByRole('button', { name: /Turnkey Execution/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
  fireEvent.click(screen.getByRole('button', { name: '1–3 months' }));
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
}

function fillContactStep() {
  for (const [label, value] of Object.entries({
    'Full Name': 'Test Client', Phone: '+91 98765 43210', Email: 'client@example.com',
    'Project Location (Area, City)': 'Indiranagar, Bengaluru',
  })) fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

describe('real project enquiry submission', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_GOOGLE_APPS_SCRIPT_URL', PROJECT_LEAD_TEST_ENDPOINT);
    vi.mocked(submitProjectLead).mockReset();
  });
  afterEach(() => vi.unstubAllEnvs());

  it('disables unconfigured capture without displaying a fake success', () => {
    vi.stubEnv('VITE_GOOGLE_APPS_SCRIPT_URL', '');
    render(<ProjectPlannerForm />);
    reachContactStep();
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Submit to Discovery Team' }).disabled).toBe(true);
    expect(screen.getByRole('alert').textContent).toContain('Online enquiries are unavailable');
    expect(screen.queryByRole('status')).toBeNull();
    expect(submitProjectLead).not.toHaveBeenCalled();
  });

  it('requires an Other description before advancing', () => {
    render(<ProjectPlannerForm />);
    fireEvent.click(screen.getByRole('button', { name: /Other/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByLabelText("Tell us what you're building").getAttribute('aria-invalid')).toBe('true');
    expect(document.activeElement).toBe(screen.getByLabelText("Tell us what you're building"));
    expect(screen.getByText('Describe your project type (2–200 characters).')).toBeTruthy();
  });

  it('validates contact fields without attempting delivery', () => {
    render(<ProjectPlannerForm />);
    reachContactStep();
    fireEvent.click(screen.getByRole('button', { name: 'Submit to Discovery Team' }));
    for (const label of ['Full Name', 'Phone', 'Email', 'Project Location (Area, City)']) {
      const field = screen.getByLabelText(label);
      expect(field.getAttribute('aria-invalid')).toBe('true');
      expect(document.getElementById(field.getAttribute('aria-describedby')!)).toBeTruthy();
    }
    expect(submitProjectLead).not.toHaveBeenCalled();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('shows success only after acknowledgement, and prevents duplicate clicks while pending', async () => {
    let confirm = () => {};
    vi.mocked(submitProjectLead).mockImplementation(() => new Promise<void>((resolve) => { confirm = resolve; }));
    const { container } = render(<ProjectPlannerForm />);
    reachContactStep();
    fillContactStep();
    fireEvent.click(screen.getByRole('button', { name: 'Submit to Discovery Team' }));
    expect(screen.getByRole('status').textContent).toBe('Saving your enquiry…');
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Submitting…' }).disabled).toBe(true);
    expect(container.querySelector('fieldset')?.disabled).toBe(true);
    fireEvent.submit(screen.getByRole('form'));
    expect(submitProjectLead).toHaveBeenCalledOnce();
    expect(submitProjectLead).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Test Client', phone: '+91 98765 43210', budget: 25, typology: 'Villa',
      scope: 'Turnkey Execution', timeline: '1–3 months', website: '', requestId: expect.any(String),
    }), expect.any(AbortSignal));
    await act(async () => confirm());
    expect(screen.getByRole('status').textContent).toContain('Received.');
    expect(container.querySelector<HTMLElement>('.planner')?.style.display).toBe('none');
  });

  it('preserves fields and reuses the ID on an uncertain retry, but changes it after edits', async () => {
    vi.mocked(submitProjectLead).mockRejectedValue(new Error(PROJECT_LEAD_TIMEOUT));
    render(<ProjectPlannerForm />);
    reachContactStep();
    fillContactStep();
    const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Submit to Discovery Team' }));
    submit();
    await screen.findByRole('alert');
    expect(screen.getByRole('alert').textContent).toBe(PROJECT_LEAD_TIMEOUT);
    expect(screen.getByLabelText<HTMLInputElement>('Email').value).toBe('client@example.com');
    expect(screen.queryByRole('status')).toBeNull();
    const firstId = vi.mocked(submitProjectLead).mock.calls[0][0].requestId;
    submit();
    await waitFor(() => expect(vi.mocked(submitProjectLead).mock.calls).toHaveLength(2));
    await screen.findByRole('alert');
    expect(vi.mocked(submitProjectLead).mock.calls[1][0].requestId).toBe(firstId);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'changed@example.com' } });
    submit();
    await waitFor(() => expect(vi.mocked(submitProjectLead).mock.calls).toHaveLength(3));
    await screen.findByRole('alert');
    expect(vi.mocked(submitProjectLead).mock.calls[2][0].requestId).not.toBe(firstId);
  });

  it('cancels the pending confirmation listener on unmount', () => {
    vi.mocked(submitProjectLead).mockImplementation(() => new Promise<void>(() => {}));
    const { unmount } = render(<ProjectPlannerForm />);
    reachContactStep();
    fillContactStep();
    fireEvent.click(screen.getByRole('button', { name: 'Submit to Discovery Team' }));
    const signal = vi.mocked(submitProjectLead).mock.calls[0][1];
    unmount();
    expect(signal.aborted).toBe(true);
  });
});
