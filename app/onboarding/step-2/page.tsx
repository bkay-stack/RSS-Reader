import ProgressTracker from "@/components/onboarding/progress-tracker";
import Link from "next/link";

export default function OnboardingStep2Page() {
  return (
    <>
      <ProgressTracker currentStep={2} totalSteps={2} />

      <section className="flex flex-1 flex-col px-6 max-w-3xl mx-auto w-full">
        <div className="flex flex-col items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Your feed is ready!</h1>
          <p className="text-text-secondary mt-2">
            You can now start reading your personalized feed.
          </p>
        </div>
        {/* feed list UI goes here */}

        {/* Get started button */}
        <Link
          href="/dashboard"
          className="mt-auto mb-6 flex h-11 items-center justify-center rounded bg-accent px-4 text-white lg:mt-8 lg:mb-0 lg:self-start">
          Get Started
        </Link>
      </section>
    </>
  );
}
