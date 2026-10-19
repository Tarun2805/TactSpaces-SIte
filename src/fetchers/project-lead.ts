import {
  PROJECT_LEAD_BUSY, PROJECT_LEAD_MESSAGE_TYPE, PROJECT_LEAD_REJECTED,
  PROJECT_LEAD_TIMEOUT, PROJECT_LEAD_TIMEOUT_MS, PROJECT_LEAD_UNAVAILABLE,
} from '../constants/project-lead';
import type { ProjectLeadSubmission } from '../types/project-lead';

export function getProjectLeadEndpoint(): string | null {
  const value = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL?.trim();
  return value && /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(value) ? value : null;
}

function isAppsScriptOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    return url.protocol === 'https:' && !url.port && (
      url.hostname === 'script.google.com' || url.hostname === 'script.googleusercontent.com'
      || /^[a-z0-9-]+-script\.googleusercontent\.com$/.test(url.hostname)
    );
  } catch {
    return false;
  }
}

// A native form POST avoids Apps Script's CORS/preflight limitations. The script's
// sandboxed HTML frame confirms the write using postMessage, never an iframe load
// event or an opaque no-cors response. No Google credentials enter this bundle.
export function submitProjectLead(payload: ProjectLeadSubmission, signal: AbortSignal): Promise<void> {
  const endpoint = getProjectLeadEndpoint();
  if (!endpoint) return Promise.reject(new Error(PROJECT_LEAD_UNAVAILABLE));
  if (signal.aborted) return Promise.reject(new DOMException('Aborted', 'AbortError'));

  return new Promise((resolve, reject) => {
    const frame = document.createElement('iframe');
    frame.name = `lead-${crypto.randomUUID()}`;
    frame.title = 'Enquiry submission';
    frame.hidden = true;
    frame.setAttribute('aria-hidden', 'true');
    const form = document.createElement('form');
    form.hidden = true;
    form.method = 'POST';
    form.action = endpoint;
    form.target = frame.name;
    form.acceptCharset = 'UTF-8';
    for (const [name, value] of Object.entries({ payload: JSON.stringify(payload), websiteOrigin: window.location.origin })) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.append(input);
    }

    const cleanup = () => {
      window.clearTimeout(timeout);
      window.removeEventListener('message', onMessage);
      signal.removeEventListener('abort', onAbort);
      form.remove();
      frame.remove();
    };
    const onAbort = () => {
      cleanup();
      reject(new DOMException('Aborted', 'AbortError'));
    };
    const onMessage = (event: MessageEvent) => {
      const result = event.data;
      // HtmlService adds a nested Google sandbox, so event.source is not the
      // outer frame's contentWindow. Check Google's origin AND the random nonce.
      if (!isAppsScriptOrigin(event.origin) || !result || result.type !== PROJECT_LEAD_MESSAGE_TYPE || result.requestId !== payload.requestId) return;
      if (typeof result.ok !== 'boolean') return;
      cleanup();
      if (result.ok) resolve();
      else reject(new Error(result.code === 'busy' ? PROJECT_LEAD_BUSY : PROJECT_LEAD_REJECTED));
    };
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error(PROJECT_LEAD_TIMEOUT));
    }, PROJECT_LEAD_TIMEOUT_MS);
    window.addEventListener('message', onMessage);
    signal.addEventListener('abort', onAbort, { once: true });
    document.body.append(frame, form);
    try {
      HTMLFormElement.prototype.submit.call(form);
    } catch {
      cleanup();
      reject(new Error(PROJECT_LEAD_UNAVAILABLE));
    }
  });
}
