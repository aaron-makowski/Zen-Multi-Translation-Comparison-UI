export interface KarmaBadge {
  /** Minimum karma required for this badge */
  min: number
  label: string
  color: string
}

// Ordered by minimum karma requirement ascending
export const karmaBadges: KarmaBadge[] = [
  { min: 0, label: "Novice", color: "text-gray-500" },
  { min: 100, label: "Contributor", color: "text-green-600" },
  { min: 500, label: "Adept", color: "text-blue-600" },
  { min: 1000, label: "Sage", color: "text-purple-600" },
]

/**
 * Return the badge information for the given karma value.
 */
export function getKarmaBadge(karma: number): { label: string; color: string } {
  const badge = [...karmaBadges].reverse().find((b) => karma >= b.min) ?? karmaBadges[0]
  return { label: badge.label, color: badge.color }
}
