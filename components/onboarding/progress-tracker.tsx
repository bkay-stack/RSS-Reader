type ProgressTrackerProps = {
  currentStep: number;
  totalSteps: number;
};

function getSegmentClass(stepIndex: number, currentStep: number): string {
  const isFilled = stepIndex <= currentStep;
  return isFilled ? "bg-accent border-accent" : "bg-transparent border-border";
}

export default function ProgressTracker({
  currentStep,
  totalSteps,
}: ProgressTrackerProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <section className="flex justify-center items-center px-4 py-10 gap-2 max-w-3xl mx-auto w-full">
      {steps.map((step) => (
        <div
          key={step}
          className={`h-1 flex-1 max-w-full rounded-full border ${getSegmentClass(step, currentStep)}`}
        />
      ))}
    </section>
  );
}
