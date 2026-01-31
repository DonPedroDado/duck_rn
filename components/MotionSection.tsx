"use client";

import { DashboardCard, Row } from "@/components/DashboardCard";
import { useMotion } from "@/hooks/useMotion";

function formatAngle(deg: number | null): string {
  if (deg == null) return "—";
  return `${Math.round(deg)}°`;
}

export function MotionSection() {
  const motion = useMotion();
  const { orientation, deviceMotion } = motion;

  return (
    <DashboardCard title="Orientation & Motion">
      <Row
        label="Screen orientation"
        value={orientation.type ?? "Not available"}
      />
      <Row
        label="Orientation angle"
        value={orientation.angle != null ? `${orientation.angle}°` : "—"}
      />
      <Row
        label="Compass (alpha)"
        value={formatAngle(deviceMotion.alpha)}
      />
      <Row label="Beta" value={formatAngle(deviceMotion.beta)} />
      <Row label="Gamma" value={formatAngle(deviceMotion.gamma)} />
      <Row
        label="Acceleration X"
        value={
          deviceMotion.acceleration.x != null
            ? deviceMotion.acceleration.x.toFixed(2)
            : "—"
        }
        mono
      />
      <Row
        label="Acceleration Y"
        value={
          deviceMotion.acceleration.y != null
            ? deviceMotion.acceleration.y.toFixed(2)
            : "—"
        }
        mono
      />
      <Row
        label="Acceleration Z"
        value={
          deviceMotion.acceleration.z != null
            ? deviceMotion.acceleration.z.toFixed(2)
            : "—"
        }
        mono
      />
      {!deviceMotion.supported && (
        <p className="text-[#00ff41]/70">Motion/orientation not supported on this device.</p>
      )}
    </DashboardCard>
  );
}
