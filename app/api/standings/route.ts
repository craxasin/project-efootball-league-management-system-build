import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateStandings } from "@/lib/standings";

export async function GET() {
  try {
    await requireUser();
    const [teams, matches] = await Promise.all([
      prisma.team.findMany({ orderBy: { createdAt: "asc" } }),
      prisma.match.findMany({
        where: { status: "COMPLETED" },
        include: {
          homeTeam: true,
          awayTeam: true,
          result: true
        }
      })
    ]);

    return NextResponse.json(calculateStandings(teams, matches));
  } catch (error) {
    return jsonError(error);
  }
}
