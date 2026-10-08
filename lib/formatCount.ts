// Caps big counts for the sidebar: 4363 → "99+".
export function formatCount(count: number): string {
  return count > 99 ? "99+" : String(count);
}
