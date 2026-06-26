import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api";
import { requireAdmin, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const matchdaySchema = z.object({
  number: z.coerce.number().int().positive(),
  title: z.string().trim().max(100).optional().nullable()
});

export async function GET() {
  try {
    await requireUser();
    const matchdays = await prisma.matchday.findMany({
      orderBy: { number: "asc" },
      include: {
        matches: {
          orderBy: { scheduledAt: "asc" },
          include: {
            homeTeam: true,
            awayTeam: true,
            result: true
          }
        }
      }
    });

    return NextResponse.json(matchdays);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = matchdaySchema.parse(await request.json());
    const matchday = await prisma.matchday.create({ data: body });
    return NextResponse.json(matchday, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
