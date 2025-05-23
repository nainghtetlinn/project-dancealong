'use client'

import { Skeleton } from '@/components/ui/skeleton'

import { useEffect, useRef, useState } from 'react'
import { useAudio } from '../_lib/audioContext'
import { useProjectDetails } from '../_lib/projectContext'

export default function AudioTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { setupWavesurfer } = useAudio()
  const { choreography } = useProjectDetails()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    setupWavesurfer(containerRef.current, (ws, rg) => {
      setLoading(false)
      choreography.forEach(c => {
        if (c.is_key_pose) {
          rg.addRegion({
            id: c.id,
            start: c.timestamp / 1000,
            color: 'oklch(0.606 0.25 292.717)',
            drag: false,
          })
        }
      })
    })
  })

  return (
    <div className='p-2'>
      <div
        ref={containerRef}
        className='h-[120px] w-full relative'
      >
        {loading && <Skeleton className='absolute inset-0 z-10' />}
      </div>
    </div>
  )
}
