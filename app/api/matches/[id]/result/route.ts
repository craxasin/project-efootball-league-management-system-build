import { NextResponse } from "next/server";
import { z } from "zod";
import { jsonError } from "@/lib/api";
import { requireAdmin, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/storage";

type Params = {
  params: Promise<{ id: string }>;
};

const resultSchema = z.object({
  homeScore: z.coerce.number().int().min(0).max(99),
  awayScore: z.coerce.number().int().min(0).max(99),
  screenshotUrl: z.string().url().optional()
});

async function getMatchForSubmission(id: string) {
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      homeTeam: true,
      awayTeam: true,
      result: true
    }
  });

  if (!match) {
    throw new Response("Match not found", { status: 404 });
  }

  return match;
}

export async function POST(request: Request, { params }: Params) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const match = await getMatchForSubmission(id);

    if (!user.team || ![match.homeTeamId, match.awayTeamId].includes(user.team.id)) {
      return NextResponse.json({ error: "Only players in this fixture can submit a result" }, { status: 403 });
    }

    if (match.result) {
      return NextResponse.json({ error: "This match already has a submitted result" }, { status: 409 });
    }

    const formData = await request.formData();
    const parsed = resultSchema.parse({
      homeScore: formData.get("homeScore"),
      awayScore: formData.get("awayScore")
    });
    const file = formData.get("screenshot");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Screenshot is required" }, { status: 400 });
    }

    const screenshotUrl = await uploadImage(file, "screenshots");
    const result = await prisma.result.create({
      data: {
        matchId: match.id,
        homeScore: parsed.homeScore,
        awayScore: parsed.awayScore,
        screenshotUrl,
        submittedById: user.id
      }
    });

    await prisma.match.update({
      where: { id: match.id },
      data: { status: "COMPLETED" }
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const admin = await requireAdmin();
    const { id } = await params;
    const match = await getMatchForSubmission(id);
    const contentType = request.headers.get("content-type") ?? "";

    let parsed: z.infer<typeof resultSchema>;
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("screenshot");
      parsed = resultSchema.parse({
        homeScore: formData.get("homeScore"),
        awayScore: formData.get("awayScore"),
        screenshotUrl: file instanceof File ? await uploadImage(file, "screenshots") : undefined
      });
    } else {
      parsed = resultSchema.parse(await request.json());
    }

    if (!match.result && !parsed.screenshotUrl) {
      return NextResponse.json({ error: "A screenshot URL or uploaded screenshot is required for a new result" }, { status: 400 });
    }

    const result = await prisma.result.upsert({
      where: { matchId: match.id },
      update: {
        homeScore: parsed.homeScore,
        awayScore: parsed.awayScore,
        ...(parsed.screenshotUrl ? { screenshotUrl: parsed.screenshotUrl } : {})
      },
      create: {
        matchId: match.id,
        homeScore: parsed.homeScore,
        awayScore: parsed.awayScore,
        screenshotUrl: parsed.screenshotUrl ?? match.result?.screenshotUrl ?? "",
        submittedById: admin.id
      }
    });

    await prisma.match.update({
      where: { id: match.id },
      data: { status: "COMPLETED" }
    });

    return NextResponse.json(result);
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;

    await prisma.result.deleteMany({ where: { matchId: id } });
    await prisma.match.update({
      where: { id },
      data: { status: "SCHEDULED" }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}
