(function () {
  // 1. Route check for static LCP shell (runs synchronously before first paint)
  var path = location.pathname.replace(/\/+$/, "") || "/";
  if (path !== "/") {
    document.documentElement.classList.add("hide-lcp-shell");
  }

  // 2. Async CSS activator & fallback listener
  function checkCss() {
    var links = document.querySelectorAll("link[data-tl-async-css]");
    for (var i = 0; i < links.length; i++) {
      var l = links[i];
      if (l.sheet) {
        l.media = "all";
      } else {
        l.addEventListener("load", function () {
          this.media = "all";
          document.documentElement.classList.add("css-ready");
          document.dispatchEvent(new Event("tl-css-ready"));
        }, { once: true });
      }
    }
    if (links.length > 0) {
      document.documentElement.classList.add("css-ready");
      document.dispatchEvent(new Event("tl-css-ready"));
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", checkCss, { once: true });
  } else {
    checkCss();
  }

  // Fallback timer if CSS load event or DOMContentLoaded is delayed
  setTimeout(function () {
    var links = document.querySelectorAll("link[data-tl-async-css]");
    for (var i = 0; i < links.length; i++) {
      links[i].media = "all";
    }
    if (!document.documentElement.classList.contains("css-ready")) {
      document.documentElement.classList.add("css-ready");
      document.dispatchEvent(new Event("tl-css-ready"));
    }
  }, 2000);

  // 3. Analytics setup (Google Analytics gtag + Meta Pixel fbq)
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
  })(window, document);
  fbq("init", "1397319418949240");
  fbq("track", "PageView");

  // Deferred third-party script loader (keeps off critical LCP path)
  function loadThirdParty() {
    var ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=G-GR80GZBEVS";
    document.head.appendChild(ga);
    gtag("js", new Date());
    gtag("config", "G-GR80GZBEVS");

    var fb = document.createElement("script");
    fb.async = true;
    fb.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(fb);
  }

  function startAnalytics() {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(loadThirdParty, { timeout: 2000 });
    } else {
      setTimeout(loadThirdParty, 1);
    }
  }

  if (document.readyState === "complete") {
    setTimeout(startAnalytics, 4000);
  } else {
    window.addEventListener("load", function () {
      setTimeout(startAnalytics, 4000);
    }, { once: true });
  }
})();
