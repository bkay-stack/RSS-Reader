import Nav from "@/components/layout/nav/page";
import { Lock } from "lucide-react";

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-10 bg-bg-secondary">
        {/* Lock icon */}
        <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full mb-4 bg-accent">
          <Lock size={28} className="text-white" />
        </div>

        {/* Headline */}
        <h1 className="text-xl sm:text-2xl font-semibold text-center mb-2 text-text-primary">
          Reset your password
        </h1>

        {/* Subtext */}
        <p className="text-sm text-center max-w-md mb-8 text-text-secondary">
          Enter your email and we will send you a link to reset your password.
        </p>

        {/* Form */}
        <form className="w-full max-w-md flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-text-primary">
              Email address
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              className="
                w-full
                px-4
                py-3
                rounded-md
                text-sm
                bg-bg-primary
                border
                border-border
                text-text-primary
                focus:outline-none
                focus:ring-2
                focus:ring-accent
              "
            />
          </div>

          <button
            type="submit"
            className="
              w-full
              py-3
              rounded-md
              text-sm
              font-semibold
              text-white
              bg-accent
              hover:opacity-90
              transition
            ">
            Send reset link
          </button>
        </form>
      </main>
    </div>
  );
}
