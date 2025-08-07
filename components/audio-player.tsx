"use client"

import React, { useRef } from "react"
import { Button } from "@/components/ui/button"

export interface AudioPlayerProps {
  /** URL of an audio file to play. If omitted, `text` will be spoken. */
  src?: string
  /** Text to speak using the Web Speech API when no `src` is provided. */
  text?: string
}

export function AudioPlayer({ src, text }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handlePlay = () => {
    if (src) {
      audioRef.current?.play()
    } else if (text && typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {src && <audio ref={audioRef} src={src} hidden />}
      <Button onClick={handlePlay}>{src ? "Play audio" : "Speak text"}</Button>
    </div>
  )
}

