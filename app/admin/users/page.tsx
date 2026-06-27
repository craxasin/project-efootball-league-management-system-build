import { AppShell } from "@/components/shell";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserControlContent } from "./users-content";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <AppShell>
      <UserControlContent users={users} />
    </AppShell>
  );
}
