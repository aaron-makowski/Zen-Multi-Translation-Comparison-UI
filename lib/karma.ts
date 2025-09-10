export interface KarmaBadge {
  /** Minimum karma required for this badge */
  min: number
  /** Display label for the badge */
  label: string
  /** Tailwind text color class */
  color: string
}

/**
 * Metadata describing available karma badges and their thresholds.
 * Badges are ordered from highest to lowest requirement.
 */
export const karmaBadges: KarmaBadge[] = [
  { min: 1000, label: "Sage", color: "text-purple-600" },
  { min: 500, label: "Adept", color: "text-blue-600" },
  { min: 100, label: "Contributor", color: "text-green-600" },
  { min: 0, label: "Novice", color: "text-gray-500" },
]

/**
 * Return the badge that corresponds to a user's karma value.
 */
export function getKarmaBadge(karma: number): Omit<KarmaBadge, 'min'> {
  const { label, color } =
    karmaBadges.find((badge) => karma >= badge.min) ?? karmaBadges[karmaBadges.length - 1]
  return { label, color }
}

