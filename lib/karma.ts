export function getKarmaBadge(karma: number): string {
  if (karma >= 1000) return "sage"
  if (karma >= 500) return "adept"
  if (karma >= 100) return "apprentice"
  return "novice"
}

export function formatKarmaBadge(karma: number): string {
  const badge = getKarmaBadge(karma)
  return badge.charAt(0).toUpperCase() + badge.slice(1)
}
