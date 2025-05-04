'use client'

import { Button } from '@/components/ui/button'
import { Minus } from 'lucide-react'

import { TKeypoints } from '../../_types'

import useDraw from '@/hooks/useDraw'
import { useEffect } from 'react'
import { useTraining } from '../_lib/trainingContext'

const ASPECT_RATIO = 640 / 480
const CANVAS_HEIGHT = 150

export default function PosesList({ label }: { label: string }) {
  const { trainingData, removePose } = useTraining()

  const filteredPoses = trainingData.filter(p => p.label === label)

  if (filteredPoses.length === 0)
    return (
      <div className='h-24 flex items-center justify-center'>No poses.</div>
    )

  return (
    <div className='relative h-[150px]'>
      <div className='absolute inset-0 overflow-x-scroll overflow-y-hidden'>
        {filteredPoses.map(pose => (
          <Pose
            key={pose.id}
            keypoints={pose.keypoints}
            handleClick={() => removePose(pose.id)}
          />
        ))}
      </div>
    </div>
  )
}

const Pose = ({
  keypoints,
  handleClick,
}: {
  keypoints: TKeypoints
  handleClick: () => void
}) => {
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

  useEffect(() => {
    draw(keypoints)
  }, [])

  return (
    <div className='relative inline-block border'>
      <Button
        size='icon'
        variant='destructive'
        onClick={handleClick}
        className='absolute top-1 right-1 rounded-full w-4 h-4'
      >
        <Minus />
      </Button>
      <canvas
        ref={canvasRef}
        width={ASPECT_RATIO * CANVAS_HEIGHT}
        height={CANVAS_HEIGHT}
      />
    </div>
  )
}
