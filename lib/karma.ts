export interface KarmaBadge {
  label: string
  color: string
}

export function getKarmaBadge(karma: number): KarmaBadge {
  if (karma >= 1000) return { label: "Sage", color: "text-purple-600" }
  if (karma >= 500) return { label: "Adept", color: "text-blue-600" }
  if (karma >= 100) return { label: "Contributor", color: "text-green-600" }
  return { label: "Novice", color: "text-gray-500" }
}
