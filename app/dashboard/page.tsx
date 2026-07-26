// import DashboardNavbar from "@/components/dashboard/navbar";

export default function DashboardPage() {
  return (
    <main className="bg-bg-primary text-text-primary flex flex-col min-h-screen w-full font-sans ">
      {/* <DashboardNavbar /> */}
      <section className="flex flex-1 flex-col px-6 max-w-3xl mx-auto w-full">
        <div className="flex flex-col items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Welcome to your feed!</h1>
          <p className="text-text-secondary mt-2">
            This is where you`ll find the latest articles from your favorite
            sources.
          </p>
        </div>
        {/* feed list UI goes here */}
      </section>
    </main>
  );
}
