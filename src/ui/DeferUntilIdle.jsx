import { useEffect, useState } from "react";

/**
 * Mounts children only after a hard delay (and optionally idle).
 * Prefer `delay` over requestIdleCallback alone — idle often fires during
 * Lighthouse's critical window right after the entry bundle parses.
 */
const DeferUntilIdle = ({ children, delay = 5000, timeout = 1500 }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId;
    let timer;

    const arm = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(() => setReady(true), { timeout });
      } else {
        setReady(true);
      }
    };

    // Wait for window load, then the hard delay, before any idle callback.
    const start = () => {
      timer = window.setTimeout(arm, delay);
    };

    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }

    return () => {
      window.removeEventListener("load", start);
      if (timer != null) window.clearTimeout(timer);
      if (idleId != null) window.cancelIdleCallback?.(idleId);
    };
  }, [delay, timeout]);

  return ready ? children : null;
};

export default DeferUntilIdle;
