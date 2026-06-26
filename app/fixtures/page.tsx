import Link from "next/link";
import { AdminFixtures } from "@/components/admin-fixtures";
import { AppShell } from "@/components/shell";
import { Badge, TeamLogo } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FixturesPage() {
  const user = await getCurrentUser();
  const [teams, matchdays] = await Promise.all([
    prisma.team.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.matchday.findMany({
      orderBy: { number: "asc" },
      include: {
        matches: {
          orderBy: { scheduledAt: "asc" },
          include: { homeTeam: true, awayTeam: true, result: true }
        }
      }
    })
  ]);

  return (
    <AppShell>
      <div className="space-y-6">
        <section>
          <h1 className="text-3xl font-black">Fixtures</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">All matchdays and admin-created scheduled matches.</p>
        </section>

        {user?.role === "ADMIN" ? <AdminFixtures teams={teams} matchdays={matchdays} /> : null}

        <section className="space-y-5">
          {matchdays.map((matchday) => (
            <div key={matchday.id} className="rounded border border-slate-200 bg-white shadow-panel">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h2 className="text-xl font-black">Matchday {matchday.number}</h2>
                {matchday.title ? <span className="text-sm font-bold text-slate-500">{matchday.title}</span> : null}
              </div>
              <div className="divide-y divide-slate-100">
                {matchday.matches.length ? (
                  matchday.matches.map((match) => (
                    <Link key={match.id} href={`/matches/${match.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <TeamLogo src={match.homeTeam.logoUrl} name={match.homeTeam.name} size="sm" />
                        <span className="font-black">{match.homeTeam.name}</span>
                      </div>
                      <span className="rounded bg-slate-100 px-3 py-1 text-sm font-black">
                        {match.result ? `${match.result.homeScore} - ${match.result.awayScore}` : "vs"}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-black">{match.awayTeam.name}</span>
                        <TeamLogo src={match.awayTeam.logoUrl} name={match.awayTeam.name} size="sm" />
                      </div>
                      <Badge tone={match.status === "COMPLETED" ? "green" : "blue"}>{match.status === "COMPLETED" ? "Completed" : "Scheduled"}</Badge>
                    </Link>
                  ))
                ) : (
                  <p className="px-5 py-4 text-sm font-semibold text-slate-500">No matches in this matchday yet.</p>
                )}
              </div>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
