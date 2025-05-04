'use client'

import { useEffect, useState } from 'react'
import { useWebcam } from '../_lib/webcamContext'

export default function Webcam() {
  const { VideoElement, CanvasElement, constants, isWebcamEnable } = useWebcam()

  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!window) return

    setScale(
      Math.max(
        Math.min(
          window.innerWidth / constants.width,
          window.innerHeight / constants.height
        ) - 0.2,
        1
      )
    )
  }, [])

  return (
    <div
      className={`fixed z-40 inset-0 bg-black/80 flex items-center justify-center pointer-events-none ${
        isWebcamEnable ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div style={{ scale }}>
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
    </div>
  )
}
