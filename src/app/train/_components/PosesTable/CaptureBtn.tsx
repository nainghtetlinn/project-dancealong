import { Button } from '@/components/ui/button'
import { Video } from 'lucide-react'

import { startTimedCapture } from '@/lib/store/_features/poseTrainingThunk'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { useWebcam } from '@/provider/webcam-provider'

const CaptureBtn = ({ label }: { label: string }) => {
  const dispatch = useAppDispatch()
  const { openWebcam, closeWebcam } = useWebcam()

  return (
    <Button
      className='bg-green-600 dark:bg-green-600/60 hover:bg-green-600/90 dark:hover:bg-green-600/90 disabled:bg-green-600/40'
      size='icon'
      onClick={async () => {
        openWebcam()
        await dispatch(startTimedCapture(label))
        closeWebcam()
      }}
    >
      <Video />
    </Button>
  )
}

export default CaptureBtn
