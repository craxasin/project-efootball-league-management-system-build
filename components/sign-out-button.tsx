"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="inline-flex items-center gap-2 rounded bg-slate-950 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
      title="Log out"
    >
      <LogOut size={16} />
      Logout
    </button>
  );
}
