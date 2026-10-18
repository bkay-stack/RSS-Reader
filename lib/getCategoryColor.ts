const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "bg-blue-100 text-blue-700",
  Design: "bg-pink-100 text-pink-700",
  "Backend & DevOps": "bg-amber-100 text-amber-700",
  "General Tech": "bg-indigo-100 text-indigo-700",
  "AI & ML": "bg-purple-100 text-purple-700",
};

const DEFAULT_COLOR = "bg-accent-subtle text-accent";

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? DEFAULT_COLOR;
}

export default getCategoryColor;

// Dot colors for categories in the sidebar.
const CATEGORY_DOTS: Record<string, string> = {
  Frontend: "bg-accent",
  Design: "bg-pink-500",
  "Backend & DevOps": "bg-warning",
  "General Tech": "bg-indigo-500",
  "AI & ML": "bg-purple-500",
};

export function getCategoryDot(category: string): string {
  return CATEGORY_DOTS[category] ?? "bg-text-tertiary";
}
