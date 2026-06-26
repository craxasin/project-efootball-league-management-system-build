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
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-2 py-2 sm:px-4 sm:py-3">#</th>
                <th className="px-2 py-2 sm:px-4 sm:py-3">Team</th>
                {["P", "W", "D", "L", "GF", "GA", "GD", "Pts"].map((head) => (
                  <th key={head} className="px-2 py-2 text-center sm:px-4 sm:py-3">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {table.map((row, index) => (
                <tr key={row.teamId}>
                  <td className="px-2 py-2 font-black sm:px-4 sm:py-4">{index + 1}</td>
                  <td className="px-2 py-2 sm:px-4 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <TeamLogo src={row.logoUrl} name={row.teamName} size="sm" />
                      <span className="font-black">{row.teamName}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-center font-semibold sm:px-4 sm:py-4">{row.played}</td>
                  <td className="px-2 py-2 text-center font-semibold sm:px-4 sm:py-4">{row.wins}</td>
                  <td className="px-2 py-2 text-center font-semibold sm:px-4 sm:py-4">{row.draws}</td>
                  <td className="px-2 py-2 text-center font-semibold sm:px-4 sm:py-4">{row.losses}</td>
                  <td className="px-2 py-2 text-center font-semibold sm:px-4 sm:py-4">{row.goalsFor}</td>
                  <td className="px-2 py-2 text-center font-semibold sm:px-4 sm:py-4">{row.goalsAgainst}</td>
                  <td className="px-2 py-2 text-center font-semibold sm:px-4 sm:py-4">{row.goalDifference}</td>
                  <td className="px-2 py-2 text-center font-black sm:px-4 sm:py-4 sm:text-lg">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
