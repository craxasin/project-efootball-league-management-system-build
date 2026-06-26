"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarPlus, Plus } from "lucide-react";

type TeamOption = { id: string; name: string };
type MatchdayOption = { id: string; number: number; title: string | null };

export function AdminFixtures({ teams, matchdays }: { teams: TeamOption[]; matchdays: MatchdayOption[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function createMatchday(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const response = await fetch("/api/matchdays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: form.get("number"), title: form.get("title") || null })
    });
    const payload = await response.json().catch(() => null);
    setMessage(response.ok ? "Matchday created" : payload?.error ?? "Could not create matchday");
    if (response.ok) {
      formElement.reset();
      router.refresh();
    }
  }

  async function createMatch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const scheduledAt = form.get("scheduledAt");
    const response = await fetch("/api/matches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        matchdayId: form.get("matchdayId"),
        homeTeamId: form.get("homeTeamId"),
        awayTeamId: form.get("awayTeamId"),
        scheduledAt: scheduledAt ? new Date(String(scheduledAt)).toISOString() : null
      })
    });
    const payload = await response.json().catch(() => null);
    setMessage(response.ok ? "Match created" : payload?.error ?? "Could not create match");
    if (response.ok) {
      formElement.reset();
      router.refresh();
    }
  }

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <form onSubmit={createMatchday} className="rounded border border-slate-200 bg-white p-4 shadow-panel">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-950">
          <CalendarPlus size={20} />
          Create matchday
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="number" type="number" min="1" required placeholder="Matchday number" className="rounded border border-slate-200 px-3 py-3 outline-none focus:ring-2 focus:ring-emerald-600" />
          <input name="title" placeholder="Optional title" className="rounded border border-slate-200 px-3 py-3 outline-none focus:ring-2 focus:ring-emerald-600" />
        </div>
        <button className="mt-4 inline-flex items-center gap-2 rounded bg-slate-950 px-4 py-3 font-bold text-white">
          <Plus size={18} />
          Add matchday
        </button>
      </form>

      <form onSubmit={createMatch} className="rounded border border-slate-200 bg-white p-4 shadow-panel">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-slate-950">
          <Plus size={20} />
          Create match
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Select name="matchdayId" label="Matchday" options={matchdays.map((m) => ({ id: m.id, name: `Matchday ${m.number}${m.title ? ` - ${m.title}` : ""}` }))} />
          <input name="scheduledAt" type="datetime-local" className="rounded border border-slate-200 px-3 py-3 outline-none focus:ring-2 focus:ring-emerald-600" />
          <Select name="homeTeamId" label="Home team" options={teams} />
          <Select name="awayTeamId" label="Away team" options={teams} />
        </div>
        <button className="mt-4 inline-flex items-center gap-2 rounded bg-emerald-700 px-4 py-3 font-bold text-white">
          <Plus size={18} />
          Add match
        </button>
      </form>
      {message ? <p className="lg:col-span-2 rounded bg-white px-3 py-2 text-sm font-semibold text-slate-700">{message}</p> : null}
    </section>
  );
}

function Select({ name, label, options }: { name: string; label: string; options: TeamOption[] }) {
  return (
    <select name={name} required aria-label={label} className="rounded border border-slate-200 px-3 py-3 outline-none focus:ring-2 focus:ring-emerald-600">
      <option value="">{label}</option>
      {options.map((option) => (
        <option value={option.id} key={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
}
