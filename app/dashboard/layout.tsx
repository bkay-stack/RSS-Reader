import DashboardNavbar from "@/components/dashboard/navbar";
import Sidebar from "@/components/dashboard/sidebar";
// import MobileSidebarDrawer from "@/components/dashboard/MobileSidebarDrawer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg-primary text-text-primary flex flex-col min-h-screen w-full font-sans">
      <DashboardNavbar />
      <div className="flex flex-1">
        <Sidebar />

        {/* <MobileSidebarDrawer /> */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
