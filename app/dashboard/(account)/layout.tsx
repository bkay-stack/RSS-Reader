import type { ReactNode } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 pb-10 sm:p-6">
      {children}

      <footer className="flex flex-col items-center gap-2 py-3 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-text-tertiary">
          <span>Frontpage RSS Reader</span>
          <span>·</span>
          <Link href="/privacy" className="hover:text-accent">
            Privacy
          </Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-accent">
            Terms
          </Link>
        </div>
        <div className="flex items-center gap-1 text-xs text-text-tertiary">
          <Zap className="h-3 w-3" />
          Engineered for speed & readability
        </div>
      </footer>
    </div>
  );
}
