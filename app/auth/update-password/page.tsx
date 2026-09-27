import Nav from "@/components/shared/nav/page";
import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";
import { requireUser } from "@/lib/supabase/requireUser";

export default async function UpdatePasswordPage() {
  // The reset email link signs the user in; without it, go home.
  await requireUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-10 bg-bg-secondary">
        <UpdatePasswordForm />
      </main>
    </div>
  );
}
