import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const resetPasswordSchema = z.object({
  userId: z.string().cuid(),
  password: z.string().min(8).max(120)
});

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = resetPasswordSchema.parse(await request.json());

    const user = await prisma.user.findUnique({
      where: { id: body.userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const passwordHash = await bcrypt.hash(body.password, 12);

    await prisma.user.update({
      where: { id: body.userId },
      data: { passwordHash }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError(error);
  }
}
