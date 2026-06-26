import type { Match, Result, Team } from "@prisma/client";

type CompletedMatch = Match & {
  homeTeam: Team;
  awayTeam: Team;
  result: Result | null;
};

export type StandingRow = {
  teamId: string;
  teamName: string;
  logoUrl: string | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

export function calculateStandings(teams: Team[], matches: CompletedMatch[]): StandingRow[] {
  const table = new Map<string, StandingRow>();

  for (const team of teams) {
    table.set(team.id, {
      teamId: team.id,
      teamName: team.name,
      logoUrl: team.logoUrl,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0
    });
  }

  for (const match of matches) {
    if (match.status !== "COMPLETED" || !match.result) continue;

    const home = table.get(match.homeTeamId);
    const away = table.get(match.awayTeamId);
    if (!home || !away) continue;

    const { homeScore, awayScore } = match.result;
    home.played += 1;
    away.played += 1;
    home.goalsFor += homeScore;
    home.goalsAgainst += awayScore;
    away.goalsFor += awayScore;
    away.goalsAgainst += homeScore;

    if (homeScore > awayScore) {
      home.wins += 1;
      away.losses += 1;
      home.points += 3;
    } else if (homeScore < awayScore) {
      away.wins += 1;
      home.losses += 1;
      away.points += 3;
    } else {
      home.draws += 1;
      away.draws += 1;
      home.points += 1;
      away.points += 1;
    }
  }

  return Array.from(table.values())
    .map((row) => ({
      ...row,
      goalDifference: row.goalsFor - row.goalsAgainst
    }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
}
