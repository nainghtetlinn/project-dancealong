import { Button } from '@/components/ui/button'

import { exportJSON } from '@/lib/utils'
import { useAppSelector } from '@/lib/store/hooks'
import { toast } from 'sonner'

const ExportBtn = () => {
  const { poses, trainingData } = useAppSelector(state => state.training)

  const handleExport = () => {
    /**
     * Check if all labels have at least some poses captured
     */
    let trainable = true
    poses.forEach(pose => {
      if (pose.numOfPosesCaptured === 0) trainable = false
    })

    if (trainable) exportJSON(trainingData, 'training-data.json')
    else toast.error('Not all poses have been captured')
  }

  return (
    <Button
      variant='secondary'
      disabled={poses.length < 2}
      onClick={handleExport}
    >
      Export Data
    </Button>
  )
}

export default ExportBtn
