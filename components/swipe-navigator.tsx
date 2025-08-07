'use client'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'

interface Props {
  prevUrl?: string
  nextUrl?: string
  children: React.ReactNode
}

export function SwipeNavigator({ prevUrl, nextUrl, children }: Props) {
  const router = useRouter()
  const startX = useRef(0)

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
  }

  function onTouchEnd(e: React.TouchEvent) {
    const deltaX = e.changedTouches[0].clientX - startX.current
    if (deltaX > 80 && prevUrl) {
      router.push(prevUrl)
    }
    if (deltaX < -80 && nextUrl) {
      router.push(nextUrl)
    }
  }

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="h-full w-full">
      {children}
    </div>
  )
}
