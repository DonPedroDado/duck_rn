"use client";

import { useTime, formatTimeSince } from "@/hooks/useTime";
import { usePageState } from "@/hooks/usePageState";
import { DashboardCard, Row } from "@/components/DashboardCard";

export function TimeSection() {
  const pageState = usePageState();
  const time = useTime(pageState.timeSinceOpen);

  return (
    <DashboardCard title="Time">
      <Row label="Current time" value={<span className="live-value font-mono">{time.timeWithMs}</span>} mono />
      <Row label="Date" value={time.date} mono />
      <Row label="Day of week" value={time.dayOfWeek} />
      <Row label="ISO timestamp" value={time.iso} mono />
      <Row label="Unix (ms)" value={time.unixMs} mono />
      <Row label="Timezone" value={time.timezoneName} />
      <Row label="UTC offset" value={time.utcOffset} mono />
      <Row label="Day of year" value={time.dayOfYear} />
      <Row label="Week number" value={time.weekNumber} />
      <Row label="Leap year" value={time.leapYear ? "Yes" : "No"} />
      <Row
        label="Time since page opened"
        value={
          time.timeSincePageOpen != null
            ? formatTimeSince(time.timeSincePageOpen)
            : "—"
        }
        mono
      />
    </DashboardCard>
  );
}
