import React from "react";
import Logo from "@/components/branding/logo";
import Link from "next/link";

const Nav = () => {
  return (
    <nav className="flex items-center  w-full px-6 h-14 border-b border-border bg-surface sticky top-0 z-50">
      <Logo />
      <div className="flex items-center gap-3"></div>
    </nav>
  );
};

export default Nav;
