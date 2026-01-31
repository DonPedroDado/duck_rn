"use client";

import { useEffect, useState } from "react";
import {
  formatTimeWithMs,
  formatDateAndDay,
  formatIsoTimestamp,
  unixTimestampMs,
  getTimezoneInfo,
  getDayOfYear,
  getWeekNumber,
  isLeapYear,
  formatDurationSeconds,
} from "@/lib/utils/time";

export interface TimeState {
  timeWithMs: string;
  date: string;
  dayOfWeek: string;
  iso: string;
  unixMs: number;
  timezoneName: string;
  utcOffset: string;
  dayOfYear: number;
  weekNumber: number;
  leapYear: boolean;
  /** Seconds since page load (set by parent that tracks load time). */
  timeSincePageOpen: number | null;
}

const defaultState: TimeState = {
  timeWithMs: "--:--:--.---",
  date: "--",
  dayOfWeek: "--",
  iso: "--",
  unixMs: 0,
  timezoneName: "--",
  utcOffset: "--",
  dayOfYear: 0,
  weekNumber: 0,
  leapYear: false,
  timeSincePageOpen: null,
};

/**
 * Live time state; updates every 50ms for high-precision display.
 * timeSincePageOpen must be passed from a parent that tracks load time.
 */
export function useTime(timeSincePageOpen: number | null): TimeState {
  const [state, setState] = useState<TimeState>(defaultState);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const { date, dayOfWeek } = formatDateAndDay(now);
      const { name: timezoneName, offsetString: utcOffset } = getTimezoneInfo(now);
      setState({
        timeWithMs: formatTimeWithMs(now),
        date,
        dayOfWeek,
        iso: formatIsoTimestamp(now),
        unixMs: unixTimestampMs(now),
        timezoneName,
        utcOffset,
        dayOfYear: getDayOfYear(now),
        weekNumber: getWeekNumber(now),
        leapYear: isLeapYear(now.getFullYear()),
        timeSincePageOpen,
      });
    };

    update();
    const interval = setInterval(update, 50);
    return () => clearInterval(interval);
  }, [timeSincePageOpen]);

  return state;
}

export function formatTimeSince(seconds: number): string {
  return formatDurationSeconds(seconds);
}
