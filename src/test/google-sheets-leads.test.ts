import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it, vi } from 'vitest';
import { PROJECT_LEAD_LIMITS, PROJECT_LEAD_MESSAGE_TYPE } from '../constants/project-lead';
import { MAX_PROJECT_BUDGET, MIN_PROJECT_BUDGET, PROJECT_SCOPES, PROJECT_TIMELINES, PROJECT_TYPOLOGIES } from '../constants/project-planner';
import type { ProjectLeadDetails } from '../types/project-lead';
import { PROJECT_LEAD_FIXTURE } from './project-lead-fixtures';

// Run the actual copy-paste .gs file, not a separate JS reimplementation. Google
// services are mocked; deployment, OAuth, iframe and live Sheet checks are manual.
const SCRIPT = readFileSync('scripts/google-sheets-leads.gs', 'utf8');

function createScript() {
  const rows: unknown[][] = [];
  const properties = new Map<string, string>();
  const cache = new Map<string, string>();
  const setNumberFormat = vi.fn();
  const getRange = (start: number | string, column = 1, height = 1, width = 1) => {
    const row = typeof start === 'number' ? start : 2;
    const range = {
      getValues: () => Array.from({ length: height }, (_, offset) =>
        Array.from({ length: width }, (__, cell) => rows[row - 1 + offset]?.[column - 1 + cell] ?? '')),
      getValue: () => rows[row - 1]?.[column - 1] ?? '',
      getRow: () => row,
      setValues: vi.fn((values: unknown[][]) => {
        values.forEach((valuesRow, offset) => {
          rows[row - 1 + offset] ??= [];
          valuesRow.forEach((value, cell) => { rows[row - 1 + offset][column - 1 + cell] = value; });
        });
      }),
      setNumberFormat,
      setFontWeight: vi.fn(),
      setDataValidation: vi.fn(),
      createTextFinder: (id: string) => ({
        matchEntireCell: () => ({
          findNext: () => {
            const index = rows.slice(row - 1, row - 1 + height).findIndex((entry) => entry[column - 1] === id);
            return index < 0 ? null : { getRow: () => row + index };
          },
        }),
      }),
    };
    return range;
  };
  const sheet = { getLastRow: () => rows.length, getRange, getMaxRows: () => 1000, insertRowsAfter: vi.fn(), setFrozenRows: vi.fn() };
  const spreadsheet = {
    getSheetByName: vi.fn(() => sheet), insertSheet: vi.fn(() => sheet),
    getId: () => 'private-sheet-id', getUrl: () => 'https://docs.google.com/spreadsheets/d/private-sheet-id/edit',
  };
  const validation = { requireValueInList: vi.fn(), setAllowInvalid: vi.fn(), build: vi.fn() };
  validation.requireValueInList.mockReturnValue(validation);
  validation.setAllowInvalid.mockReturnValue(validation);
  const services = {
    SpreadsheetApp: {
      getActiveSpreadsheet: () => spreadsheet, openById: vi.fn(() => spreadsheet),
      newDataValidation: () => validation, flush: vi.fn(),
    },
    PropertiesService: { getScriptProperties: () => ({
      getProperty: (key: string) => properties.get(key),
      setProperty: (key: string, value: string) => properties.set(key, value),
    }) },
    CacheService: { getScriptCache: () => ({ get: (key: string) => cache.get(key), put: (key: string, value: string) => cache.set(key, value) }) },
    LockService: { getScriptLock: () => lock },
    Utilities: {
      computeDigest: (_algorithm: string, text: string) => createHash('sha256').update(text).digest(),
      base64EncodeWebSafe: (bytes: Uint8Array) => Buffer.from(bytes).toString('base64url'),
      DigestAlgorithm: { SHA_256: 'sha256' }, Charset: { UTF_8: 'utf8' },
    },
    HtmlService: {
      XFrameOptionsMode: { ALLOWALL: 'ALLOWALL' },
      createHtmlOutput: (html: string) => ({ html, setXFrameOptionsMode() { return this; } }),
    },
    MailApp: { sendEmail: vi.fn() },
    console: { error: vi.fn(), warn: vi.fn() },
  };
  const lock = { waitLock: vi.fn(), tryLock: vi.fn(() => true), releaseLock: vi.fn() };
  const api = runInNewContext(`${SCRIPT}\n;({ setupLeadSheet, doPost, doGet, validateLead_, LEAD_CONFIG, LEAD_HEADERS });`, services) as {
    setupLeadSheet: () => void;
    doPost: (event: { parameter: { payload: string; websiteOrigin: string } }) => { html: string };
    doGet: () => { html: string };
    validateLead_: (payload: unknown) => ProjectLeadDetails;
    LEAD_CONFIG: { notificationEmail: string; maxNewLeadsPerMinute: number; allowedOrigins: string[] };
    LEAD_HEADERS: string[];
  };
  api.setupLeadSheet();
  lock.releaseLock.mockClear();

  const post = (overrides = {}, origin = 'https://tactspaces.in') => {
    const output = api.doPost({ parameter: { payload: JSON.stringify({ ...PROJECT_LEAD_FIXTURE, ...overrides }), websiteOrigin: origin } });
    const json = output.html.match(/window\.top\.postMessage\((\{.*\}), /)?.[1];
    return { output, result: json ? JSON.parse(json) as { type: string; requestId: string; ok: boolean; code: string } : null };
  };
  return { api, rows, properties, cache, services, lock, spreadsheet, setNumberFormat, post };
}

describe('client Google Sheets Apps Script', () => {
  it('sets up a private sheet without overwriting existing data', () => {
    const { api, rows, properties } = createScript();
    expect(rows[0]).toEqual(Array.from(api.LEAD_HEADERS));
    expect(properties.get('LEAD_SPREADSHEET_ID')).toBe('private-sheet-id');
    rows.push(['keep existing lead']);
    api.setupLeadSheet();
    expect(rows[1]).toEqual(['keep existing lead']);
    rows[0][0] = 'Unexpected header';
    expect(() => api.setupLeadSheet()).toThrow('Lead columns changed');
    expect(rows[1]).toEqual(['keep existing lead']);
  });

  it('saves the complete payload and acknowledges only after flushing the write', () => {
    const { post, rows, services, lock } = createScript();
    const { result, output } = post();
    expect(result).toEqual({ type: PROJECT_LEAD_MESSAGE_TYPE, requestId: PROJECT_LEAD_FIXTURE.requestId, ok: true, code: '' });
    expect(rows).toHaveLength(2);
    expect(rows[1].slice(3)).toEqual([
      'Test Client', "'+91 98765 43210", 'client@example.com', 'Indiranagar, Bengaluru',
      'Villa', '', 'Turnkey Execution', '1–3 months', 25, 'New', '', '', '',
    ]);
    expect(services.SpreadsheetApp.flush).toHaveBeenCalledOnce();
    expect(lock.releaseLock).toHaveBeenCalledOnce();
    expect(output.html).toContain(', "https://tactspaces.in");');
    expect(output.html).not.toContain('client@example.com');
    expect(services.MailApp.sendEmail).not.toHaveBeenCalled();
  });

  it('confirms unchanged retries without appending or emailing again', () => {
    const { api, post, rows, services } = createScript();
    api.LEAD_CONFIG.notificationEmail = 'team@example.com';
    expect(post().result?.ok).toBe(true);
    expect(post().result?.ok).toBe(true);
    expect(rows).toHaveLength(2);
    expect(services.MailApp.sendEmail).toHaveBeenCalledOnce();
    expect(post({ email: 'different@example.com' }).result).toMatchObject({ ok: false, code: 'invalid' });
    expect(rows).toHaveLength(2);
  });

  it('rejects malformed or spam fields without saving anything', () => {
    const { post, rows, api } = createScript();
    for (const override of [
      { website: 'bot' }, { name: ' ' }, { phone: '123' }, { phone: '1'.repeat(16) },
      { email: 'invalid' }, { location: '' }, { budget: '25' }, { budget: 26 }, { budget: 200 },
      { typology: 'Unknown' }, { scope: 'Unknown' }, { timeline: 'Unknown' },
      { typology: 'Other', typologyOther: '' }, { name: 'first\nlast' }, { requestId: 'bad-id' },
    ]) expect(post(override).result?.ok).not.toBe(true);
    expect(() => api.validateLead_({ ...PROJECT_LEAD_FIXTURE, startedAt: NaN })).toThrow('invalid');
    expect(rows).toHaveLength(1);
  });

  it('keeps server options and field limits aligned with the planner', () => {
    const { api } = createScript();
    for (const { value: typology } of PROJECT_TYPOLOGIES) {
      expect(() => api.validateLead_({ ...PROJECT_LEAD_FIXTURE, typology, typologyOther: typology === 'Other' ? 'Clinic' : '' })).not.toThrow();
    }
    for (const { value: scope } of PROJECT_SCOPES) expect(() => api.validateLead_({ ...PROJECT_LEAD_FIXTURE, scope })).not.toThrow();
    for (const timeline of PROJECT_TIMELINES) expect(() => api.validateLead_({ ...PROJECT_LEAD_FIXTURE, timeline })).not.toThrow();
    for (const budget of [MIN_PROJECT_BUDGET, MAX_PROJECT_BUDGET]) expect(() => api.validateLead_({ ...PROJECT_LEAD_FIXTURE, budget })).not.toThrow();
    for (const field of ['name', 'email', 'location', 'typologyOther'] as const) {
      const base = field === 'email' ? 'a@b.c' : 'x';
      const value = 'a'.repeat(PROJECT_LEAD_LIMITS[field] - base.length) + base;
      expect(() => api.validateLead_({ ...PROJECT_LEAD_FIXTURE, [field]: value })).not.toThrow();
      expect(() => api.validateLead_({ ...PROJECT_LEAD_FIXTURE, [field]: value + 'x' })).toThrow('invalid');
    }
  });

  it('escapes formula-like contact text and custom project descriptions', () => {
    const { post, rows, setNumberFormat } = createScript();
    expect(post({ name: '=1+1', location: '@SUM(A1)', typology: 'Other', typologyOther: '-42' }).result?.ok).toBe(true);
    expect(rows[1][3]).toBe("'=1+1");
    expect(rows[1][6]).toBe("'@SUM(A1)");
    expect(rows[1][8]).toBe("'-42");
    expect(setNumberFormat).toHaveBeenCalledWith('@');
  });

  it('does not write when the origin, setup, schema or lock is invalid', () => {
    const { post, rows, properties, lock } = createScript();
    expect(post({}, 'https://evil.test').result).toBeNull();
    properties.clear();
    expect(post().result).toMatchObject({ ok: false, code: 'server' });
    properties.set('LEAD_SPREADSHEET_ID', 'private-sheet-id');
    lock.tryLock.mockReturnValueOnce(false);
    expect(post().result).toMatchObject({ ok: false, code: 'busy' });
    rows[0][0] = 'Changed header';
    expect(post().result).toMatchObject({ ok: false, code: 'server' });
    expect(rows).toHaveLength(1);
  });

  it('applies the shared burst limit but allows retries of existing leads', () => {
    const { api, post, rows } = createScript();
    api.LEAD_CONFIG.maxNewLeadsPerMinute = 1;
    expect(post().result?.ok).toBe(true);
    expect(post({ requestId: 'd94152fd-d807-4203-989a-9a1b6bc115ef' }).result).toMatchObject({ ok: false, code: 'busy' });
    expect(post().result?.ok).toBe(true);
    expect(rows).toHaveLength(2);
  });

  it('never acknowledges a flush failure and safely confirms its retry', () => {
    const { post, rows, services, lock } = createScript();
    services.SpreadsheetApp.flush.mockImplementationOnce(() => { throw new Error('quota'); });
    expect(post().result).toMatchObject({ ok: false, code: 'server' });
    expect(lock.releaseLock).toHaveBeenCalledOnce();
    expect(post().result?.ok).toBe(true);
    expect(rows).toHaveLength(2);
  });

  it('does not lose a saved lead when optional email fails or expose leads on GET', () => {
    const { api, post, rows, services } = createScript();
    api.LEAD_CONFIG.notificationEmail = 'team@example.com';
    services.MailApp.sendEmail.mockImplementation(() => { throw new Error('mail quota'); });
    expect(post().result?.ok).toBe(true);
    expect(rows).toHaveLength(2);
    expect(services.console.warn).toHaveBeenCalledOnce();
    expect(api.doGet().html).not.toContain('private-sheet-id');
    expect(api.doGet().html).not.toContain('client@example.com');
  });
});
