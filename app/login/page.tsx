import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth-forms";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/dashboard");

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10" style={{
      backgroundImage: "url(https://cdn.builder.io/api/v1/image/assets%2Fd98d6f8e521a4d5f9b9ddb0a6527cb9b%2Ff53af0ffdd9f4573b7a800d60f7ee448)",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover"
    }}>
      <section className="w-full max-w-md rounded border border-slate-200 bg-white p-6 shadow-panel">
        <p className="text-sm font-black uppercase tracking-wide text-emerald-700">eFootball League</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Welcome back</h1>
        <p className="mb-6 mt-2 text-slate-600">Sign in to submit results and track the table.</p>
        <LoginForm />
      </section>
    </main>
  );
}
