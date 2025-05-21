"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface User {
  id: string
  name: string | null
  image: string | null
}

interface Comment {
  id: string
  text: string
  createdAt: Date
  user: User
}

interface CommentSectionProps {
  bookId: string
  verseId?: string
  comments: Comment[]
  currentUser: User | null
}

export function CommentSection({ bookId, verseId, comments: initialComments, currentUser }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments)
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault()

    if (!commentText.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: commentText,
          bookId,
          verseId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit comment")
      }

      const newComment = await response.json()
      setComments([newComment, ...comments])
      setCommentText("")

      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function getInitials(name: string | null) {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const returnPath = verseId ? `/books/${bookId}/verses/${verseId}` : `/books/${bookId}`
  const returnTo = encodeURIComponent(returnPath)

  return (
    <div className="space-y-6">
      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            placeholder="Share your thoughts..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="min-h-[100px]"
          />
          <Button type="submit" disabled={isSubmitting || !commentText.trim()}>
            {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </form>
      ) : (
        <div className="bg-muted p-4 rounded-md">
          <p className="text-sm text-muted-foreground mb-2">Sign in or continue as a guest to join the discussion</p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="default" size="sm">
              <Link href={`/login?return_to=${returnTo}`}>Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/api/auth/guest?return_to=${returnTo}`}>Continue as Guest</Link>
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
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
                <p className="text-sm">{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  )
}
