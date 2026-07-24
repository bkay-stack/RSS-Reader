import ProgressTracker from "@/components/onboarding/progress-tracker";
import Link from "next/link";
import {
  Code2,
  Palette,
  Cloud,
  ShieldCheck,
  Smartphone,
  Briefcase,
  Sparkles,
  Server,
} from "lucide-react";

const topics = [
  { id: "frontend", label: "Frontend", icon: Code2 },
  { id: "backend", label: "Backend", icon: Server },
  { id: "design", label: "Design", icon: Palette },
  { id: "ai-ml", label: "AI & ML", icon: Sparkles },
  { id: "devops", label: "Cloud & DevOps", icon: Cloud },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "mobile", label: "Mobile", icon: Smartphone },
  { id: "career", label: "Career", icon: Briefcase },
];

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

          {/* Topic selection */}
          <div className="flex flex-wrap gap-2">
            {topics.map(({ id, label, icon: Icon }) => (
              <div key={id}>
                <input
                  type="checkbox"
                  id={id}
                  name="topic"
                  value={id}
                  className="peer sr-only"
                />
                <label
                  htmlFor={id}
                  className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm cursor-pointer transition-colors peer-checked:bg-accent-subtle peer-checked:border-accent peer-checked:text-accent">
                  <Icon size={16} />
                  {label}
                </label>
              </div>
            ))}
          </div>

          <Link
            href="/onboarding/step-2"
            className="mt-auto mb-6 flex h-11 items-center justify-center rounded bg-accent px-4 text-white lg:mt-8 lg:mb-0 lg:self-start">
            Continue
          </Link>
        </div>
      </section>
    </>
  );
}
