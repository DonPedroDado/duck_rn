/**
 * Client-side device and browser detection (heuristic).
 * Run only in browser.
 */

export type DeviceType = "mobile" | "desktop" | "unknown";

/**
 * Simple heuristic: touch-capable and small viewport → mobile.
 */
export function getDeviceType(): DeviceType {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isSmall = typeof window !== "undefined" && window.innerWidth < 768;
  if (/Mobile|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return "mobile";
  }
  if (hasTouch && isSmall) return "mobile";
  if (ua.length > 0) return "desktop";
  return "unknown";
}

/**
 * Parse OS from user agent (best-effort).
 */
export function getOperatingSystem(): string {
  if (typeof navigator === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (/Win/i.test(ua)) return "Windows";
  if (/Mac/i.test(ua)) return "macOS";
  if (/Linux/i.test(ua)) return "Linux";
  if (/Android/i.test(ua)) return "Android";
  if (/iOS|iPhone|iPad|iPod/i.test(ua)) return "iOS";
  return "Unknown";
}

/**
 * Browser name and version from user agent.
 */
export function getBrowserInfo(): { name: string; version: string } {
  if (typeof navigator === "undefined") return { name: "Unknown", version: "" };
  const ua = navigator.userAgent;
  let name = "Unknown";
  let version = "";
  const match = ua.match(/(Chrome|Firefox|Safari|Edge|Opera|OPR)\/(\d+)/);
  if (match) {
    name = match[1] === "Chrome" && ua.includes("Edg") ? "Edge" : match[1];
    name = match[1] === "OPR" ? "Opera" : name;
    version = match[2] ?? "";
  }
  if (ua.includes("Safari") && !ua.includes("Chrome")) {
    const v = ua.match(/Version\/(\d+)/);
    if (v) {
      name = "Safari";
      version = v[1] ?? "";
    }
  }
  return { name, version };
}
