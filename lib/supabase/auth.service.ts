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

    if (error) return { data: null, error: error.message };

    return { data: { message: "Signed in successfully." }, error: null };
  } catch {
    return { data: null, error: "Something went wrong. Please try again." };
  }
};

//  Google OAuth
export const signInWithGoogle = async (): Promise<AuthResult<null>> => {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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
export const signInWithGithub = async (): Promise<AuthResult<null>> => {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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

//  Password Reset (emails a link to /auth/update-password)
export const requestPasswordReset = async (
  email: string,
): Promise<AuthResult<{ message: string }>> => {
  try {
    const supabase = createClient();
    const next = encodeURIComponent("/auth/update-password");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=${next}`,
    });

    if (error) return { data: null, error: error.message };

    // Same message either way, so no one can check which emails have accounts.
    return {
      data: {
        message: "If that email has an account, a reset link is on its way.",
      },
      error: null,
    };
  } catch {
    return { data: null, error: "Something went wrong. Please try again." };
  }
};

//  Update Password (needs the session from the reset link)
export const updatePassword = async (
  password: string,
): Promise<AuthResult<null>> => {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) return { data: null, error: error.message };

    return { data: null, error: null };
  } catch {
    return { data: null, error: "Something went wrong. Please try again." };
  }
};
