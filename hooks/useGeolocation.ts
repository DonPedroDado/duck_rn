"use client";

import { useEffect, useState, useCallback } from "react";

export interface Coords {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  /** "gps" = browser geolocation, "ip" = from IP (approximate) */
  source?: "gps" | "ip";
}

export interface GeolocationState {
  coords: Coords | null;
  error: string | null;
  loading: boolean;
  request: () => void;
}

export function useGeolocation(): GeolocationState {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(true);
      fetch("https://ipapi.co/json/")
        .then((r) => (r.ok ? r.json() : null))
        .then((data: { latitude?: number; longitude?: number } | null) => {
          if (data?.latitude != null && data?.longitude != null) {
            setCoords({ latitude: data.latitude, longitude: data.longitude, accuracy: null, source: "ip" });
            setError(null);
          }
        })
        .finally(() => setLoading(false));
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy ?? null,
          source: "gps",
        });
        setError(null);
        setLoading(false);
      },
      () => {
        setCoords(null);
        setLoading(true);
        const applyCoords = (lat: number, lon: number) => {
          setCoords({ latitude: lat, longitude: lon, accuracy: null, source: "ip" });
          setError(null);
        };
        const done = () => setLoading(false);
        const tryClientIp = () =>
          fetch("https://ipapi.co/json/")
            .then((r) => (r.ok ? r.json() : null))
            .then((d: { latitude?: number; longitude?: number } | null) => {
              if (d?.latitude != null && d?.longitude != null) applyCoords(d.latitude, d.longitude);
              else setError("Location unavailable");
            });
        // Prefer client-side IP (user's real IP); fallback to server API
        fetch("https://ipapi.co/json/")
          .then((r) => (r.ok ? r.json() : null))
          .then((data: { latitude?: number; longitude?: number } | null) => {
            if (data?.latitude != null && data?.longitude != null) {
              applyCoords(data.latitude, data.longitude);
              done();
              return;
            }
            return fetch("/api/geo-from-ip")
              .then((r) => (r.ok ? r.json() : null))
              .then((serverData: { latitude?: number; longitude?: number } | null) => {
                if (serverData?.latitude != null && serverData?.longitude != null) {
                  applyCoords(serverData.latitude, serverData.longitude);
                } else {
                  setError("Location unavailable");
                }
              });
          })
          .catch(() =>
            fetch("/api/geo-from-ip")
              .then((r) => (r.ok ? r.json() : null))
              .then((serverData: { latitude?: number; longitude?: number } | null) => {
                if (serverData?.latitude != null && serverData?.longitude != null) {
                  applyCoords(serverData.latitude, serverData.longitude);
                } else {
                  setError("Location unavailable");
                }
              })
          )
          .finally(done);
      },
      { enableHighAccuracy: false, timeout: 30000, maximumAge: 300000 }
    );
  }, []);

  useEffect(() => {
    request();
  }, [request]);

  return { coords, error, loading, request };
}
