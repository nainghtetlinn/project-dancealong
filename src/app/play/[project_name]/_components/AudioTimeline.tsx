'use client'

import { Skeleton } from '@/components/ui/skeleton'

import { useEffect, useRef, useState } from 'react'
import { useAudio } from '../_lib/audioContext'

export default function AudioTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { setupWavesurfer } = useAudio()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    setupWavesurfer(containerRef.current, () => {
      setLoading(false)
    })
  }, [])

  return (
    <div
      ref={containerRef}
      className='h-[60px] w-full relative'
    >
      {loading && <Skeleton className='absolute inset-0 z-10' />}
    </div>
  )
}
