import { FiRss } from "react-icons/fi";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        {/* RSS icon */}
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
          <FiRss size={35} className="text-white" />
        </div>

        {/* Application name */}
        <span className="text-base font-semibold text-text-primary">
          Frontpage
        </span>
      </div>
    </Link>
  );
}
// export default Logo;
