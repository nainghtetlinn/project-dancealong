import { Button } from '@/components/ui/button'
import { Video } from 'lucide-react'

import { useTraining } from '../../_lib/trainingContext'
import { useWebcam } from '../../_lib/webcamContext'

export default function CaptureBtn({ label }: { label: string }) {
  const { startCapturing } = useWebcam()
  const { addTrainingData } = useTraining()

  const handleClick = async () => {
    const result = await startCapturing()
    addTrainingData(result, label)
  }

  return (
    <Button
      className='bg-green-600 dark:bg-green-600/60 hover:bg-green-600/90 dark:hover:bg-green-600/90 disabled:bg-green-600/40'
      size='icon'
      onClick={handleClick}
    >
      <Video />
    </Button>
  )
}
