import { createClient } from "@/lib/supabase/client";
import type {
  TSignUpSchema,
  TSignInSchema,
} from "@/lib/validation/auth.schema";

//  Types
type AuthResult<T> = {
  data: T | null;
  error: string | null;
};

// Where the OAuth provider sends the user back. `next` is the page to land on
// (the callback route only allows paths on this site).
const callbackUrl = (next?: string) =>
  `${window.location.origin}/auth/callback${
    next ? `?next=${encodeURIComponent(next)}` : ""
  }`;

//  Sign Up
export const signUpWithEmail = async (
  input: TSignUpSchema,
): Promise<AuthResult<{ message: string }>> => {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.name,
        },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    if (error) return { data: null, error: error.message };

    // User exists but is unconfirmed — Supabase returns a fake
    // success. Detect it by checking if identities array is empty.
    if (data.user && data.user.identities?.length === 0) {
      return {
        data: null,
        error: "An account with this email already exists.",
      };
    }

    return {
      data: { message: "Check your email to confirm your account." },
      error: null,
    };
  } catch {
    return { data: null, error: "Something went wrong. Please try again." };
  }
};

//  Sign In
export const signInWithEmail = async (
  input: TSignInSchema,
): Promise<AuthResult<{ message: string }>> => {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    // Generic on purpose — don't reveal which emails have accounts.
    if (error) {
      const message =
        error.code === "email_not_confirmed"
          ? "Please confirm your email first — check your inbox."
          : "Invalid email or password.";
      return { data: null, error: message };
    }

    return { data: { message: "Signed in successfully." }, error: null };
  } catch {
    return { data: null, error: "Something went wrong. Please try again." };
  }
};

//  Google OAuth
export const signInWithGoogle = async (
  next?: string,
): Promise<AuthResult<null>> => {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl(next),
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) return { data: null, error: error.message };

    return { data: null, error: null };
  } catch {
    return { data: null, error: "Something went wrong. Please try again." };
  }
};

//  GitHub OAuth
export const signInWithGithub = async (
  next?: string,
): Promise<AuthResult<null>> => {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: callbackUrl(next),
      },
    });

    if (error) return { data: null, error: error.message };

    return { data: null, error: null };
  } catch {
    return { data: null, error: "Something went wrong. Please try again." };
  }
};

//  Sign Out
export const signOut = async (): Promise<AuthResult<null>> => {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) return { data: null, error: error.message };

    return { data: null, error: null };
  } catch {
    return { data: null, error: "Something went wrong. Please try again." };
  }
};
