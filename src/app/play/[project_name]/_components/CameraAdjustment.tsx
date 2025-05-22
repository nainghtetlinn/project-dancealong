import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { useState } from 'react'

import useWebcam from '@/hooks/useWebcam'

export default function CameraAdjustment() {
  const { videoRef, isEnable, enable, disable } = useWebcam(720, 480)

  const [open, setOpen] = useState(false)

  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        setOpen(open)
        if (isEnable) {
          disable()
        } else {
          enable()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size='sm'
          variant='secondary'
        >
          Adjust camera
        </Button>
      </DialogTrigger>
      <DialogContent className='!max-w-[780px]'>
        <DialogHeader>
          <DialogTitle>Adjust camera</DialogTitle>
        </DialogHeader>

        <video
          ref={videoRef}
          autoPlay
          muted
          style={{ transform: 'scaleX(-1)', width: 720, aspectRatio: 3 / 2 }}
        />
      </DialogContent>
    </Dialog>
  )
}
