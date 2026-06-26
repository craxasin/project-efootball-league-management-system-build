"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Upload } from "lucide-react";

export function TeamForm({ initialName, initialLogo }: { initialName: string; initialLogo?: string | null }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [logoUrl, setLogoUrl] = useState(initialLogo ?? "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function uploadLogo(file: File) {
    const data = new FormData();
    data.append("file", file);
    const response = await fetch("/api/team/logo", {
      method: "POST",
      body: data
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error ?? "Logo upload failed");
    setLogoUrl(payload.logoUrl ?? "");
    router.refresh();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/team", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, logoUrl: logoUrl || null })
    });

    setLoading(false);
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setMessage(payload?.error ?? "Team update failed");
      return;
    }

    setMessage("Team updated");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-slate-700">Team name</span>
        <input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded border border-slate-200 px-3 py-3 outline-none focus:ring-2 focus:ring-emerald-600" />
      </label>
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-slate-300 bg-white px-3 py-4 text-sm font-bold text-slate-700 hover:border-emerald-500">
        <Upload size={18} />
        Upload logo
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) uploadLogo(file).catch((error) => setMessage(error.message));
          }}
        />
      </label>
      {message ? <p className="text-sm font-semibold text-slate-600">{message}</p> : null}
      <button className="rounded bg-slate-950 px-4 py-3 font-bold text-white hover:bg-slate-800" disabled={loading}>
        {loading ? "Saving..." : "Save team"}
      </button>
    </form>
  );
}
