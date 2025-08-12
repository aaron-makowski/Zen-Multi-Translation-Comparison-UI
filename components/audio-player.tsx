"use client"

import { useEffect, useRef, useState } from "react"

interface AudioPlayerProps {
  text?: string
  src?: string
}

export function AudioPlayer({ text, src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [speaking, setSpeaking] = useState(false)

  function speak() {
    if (!text || typeof window === "undefined") return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.onend = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis.cancel()
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      {src && <audio ref={audioRef} controls src={src} className="h-8" />}
      {text && (
        <button
          onClick={speak}
          disabled={speaking}
          className="text-sm px-2 py-1 border rounded"
        >
          {speaking ? "Speaking..." : "Speak"}
        </button>
      )}
    </div>
  )
}
