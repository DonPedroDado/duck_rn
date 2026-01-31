"use client";

import { DashboardCard, Row } from "@/components/DashboardCard";
import { useNetworkInfo } from "@/hooks/useNetworkInfo";
import { usePageState } from "@/hooks/usePageState";

export function NetworkSection() {
  const net = useNetworkInfo();
  const page = usePageState();

  const loadTimeStr =
    page.loadTime != null ? `${(page.loadTime / 1000).toFixed(2)} s` : "—";
  const timeSinceOpen = `${Math.floor(page.timeSinceOpen / 60)}m ${Math.floor(page.timeSinceOpen % 60)}s`;

  return (
    <DashboardCard title="Network & Page State">
      <Row
        label="Connection type"
        value={net.supported && net.type != null ? net.type : "Not available"}
      />
      <Row
        label="Downlink"
        value={
          net.supported && net.downlink != null
            ? `${net.downlink} Mbps`
            : "Not available"
        }
      />
      <Row
        label="RTT"
        value={
          net.supported && net.rtt != null ? `${net.rtt} ms` : "Not available"
        }
      />
      <Row label="Page load time" value={loadTimeStr} mono />
      <Row label="Time since page opened" value={timeSinceOpen} mono />
      <Row label="Tab visible" value={page.tabVisible ? "Yes" : "No"} />
      <Row label="Window focused" value={page.focus ? "Yes" : "No"} />
      <Row label="Online" value={net.online === null ? "—" : net.online ? "Yes" : "No"} />
    </DashboardCard>
  );
}
