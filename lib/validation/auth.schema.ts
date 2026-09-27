import { z } from "zod";

// Same rules for sign-up and new passwords
const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");

//  Sign Up
export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: passwordRules,
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

//  New Password (from the reset email)
export const updatePasswordSchema = z
  .object({
    password: passwordRules,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

//  Types
export type TSignUpSchema = z.infer<typeof signupSchema>;
export type TSignInSchema = z.infer<typeof signinSchema>;
export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type TUpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
