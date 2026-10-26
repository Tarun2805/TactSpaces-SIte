export function initializeGoogleAnalytics() {
  if (process.env.NODE_ENV !== 'production' || typeof window === 'undefined') return;

  const measurementId = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? process.env.VITE_GA_MEASUREMENT_ID)?.trim();
  if (!measurementId || !/^G-[A-Z0-9]+$/.test(measurementId)) return;
  if (document.querySelector('script[data-google-analytics]')) return;

  window.dataLayer ??= [];
  window.gtag ??= function (..._args: unknown[]) {
    // Google's tag consumes argument objects queued before the script loads.
    window.dataLayer!.push(arguments);
  };

  window.gtag('js', new Date());
  // GA4 sends the initial page_view; each navigation loads a new document.
  window.gtag('config', measurementId);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  script.dataset.googleAnalytics = measurementId;
  document.head.append(script);
}
