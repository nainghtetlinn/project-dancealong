import { Progress } from '@/components/ui/progress'

import { cn } from '@/lib/utils'
import { useAppSelector } from '@/lib/store/hooks'
import { useWebcam } from '@/provider/webcam-provider'

const Webcam = () => {
  const { VideoElement, CanvasElement, constants, webcamEnable } = useWebcam()
  const { value, show } = useAppSelector(state => state.counter)

  return (
    <section
      className={cn(
        'fixed z-40 inset-0 bg-black/80 flex items-center justify-center pointer-events-none',
        webcamEnable ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div>
        <Progress value={show ? 0 : (100 * value) / 5} />
        <div
          style={{
            width: constants.width,
            height: constants.height,
          }}
          className='relative rounded overflow-hidden bg-accent'
        >
          <div className='relative z-0'>{VideoElement}</div>

          <div className='absolute inset-0 z-10'>{CanvasElement}</div>
        </div>
      </div>
    </section>
  )
}

export default Webcam
