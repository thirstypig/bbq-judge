import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import { CompetitionProvider } from "@features/competition";
import { DashboardShell } from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string;
    cbjNumber: string;
  };

  return (
    <CompetitionProvider>
      <DashboardShell user={user}>{children}</DashboardShell>
    </CompetitionProvider>
  );
}
