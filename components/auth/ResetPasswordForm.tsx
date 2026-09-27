"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import {
  resetPasswordSchema,
  type TResetPasswordSchema,
} from "@/lib/validation/auth.schema";
import { requestPasswordReset } from "@/lib/supabase/auth.service";

export default function ResetPasswordForm() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async ({ email }: TResetPasswordSchema) => {
    setAuthError(null);
    setSuccessMessage(null);

    const { data, error } = await requestPasswordReset(email);

    if (error) {
      setAuthError(error);
      return;
    }

    setSuccessMessage(data?.message ?? null);
    reset();
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      {/* Lock icon */}
      <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full mb-4 bg-accent">
        <Lock size={28} className="text-white" />
      </div>

      {/* Headline */}
      <h1 className="text-xl sm:text-2xl font-semibold text-center mb-2 text-text-primary">
        Reset your password
      </h1>

      {/* Subtext */}
      <p className="text-sm text-center mb-8 text-text-secondary">
        Enter your email and we will send you a link to reset your password.
      </p>

      {/* Auth error */}
      {authError && (
        <div
          role="alert"
          className="w-full mb-4 p-3 rounded-md bg-error/10 border border-error">
          <p className="text-xs text-error">{authError}</p>
        </div>
      )}

      {/* Success message */}
      {successMessage && (
        <div
          role="status"
          className="w-full mb-4 p-3 rounded-md bg-success/10 border border-success">
          <p className="text-xs text-success">{successMessage}</p>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-sm font-medium text-text-primary">
            Email address
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-md text-sm bg-bg-primary border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          />
          {errors.email && (
            <p className="text-xs text-error mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-md text-sm font-semibold text-white bg-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition">
          {isSubmitting ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <Link
        href="/auth/sign-in"
        className="mt-6 text-sm text-accent font-semibold hover:text-accent-hover transition-colors">
        Back to sign in
      </Link>
    </div>
  );
}
