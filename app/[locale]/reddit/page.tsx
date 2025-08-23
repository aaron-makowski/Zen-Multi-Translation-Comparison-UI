import { RedditFeed } from "@/components/reddit-feed"

export default function Page() {
  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Zen Subreddit Feed</h1>
      <RedditFeed />
    </main>
  )
}
