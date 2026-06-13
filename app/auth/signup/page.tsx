import React from "react";
import Logo from "@/components/branding/logo";
import Link from "next/link";

const SignUp = () => {
  return (
    <nav className="flex items-center justify-between w-full px-6 h-14 border-b border-border bg-surface sticky top-0 z-50">
      <Logo />
      <div className="flex items-center gap-3">
        <Link
          href="/auth/signin"
          className="text-sm text-text-secondary hover:text-text-primary transition-colors">
          Sign in
        </Link>
      </div>
    </nav>
  );
};

export default SignUp;
