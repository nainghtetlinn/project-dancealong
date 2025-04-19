import { Button } from '@/components/ui/button'
import { Video } from 'lucide-react'

import { useTrain } from '@/provider/train-provider'
import { toast } from 'sonner'

const CaptureBtn = ({ label }: { label: string }) => {
  const { isRecording, isCapturing, startCapturing } = useTrain()

  return (
    <Button
      className='bg-green-600 dark:bg-green-600/60 hover:bg-green-600/90 dark:hover:bg-green-600/90 disabled:bg-green-600/40'
      size='icon'
      disabled={isCapturing}
      onClick={() => {
        if (isRecording) {
          startCapturing(label)
        } else {
          toast.error('Please enable webcam')
        }
      }}
    >
      <Video />
    </Button>
  )
}

export default CaptureBtn
