import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.EXCHANGERATES_API_BASE_URL || "http://api.exchangeratesapi.io/v1";
const API_KEY = process.env.EXCHANGERATES_API_KEY || "";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const amount = searchParams.get("amount");
  const date = searchParams.get("date");

  if (!from || !to || !amount) {
    return NextResponse.json(
      { error: "Missing required parameters: from, to, amount" },
      { status: 400 }
    );
  }

  try {
    const params = new URLSearchParams({
      access_key: API_KEY,
      from,
      to,
      amount,
    });

    if (date) {
      params.append("date", date);
    }

    const res = await fetch(`${API_BASE_URL}/convert?${params.toString()}`);

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: error.error?.info || "Failed to convert currency" },
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