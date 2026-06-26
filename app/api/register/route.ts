import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8).max(120),
  teamName: z.string().trim().min(2).max(80)
});

export async function POST(request: Request) {
  try {
    const body = registerSchema.parse(await request.json());
    const email = body.email.toLowerCase();

    const [existingUser, playerCount] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.count()
    ]);

    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
    }

    if (playerCount >= 6) {
      return NextResponse.json({ error: "This private league already has six players" }, { status: 403 });
    }

    const passwordHash = await bcrypt.hash(body.password, 12);
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email,
        passwordHash,
        role: playerCount === 0 ? "ADMIN" : "PLAYER",
        team: {
          create: {
            name: body.teamName
          }
        }
      },
      include: { team: true }
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role,
      team: user.team
    });
  } catch (error) {
    return jsonError(error);
  }
}
