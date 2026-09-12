"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiMail, FiLock, FiEye, FiEyeOff, FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { TSignInSchema, signinSchema } from "@/lib/validation/auth.schema";
import {
  signInWithEmail,
  signInWithGoogle,
  signInWithGithub,
} from "@/lib/supabase/auth.service";

// Never say which half was wrong — that would reveal which emails have accounts.
function friendlyError(message: string): string {
  return message.toLowerCase().includes("invalid login credentials")
    ? "Invalid email or password."
    : message;
}

export default function SignInForm({ linkError }: { linkError: string | null }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(linkError);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TSignInSchema>({ resolver: zodResolver(signinSchema) });

  const onSubmit = async (data: TSignInSchema) => {
    setAuthError(null);

    const { error } = await signInWithEmail(data);
    if (error) {
      setAuthError(friendlyError(error));
      return;
    }

    router.push("/dashboard");
    router.refresh(); // let the server pick up the new session cookie
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setAuthError(null);
    setOauthLoading(provider);

    const { error } =
      provider === "google"
        ? await signInWithGoogle("/dashboard")
        : await signInWithGithub("/dashboard");

    if (error) {
      setAuthError(error);
      setOauthLoading(null);
    }
    // On success the browser leaves for the provider, then /auth/callback.
  };

  const busy = isSubmitting || oauthLoading !== null;

  return (
    <>
      {/* Auth error */}
      {authError && (
        <div className="mb-4 p-3 rounded-md bg-error/10 border border-error">
          <p className="text-xs text-error">{authError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 ">
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
            Email address
          </label>
          <div className="relative">
            <FiMail
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
            <input
              {...register("email")}
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-md bg-bg-primary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-error mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
              Password
            </label>
            <Link
              href="/auth/reset-password"
              className="text-xs text-accent hover:text-accent-hover transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <FiLock
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Your password"
              className="w-full pl-9 pr-10 py-2.5 text-sm border border-border rounded-md bg-bg-primary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary">
              {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-error mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-md transition-colors mt-2">
          {isSubmitting ? "Signing in..." : "Sign in"}
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
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          disabled={busy}
          className="flex-1 flex items-center justify-center gap-2 border border-border rounded-md py-2.5 text-sm text-text-primary hover:bg-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {oauthLoading === "google" ? "Opening..." : "Google"}
          <FcGoogle size={15} />
        </button>
        <button
          type="button"
          onClick={() => handleOAuth("github")}
          disabled={busy}
          className="flex-1 flex items-center justify-center gap-2 border border-border rounded-md py-2.5 text-sm text-text-primary hover:bg-bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {oauthLoading === "github" ? "Opening..." : "GitHub"}
          <FiGithub size={15} />
        </button>
      </div>
    </>
  );
}
