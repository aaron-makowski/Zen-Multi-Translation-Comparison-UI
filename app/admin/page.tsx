import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, MessageSquare, Plus, User } from "lucide-react"

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()

  // For demo purposes, we'll consider the first user as admin
  // In a real app, you'd have proper role-based access control
  const isAdmin = user?.id === (await prisma.user.findFirst())?.id

  if (!user || !isAdmin) {
    redirect("/")
  }

  // Get stats
  const userCount = await prisma.user.count()
  const bookCount = await prisma.book.count()
  const commentCount = await prisma.comment.count()
  const verseCount = await prisma.verse.count()

  // Get recent users
  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  // Get recent comments
  const recentComments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      book: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  })

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your Zen Texts platform</p>
        </div>

        <Button asChild>
          <Link href="/admin/books/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Book
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{userCount}</CardTitle>
            <CardDescription>Total Users</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/users" className="text-sm text-primary hover:underline">
              Manage Users
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{bookCount}</CardTitle>
            <CardDescription>Books</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/books" className="text-sm text-primary hover:underline">
              Manage Books
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{verseCount}</CardTitle>
            <CardDescription>Verses</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/verses" className="text-sm text-primary hover:underline">
              Manage Verses
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{commentCount}</CardTitle>
            <CardDescription>Comments</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/comments" className="text-sm text-primary hover:underline">
              Manage Comments
            </Link>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Recent Users</TabsTrigger>
          <TabsTrigger value="comments">Recent Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" /> Books Overview
                </CardTitle>
                <CardDescription>Manage your book collection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button asChild variant="outline">
                    <Link href="/admin/books">View All Books</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/admin/books/new">Add New Book</Link>
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button asChild variant="outline">
                    <Link href="/admin/translations">Manage Translations</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admin/chapters">Manage Chapters</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" /> User Management
                </CardTitle>
                <CardDescription>Manage users and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button asChild variant="outline">
                    <Link href="/admin/users">View All Users</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admin/roles">Manage Roles</Link>
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button asChild variant="outline">
                    <Link href="/admin/comments">Moderate Comments</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admin/settings">Site Settings</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" /> Recent Users
              </CardTitle>
              <CardDescription>Recently registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <div className="font-medium">{user.name || "Anonymous"}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/users">View All Users</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" /> Recent Comments
              </CardTitle>
              <CardDescription>Recently posted comments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex justify-between items-start border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <div className="font-medium">{comment.user?.name || "Anonymous"}</div>
                      <div className="text-sm mb-1">
                        on{" "}
                        <Link href={`/books/${comment.book?.id}`} className="text-primary hover:underline">
                          {comment.book?.title}
                        </Link>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.text}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/comments">Moderate All Comments</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
