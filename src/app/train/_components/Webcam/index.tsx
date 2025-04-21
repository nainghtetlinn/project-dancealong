import BackdropCounter from './BackdropCounter'
import WebcamController from './WebcamController'

import { useWebcam } from '@/provider/webcam-provider'

const Webcam = () => {
  const { VideoElement, CanvasElement, constants } = useWebcam()

  return (
    <section>
      <WebcamController />

      <div
        style={{
          width: constants.width,
          height: constants.height,
        }}
        className='relative rounded overflow-hidden bg-accent'
      >
        <div className='relative z-0'>{VideoElement}</div>

        <div className='absolute inset-0 z-10'>{CanvasElement}</div>

        <BackdropCounter />
      </div>
    </section>
  )
}

export default Webcam
