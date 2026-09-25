import Nav from "@/components/shared/nav/page";
import SignInForm from "@/components/auth/SignInForm";

// Messages for the ?error= codes the auth callback routes send back here.
const LINK_ERRORS = new Map([
  [
    "callback_failed",
    "Google or GitHub sign-in didn't finish. Please try again.",
  ],
  [
    "confirmation_failed",
    "That email link didn't work or has expired. Try signing in below.",
  ],
]);

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-bg-secondary flex justify-center items-center px-4">
        <SignInForm linkError={error ? LINK_ERRORS.get(error) : undefined} />
      </div>
    </>
  );
}
