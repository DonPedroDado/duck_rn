"use client";

import { DashboardCard, Row } from "@/components/DashboardCard";
import { PHYSICS_CONSTANTS, META_FACTS } from "@/lib/constants";

export function CosmosSection() {
  return (
    <DashboardCard title="Cosmos">
      <Row
        label="Earth orbital speed"
        value={`${PHYSICS_CONSTANTS.earthOrbitalSpeedKmPerS} km/s`}
      />
      <Row
        label="Earth rotation (equator)"
        value={`${PHYSICS_CONSTANTS.earthRotationSpeedEquatorMetersPerS} m/s`}
      />
      <Row
        label="Distance to Sun"
        value={`${(PHYSICS_CONSTANTS.distanceToSunKm / 1e6).toFixed(2)} × 10⁶ km`}
      />
      <Row
        label="Distance to Moon"
        value={`${PHYSICS_CONSTANTS.distanceToMoonKm.toLocaleString()} km`}
      />
      <Row
        label="Distance to galactic center"
        value={`${(PHYSICS_CONSTANTS.distanceToGalacticCenterLy / 1000).toFixed(0)}k ly`}
      />
      <Row
        label="Age of the universe"
        value={`${(PHYSICS_CONSTANTS.ageOfUniverseYears / 1e9).toFixed(1)} billion years`}
      />
      <Row label="You are made of stardust" value={META_FACTS.madeOfStardust} />
    </DashboardCard>
  );
}
