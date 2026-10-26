import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initializeGoogleAnalytics } from '../lib/google-analytics';

describe('Google Analytics', () => {
  beforeEach(() => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-ABC1234567');
  });

  afterEach(() => {
    document.querySelectorAll('script[data-google-analytics]').forEach((script) => script.remove());
    delete window.dataLayer;
    delete window.gtag;
    vi.unstubAllEnvs();
  });

  it.each([undefined, '', '   ', '123456789', 'GTM-ABC123', 'G-', 'G-ABC<script>'])('does not load analytics for an absent or invalid ID: %s', (id) => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', id);

    initializeGoogleAnalytics();

    expect(document.querySelector('script[data-google-analytics]')).toBeNull();
    expect(window.dataLayer).toBeUndefined();
    expect(window.gtag).toBeUndefined();
  });

  it('does not track development visits even when an ID is configured', () => {
    vi.stubEnv('NODE_ENV', 'development');

    initializeGoogleAnalytics();

    expect(document.querySelector('script[data-google-analytics]')).toBeNull();
    expect(window.dataLayer).toBeUndefined();
  });

  it('queues GA4 initialization and loads the tag asynchronously', () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', ' G-ABC1234567 ');

    initializeGoogleAnalytics();

    const script = document.querySelector<HTMLScriptElement>('script[data-google-analytics]');
    expect(script?.src).toBe('https://www.googletagmanager.com/gtag/js?id=G-ABC1234567');
    expect(script?.async).toBe(true);
    expect(script?.parentElement).toBe(document.head);
    const commands = window.dataLayer!.map((command) => Array.from(command as IArguments));
    expect(commands).toEqual([
      ['js', expect.any(Date)],
      ['config', 'G-ABC1234567'],
    ]);
  });

  it('does not duplicate the script or initial page view on repeated initialization', () => {
    initializeGoogleAnalytics();
    initializeGoogleAnalytics();

    expect(document.querySelectorAll('script[data-google-analytics]')).toHaveLength(1);
    expect(window.dataLayer).toHaveLength(2);
  });

  it('preserves an existing data layer', () => {
    const existingEvent = { event: 'existing-event' };
    const dataLayer = [existingEvent];
    window.dataLayer = dataLayer;

    initializeGoogleAnalytics();

    expect(window.dataLayer).toBe(dataLayer);
    expect(window.dataLayer?.[0]).toBe(existingEvent);
    expect(window.dataLayer).toHaveLength(3);
  });

  it('preserves an existing Google tag function', () => {
    const gtag = vi.fn();
    window.gtag = gtag;

    initializeGoogleAnalytics();

    expect(window.gtag).toBe(gtag);
    expect(gtag).toHaveBeenNthCalledWith(1, 'js', expect.any(Date));
    expect(gtag).toHaveBeenNthCalledWith(2, 'config', 'G-ABC1234567');
  });
});
