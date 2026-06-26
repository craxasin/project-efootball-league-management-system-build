import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth-forms";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/dashboard");

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10" style={{
      backgroundImage: "url(https://cdn.builder.io/api/v1/image/assets%2Fd98d6f8e521a4d5f9b9ddb0a6527cb9b%2Fcd55275cc90447eebfc63fa9d3fcf6ae)",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover"
    }}>
      <section className="w-full max-w-md rounded border border-slate-200 p-6 shadow-panel" style={{ backgroundColor: "rgba(255, 255, 255, 0.43)" }}>
        <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Six-player private league</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Create your club</h1>
        <p className="mb-6 mt-2 text-slate-600">The first registered user becomes admin automatically.</p>
        <RegisterForm />
      </section>
    </main>
  );
}
