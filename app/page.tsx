import Logo from "@/components/branding/logo";
import Link from "next/link";
import { FiRss } from "react-icons/fi";
import Footer from "@/components/layout/footer/page";

export default function LandingPage() {
  return (
    <main className="bg-bg-primary text-text-primary flex flex-col min-h-screen w-full font-sans">
      {/* Navbar */}
      <nav className="flex items-center justify-between w-full px-6 h-14 border-b border-border bg-surface sticky top-0 z-50">
        <Logo />
        <div className="flex items-center gap-3">
          <Link
            href="/auth/signin"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-10 gap-6 max-w-3xl mx-auto w-full">
        {/* Badge */}
        <div className="flex items-center gap-2 bg-accent-subtle text-accent text-sm px-4 py-2 rounded-full border border-accent">
          <FiRss size={14} />
          <span>Your personal front page for tech content</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight max-w-2xl tracking-tight">
          One place for everything you want to read
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-text-secondary max-w-lg leading-relaxed">
          Frontpage pulls your favourite blogs, newsletters and feeds into one
          calm reading dashboard. No algorithm. No ads. Just your content.
        </p>

        {/* CTAs */}
        <div className="flex flex-col md:flex-row gap-3 w-full max-w-sm md:max-w-none md:w-auto">
          <Link
            href="/auth/signup"
            className="bg-accent hover:bg-accent-hover text-white text-sm font-semibold py-3 px-8 rounded-md transition-colors text-center">
            Get Started Free →
          </Link>
          <Link
            href="/dashboard"
            className="bg-bg-primary hover:bg-bg-secondary text-text-primary text-sm font-medium py-3 px-8 rounded-md border border-border transition-colors text-center">
            Try as Guest
          </Link>
        </div>

        {/* Social proof */}
        <p className="text-sm text-text-tertiary">
          Trusted by 12,000+ developers and designers
        </p>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-24 max-w-4xl mx-auto w-full"></section>
      <Footer />
    </main>
  );
}
