import { NextRequest, NextResponse } from "next/server";
import { getWeatherDescription, windDirectionLabel } from "@/lib/utils/weatherCodes";

const OPEN_METEO = "https://api.open-meteo.com/v1/forecast";

export interface WeatherResponse {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  description: string;
  windSpeed: number;
  windDirection: number;
  windDirectionLabel: string;
  sunrise: string;
  sunset: string;
}

export async function GET(request: NextRequest) {
  const lat = request.nextUrl.searchParams.get("lat");
  const lon = request.nextUrl.searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Missing lat or lon" },
      { status: 400 }
    );
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return NextResponse.json(
      { error: "Invalid lat or lon" },
      { status: 400 }
    );
  }

  try {
    const url = new URL(OPEN_METEO);
    url.searchParams.set("latitude", lat);
    url.searchParams.set("longitude", lon);
    url.searchParams.set(
      "current",
      "temperature_2m,relative_humidity_2m,apparent_temperature,surface_pressure,weather_code,wind_speed_10m,wind_direction_10m"
    );
    url.searchParams.set("daily", "sunrise,sunset");
    url.searchParams.set("timezone", "auto");

    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!res.ok) {
      throw new Error(`Open-Meteo returned ${res.status}`);
    }

    const data = (await res.json()) as {
      current?: {
        temperature_2m?: number;
        relative_humidity_2m?: number;
        apparent_temperature?: number;
        surface_pressure?: number;
        weather_code?: number;
        wind_speed_10m?: number;
        wind_direction_10m?: number;
      };
      daily?: {
        sunrise?: string[];
        sunset?: string[];
      };
    };

    const current = data.current ?? {};
    const daily = data.daily ?? {};
    const sunrise = daily.sunrise?.[0] ?? "";
    const sunset = daily.sunset?.[0] ?? "";
    const code = current.weather_code ?? 0;

    const payload: WeatherResponse = {
      temperature: current.temperature_2m ?? 0,
      feelsLike: current.apparent_temperature ?? current.temperature_2m ?? 0,
      humidity: current.relative_humidity_2m ?? 0,
      pressure: current.surface_pressure ?? 0,
      description: getWeatherDescription(code),
      windSpeed: current.wind_speed_10m ?? 0,
      windDirection: current.wind_direction_10m ?? 0,
      windDirectionLabel: windDirectionLabel(current.wind_direction_10m ?? 0),
      sunrise,
      sunset,
    };

    return NextResponse.json(payload);
  } catch (e) {
    console.error("Weather API error:", e);
    return NextResponse.json(
      { error: "Failed to fetch weather" },
      { status: 502 }
    );
  }
}
