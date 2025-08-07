import { RedditFeed } from "@/components/reddit-feed"

export default function RedditPage() {
  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">r/Zen Posts</h1>
      <RedditFeed />
    </main>
  )
}
