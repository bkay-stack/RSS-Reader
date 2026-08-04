import Feed from "@/components/dashboard/feed/Feed";

export default function DashboardPage() {
  return (
    <main className="bg-bg-primary text-text-primary flex flex-col min-h-screen w-full font-sans ">
      {/* <DashboardNavbar /> */}
      <section className="flex flex-1 flex-col px-6 max-w-3xl mx-auto w-full">
        <div className="flex flex-col items-center gap-4 mb-6"></div>

        {/* feed list UI goes here */}
        <Feed />
      </section>
    </main>
  );
}
