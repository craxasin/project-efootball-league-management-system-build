import { FeedCard } from "@/components/feed-card";
import { AppShell } from "@/components/shell";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const matches = await prisma.match.findMany({
    where: { status: "COMPLETED", result: { isNot: null } },
    orderBy: [{ result: { submittedAt: "desc" } }],
    include: { matchday: true, homeTeam: true, awayTeam: true, result: true }
  });

  return (
    <AppShell>
      <section className="mx-auto max-w-3xl space-y-5">
        <div>
          <h1 className="text-3xl font-black">Match Feed</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">Newest completed matches first.</p>
        </div>
        {matches.length ? matches.map((match) => <FeedCard key={match.id} match={match} />) : <p className="rounded border border-slate-200 bg-white p-5 font-semibold text-slate-600 shadow-panel">No completed matches yet.</p>}
      </section>
    </AppShell>
  );
}
