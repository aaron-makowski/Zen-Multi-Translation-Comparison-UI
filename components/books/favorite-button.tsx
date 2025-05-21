"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface FavoriteButtonProps {
  bookId: string
  initialFavorited: boolean
}

export function FavoriteButton({ bookId, initialFavorited }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function toggleFavorite() {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/books/${bookId}/favorite`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to update favorite status")
      }

      const { favorited } = await response.json()
      setIsFavorited(favorited)

      toast({
        title: favorited ? "Added to favorites" : "Removed from favorites",
        description: favorited
          ? "This book has been added to your favorites."
          : "This book has been removed from your favorites.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={isFavorited ? "default" : "outline"}
      size="sm"
      onClick={toggleFavorite}
      disabled={isLoading}
      className="gap-1"
    >
      <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
      {isFavorited ? "Favorited" : "Add to Favorites"}
    </Button>
  )
}
