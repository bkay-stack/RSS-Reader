import Nav from "@/components/shared/nav/page";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 py-10 bg-bg-secondary">
        <ResetPasswordForm />
      </main>
    </div>
  );
}
