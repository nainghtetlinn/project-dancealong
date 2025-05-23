'use client'

import { type TParsedChoreography } from '@/types'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import useDraw from '@/hooks/useDraw'
import { updateIsKeyPose } from '@/server-actions/choreography'
import { useAudio } from '../_lib/audioContext'

const ASPECT_RATIO = 640 / 480
const CANVAS_HEIGHT = 150

export default function ChoreographyList({
  choreography,
}: {
  choreography: TParsedChoreography[]
}) {
  return (
    <div className='p-2'>
      <div className='overflow-x-scroll flex gap-1'>
        {choreography.map(c => (
          <ChoreographyItem
            key={c.id}
            c={c}
          />
        ))}
      </div>
    </div>
  )
}

function ChoreographyItem({ c }: { c: TParsedChoreography }) {
  const { canvasRef, draw } = useDraw(
    ASPECT_RATIO * CANVAS_HEIGHT,
    CANVAS_HEIGHT,
    {
      point: {
        color: 'oklch(0.705 0.213 47.604)',
        size: 4,
      },
      segment: {
        width: 1,
      },
    }
  )

  const { regions } = useAudio()
  const [isKeyPose, setIsKeyPose] = useState(c.is_key_pose)

  useEffect(() => {
    draw(c.keypoints)
  })

  useEffect(() => {
    if (isKeyPose) {
      regions?.addRegion({
        id: c.id,
        start: c.timestamp / 1000,
        color: 'oklch(0.606 0.25 292.717)',
        drag: false,
      })
    } else {
      regions?.getRegions().forEach(r => {
        if (r.id === c.id) r.remove()
      })
    }
  }, [isKeyPose, c.id, c.timestamp, regions])

  const handleClick = async () => {
    const prev = isKeyPose
    setIsKeyPose(!prev)

    const result = await updateIsKeyPose(c.id, !prev)

    if (!result.success) {
      toast.error('Failed.')
      setIsKeyPose(prev)
    }
  }

  return (
    <div
      className='relative inline-block'
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        width={ASPECT_RATIO * CANVAS_HEIGHT}
        height={CANVAS_HEIGHT}
        className={`border rounded overflow-hidden ${
          isKeyPose && 'border-primary'
        }`}
      />
      <p>{c.timestamp} ms</p>
    </div>
  )
}
