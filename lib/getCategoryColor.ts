const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "bg-blue-100 text-blue-700",
  Design: "bg-pink-100 text-pink-700",
  "Backend & DevOps": "bg-amber-100 text-amber-700",
  "General Tech": "bg-emerald-100 text-emerald-700",
  "AI & ML": "bg-red-100 text-red-700",
};

const DEFAULT_COLOR = "bg-accent-subtle text-accent";

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? DEFAULT_COLOR;
}

export default getCategoryColor;
