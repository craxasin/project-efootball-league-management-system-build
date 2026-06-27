import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const paramsSchema = z.object({
  id: z.string().cuid()
});

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();

    const { id } = paramsSchema.parse(await params);

    const matchday = await prisma.matchday.findUnique({
      where: { id }
    });

    if (!matchday) {
      return NextResponse.json({ error: "Matchday not found" }, { status: 404 });
    }

    await prisma.matchday.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return jsonError(error);
  }
}
