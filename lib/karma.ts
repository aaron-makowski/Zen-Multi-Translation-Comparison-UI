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
}
