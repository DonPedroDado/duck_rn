/**
 * Time formatting utilities for high-precision display.
 */

/**
 * Format a Date to HH:mm:ss.SSS (24h with milliseconds).
 */
export function formatTimeWithMs(date: Date): string {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  const s = date.getSeconds().toString().padStart(2, "0");
  const ms = date.getMilliseconds().toString().padStart(3, "0");
  return `${h}:${m}:${s}.${ms}`;
}

/**
 * Format date as YYYY-MM-DD and day of week.
 */
export function formatDateAndDay(date: Date): { date: string; dayOfWeek: string } {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return {
    date: `${y}-${m}-${d}`,
    dayOfWeek: dayNames[date.getDay()],
  };
}

/**
 * ISO 8601 timestamp (with timezone offset).
 */
export function formatIsoTimestamp(date: Date): string {
  return date.toISOString();
}

/**
 * Unix timestamp in milliseconds.
 */
export function unixTimestampMs(date: Date): number {
  return date.getTime();
}

/**
 * Get timezone name (e.g. "America/New_York") and UTC offset string (e.g. "UTC-5").
 */
export function getTimezoneInfo(date: Date): { name: string; offsetString: string } {
  const name = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const offsetString = `UTC${sign}${h}${m ? `:${m.toString().padStart(2, "0")}` : ""}`;
  return { name, offsetString };
}

/**
 * Day of year (1–366).
 */
export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 86400000;
  return Math.floor(diff / oneDay);
}

/**
 * ISO week number (1–53).
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7; // Monday = 1, Sunday = 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Format duration in seconds to "Xh Ym Zs" or "Ym Zs" or "Zs".
 */
export function formatDurationSeconds(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(" ");
}
