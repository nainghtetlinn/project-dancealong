import SongUpload from './SongUpload'
import Player from './Player'

import { useRef } from 'react'
import { useTrain } from '@/provider/train-provider'
import { useAudio } from '@/provider/audio-provider'

const Studio = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { constants } = useTrain()
  const { audio, isCounting, count } = useAudio()

  return (
    <div className='h-full'>
      <div className='flex justify-center'>
        <div className='relative rounded overflow-hidden bg-accent'>
          <canvas
            ref={canvasRef}
            width={constants.canvas.width}
            height={constants.canvas.height}
            className='absolute inset-0'
          ></canvas>
          <video
            width={constants.canvas.width}
            height={constants.canvas.height}
          ></video>
          {isCounting && (
            <div className='absolute inset-0 z-10 bg-black/40 flex items-center justify-center text-5xl'>
              {count}
            </div>
          )}
        </div>
      </div>

      {audio !== null ? <Player /> : <SongUpload />}
    </div>
  )
}

export default Studio
