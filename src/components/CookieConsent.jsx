import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const COOKIE_CONSENT_KEY = "tl_cookie_consent";

const DEFAULT_PREFERENCES = {
  necessary: true,
  analytics: true,
  marketing: true,
};

/**
 * Updates analytics consent in Google Analytics and Meta Pixel if loaded.
 */
function applyConsent(prefs) {
  if (typeof window === "undefined") return;

  // Google Analytics Consent Mode v2
  if (typeof window.gtag === "function") {
    try {
      window.gtag("consent", "update", {
        analytics_storage: prefs.analytics ? "granted" : "denied",
        ad_storage: prefs.marketing ? "granted" : "denied",
        ad_user_data: prefs.marketing ? "granted" : "denied",
        ad_personalization: prefs.marketing ? "granted" : "denied",
      });
    } catch {
      // ignore
    }
  }

  // Meta (Facebook) Pixel Consent
  if (typeof window.fbq === "function") {
    try {
      if (prefs.marketing) {
        window.fbq("consent", "grant");
      } else {
        window.fbq("consent", "revoke");
      }
    } catch {
      // ignore
    }
  }
}

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  // Read saved consent on client mount & listen for re-open events from footer
  useEffect(() => {
    setMounted(true);

    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({
          necessary: true,
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing),
        });
        applyConsent(parsed);
      } else {
        // No consent chosen yet — show banner after a gentle delay
        const timer = window.setTimeout(() => {
          setBannerVisible(true);
        }, 1200);
        return () => window.clearTimeout(timer);
      }
    } catch {
      setBannerVisible(true);
    }

    // Listen for custom event so footer link can open settings
    const handleOpenSettings = () => {
      setSettingsOpen(true);
    };

    window.addEventListener("tl-open-cookie-settings", handleOpenSettings);
    return () => {
      window.removeEventListener("tl-open-cookie-settings", handleOpenSettings);
    };
  }, []);

  const saveConsent = (prefs) => {
    try {
      const record = {
        ...prefs,
        necessary: true,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(record));
      setPreferences(record);
      applyConsent(record);
    } catch {
      // ignore
    }
    setBannerVisible(false);
    setSettingsOpen(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const handleRejectNonEssential = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  // SSR or before client mount: render nothing to prevent hydration mismatch
  if (!mounted) return null;

  return (
    <>
      {/* Floating Cookie Consent Banner */}
      {bannerVisible && !settingsOpen && (
        <aside
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-3 sm:bottom-5 inset-x-3 sm:inset-x-6 max-w-4xl mx-auto z-[95] animate-fade-in-up"
        >
          <div className="relative rounded-2xl bg-[#132F2C]/95 backdrop-blur-md border border-[#2D544C] shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-white p-5 sm:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              {/* Text content */}
              <div className="flex-1 pr-2">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#F4D57E]/15 text-[#F4D57E]">
                    <svg
                      role="img"
                      aria-hidden="true"
                      className="w-4 h-4 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21.598 11.064a1.006 1.006 0 0 0-.854-.172A3.992 3.992 0 0 1 15.8 5.95a1 1 0 0 0-.78-.973 9.99 9.99 0 0 0-5.02.025C5.068 6.2 1.34 10.73 2.06 15.688c.753 5.176 5.28 9.07 10.51 8.805 5.597-.284 10.02-4.87 9.924-10.468a1.002 1.002 0 0 0-.896-.961zM12 22.493c-4.417.224-8.232-3.053-8.868-7.42-.605-4.17 2.527-7.983 6.697-8.98a12.01 12.01 0 0 1 1.76-.233 5.986 5.986 0 0 0 4.887 4.888c.11.758.38 1.48.784 2.122-1.39.81-2.43 2.21-2.78 3.87a6.002 6.002 0 0 0-2.48 5.753zm-3.5-9.493a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-2 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 1a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm2-6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                    </svg>
                  </span>
                  <h3 className="font-[Urania] font-semibold text-[17px] text-[#F4D57E] tracking-wide">
                    Cookie Preferences
                  </h3>
                </div>

                <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#D2DFDC]">
                  We use cookies to personalise content and ads, provide social
                  media features, and analyse our traffic. We also share
                  information about your use of our site with our analytics,
                  advertising, and social media partners.
                  <Link
                    to="/privacy-policy#cookies"
                    className="ml-1.5 text-[#F4D57E] hover:underline underline-offset-2 font-medium"
                  >
                    Learn more
                  </Link>
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setSettingsOpen(true)}
                  className="flex-1 sm:flex-initial text-center rounded-full border border-[#F4D57E] text-[#F4D57E] hover:bg-[#F4D57E]/10 active:bg-[#F4D57E]/20 px-4 sm:px-5 py-2.5 text-[13px] sm:text-[14px] font-medium transition-colors cursor-pointer"
                >
                  Cookie Settings
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-initial text-center rounded-full bg-gradient-to-r from-[#FFCD42] to-[#F4D57E] hover:brightness-105 active:scale-[0.98] text-[#132F2C] px-5 sm:px-6 py-2.5 text-[13px] sm:text-[14px] font-semibold transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  Accept Cookies
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Cookie Settings Modal */}
      {settingsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="relative w-full max-w-xl rounded-2xl bg-[#132F2C] border border-[#2D544C] shadow-2xl text-white p-6 sm:p-7 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#244741]">
              <div>
                <h2
                  id="cookie-settings-title"
                  className="font-[Urania] text-[22px] sm:text-[24px] font-bold text-[#F4D57E]"
                >
                  Cookie Settings
                </h2>
                <p className="mt-1 text-[13px] text-[#A3B4B0]">
                  Manage and customize your cookie preferences below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close cookie settings"
                className="text-[#A3B4B0] hover:text-white text-2xl leading-none p-1 transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Description */}
            <div className="py-4 text-[13px] sm:text-[14px] leading-relaxed text-[#D2DFDC] border-b border-[#244741]">
              We use cookies to personalise content and ads, provide social media
              features, and analyse our traffic. We also share information about
              your use of our site with our analytics, advertising, and social
              media partners. You can adjust your consent categories at any time.
            </div>

            {/* Categories */}
            <div className="py-4 space-y-4">
              {/* Necessary */}
              <div className="rounded-xl bg-[#0F2623] p-4 border border-[#244741]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-[15px] text-white">
                      Strictly Necessary Cookies
                    </h4>
                    <p className="mt-1 text-[12px] sm:text-[13px] text-[#A3B4B0] leading-relaxed">
                      Essential for basic site functionality, page navigation,
                      form submissions, and security. Cannot be switched off.
                    </p>
                  </div>
                  <span className="shrink-0 ml-3 text-[11px] font-semibold uppercase tracking-wider text-[#F4D57E] bg-[#F4D57E]/10 px-2.5 py-1 rounded-full border border-[#F4D57E]/30">
                    Always Active
                  </span>
                </div>
              </div>

              {/* Analytics */}
              <div className="rounded-xl bg-[#0F2623] p-4 border border-[#244741]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-[15px] text-white">
                      Analytics Cookies
                    </h4>
                    <p className="mt-1 text-[12px] sm:text-[13px] text-[#A3B4B0] leading-relaxed">
                      Allow us to count visits and traffic sources to measure
                      and improve site performance and user experience.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          analytics: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#244741] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F4D57E] peer-checked:after:bg-[#132F2C] peer-checked:after:border-[#132F2C]"></div>
                  </label>
                </div>
              </div>

              {/* Marketing / Advertising */}
              <div className="rounded-xl bg-[#0F2623] p-4 border border-[#244741]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-[15px] text-white">
                      Advertising &amp; Social Media Cookies
                    </h4>
                    <p className="mt-1 text-[12px] sm:text-[13px] text-[#A3B4B0] leading-relaxed">
                      Used by our advertising and social media partners (e.g.
                      Meta, Google) to build a profile of your interests and
                      deliver relevant ads on other platforms.
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) =>
                        setPreferences((prev) => ({
                          ...prev,
                          marketing: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#244741] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F4D57E] peer-checked:after:bg-[#132F2C] peer-checked:after:border-[#132F2C]"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="pt-4 border-t border-[#244741] flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRejectNonEssential}
                className="w-full sm:w-auto text-center text-[13px] text-[#A3B4B0] hover:text-white underline cursor-pointer py-1"
              >
                Reject Non-Essential
              </button>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="flex-1 sm:flex-initial text-center rounded-full border border-[#F4D57E] text-[#F4D57E] hover:bg-[#F4D57E]/10 active:bg-[#F4D57E]/20 px-5 py-2 text-[13px] sm:text-[14px] font-medium transition-colors cursor-pointer"
                >
                  Save Preferences
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 sm:flex-initial text-center rounded-full bg-gradient-to-r from-[#FFCD42] to-[#F4D57E] hover:brightness-105 active:scale-[0.98] text-[#132F2C] px-5 py-2 text-[13px] sm:text-[14px] font-semibold transition-all shadow-md cursor-pointer whitespace-nowrap"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
