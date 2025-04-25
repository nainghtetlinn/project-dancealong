import { Button } from '@/components/ui/button'
import { Video } from 'lucide-react'

import { startTimedCapture } from '@/lib/store/_features/poseTrainingThunk'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { useWebcam } from '@/provider/webcam-provider'

const CaptureBtn = ({ label }: { label: string }) => {
  const dispatch = useAppDispatch()
  const { value, running } = useAppSelector(state => state.counter)
  const { isCapturing, activeLabel } = useAppSelector(state => state.training)
  const { webcamEnable, toggleWebcam } = useWebcam()

  return (
    <Button
      className='bg-green-600 dark:bg-green-600/60 hover:bg-green-600/90 dark:hover:bg-green-600/90 disabled:bg-green-600/40'
      size='icon'
      disabled={isCapturing || running}
      onClick={() => {
        if (!webcamEnable) {
          toggleWebcam()
        }
        dispatch(startTimedCapture(label))
      }}
    >
      {isCapturing && running && label === activeLabel ? value : <Video />}
    </Button>
  )
}

export default CaptureBtn
