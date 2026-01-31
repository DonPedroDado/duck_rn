import { NextRequest, NextResponse } from "next/server";

const NOMINATIM = "https://nominatim.openstreetmap.org/reverse";

export interface GeocodeResponse {
  city: string | null;
  region: string | null;
  country: string | null;
  street: string | null;
  postalCode: string | null;
  continent: string | null;
  displayName: string | null;
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
    const url = new URL(NOMINATIM);
    url.searchParams.set("lat", lat);
    url.searchParams.set("lon", lon);
    url.searchParams.set("format", "json");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("zoom", "18"); // building level for house_number

    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "RightNow/1.0 (educational dashboard)" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Nominatim returned ${res.status}`);
    }

    const data = (await res.json()) as {
      address?: {
        city?: string;
        town?: string;
        village?: string;
        municipality?: string;
        state?: string;
        country?: string;
        country_code?: string;
        road?: string;
        house_number?: string;
        postcode?: string;
        continent?: string;
      };
      display_name?: string;
    };

    const addr = data.address ?? {};
    const city =
      addr.city ??
      addr.town ??
      addr.village ??
      addr.municipality ??
      null;
    const region = addr.state ?? null;
    const country = addr.country ?? null;
    const road = addr.road ?? null;
    const houseNumber = addr.house_number ?? null;
    const street =
      road && houseNumber
        ? `${road} ${houseNumber}`
        : road ?? (houseNumber ? houseNumber : null);
    const postalCode = addr.postcode ?? null;
    const continent = addr.continent ?? null;

    const payload: GeocodeResponse = {
      city,
      region,
      country,
      street,
      postalCode,
      continent,
      displayName: data.display_name ?? null,
    };

    return NextResponse.json(payload);
  } catch (e) {
    console.error("Geocode API error:", e);
    return NextResponse.json(
      { error: "Failed to fetch address" },
      { status: 502 }
    );
  }
}
