"use client";

import { useEffect, useState } from "react";
import { DashboardCard, Row } from "@/components/DashboardCard";
import { COSMIC_FACTS } from "@/lib/constants";
import type { GeocodeResponse } from "@/app/api/geocode/route";
import type { Coords } from "@/hooks/useGeolocation";

interface LocationSectionProps {
  coords: Coords | null;
  onRequestLocation?: () => void;
  loading: boolean;
  error: string | null;
}

export function LocationSection({
  coords,
  onRequestLocation,
  loading,
  error,
}: LocationSectionProps) {
  const [geocode, setGeocode] = useState<GeocodeResponse | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    if (!coords) {
      setGeocode(null);
      return;
    }
    setGeoLoading(true);
    fetch(`/api/geocode?lat=${coords.latitude}&lon=${coords.longitude}`)
      .then((res) => {
        if (!res.ok) throw new Error("Geocode failed");
        return res.json();
      })
      .then((data: GeocodeResponse) => {
        setGeocode(data);
      })
      .catch(() => setGeocode(null))
      .finally(() => setGeoLoading(false));
  }, [coords?.latitude, coords?.longitude]);

  const hasLocation = coords != null;

  return (
    <DashboardCard title="Location">
      {!hasLocation && (
        <>
          <p className="text-[#00ff41]/80">
            {error ?? "Location not yet requested."}
          </p>
          {onRequestLocation && (
            <button
              type="button"
              onClick={onRequestLocation}
              disabled={loading}
              className="mt-2 rounded-md border border-[#00ff41]/60 bg-transparent px-3 py-1.5 text-sm text-[#00ff41] hover:bg-[#00ff41]/10 disabled:opacity-50"
            >
              {loading ? "Getting…" : "Get location"}
            </button>
          )}
        </>
      )}
      {hasLocation && (
        <>
          {coords.source === "ip" && (
            <p className="mb-2 text-xs text-[#00ff41]/70">
              Approximate (from IP). Allow browser location for precise address.
            </p>
          )}
          <Row label="Latitude" value={coords.latitude.toFixed(6)} mono />
          <Row label="Longitude" value={coords.longitude.toFixed(6)} mono />
          {coords.accuracy != null && (
            <Row label="Accuracy" value={`±${Math.round(coords.accuracy)} m`} />
          )}
          {geoLoading && (
            <p className="text-[#00ff41]/70">Resolving address…</p>
          )}
          {geocode && !geoLoading && (
            <>
              {geocode.city != null && <Row label="City" value={geocode.city} />}
              {geocode.region != null && (
                <Row label="Region / State" value={geocode.region} />
              )}
              {geocode.country != null && (
                <Row label="Country" value={geocode.country} />
              )}
              {geocode.street != null && (
                <Row label="Street" value={geocode.street} />
              )}
              {geocode.postalCode != null && (
                <Row label="Postal code" value={geocode.postalCode} />
              )}
              {geocode.continent != null && (
                <Row label="Continent" value={geocode.continent} />
              )}
            </>
          )}
          <div className="mt-4 border-t border-[#00ff41]/30 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#00ff41]/70">
              Cosmic context
            </p>
            <Row label="Planet" value={COSMIC_FACTS.planet} />
            <Row label="Planet position" value={COSMIC_FACTS.planetPosition} />
            <Row label="Star" value={COSMIC_FACTS.star} />
            <Row label="Star system" value={COSMIC_FACTS.starSystem} />
            <Row label="Galaxy" value={COSMIC_FACTS.galaxy} />
            <Row label="Local Group" value={COSMIC_FACTS.localGroup} />
            <Row label="Supercluster" value={COSMIC_FACTS.supercluster} />
            <Row label="Observable universe" value={COSMIC_FACTS.observableUniverse} />
          </div>
        </>
      )}
    </DashboardCard>
  );
}
