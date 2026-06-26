import { Database, KeyRound, UploadCloud } from "lucide-react";

export function SetupRequired({ missing }: { missing: string[] }) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-2xl rounded border border-slate-200 bg-white p-6 shadow-panel">
        <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Environment setup needed</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Connect the league database first</h1>
        <p className="mt-3 text-slate-600">
          The app is running, but server-side features need environment variables in a local <code className="rounded bg-slate-100 px-1 py-0.5">.env</code> file.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Info icon={<Database size={20} />} title="PostgreSQL" text="Required for Prisma models, auth users, teams, fixtures, and results." />
          <Info icon={<KeyRound size={20} />} title="NextAuth" text="Required for secure login sessions." />
          <Info icon={<UploadCloud size={20} />} title="Supabase" text="Required for team logos and match screenshots." />
        </div>

        <div className="mt-5 rounded bg-slate-950 p-4 text-sm text-white">
          <p className="font-black">Missing values</p>
          <pre className="mt-2 overflow-x-auto text-slate-200">{missing.map((name) => `${name}=...`).join("\n")}</pre>
        </div>

        <p className="mt-5 text-sm font-semibold text-slate-600">
          Copy <code className="rounded bg-slate-100 px-1 py-0.5">.env.example</code> to <code className="rounded bg-slate-100 px-1 py-0.5">.env</code>, fill the values, then run Prisma migrations and refresh this page.
        </p>
      </section>
    </main>
  );
}

function Info({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded border border-slate-200 p-4">
      <div className="mb-3 grid h-9 w-9 place-items-center rounded bg-emerald-100 text-emerald-800">{icon}</div>
      <h2 className="font-black text-slate-950">{title}</h2>
      <p className="mt-1 text-sm font-semibold text-slate-500">{text}</p>
    </div>
  );
}
