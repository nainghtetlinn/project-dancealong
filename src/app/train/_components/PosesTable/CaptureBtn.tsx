import { Button } from '@/components/ui/button'
import { Video } from 'lucide-react'

import { startTimedCapture } from '@/lib/store/_features/poseTrainingThunk'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { useWebcam } from '@/provider/webcam-provider'
import { toast } from 'sonner'

const CaptureBtn = ({ label }: { label: string }) => {
  const dispatch = useAppDispatch()
  const { value, running } = useAppSelector(state => state.counter)
  const { isCapturing } = useAppSelector(state => state.training)
  const { webcamEnable } = useWebcam()

  return (
    <Button
      className='bg-green-600 dark:bg-green-600/60 hover:bg-green-600/90 dark:hover:bg-green-600/90 disabled:bg-green-600/40'
      size='icon'
      disabled={isCapturing || running}
      onClick={() => {
        if (webcamEnable) {
          dispatch(startTimedCapture(label))
        } else {
          toast.error('Please enable webcam')
        }
      }}
    >
      {isCapturing && running ? value : <Video />}
    </Button>
  )
}

export default CaptureBtn
