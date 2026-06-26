"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save, Trash2 } from "lucide-react";

export function AdminResultControls({
  matchId,
  homeScore,
  awayScore
}: {
  matchId: string;
  homeScore?: number;
  awayScore?: number;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/matches/${matchId}/result`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        homeScore: form.get("homeScore"),
        awayScore: form.get("awayScore"),
        screenshotUrl: form.get("screenshotUrl") || undefined
      })
    });
    const payload = await response.json().catch(() => null);
    setMessage(response.ok ? "Result saved" : payload?.error ?? "Could not save result");
    if (response.ok) router.refresh();
  }

  async function clear() {
    const response = await fetch(`/api/matches/${matchId}/result`, { method: "DELETE" });
    const payload = await response.json().catch(() => null);
    setMessage(response.ok ? "Result deleted" : payload?.error ?? "Could not delete result");
    if (response.ok) router.refresh();
  }

  return (
    <div className="rounded border border-slate-200 bg-white p-5 shadow-panel">
      <h2 className="mb-4 text-xl font-black">Admin result controls</h2>
      <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
        <input name="homeScore" type="number" min="0" max="99" defaultValue={homeScore ?? 0} className="rounded border border-slate-200 px-3 py-3 outline-none focus:ring-2 focus:ring-emerald-600" />
        <input name="awayScore" type="number" min="0" max="99" defaultValue={awayScore ?? 0} className="rounded border border-slate-200 px-3 py-3 outline-none focus:ring-2 focus:ring-emerald-600" />
        <input name="screenshotUrl" type="url" placeholder="Screenshot URL for manual edits" className="rounded border border-slate-200 px-3 py-3 outline-none focus:ring-2 focus:ring-emerald-600 sm:col-span-2" />
        <button className="inline-flex items-center justify-center gap-2 rounded bg-emerald-700 px-4 py-3 font-bold text-white">
          <Save size={18} />
          Save result
        </button>
        <button type="button" onClick={clear} className="inline-flex items-center justify-center gap-2 rounded bg-red-600 px-4 py-3 font-bold text-white">
          <Trash2 size={18} />
          Delete result
        </button>
      </form>
      {message ? <p className="mt-3 text-sm font-semibold text-slate-600">{message}</p> : null}
    </div>
  );
}
