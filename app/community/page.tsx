import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Heart, User } from "lucide-react"

export default async function CommunityPage() {
  const user = await getCurrentUser()

  // Get recent comments
  const recentComments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      book: {
        select: {
          id: true,
          title: true,
        },
      },
      verse: {
        select: {
          id: true,
          number: true,
          chapter: {
            select: {
              id: true,
              number: true,
            },
          },
        },
      },
    },
  })

  // Get recent favorites
  const recentFavorites = await prisma.favorite.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      book: {
        select: {
          id: true,
          title: true,
          author: true,
        },
      },
    },
  })

  // Get active users
  const activeUsers = await prisma.user.findMany({
    orderBy: [
      {
        comments: {
          _count: "desc",
        },
      },
      {
        favorites: {
          _count: "desc",
        },
      },
    ],
    take: 10,
    select: {
      id: true,
      name: true,
      image: true,
      _count: {
        select: {
          comments: true,
          favorites: true,
          notes: true,
        },
      },
    },
  })

  // Get popular books
  const popularBooks = await prisma.book.findMany({
    orderBy: [
      {
        favorites: {
          _count: "desc",
        },
      },
      {
        comments: {
          _count: "desc",
        },
      },
    ],
    take: 10,
    include: {
      _count: {
        select: {
          favorites: true,
          comments: true,
        },
      },
    },
  })

  function getInitials(name: string | null) {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Community</h1>
        <p className="text-muted-foreground">See what's happening in the Zen Texts community</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="activity" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="popular">Popular Books</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="mt-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-3 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" /> Recent Comments
                </h2>
                <div className="space-y-4">
                  {recentComments.map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarImage src={comment.user.image || undefined} alt={comment.user.name || "User"} />
                            <AvatarFallback>{getInitials(comment.user.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{comment.user.name || "Anonymous"}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm mb-2">{comment.text}</p>
                            <div className="text-xs text-muted-foreground">
                              <Link
                                href={
                                  comment.verse
                                    ? `/books/${comment.book?.id}/verses/${comment.verse.id}`
                                    : `/books/${comment.book?.id}`
                                }
                                className="hover:underline"
                              >
                                {comment.book?.title}
                                {comment.verse &&
                                  ` - Chapter ${comment.verse.chapter.number}, Verse ${comment.verse.number}`}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {recentComments.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-3 flex items-center">
                  <Heart className="h-5 w-5 mr-2" /> Recent Favorites
                </h2>
                <div className="space-y-4">
                  {recentFavorites.map((favorite) => (
                    <Card key={favorite.id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarImage src={favorite.user.image || undefined} alt={favorite.user.name || "User"} />
                            <AvatarFallback>{getInitials(favorite.user.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{favorite.user.name || "Anonymous"}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(favorite.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm">
                              favorited{" "}
                              <Link href={`/books/${favorite.book?.id}`} className="font-medium hover:underline">
                                {favorite.book?.title}
                              </Link>
                              {favorite.book?.author && ` by ${favorite.book.author}`}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {recentFavorites.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No favorites yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="popular" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularBooks.map((book) => (
                  <Card key={book.id}>
                    <CardHeader>
                      <CardTitle>
                        <Link href={`/books/${book.id}`} className="hover:underline">
                          {book.title}
                        </Link>
                      </CardTitle>
                      <CardDescription>{book.author}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{book._count.favorites} favorites</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{book._count.comments} comments</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" /> Active Members
              </CardTitle>
              <CardDescription>Members contributing to the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{user.name || "Anonymous"}</div>
                      <div className="text-xs text-muted-foreground flex gap-2">
                        <span>{user._count.comments} comments</span>
                        <span>•</span>
                        <span>{user._count.favorites} favorites</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Welcome to the Zen Texts community! Please follow these guidelines:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Be respectful and kind to other members</li>
                <li>Share your insights and interpretations</li>
                <li>Cite sources when referencing external material</li>
                <li>Ask questions and engage in thoughtful discussion</li>
                <li>Report inappropriate content to moderators</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
