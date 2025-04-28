import { Button } from '@/components/ui/button'
import { Minus } from 'lucide-react'

import type { Keypoints } from '@/types'

import useDraw from '@/hooks/useDraw'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { useEffect } from 'react'
import { removePose } from '@/lib/store/_features/poseTrainingSlice'

const ASPECT_RATIO = 640 / 480
const CANVAS_HEIGHT = 150

const PosesList = ({ label }: { label: string }) => {
  const dispatch = useAppDispatch()
  const { trainingData } = useAppSelector(state => state.training)

  const filteredPoses = trainingData.filter(p => p.label === label)

  if (filteredPoses.length === 0) return null

  return (
    <div className='relative h-[150px]'>
      <div className='absolute inset-0 overflow-x-scroll overflow-y-hidden'>
        {filteredPoses.map(pose => (
          <Pose
            key={pose.id}
            keypoints={pose.keypoints}
            handleClick={() => dispatch(removePose(pose.id))}
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
  keypoints: Keypoints
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
export default PosesList
