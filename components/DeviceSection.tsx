"use client";

import { useEffect, useState } from "react";
import { DashboardCard, Row } from "@/components/DashboardCard";
import { getDeviceType, getOperatingSystem, getBrowserInfo } from "@/lib/utils/device";
import { useBattery } from "@/hooks/useBattery";

export function DeviceSection() {
  const battery = useBattery();
  const [mounted, setMounted] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<{
    deviceType: string;
    os: string;
    browser: string;
    browserVersion: string;
    language: string;
    screenResolution: string;
    colorDepth: number;
    pixelRatio: number;
    cores: number;
    deviceMemory: number | null;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const { name: browser, version: browserVersion } = getBrowserInfo();
    setDeviceInfo({
      deviceType: getDeviceType(),
      os: getOperatingSystem(),
      browser,
      browserVersion,
      language: navigator.language ?? "—",
      screenResolution: `${window.screen.width} × ${window.screen.height}`,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio ?? 1,
      cores: navigator.hardwareConcurrency ?? 0,
      deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? null,
    });
  }, [mounted]);

  if (!mounted || !deviceInfo) {
    return (
      <DashboardCard title="Device & Browser">
        <p className="text-[#00ff41]/70">Loading…</p>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Device & Browser">
      <Row label="Device type" value={deviceInfo.deviceType} />
      <Row label="Operating system" value={deviceInfo.os} />
      <Row
        label="Browser"
        value={
          deviceInfo.browserVersion
            ? `${deviceInfo.browser} ${deviceInfo.browserVersion}`
            : deviceInfo.browser
        }
      />
      <Row label="Language" value={deviceInfo.language} />
      <Row label="Screen resolution" value={deviceInfo.screenResolution} mono />
      <Row label="Color depth" value={`${deviceInfo.colorDepth}-bit`} />
      <Row label="Device pixel ratio" value={deviceInfo.pixelRatio} />
      <Row label="CPU cores" value={deviceInfo.cores} />
      <Row
        label="Approx RAM"
        value={
          deviceInfo.deviceMemory != null
            ? `${deviceInfo.deviceMemory} GB`
            : "Not available"
        }
      />
      <Row
        label="Battery"
        value={
          battery.supported && battery.level != null
            ? `${Math.round(battery.level * 100)}%${battery.charging ? " (charging)" : ""}`
            : "Not supported"
        }
      />
      <Row label="Online" value={navigator.onLine ? "Yes" : "No"} />
    </DashboardCard>
  );
}
