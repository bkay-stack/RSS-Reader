import ProgressTracker from "@/components/onboarding/progress-tracker";
import CategoryPicker from "@/components/onboarding/CategoryPicker";

export default function OnboardingStep1Page() {
  return (
    <>
      <ProgressTracker currentStep={1} totalSteps={2} />

      <section className="flex flex-1 flex-col px-6 max-w-3xl mx-auto w-full">
        <div className="flex flex-1 flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">What do you want to read?</h1>
            <p className="mt-2 text-text-secondary">
              Pick a few topics that you are interested in and you can always
              change these later.
            </p>
          </div>

          <CategoryPicker />
        </div>
      </section>
    </>
  );
}
