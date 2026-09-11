import Logo from "@/components/branding/logo";
import Link from "next/link";
import { requireUser } from "@/lib/supabase/requireUser";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Real auth gate — the proxy alone can be skipped (see requireUser).
  await requireUser();

  return (
    <main className="bg-bg-primary text-text-primary flex flex-col min-h-screen w-full font-sans">
      <nav className="flex items-center justify-between w-full px-4 sm:px-6 h-14 border-b border-border bg-surface sticky top-0 z-50">
        <Logo />
        <Link
          href="/dashboard"
          className="flex items-center min-h-11 px-2 text-sm text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent">
          Skip
        </Link>
      </nav>

      {children}
    </main>
  );
}
