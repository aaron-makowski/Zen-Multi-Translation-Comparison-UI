import RedditFeed from "@/components/reddit-feed"

export default function RedditPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6">r/Zen Posts</h1>
        <RedditFeed />
      </div>
    </main>
  )
}
