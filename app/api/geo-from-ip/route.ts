import { NextRequest, NextResponse } from "next/server";

/**
 * Returns approximate lat/lon from the client's IP (no permission needed).
 * Uses ip-api.com (free, no key). Fallback when browser geolocation times out or is denied.
 */
export async function GET(request: NextRequest) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp = forwarded?.split(",")[0]?.trim() ?? realIp ?? "";
    const url = clientIp
      ? `http://ip-api.com/json/${clientIp}?fields=lat,lon`
      : "http://ip-api.com/json/?fields=lat,lon";
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`ip-api returned ${res.status}`);
    const data = (await res.json()) as { lat?: number; lon?: number };
    const lat = typeof data.lat === "number" ? data.lat : null;
    const lon = typeof data.lon === "number" ? data.lon : null;
    if (lat == null || lon == null) throw new Error("Missing lat/lon");
    return NextResponse.json({ latitude: lat, longitude: lon });
  } catch (e) {
    console.error("geo-from-ip error:", e);
    return NextResponse.json(
      { error: "Could not get location from IP" },
      { status: 502 }
    );
  }
}
