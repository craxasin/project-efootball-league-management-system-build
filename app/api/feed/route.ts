import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireUser();
    const matches = await prisma.match.findMany({
      where: {
        status: "COMPLETED",
        result: { isNot: null }
      },
      orderBy: [{ result: { submittedAt: "desc" } }],
      include: {
        matchday: true,
        homeTeam: true,
        awayTeam: true,
        result: true
      }
    });

    return NextResponse.json(matches);
  } catch (error) {
    return jsonError(error);
  }
}
