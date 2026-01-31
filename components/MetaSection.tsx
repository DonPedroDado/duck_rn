"use client";

import { DashboardCard, Row } from "@/components/DashboardCard";
import { META_FACTS } from "@/lib/constants";

export function MetaSection() {
  return (
    <DashboardCard title="Meta">
      <Row label="You are here" value={META_FACTS.youAreHere} />
      <Row label="Is this moment unique?" value={META_FACTS.isThisMomentUnique} />
      <Row label="Will it ever repeat?" value={META_FACTS.willItEverRepeat} />
      <Row label="Entropy status" value={META_FACTS.entropyStatus} />
      <Row label="Heat death of the universe" value={META_FACTS.heatDeathOfUniverse} />
    </DashboardCard>
  );
}
