"use client"
import React from 'react'

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

interface AudioPlayerProps {
  /** Text to be read using the browser's text-to-speech engine */
  text?: string
  /** Optional audio file to play instead of synthesising text */
  src?: string
}

export function AudioPlayer({ text, src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSpeechSupported("speechSynthesis" in window)
    }
  }, [])

  function play() {
    if (src && audioRef.current) {
      audioRef.current.play()
      setPlaying(true)
      return
    }

    if (text && speechSupported) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onend = () => setPlaying(false)
      speechSynthesis.speak(utterance)
      setPlaying(true)
    }
  }

  function stop() {
    if (src && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    } else if (speechSupported) {
      speechSynthesis.cancel()
    }
    setPlaying(false)
  }

  return (
    <div className="flex items-center gap-2">
      {src && <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} />}
      <Button size="sm" onClick={playing ? stop : play}>
        {playing ? "Stop" : "Play"}
      </Button>
    </div>
  )
}

