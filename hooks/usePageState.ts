"use client";

import { useEffect, useState } from "react";

export interface PageState {
  loadTime: number | null; // ms
  timeSinceOpen: number; // seconds
  tabVisible: boolean;
  focus: boolean;
}

export function usePageState(): PageState {
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [timeSinceOpen, setTimeSinceOpen] = useState(0);
  const [tabVisible, setTabVisible] = useState(true);
  const [focus, setFocus] = useState(true);

  useEffect(() => {
    if (typeof performance !== "undefined" && performance.timing) {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (nav) {
        setLoadTime(nav.loadEventEnd > 0 ? nav.loadEventEnd - nav.startTime : null);
      } else {
        const t = performance.timing;
        if (t.loadEventEnd > 0) setLoadTime(t.loadEventEnd - t.navigationStart);
      }
    }
  }, []);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setTimeSinceOpen((Date.now() - start) / 1000);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleVisibility = () => setTabVisible(document.visibilityState === "visible");
    const handleFocus = () => setFocus(true);
    const handleBlur = () => setFocus(false);

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return { loadTime, timeSinceOpen, tabVisible, focus };
}
