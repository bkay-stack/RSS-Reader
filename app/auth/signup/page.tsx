import Link from "next/link";
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { FiGithub } from "react-icons/fi";
import Nav from "@/components/layout/nav/page";

export default function SignUpPage() {
  return (
    <div>
      <Nav />
      <main className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center px-4  ">
        {/* Card */}
        <div className="w-full max-w-md bg-surface border border-border rounded-xl shadow-md p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-primary">
              Create your account
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Start reading in under a minute
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4 ">
            {/* Full name */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Full name
              </label>
              <div className="relative">
                <FiUser
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                />
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-md bg-bg-primary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Email address
              </label>
              <div className="relative">
                <FiMail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-md bg-bg-primary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <FiLock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                />
                <input
                  type="password"
                  placeholder="Minimum 8 characters"
                  className="w-full pl-9 pr-10 py-2.5 text-sm border border-border rounded-md bg-bg-primary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors">
                  <FiEye size={15} />
                </button>
              </div>

              {/* Password strength bar */}
              <div className="flex gap-1 mt-1">
                <div className="flex-1 h-1 rounded-full bg-error" />
                <div className="flex-1 h-1 rounded-full bg-warning" />
                <div className="flex-1 h-1 rounded-full bg-success" />
                <div className="flex-1 h-1 rounded-full bg-accent" />
              </div>
              <p className="text-xs text-text-tertiary text-right">
                Fair strength
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold py-2.5 rounded-md transition-colors mt-2">
              Create account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-tertiary">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social buttons */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 border border-border rounded-md py-2.5 text-sm text-text-primary hover:bg-bg-secondary transition-colors">
              <FcGoogle size={16} />
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-border rounded-md py-2.5 text-sm text-text-primary hover:bg-bg-secondary transition-colors">
              <FiGithub size={16} />
              GitHub
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-text-tertiary text-center mt-4 leading-relaxed">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="text-accent hover:text-accent-hover">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-accent hover:text-accent-hover">
              Privacy Policy
            </Link>
          </p>

          {/* Footer */}
          <p className="text-sm text-text-secondary text-center mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-accent font-semibold hover:text-accent-hover transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
