import Link from "next/link";
import { CalendarCheck, Medal, Shield } from "lucide-react";
import { AdminFixtures } from "@/components/admin-fixtures";
import { AppShell } from "@/components/shell";
import { SetupRequired } from "@/components/setup-required";
import { TeamForm } from "@/components/team-form";
import { TeamLogo } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { getMissingEnvVars, isDatabaseConfigured } from "@/lib/config";
import { prisma } from "@/lib/prisma";
import { calculateStandings } from "@/lib/standings";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!isDatabaseConfigured()) {
    return <SetupRequired missing={getMissingEnvVars()} />;
  }

  const user = await getCurrentUser();
  const [teams, matchdays, matches] = await Promise.all([
    prisma.team.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.matchday.findMany({ orderBy: { number: "asc" } }),
    prisma.match.findMany({
      include: { homeTeam: true, awayTeam: true, result: true },
      orderBy: [{ matchday: { number: "asc" } }, { scheduledAt: "asc" }]
    })
  ]);
  const standings = calculateStandings(teams, matches);
  const myUpcoming = user?.team
    ? matches.filter((match) => match.status === "SCHEDULED" && [match.homeTeamId, match.awayTeamId].includes(user.team!.id)).slice(0, 3)
    : [];

  return (
    <AppShell>
      <div className="grid gap-6">
        <section className="overflow-hidden rounded border border-emerald-900/10 bg-emerald-900 text-white shadow-panel">
          <div className="pitch-lines grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-emerald-200">League control room</p>
              <h1 className="mt-3 text-4xl font-black sm:text-5xl">Manage fixtures, results, and the table.</h1>
              <p className="mt-4 max-w-2xl text-emerald-50">Six players, admin-built fixtures, player-submitted results, and live standings.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <Stat label="Players" value={`${teams.length}/6`} />
              <Stat label="Fixtures" value={String(matches.length)} />
              <Stat label="Completed" value={String(matches.filter((m) => m.status === "COMPLETED").length)} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded border border-slate-200 bg-white p-5 shadow-panel">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black">
              <Shield size={22} />
              Your team
            </h2>
            {user?.team ? (
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <TeamLogo src={user.team.logoUrl} name={user.team.name} size="lg" />
                  <div>
                    <p className="text-2xl font-black">{user.team.name}</p>
                    <p className="text-sm font-semibold text-slate-500">{user.role}</p>
                  </div>
                </div>
                <TeamForm initialName={user.team.name} initialLogo={user.team.logoUrl} />
              </div>
            ) : null}
          </div>

          <div className="rounded border border-slate-200 bg-white p-5 shadow-panel">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black">
              <CalendarCheck size={22} />
              Your scheduled matches
            </h2>
            <div className="space-y-3">
              {myUpcoming.length ? (
                myUpcoming.map((match) => (
                  <Link key={match.id} href={`/matches/${match.id}`} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded border border-slate-100 p-3 hover:bg-slate-50">
                    <span className="text-right font-bold">{match.homeTeam.name}</span>
                    <span className="rounded bg-slate-100 px-3 py-1 text-sm font-black">vs</span>
                    <span className="font-bold">{match.awayTeam.name}</span>
                  </Link>
                ))
              ) : (
                <p className="rounded bg-slate-50 p-4 text-sm font-semibold text-slate-600">No scheduled matches for your team yet.</p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded border border-slate-200 bg-white p-5 shadow-panel">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-black">
            <Medal size={22} />
            Top of the table
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {standings.slice(0, 3).map((row, index) => (
              <div key={row.teamId} className="flex items-center gap-3 rounded border border-slate-100 p-3">
                <span className="grid h-9 w-9 place-items-center rounded bg-slate-950 font-black text-white">{index + 1}</span>
                <TeamLogo src={row.logoUrl} name={row.teamName} />
                <div>
                  <p className="font-black">{row.teamName}</p>
                  <p className="text-sm font-semibold text-slate-500">{row.points} pts</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {user?.role === "ADMIN" ? <AdminFixtures teams={teams} matchdays={matchdays} /> : null}
      </div>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-white/10 p-4 ring-1 ring-white/10">
      <p className="text-3xl font-black">{value}</p>
      <p className="text-sm font-semibold text-emerald-100">{label}</p>
    </div>
  );
}
