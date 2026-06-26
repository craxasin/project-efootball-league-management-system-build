import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const teamSchema = z.object({
  name: z.string().trim().min(2).max(80),
  logoUrl: z.string().url().optional().nullable()
});

export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json(user.team);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireUser();
    const body = teamSchema.parse(await request.json());

    const team = await prisma.team.upsert({
      where: { userId: user.id },
      update: {
        name: body.name,
        logoUrl: body.logoUrl ?? user.team?.logoUrl ?? null
      },
      create: {
        userId: user.id,
        name: body.name,
        logoUrl: body.logoUrl ?? null
      }
    });

    return NextResponse.json(team);
  } catch (error) {
    return jsonError(error);
  }
}
