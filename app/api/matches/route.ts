import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api";
import { requireAdmin, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const matchSchema = z.object({
  matchdayId: z.string().min(1),
  homeTeamId: z.string().min(1),
  awayTeamId: z.string().min(1),
  scheduledAt: z.string().datetime().optional().nullable()
});

export async function GET() {
  try {
    await requireUser();
    const matches = await prisma.match.findMany({
      orderBy: [{ matchday: { number: "asc" } }, { scheduledAt: "asc" }],
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

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = matchSchema.parse(await request.json());

    if (body.homeTeamId === body.awayTeamId) {
      return NextResponse.json({ error: "Home and away teams must be different" }, { status: 400 });
    }

    const match = await prisma.match.create({
      data: {
        matchdayId: body.matchdayId,
        homeTeamId: body.homeTeamId,
        awayTeamId: body.awayTeamId,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null
      },
      include: {
        matchday: true,
        homeTeam: true,
        awayTeam: true
      }
    });

    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
