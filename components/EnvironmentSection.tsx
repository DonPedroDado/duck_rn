"use client";

import { useEffect, useState } from "react";
import { DashboardCard, Row } from "@/components/DashboardCard";
import type { WeatherResponse } from "@/app/api/weather/route";

interface EnvironmentSectionProps {
  latitude: number | null;
  longitude: number | null;
  onRequestLocation?: () => void;
}

function formatTimeOnly(iso: string): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export function EnvironmentSection({
  latitude,
  longitude,
  onRequestLocation,
}: EnvironmentSectionProps) {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude == null || longitude == null) {
      setWeather(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
      .then((res) => {
        if (!res.ok) throw new Error("Weather unavailable");
        return res.json();
      })
      .then((data: WeatherResponse) => {
        setWeather(data);
        setError(null);
      })
      .catch((e) => {
        setError(e.message ?? "Failed to load");
        setWeather(null);
      })
      .finally(() => setLoading(false));
  }, [latitude, longitude]);

  if (latitude == null || longitude == null) {
    return (
      <DashboardCard title="Environment">
        <p className="text-[#00ff41]/80">
          Allow location to see local weather.
        </p>
        {onRequestLocation && (
          <button
            type="button"
            onClick={onRequestLocation}
            className="mt-2 rounded-md border border-[#00ff41]/60 bg-transparent px-3 py-1.5 text-sm text-[#00ff41] hover:bg-[#00ff41]/10"
          >
            Get location
          </button>
        )}
      </DashboardCard>
    );
  }

  if (loading) {
    return (
      <DashboardCard title="Environment">
        <p className="text-[#00ff41]/70">Loading weather…</p>
      </DashboardCard>
    );
  }

  if (error || !weather) {
    return (
      <DashboardCard title="Environment">
        <p className="text-[#00ff41]/80">
          {error ?? "Not supported"}
        </p>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="Environment">
      <Row label="Temperature" value={`${weather.temperature} °C`} />
      <Row label="Feels like" value={`${weather.feelsLike} °C`} />
      <Row label="Humidity" value={`${weather.humidity}%`} />
      <Row label="Air pressure" value={`${weather.pressure} hPa`} />
      <Row label="Weather" value={weather.description} />
      <Row
        label="Wind"
        value={`${weather.windSpeed} km/h ${weather.windDirectionLabel}`}
      />
      <Row label="Sunrise" value={formatTimeOnly(weather.sunrise)} />
      <Row label="Sunset" value={formatTimeOnly(weather.sunset)} />
    </DashboardCard>
  );
}
