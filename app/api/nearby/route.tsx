import type { NextRequest } from "next/server";

export const nearby = async (
  lat: string,
  lon: string,
): Promise<
  | {
      pois: any[];
      error?: never;
    }
  | {
      error: string;
      pois?: never;
    }
> => {
  const key = process.env.LOCATIONIQ_KEY;
  const response = await fetch(
    `https://us1.locationiq.com/v1/nearby?key=${key}&lat=${lat}&lon=${lon}&radius=30000&limit=50&format=json`,
  );

  if (response.ok) {
    const json = await response.json();
    return { pois: json };
  } else {
    return { error: response.statusText };
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  if (lat && lon) {
    const response = await nearby(lat, lon);
    return new Response(JSON.stringify(response));
  }
}
