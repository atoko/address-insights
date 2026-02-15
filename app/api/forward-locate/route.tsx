import type { NextRequest } from "next/server";

export const forwardLocateByAddress = async (
  address: string,
): Promise<
  | {
      address: {
        lat: number;
        lon: number;
        display_name: string;
      };
      error?: never;
    }
  | {
      error: string;
      address?: never;
    }
> => {
  const key = process.env.LOCATIONIQ_KEY;
  const response = await fetch(
    `https://us1.locationiq.com/v1/search?key=${key}&q=${encodeURIComponent(address)}&format=json`,
  );

  if (response.ok) {
    const json = await response.json();
    return { address: json[0] };
  } else {
    return { error: response.statusText };
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  if (address) {
    const response = await forwardLocateByAddress(address);
    return new Response(JSON.stringify(response));
  }
}
