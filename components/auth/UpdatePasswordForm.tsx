"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {
  updatePasswordSchema,
  type TUpdatePasswordSchema,
} from "@/lib/validation/auth.schema";
import { updatePassword } from "@/lib/supabase/auth.service";

const inputClass =
  "w-full px-4 py-3 rounded-md text-sm bg-bg-primary border border-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent";

export default function UpdatePasswordForm() {
  const router = useRouter();
  const [isRedirecting, startRedirect] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TUpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = async ({ password }: TUpdatePasswordSchema) => {
    setAuthError(null);

    const { error } = await updatePassword(password);

    if (error) {
      setAuthError(error);
      return;
    }

    startRedirect(() => {
      router.replace("/dashboard");
      router.refresh();
    });
  };

  const isBusy = isSubmitting || isRedirecting;

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      {/* Lock icon */}
      <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full mb-4 bg-accent">
        <Lock size={28} className="text-white" />
      </div>

      {/* Headline */}
      <h1 className="text-xl sm:text-2xl font-semibold text-center mb-2 text-text-primary">
        Set a new password
      </h1>

      {/* Subtext */}
      <p className="text-sm text-center mb-8 text-text-secondary">
        Choose a new password for your account.
      </p>

      {/* Auth error */}
      {authError && (
        <div
          role="alert"
          className="w-full mb-4 p-3 rounded-md bg-error/10 border border-error">
          <p className="text-xs text-error">{authError}</p>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4">
        {/* New password */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-sm font-medium text-text-primary">
            New password
          </label>
          <div className="relative">
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors">
              {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-error mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-text-primary">
            Confirm new password
          </label>
          <input
            {...register("confirmPassword")}
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Type it again"
            className={inputClass}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-error mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isBusy}
          className="w-full py-3 rounded-md text-sm font-semibold text-white bg-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition">
          {isBusy ? "Saving..." : "Save new password"}
        </button>
      </form>
    </div>
  );
}
