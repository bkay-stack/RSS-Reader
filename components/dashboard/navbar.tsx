import Logo from "@/components/branding/logo";
import Link from "next/link";
import { Search, Plus } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Feed" },
  { href: "/dashboard/digest", label: "Digest" },
  { href: "/dashboard/discover", label: "Discover" },
];

export default function DashboardNavbar() {
  return (
    <nav className="flex items-center justify-between w-full px-4 sm:px-6 h-14 border-b border-border bg-surface sticky top-0 z-50">
      <div className="flex items-center gap-8">
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

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 rounded border border-border px-3 py-1.5 text-sm text-text-tertiary">
          <Search size={16} />
          <span>Search articles...</span>
        </div>

        <button
          type="button"
          className="flex items-center justify-center h-9 w-9 rounded-full bg-accent text-white hover:bg-accent-hover transition-colors">
          <Plus size={18} />
        </button>

        <div className="h-9 w-9 rounded-full bg-accent-subtle text-accent flex items-center justify-center text-sm font-medium">
          MS
        </div>
      </div>
    </nav>
  );
}
