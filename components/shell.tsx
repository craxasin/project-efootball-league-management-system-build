import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Trophy } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/league-table", label: "League Table" },
  { href: "/fixtures", label: "Fixtures" },
  { href: "/feed", label: "Match Feed" }
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const navItems = [
    ...nav,
    ...(session.user.role === "ADMIN" ? [{ href: "/admin/users", label: "User Control" }] : [])
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/60 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded bg-emerald-700 text-white shadow-panel">
              <Trophy size={22} />
            </span>
            <span>
              <span className="block text-sm font-black uppercase tracking-wide text-emerald-700">Saimoo League</span>
              <span className="block text-lg font-black text-slate-950">eFootball Manager</span>
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                {item.label}
              </Link>
            ))}
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
