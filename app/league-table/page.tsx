import { AppShell } from "@/components/shell";
import { TeamLogo } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { calculateStandings } from "@/lib/standings";

export const dynamic = "force-dynamic";

export default async function LeagueTablePage() {
  const [teams, matches] = await Promise.all([
    prisma.team.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.match.findMany({ where: { status: "COMPLETED" }, include: { homeTeam: true, awayTeam: true, result: true } })
  ]);
  const table = calculateStandings(teams, matches);

  return (
    <AppShell>
      <section className="rounded border border-slate-200 bg-white shadow-panel">
        <div className="border-b border-slate-100 p-5">
          <h1 className="text-3xl font-black">League Table</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">Sorted by points, goal difference, then goals for.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Team</th>
                {["P", "W", "D", "L", "GF", "GA", "GD", "Pts"].map((head) => (
                  <th key={head} className="px-4 py-3 text-center">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {table.map((row, index) => (
                <tr key={row.teamId}>
                  <td className="px-4 py-4 font-black">{index + 1}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <TeamLogo src={row.logoUrl} name={row.teamName} size="sm" />
                      <span className="font-black">{row.teamName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center font-semibold">{row.played}</td>
                  <td className="px-4 py-4 text-center font-semibold">{row.wins}</td>
                  <td className="px-4 py-4 text-center font-semibold">{row.draws}</td>
                  <td className="px-4 py-4 text-center font-semibold">{row.losses}</td>
                  <td className="px-4 py-4 text-center font-semibold">{row.goalsFor}</td>
                  <td className="px-4 py-4 text-center font-semibold">{row.goalsAgainst}</td>
                  <td className="px-4 py-4 text-center font-semibold">{row.goalDifference}</td>
                  <td className="px-4 py-4 text-center text-lg font-black">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
