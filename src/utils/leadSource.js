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
  // Don't overwrite if we already captured in this session
  if (sessionStorage.getItem(SESSION_KEY)) return;

  const params = new URLSearchParams(window.location.search);
  const type = params.get("type")?.trim();
  const utmSource = params.get("utm_source")?.trim();

  if (type) {
    // e.g. ?type=qr  →  "succession-tool-qr"
    sessionStorage.setItem(SESSION_KEY, `${DEFAULT_SOURCE}-${type}`);
  } else if (utmSource) {
    sessionStorage.setItem(SESSION_KEY, utmSource);
  }
  // If neither present, nothing is stored — getLeadSource() will return default.
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
