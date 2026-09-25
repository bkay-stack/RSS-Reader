import Nav from "@/components/shared/nav/page";
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <div>
      <Nav />
      <main className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center px-4">
        <SignUpForm />
      </main>
    </div>
  );
}
