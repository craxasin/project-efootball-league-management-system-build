import { notFound } from "next/navigation";
import { AdminResultControls } from "@/components/admin-result-controls";
import { ResultForm } from "@/components/result-form";
import { AppShell } from "@/components/shell";
import { Badge, TeamLogo } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MatchDetailsPage({ params }: Props) {
  const user = await getCurrentUser();
  const { id } = await params;
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      matchday: true,
      homeTeam: true,
      awayTeam: true,
      result: true
    }
  });

  if (!match) notFound();

  const canSubmit = Boolean(user?.team && [match.homeTeamId, match.awayTeamId].includes(user.team.id) && !match.result);

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="overflow-hidden rounded border border-slate-200 bg-white shadow-panel">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <Badge tone={match.status === "COMPLETED" ? "green" : "blue"}>{match.status === "COMPLETED" ? "Completed" : "Scheduled"}</Badge>
            <span className="text-sm font-bold text-slate-500">Matchday {match.matchday.number}</span>
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 p-6">
            <TeamPanel name={match.homeTeam.name} logoUrl={match.homeTeam.logoUrl} align="right" />
            <div className="rounded bg-slate-950 px-4 py-3 text-3xl font-black text-white">
              {match.result ? `${match.result.homeScore} - ${match.result.awayScore}` : "vs"}
            </div>
            <TeamPanel name={match.awayTeam.name} logoUrl={match.awayTeam.logoUrl} align="left" />
          </div>
          {match.scheduledAt ? <p className="border-t border-slate-100 px-5 py-3 text-center text-sm font-semibold text-slate-500">Scheduled for {new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short" }).format(match.scheduledAt)}</p> : null}
        </section>

        {match.result ? (
          <section className="overflow-hidden rounded border border-slate-200 bg-white shadow-panel">
            <div className="border-b border-slate-100 p-5">
              <h2 className="text-xl font-black">Submitted screenshot</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(match.result.submittedAt)}</p>
            </div>
            <img src={match.result.screenshotUrl} alt="Submitted match screenshot" className="max-h-[680px] w-full object-contain bg-slate-950" />
          </section>
        ) : null}

        {canSubmit ? (
          <section className="rounded border border-slate-200 bg-white p-5 shadow-panel">
            <h2 className="mb-4 text-xl font-black">Submit match result</h2>
            <ResultForm matchId={match.id} />
          </section>
        ) : null}

        {user?.role === "ADMIN" ? <AdminResultControls matchId={match.id} homeScore={match.result?.homeScore} awayScore={match.result?.awayScore} /> : null}
      </div>
    </AppShell>
  );
}

function TeamPanel({ name, logoUrl, align }: { name: string; logoUrl: string | null; align: "left" | "right" }) {
  return (
    <div className={`flex flex-col items-center gap-3 ${align === "right" ? "text-right" : "text-left"}`}>
      <TeamLogo src={logoUrl} name={name} size="lg" />
      <h1 className="text-xl font-black sm:text-2xl">{name}</h1>
    </div>
  );
}
