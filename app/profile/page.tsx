import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  commentBadges,
  highlightBadges,
  getBadges,
  progressToNextBadge,
  calculateStreak,
} from "@/lib/gamification"

export default function ProfilePage() {
  // Placeholder user data
  const user = {
    username: "Guest",
    commentKarma: 7,
    highlightKarma: 12,
    activity: [
      new Date(),
      new Date(Date.now() - 86400000),
      new Date(Date.now() - 2 * 86400000),
    ],
  }

  const badges = getBadges(user)
  const commentProgress = progressToNextBadge(user.commentKarma, commentBadges)
  const highlightProgress = progressToNextBadge(
    user.highlightKarma,
    highlightBadges,
  )
  const streak = calculateStreak(user.activity)

  return (
    <main className="flex flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold">{user.username}'s Profile</h1>

      <section>
        <h2 className="font-semibold mb-2">Comment Karma</h2>
        <Progress value={commentProgress} className="w-full" />
        <p className="text-sm mt-1">{user.commentKarma} points</p>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Highlight Karma</h2>
        <Progress value={highlightProgress} className="w-full" />
        <p className="text-sm mt-1">{user.highlightKarma} points</p>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Badges</h2>
        <div className="flex flex-wrap gap-2">
          {badges.comments.map((b) => (
            <Badge key={`c-${b}`}>{b}</Badge>
          ))}
          {badges.highlights.map((b) => (
            <Badge key={`h-${b}`}>{b}</Badge>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Current Streak</h2>
        <p>{streak} days</p>
      </section>
    </main>
  )
}
