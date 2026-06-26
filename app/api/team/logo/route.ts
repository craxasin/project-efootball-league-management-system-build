import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Logo file is required" }, { status: 400 });
    }

    const logoUrl = await uploadImage(file, "logos");
    const team = await prisma.team.update({
      where: { userId: user.id },
      data: { logoUrl }
    });

    return NextResponse.json(team);
  } catch (error) {
    return jsonError(error);
  }
}
