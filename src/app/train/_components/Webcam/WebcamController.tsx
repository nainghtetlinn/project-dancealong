import { Switch } from '@/components/ui/switch'
import { Video } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useWebcam } from '@/provider/webcam-provider'

const WebcamController = () => {
  const { webcamEnable, toggleWebcam } = useWebcam()

  return (
    <div className='flex justify-between items-center'>
      <div className='flex gap-2'>
        <Video
          className={cn(webcamEnable ? 'text-emerald-500' : 'text-destructive')}
        />
        {webcamEnable ? 'Recording ...' : 'Record'}
      </div>

      <Switch
        checked={webcamEnable}
        onCheckedChange={toggleWebcam}
      />
    </div>
  )
}

export default WebcamController
