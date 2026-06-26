"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Camera, Send } from "lucide-react";

export function ResultForm({ matchId }: { matchId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [screenshotStatus, setScreenshotStatus] = useState<"idle" | "selected" | "uploading">("idle");
  const [screenshotName, setScreenshotName] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch(`/api/matches/${matchId}/result`, {
      method: "POST",
      body: new FormData(event.currentTarget)
    });
    const payload = await response.json().catch(() => null);
    setLoading(false);

    if (!response.ok) {
      setMessage(payload?.error ?? "Result submission failed");
      return;
    }

    setMessage("Result submitted");
    setScreenshotStatus("idle");
    setScreenshotName("");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <ScoreInput name="homeScore" label="Home score" />
        <ScoreInput name="awayScore" label="Away score" />
      </div>
      <label className={`flex cursor-pointer items-center justify-center gap-2 rounded border-2 border-dashed px-3 py-4 text-sm font-bold transition-colors ${
        screenshotStatus === "selected" ? "border-blue-300 bg-blue-50 text-blue-700" :
        screenshotStatus === "uploading" ? "border-blue-300 bg-blue-50 text-blue-700" :
        "border-slate-300 bg-white text-slate-700 hover:border-emerald-500"
      }`}>
        <Camera size={18} />
        {screenshotStatus === "selected" ? `Selected: ${screenshotName}` : screenshotStatus === "uploading" ? "Uploading..." : "Match screenshot"}
        <input
          name="screenshot"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          required
          disabled={loading || screenshotStatus === "uploading"}
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              setScreenshotName(file.name);
              setScreenshotStatus("selected");
            }
          }}
        />
      </label>
      {message ? <p className="rounded bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">{message}</p> : null}
      <button className="inline-flex items-center gap-2 rounded bg-emerald-700 px-4 py-3 font-bold text-white hover:bg-emerald-800" disabled={loading || screenshotStatus === "uploading"}>
        <Send size={18} />
        {loading ? "Submitting..." : "Submit result"}
      </button>
    </form>
  );
}

function ScoreInput({ name, label }: { name: string; label: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-700">{label}</span>
      <input name={name} type="number" min="0" max="99" required className="w-full rounded border border-slate-200 px-3 py-3 text-center text-xl font-black outline-none focus:ring-2 focus:ring-emerald-600" />
    </label>
  );
}
