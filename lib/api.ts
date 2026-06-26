import { NextResponse } from "next/server";

export function jsonError(error: unknown, fallback = "Something went wrong", status = 400) {
  if (error instanceof Response) {
    return new NextResponse(error.body, {
      status: error.status,
      headers: error.headers
    });
  }

  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ error: message }, { status });
}
