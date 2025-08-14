<<<<<<< HEAD
export interface KarmaBadge {
  label: string
  color: string
}

export function getKarmaBadge(karma: number): KarmaBadge {
  if (karma >= 1000) return { label: "Sage", color: "text-purple-600" }
  if (karma >= 500) return { label: "Adept", color: "text-blue-600" }
  if (karma >= 100) return { label: "Contributor", color: "text-green-600" }
  return { label: "Novice", color: "text-gray-500" }
=======
export interface Badge {
  label: string
  className: string
}

/**
 * Returns a badge label and styling based on karma score.
 * Simple utility for displaying user flairs.
 */
export function getBadge(karma: number): Badge {
  if (karma >= 1000) return { label: "Master", className: "text-yellow-600" }
  if (karma >= 500) return { label: "Expert", className: "text-purple-600" }
  if (karma >= 100) return { label: "Adept", className: "text-blue-600" }
  if (karma >= 10) return { label: "Apprentice", className: "text-green-600" }
  return { label: "Newcomer", className: "text-gray-500" }
>>>>>>> origin/codex/add-page-to-pull-latest-comments-and-highlights
}
