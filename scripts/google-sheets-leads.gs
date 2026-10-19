/**
 * Paste this entire file into Extensions → Apps Script in the CLIENT'S Sheet.
 * Configure allowedOrigins, run setupLeadSheet once, then deploy as a Web app:
 * Execute as: Me; Who has access: Anyone. Use the /exec URL in the website build.
 * Full instructions: docs/lead-capture.md. No paid services or libraries needed.
 */
const LEAD_CONFIG = {
  allowedOrigins: ['https://tactspaces.in', 'https://www.tactspaces.in'],
  sheetName: 'Website Leads',
  // Optional team notification. Leave blank to only save leads to the Sheet.
  notificationEmail: '',
  maxNewLeadsPerMinute: 20,
};

const LEAD_HEADERS = [
  'Received at', 'Submission ID', 'Payload hash', 'Full name', 'Phone', 'Email',
  'Project location', 'Project type', 'Other project type', 'Scope', 'Timeline',
  'Budget (INR lakh)', 'Status', 'Assigned to', 'Next follow-up', 'Notes',
];
const LEAD_MESSAGE_TYPE = 'tactspaces:lead-result';
const LEAD_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function setupLeadSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('Open Apps Script from the client Google Sheet first.');
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = spreadsheet.getSheetByName(LEAD_CONFIG.sheetName) || spreadsheet.insertSheet(LEAD_CONFIG.sheetName);
    if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, LEAD_HEADERS.length).setValues([LEAD_HEADERS]);
    assertLeadHeaders_(sheet);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, LEAD_HEADERS.length).setFontWeight('bold');
    sheet.getRange('M2:M').setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(['New', 'Contacted', 'Site visit', 'Won', 'Lost'], true)
      .setAllowInvalid(false).build());
    PropertiesService.getScriptProperties().setProperty('LEAD_SPREADSHEET_ID', spreadsheet.getId());
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  // Never expose the Sheet, lead data, or credentials from this public endpoint.
  return HtmlService.createHtmlOutput('TactSpaces enquiry endpoint. Submit enquiries from the website.');
}

function doPost(event) {
  const parameters = event && event.parameter ? event.parameter : {};
  const origin = parameters.websiteOrigin;
  // This is a destination allowlist, not authentication: callers can forge form
  // fields. The endpoint is deliberately public; keep the spreadsheet private.
  if (LEAD_CONFIG.allowedOrigins.indexOf(origin) === -1) {
    return HtmlService.createHtmlOutput('This website is not configured for enquiries.');
  }

  let requestId = '';
  let result;
  try {
    if (typeof parameters.payload !== 'string' || parameters.payload.length > 10000) throw new Error('invalid');
    const payload = JSON.parse(parameters.payload);
    if (!payload || typeof payload !== 'object' || !LEAD_ID_PATTERN.test(payload.requestId)) throw new Error('invalid');
    requestId = payload.requestId;
    const details = validateLead_(payload);
    result = saveLead_(requestId, details, origin);
  } catch (error) {
    const code = error && (error.message === 'invalid' || error.message === 'busy') ? error.message : 'server';
    // Do not log contact details or the submitted payload.
    if (code === 'server') console.error('Lead write failed. Check spreadsheet setup, permissions, and execution quotas.');
    result = { ok: false, code: code };
  }
  return leadResponse_(origin, requestId, result);
}

function validateLead_(payload) {
  const text = function (key, min, max) {
    if (typeof payload[key] !== 'string') throw new Error('invalid');
    const value = payload[key].trim();
    if (value.length < min || value.length > max || /[\u0000-\u001f\u007f]/.test(value)) throw new Error('invalid');
    return value;
  };
  const details = {
    name: text('name', 2, 120), phone: text('phone', 7, 30), email: text('email', 3, 254),
    location: text('location', 2, 200), typology: text('typology', 1, 40),
    typologyOther: text('typologyOther', 0, 200), scope: text('scope', 1, 40),
    timeline: text('timeline', 1, 40), budget: payload.budget,
  };
  if (payload.website !== '' || !Number.isFinite(payload.startedAt) || payload.startedAt <= 0) throw new Error('invalid');
  // Only a basic bot signal; this timestamp is client-supplied, not a security token.
  const elapsed = Date.now() - payload.startedAt;
  if (elapsed >= 0 && elapsed < 1500) throw new Error('invalid');
  const digits = details.phone.replace(/\D/g, '');
  if (!/^\+?[\d\s().-]+$/.test(details.phone) || digits.length < 7 || digits.length > 15) throw new Error('invalid');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) throw new Error('invalid');
  if (['Villa', 'Flat', 'Commercial', 'Institutional', 'Other'].indexOf(details.typology) === -1) throw new Error('invalid');
  if (details.typology === 'Other' && details.typologyOther.length < 2) throw new Error('invalid');
  if (details.typology !== 'Other') details.typologyOther = '';
  if (['Design Only', 'Turnkey Execution'].indexOf(details.scope) === -1) throw new Error('invalid');
  if (['< 1 month', '1–3 months', '3–6 months', 'Flexible'].indexOf(details.timeline) === -1) throw new Error('invalid');
  if (!Number.isFinite(details.budget) || details.budget < 5 || details.budget > 150 || details.budget % 5 !== 0) throw new Error('invalid');
  return details;
}

