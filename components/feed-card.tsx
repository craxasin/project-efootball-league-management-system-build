import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Badge, TeamLogo } from "@/components/ui";

type FeedMatch = {
  id: string;
  matchday: { number: number };
  homeTeam: { name: string; logoUrl: string | null };
  awayTeam: { name: string; logoUrl: string | null };
  result: { homeScore: number; awayScore: number; screenshotUrl: string; submittedAt: Date } | null;
};

export function FeedCard({ match }: { match: FeedMatch }) {
  if (!match.result) return null;

  return (
    <article className="overflow-hidden rounded border border-slate-200 bg-white shadow-panel">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <Badge tone="green">Matchday {match.matchday.number}</Badge>
        <span className="flex items-center gap-1 text-sm font-semibold text-slate-500">
          <CalendarDays size={15} />
          {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(match.result.submittedAt)}
        </span>
      </div>
      <Link href={`/matches/${match.id}`} className="block">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-5">
          <TeamBlock name={match.homeTeam.name} logoUrl={match.homeTeam.logoUrl} align="right" />
          <div className="rounded bg-slate-950 px-4 py-2 text-2xl font-black text-white">
            {match.result.homeScore} - {match.result.awayScore}
          </div>
          <TeamBlock name={match.awayTeam.name} logoUrl={match.awayTeam.logoUrl} align="left" />
        </div>
        <img src={match.result.screenshotUrl} alt="Match screenshot" className="aspect-video w-full object-cover" />
      </Link>
    </article>
  );
}

function TeamBlock({ name, logoUrl, align }: { name: string; logoUrl: string | null; align: "left" | "right" }) {
  return (
    <div className={`flex items-center gap-3 ${align === "right" ? "justify-end text-right" : ""}`}>
      {align === "right" ? <span className="text-sm font-black sm:text-base">{name}</span> : null}
      <TeamLogo src={logoUrl} name={name} />
      {align === "left" ? <span className="text-sm font-black sm:text-base">{name}</span> : null}
    </div>
  );
}
