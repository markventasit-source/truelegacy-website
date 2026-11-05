/**
 * Lead-source attribution helpers.
 *
 * On page load, call `captureLeadSource()` once. It reads known query params
 * from the URL and writes them to sessionStorage so they survive client-side
 * navigation. Use `getLeadSource()` anywhere to retrieve the stored value.
 *
 * Supported query params (first non-empty one wins, checked in order):
 *   ?type=qr        → "succession-tool-qr"
 *   ?type=event     → "succession-tool-event"
 *   ?type=<custom>  → "succession-tool-<custom>"
 *   ?utm_source=…   → raw utm_source value
 *   (none)          → "succession-tool"  (default)
 */

const SESSION_KEY = "tl_lead_source";
const DEFAULT_SOURCE = "succession-tool";

/**
 * Read the URL and persist the lead source to sessionStorage.
 * Call once at app entry (e.g. inside RootLayout or main.jsx).
 * Only writes if a recognized param is present, so subsequent
 * navigations won't overwrite the original attribution.
 */
export const captureLeadSource = () => {
  const params = new URLSearchParams(window.location.search);
  const type = params.get("type")?.trim();
  const utmSource = params.get("utm_source")?.trim();
  
  // Check if we already have a stored source
  const existingSource = sessionStorage.getItem(SESSION_KEY);
  
  // Debug logging
  console.log('🔍 Lead Source Capture:', {
    currentUrl: window.location.href,
    typeParam: type,
    utmSourceParam: utmSource,
    existingSource: existingSource,
  });

  // Don't overwrite if we already captured in this session
  if (existingSource) {
    console.log('✅ Using existing lead source:', existingSource);
    return;
  }

  if (type) {
    // e.g. ?type=qr  →  "succession-tool-qr"
    const leadSource = `${DEFAULT_SOURCE}-${type}`;
    sessionStorage.setItem(SESSION_KEY, leadSource);
    console.log('✅ Captured lead source from type param:', leadSource);
  } else if (utmSource) {
    sessionStorage.setItem(SESSION_KEY, utmSource);
    console.log('✅ Captured lead source from utm_source:', utmSource);
  } else {
    console.log('⚠️ No type or utm_source parameter found, will use default on getLeadSource()');
  }
};

/**
 * Returns the lead source string to pass to the CRM.
 * Falls back to "succession-tool" when nothing was captured.
 */
export const getLeadSource = () =>
  sessionStorage.getItem(SESSION_KEY) || DEFAULT_SOURCE;

/**
 * Clear the stored source (e.g. after a successful lead submission,
 * so a second visit in the same tab starts fresh).
 */
export const clearLeadSource = () => sessionStorage.removeItem(SESSION_KEY);
