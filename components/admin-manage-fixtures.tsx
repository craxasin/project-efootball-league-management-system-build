"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Badge, TeamLogo } from "@/components/ui";

interface TeamOption {
  id: string;
  name: string;
  logoUrl?: string | null;
}

interface MatchdayWithMatches {
  id: string;
  number: number;
  title: string | null;
  matches: {
    id: string;
    homeTeamId: string;
    awayTeamId: string;
    scheduledAt?: Date | null;
    status: "SCHEDULED" | "COMPLETED";
    result?: {
      homeScore: number;
      awayScore: number;
    } | null;
    homeTeam: TeamOption;
    awayTeam: TeamOption;
  }[];
}

interface AdminManageFixturesProps {
  matchdays: MatchdayWithMatches[];
  teams: TeamOption[];
}

export function AdminManageFixtures({ matchdays, teams }: AdminManageFixturesProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function deleteMatchday(matchdayId: string) {
    if (!confirm("Are you sure? This will delete all matches in this matchday.")) return;

    setDeleting(matchdayId);
    try {
      const response = await fetch(`/api/matchdays/${matchdayId}`, { method: "DELETE" });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to delete matchday");
      }
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete matchday");
    } finally {
      setDeleting(null);
    }
  }

  async function deleteMatch(matchId: string) {
    if (!confirm("Are you sure? This will delete this match.")) return;

    setDeleting(matchId);
    try {
      const response = await fetch(`/api/matches/${matchId}`, { method: "DELETE" });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to delete match");
      }
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete match");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <section className="space-y-5">
      <h2 className="text-lg font-black text-slate-950">Manage Matchdays & Matches</h2>
      {matchdays.map((matchday) => (
        <div key={matchday.id} className="rounded border border-slate-200 bg-white shadow-panel">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="text-lg font-black">Matchday {matchday.number}</h3>
              {matchday.title && <p className="text-sm text-slate-500">{matchday.title}</p>}
            </div>
            <button
              onClick={() => deleteMatchday(matchday.id)}
              disabled={deleting === matchday.id}
              className="flex items-center gap-2 rounded bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>

          {matchday.matches.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {matchday.matches.map((match) => (
                <div key={match.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50">
                  <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto] md:items-center flex-1">
                    <div className="flex items-center justify-start gap-3 md:justify-end md:text-right">
                      <span className="font-bold">{match.homeTeam.name}</span>
                      <TeamLogo src={match.homeTeam.logoUrl} name={match.homeTeam.name} size="sm" />
                    </div>
                    <span className="rounded bg-slate-100 px-3 py-1 text-sm font-black md:justify-self-center">
                      {match.result ? `${match.result.homeScore} - ${match.result.awayScore}` : "vs"}
                    </span>
                    <div className="flex items-center gap-3">
                      <TeamLogo src={match.awayTeam.logoUrl} name={match.awayTeam.name} size="sm" />
                      <span className="font-bold">{match.awayTeam.name}</span>
                    </div>
                    <Badge tone={match.status === "COMPLETED" ? "green" : "blue"}>
                      {match.status === "COMPLETED" ? "Completed" : "Scheduled"}
                    </Badge>
                  </div>
                  <button
                    onClick={() => deleteMatch(match.id)}
                    disabled={deleting === match.id}
                    className="ml-4 inline-flex items-center gap-2 rounded bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-5 py-4 text-sm font-semibold text-slate-500">No matches in this matchday.</p>
          )}
        </div>
      ))}

      {matchdays.length === 0 && <p className="text-sm text-slate-600">No matchdays created yet.</p>}
    </section>
  );
}
