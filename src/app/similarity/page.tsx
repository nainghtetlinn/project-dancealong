'use client'

import useDraw from '@/hooks/useDraw'
import useDetectAndDraw from '@/hooks/useDetectAndDraw'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { comparePoses } from '@/utils/pose'

export default function Similarity() {
  const [text, setText] = useState('')

  const { canvasRef, draw, clean } = useDraw(640, 480)
  const {
    videoRef,
    canvasRef: videoCanvasRef,
    startDetection,
    stopDetection,
  } = useDetectAndDraw(640, 480, keypoints => {
    const score = comparePoses(keypoints, expected_keypoints)
    setText(`Score: ${score}`)
  })

  useEffect(() => {
    draw(expected_keypoints)
  }, [])

  const handleClick = async () => {
    await startDetection()
  }

  const handleStop = () => {
    stopDetection()
  }

  return (
    <div className='flex flex-wrap'>
      <div
        className='border relative'
        style={{ width: 640, height: 480 }}
      >
        <canvas
          ref={canvasRef}
          className='w-full h-full'
        />
      </div>
      <div
        className='border relative'
        style={{ width: 640, height: 480 }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          style={{ transform: 'scaleX(-1)' }}
          className='w-full h-full'
        />
        <canvas
          ref={videoCanvasRef}
          className='absolute top-0 left-0 w-full h-full z-10'
        />
      </div>
      <div className='w-full'>
        <Button onClick={handleClick}>Start</Button>
        <Button onClick={handleStop}>Stop</Button>
      </div>
      <div className='w-full font-bold text-2xl'>{text}</div>
    </div>
  )
}

const expected_keypoints = [
  [0.21791857481002808, 0.47731271386146545, 0.7962328195571899],
  [0.19563628733158112, 0.4946116805076599, 0.915677547454834],
  [0.19466227293014526, 0.4561951756477356, 0.8947209119796753],
  [0.20496363937854767, 0.5107933878898621, 0.8510741591453552],
  [0.20689897239208221, 0.42718663811683655, 0.8702147006988525],
  [0.3497827351093292, 0.5390828847885132, 0.7825837135314941],
  [0.3353636860847473, 0.3694114685058594, 0.8050339221954346],
  [0.42572569847106934, 0.6372506022453308, 0.9221384525299072],
  [0.4660041034221649, 0.2985553741455078, 0.8213111162185669],
  [0.30893921852111816, 0.7060732841491699, 0.8091776371002197],
  [0.32818305492401123, 0.2561019957065582, 0.8776100873947144],
  [0.6481557488441467, 0.528610110282898, 0.5856342315673828],
  [0.6754053831100464, 0.4315875768661499, 0.7952802181243896],
  [0.6605353951454163, 0.6803483366966248, 0.7941432595252991],
  [0.9405668377876282, 0.4404602646827698, 0.5938595533370972],
  [0.9618514180183411, 0.6474146246910095, 0.7984622716903687],
  [0.9787099361419678, 0.4444659352302551, 0.02859480306506157],
]
