// "use client";

import Logo from "@/components/branding/logo";
import Link from "next/link";
import ProgressTracker from "@/components/onboarding/progress-tracker";
import { FiRss } from "react-icons/fi";
// import Footer from "@/components/layout/footer/page";

export default function OnboardingPage() {
  return (
    <main className="bg-bg-primary text-text-primary flex flex-col min-h-screen w-full font-sans ">
      {/* Navbar */}
      <nav className="flex items-center justify-between w-full px-4 sm:px-6 h-14 border-b border-border bg-surface sticky top-0 z-50">
        <Logo />
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center min-h-11 px-2 text-sm text-text-secondary hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent">
            Skip
          </Link>
        </div>
      </nav>

      {/* Progress tracker */}
      <section className="flex justify-center  gap-6 max-w-3xl mx-auto w-full">
        <ProgressTracker currentStep={1} totalSteps={2} />
      </section>
    </main>
  );
}
