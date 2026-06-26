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
  const [logoStatus, setLogoStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [logoError, setLogoError] = useState("");

  async function uploadLogo(file: File) {
    setLogoStatus("uploading");
    setLogoError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch("/api/team/logo", {
        method: "POST",
        body: data
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Logo upload failed");
      setLogoUrl(payload.logoUrl ?? "");
      setLogoStatus("success");
      setTimeout(() => setLogoStatus("idle"), 2000);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      setLogoError(message);
      setLogoStatus("error");
      setTimeout(() => setLogoStatus("idle"), 4000);
    }
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
      <label className={`flex cursor-pointer items-center justify-center gap-2 rounded border-2 border-dashed px-3 py-4 text-sm font-bold transition-colors ${
        logoStatus === "uploading" ? "border-blue-300 bg-blue-50 text-blue-700" :
        logoStatus === "success" ? "border-emerald-300 bg-emerald-50 text-emerald-700" :
        logoStatus === "error" ? "border-red-300 bg-red-50 text-red-700" :
        "border-slate-300 bg-white text-slate-700 hover:border-emerald-500"
      }`}>
        <Upload size={18} />
        {logoStatus === "uploading" ? "Uploading..." : logoStatus === "success" ? "Logo uploaded ✓" : logoStatus === "error" ? `Error: ${logoError}` : "Upload logo"}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          disabled={logoStatus === "uploading"}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) uploadLogo(file);
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
