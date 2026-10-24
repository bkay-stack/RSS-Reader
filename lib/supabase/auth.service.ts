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

    // A guest must LINK Google to their existing user (same ID, data stays).
    // Normal sign-in would create a different user and orphan their feeds.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const isGuest = user?.is_anonymous === true;

    const options = {
      redirectTo: isGuest
        ? `${window.location.origin}/auth/callback?next=${encodeURIComponent("/dashboard")}`
        : `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    };

    const { error } = isGuest
      ? await supabase.auth.linkIdentity({ provider: "google", options })
      : await supabase.auth.signInWithOAuth({ provider: "google", options });

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

//  Guest (anonymous user, no email or password)
export const signInAsGuest = async (): Promise<AuthResult<null>> => {
  try {
    const supabase = createClient();

    // Already signed in (guest or real)? Keep that session.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) return { data: null, error: null };

    const { error } = await supabase.auth.signInAnonymously();
    if (error) return { data: null, error: error.message };

    return { data: null, error: null };
  } catch {
    return { data: null, error: "Something went wrong. Please try again." };
  }
};

//  Guest → real account from the sign-up form. Same user, so data stays.
export const upgradeGuestToAccount = async (
  input: TSignUpSchema,
): Promise<AuthResult<{ message: string }>> => {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser(
      {
        email: input.email,
        password: input.password,
        data: { full_name: input.name },
      },
      {
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent("/onboarding")}`,
      },
    );
    if (error) return { data: null, error: error.message };

    return {
      data: { message: "Check your email to confirm your account." },
      error: null,
    };
  } catch {
    return { data: null, error: "Something went wrong. Please try again." };
  }
};

//  Sign-up form entry point: guests upgrade, everyone else signs up.
export const registerAccount = async (
  input: TSignUpSchema,
): Promise<AuthResult<{ message: string }>> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.is_anonymous
    ? upgradeGuestToAccount(input)
    : signUpWithEmail(input);
};
