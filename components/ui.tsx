import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "green" | "blue" | "neutral" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-1 text-xs font-semibold",
        tone === "green" && "bg-emerald-100 text-emerald-800",
        tone === "blue" && "bg-sky-100 text-sky-800",
        tone === "neutral" && "bg-slate-100 text-slate-700"
      )}
    >
      {children}
    </span>
  );
}

export function TeamLogo({ src, name, size = "md" }: { src?: string | null; name: string; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-16 w-16" : "h-11 w-11";
  const initial = name.trim().slice(0, 1).toUpperCase() || "T";

  if (src) {
    return <img src={src} alt={`${name} logo`} className={cn(sizeClass, "rounded object-cover ring-1 ring-slate-200")} />;
  }

  return (
    <div className={cn(sizeClass, "grid place-items-center rounded bg-emerald-700 text-sm font-black text-white ring-1 ring-emerald-900/10")}>
      {initial}
    </div>
  );
}
