import DashboardNavbar from "@/components/dashboard/navbar";
import { getSidebarData } from "@/components/dashboard/getSidebarData";
import Sidebar from "@/components/dashboard/sidebar";
import { requireUser } from "@/lib/supabase/requireUser";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Real auth gate — the proxy alone can be skipped (see requireUser).
  await requireUser();
  const sidebar = await getSidebarData();

  return (
    <div className="bg-bg-primary text-text-primary flex flex-col h-screen w-full font-sans overflow-hidden">
      <DashboardNavbar sidebar={sidebar} />
      <div className="flex flex-1 min-h-0">
        <Sidebar data={sidebar} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