function saveLead_(requestId, details, origin) {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('LEAD_SPREADSHEET_ID');
  if (!spreadsheetId) throw new Error('setup');
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(LEAD_CONFIG.sheetName);
  if (!sheet) throw new Error('setup');
  const hash = Utilities.base64EncodeWebSafe(Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, JSON.stringify(details), Utilities.Charset.UTF_8));
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) throw new Error('busy');
  try {
    assertLeadHeaders_(sheet);
    const lastRow = sheet.getLastRow();
    const existing = lastRow > 1 ? sheet.getRange(2, 2, lastRow - 1, 1)
      .createTextFinder(requestId).matchEntireCell(true).findNext() : null;
    if (existing) {
      if (sheet.getRange(existing.getRow(), 3).getValue() !== hash) throw new Error('invalid');
      return { ok: true };
    }

    // Best-effort burst protection. Does not prevent a determined attacker from
    // invoking this public web app or consuming Google's execution quotas.
    const cache = CacheService.getScriptCache();
    const rateKey = 'lead-minute-' + Math.floor(Date.now() / 60000);
    const count = Number(cache.get(rateKey) || 0);
    if (count >= LEAD_CONFIG.maxNewLeadsPerMinute) throw new Error('busy');
    cache.put(rateKey, String(count + 1), 120);

    const row = [
      new Date(), requestId, hash, literalLeadText_(details.name), literalLeadText_(details.phone),
      literalLeadText_(details.email), literalLeadText_(details.location), details.typology,
      literalLeadText_(details.typologyOther), details.scope, details.timeline,
      details.budget, 'New', '', '', '',
    ];
    if (lastRow >= sheet.getMaxRows()) sheet.insertRowsAfter(lastRow, 100);
    // Set user-entered columns to plain text AND escape formula-like prefixes.
    sheet.getRange(lastRow + 1, 4, 1, 8).setNumberFormat('@');
    sheet.getRange(lastRow + 1, 1, 1, row.length).setValues([row]);
    sheet.getRange(lastRow + 1, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }

  // Email is optional and never changes a successfully saved enquiry to failure.
  // A retry of an existing Submission ID does not send another notification.
  if (LEAD_CONFIG.notificationEmail) {
    try {
      MailApp.sendEmail({
        to: LEAD_CONFIG.notificationEmail,
        subject: 'New TactSpaces website enquiry',
        body: 'A new project enquiry was saved from ' + origin + '.\n\nOpen the private lead tracker:\n'
          + spreadsheet.getUrl() + '\n\nSubmission ID: ' + requestId,
      });
    } catch (error) {
      console.warn('Lead saved, but the optional notification email failed. Check MailApp permissions and quota.');
    }
  }
  return { ok: true };
}

function assertLeadHeaders_(sheet) {
  const headers = sheet.getRange(1, 1, 1, LEAD_HEADERS.length).getValues()[0];
  if (headers.some(function (value, index) { return value !== LEAD_HEADERS[index]; })) {
    throw new Error('Lead columns changed. Restore the original header names and order; do not overwrite existing data.');
  }
}

function literalLeadText_(value) {
  return /^[\s]*[=+\-@']/.test(value) ? "'" + value : value;
}

function leadResponse_(origin, requestId, result) {
  const response = { type: LEAD_MESSAGE_TYPE, requestId: requestId, ok: result.ok, code: result.code || '' };
  const safeJson = function (value) {
    return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  };
  // HtmlService runs inside Google's nested sandbox. Reply to the WEBSITE's top
  // window, not Google's intermediate frame; never use '*' as the destination.
  return HtmlService.createHtmlOutput('<!doctype html><html><head><meta charset="utf-8"></head><body><script>'
    + 'window.top.postMessage(' + safeJson(response) + ', ' + safeJson(origin) + ');'
    + '</script></body></html>').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
