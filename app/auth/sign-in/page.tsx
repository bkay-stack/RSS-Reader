import Link from "next/link";
import Nav from "@/components/shared/nav/page";
import SignInForm from "./SignInForm";

// The auth routes send people here with ?error=... when a link fails.
const LINK_ERRORS: Record<string, string> = {
  callback_failed: "That sign-in didn't work. Please try again.",
  confirmation_failed: "That confirmation link didn't work. Please sign in.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const linkError = error
    ? (LINK_ERRORS[error] ?? "Something went wrong. Please try again.")
    : null;

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

          <SignInForm linkError={linkError} />

          {/* Footer */}
          <p className="text-sm text-text-secondary text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="text-accent font-semibold hover:text-accent-hover transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
