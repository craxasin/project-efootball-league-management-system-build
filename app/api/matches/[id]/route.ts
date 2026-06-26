import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  try {
    await requireUser();
    const { id } = await params;
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        matchday: true,
        homeTeam: { include: { user: true } },
        awayTeam: { include: { user: true } },
        result: true
      }
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    return NextResponse.json(match);
  } catch (error) {
    return jsonError(error);
  }
}
