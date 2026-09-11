import { z } from "zod";

//  Sign Up
export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  // Keep in sync with the Supabase password settings.
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});

//  Sign In
export const signinSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// ── Reset Password
export const resetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

//  Types
export type TSignUpSchema = z.infer<typeof signupSchema>;
export type TSignInSchema = z.infer<typeof signinSchema>;
export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
