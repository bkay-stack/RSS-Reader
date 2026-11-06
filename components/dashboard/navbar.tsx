import Logo from "@/components/branding/logo";
import MobileSidebarDrawer from "./MobileSidebarDrawer";
import Link from "next/link";
import { Suspense } from "react";
import type { SidebarData } from "./getSidebarData";
import SearchInput from "./SearchInput";
import AcountMenu from "./account/AccountMenu";
const navLinks = [
  { href: "/dashboard", label: "Feed" },
  { href: "/dashboard/digest", label: "Digest" },
  { href: "/dashboard/discover", label: "Discover" },
];

export default function DashboardNavbar({ sidebar }: { sidebar: SidebarData }) {
  return (
    <nav className="flex items-center justify-between w-full px-4 sm:px-6 h-14 border-b border-border bg-surface sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <MobileSidebarDrawer data={sidebar} />
        <Logo />

        <ul className="hidden sm:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center gap-5">
        {/* Search bar */}
        <Suspense
          fallback={
            <div className="hidden md:block h-8 w-56 rounded border border-border" />
          }>
          <SearchInput className="hidden md:flex" />
        </Suspense>

        {/* Profile */}
        <AcountMenu />
      </div>
    </nav>
  );
}
