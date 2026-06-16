import { FiMail, FiLock, FiEye, FiGithub } from "react-icons/fi";
import Nav from "@/components/layout/nav/page";
import { FcGoogle } from "react-icons/fc";

export default function SignInPage() {
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-bg-secondary flex justify-center items-center px-4 ">
        {/* Card */}
        <div className="w-full max-w-md bg-surface border border-border rounded-xl shadow-md p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-primary">
              Welcome back
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Sign in to your account to continue reading and managing your
              articles.
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4 ">
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                  Password
                </label>
                <a
                  href="/auth/reset-password"
                  className="text-xs text-accent hover:text-accent-hover transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <FiLock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                />
                <input
                  type="password"
                  placeholder="Your password"
                  className="w-full pl-9 pr-10 py-2.5 text-sm border border-border rounded-md bg-bg-primary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary">
                  <FiEye size={15} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-accent hover:bg-accent-hover text-white text-sm font-semibold py-2.5 rounded-md transition-colors mt-2">
              Sign in
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
              Google <FcGoogle size={15} />
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 border border-border rounded-md py-2.5 text-sm text-text-primary hover:bg-bg-secondary transition-colors">
              GitHub <FiGithub size={15} />
            </button>
          </div>

          {/* Footer */}
          <p className="text-sm text-text-secondary text-center mt-6">
            Don&apos;t have an account?{" "}
            <a
              href="/auth/signup"
              className="text-accent font-semibold hover:text-accent-hover transition-colors">
              Sign up free
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
