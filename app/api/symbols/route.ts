import { NextResponse } from "next/server";

const API_BASE_URL = process.env.EXCHANGERATES_API_BASE_URL || "http://api.exchangeratesapi.io/v1";
const API_KEY = process.env.EXCHANGERATES_API_KEY || "";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE_URL}/symbols?access_key=${API_KEY}`);

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.error?.info || "Failed to fetch symbols" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}