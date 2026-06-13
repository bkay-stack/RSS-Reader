import { FiRss } from "react-icons/fi";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      {/* RSS icon */}
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
        <FiRss size={14} className="text-white" />
      </div>

      {/* Application name */}
      <span className="text-base font-semibold text-text-primary">
        Frontpage
      </span>
    </div>
  );
}
// export default Logo;
