import AnimatedText from './AnimatedText'

import { TKeypoints, TParsedChoreography } from '@/types'

import { RefObject, useImperativeHandle, useRef, useState } from 'react'

import useWebcam from '@/hooks/useWebcam'
import { useModel } from '@/provider/model-provider'
import { comparePoses } from '@/utils/pose'

export default function Score({
  ref,
  choreography,
}: {
  ref: RefObject<{
    enableWebcam: () => Promise<void>
    disableWebcam: () => void
    callbackLoop: (elasped: number) => void
    restart: () => void
    getResult: () => number
  } | null>
  choreography: TParsedChoreography[]
}) {
  const { videoRef, enable, disable } = useWebcam(300, 200)
  const { detect } = useModel()

  const toCheck = useRef<
    { start: number; end: number; keypoints: TKeypoints }[]
  >(
    choreography.map(c => ({
      start: c.timestamp - 200,
      end: c.timestamp + 200,
      keypoints: c.keypoints,
    }))
  )
  const indexRef = useRef(0)
  const maxScoreRef = useRef(0)
  const totalScoreRef = useRef(0)

  const [text, setText] = useState('')

  async function enableWebcam() {
    await enable()
  }

  function disableWebcam() {
    disable()
  }

  function updateScore(score: number) {
    if (score > 0.85) {
      setText('Perfect!')
    } else if (score > 0.75) {
      setText('Nice!')
    } else if (score > 0.65) {
      setText('Good!')
    } else {
      setText('Okay!')
    }
  }

  function callbackLoop(elasped: number) {
    if (
      videoRef.current === null ||
      videoRef.current.readyState !== 4 ||
      indexRef.current === choreography.length
    )
      return

    const c = toCheck.current[indexRef.current]

    if (c.start <= elasped && elasped <= c.end) {
      const keypoints = detect(videoRef.current)
      const score = comparePoses(keypoints, c.keypoints)
      if (score > maxScoreRef.current) maxScoreRef.current = score
    } else if (c.end <= elasped) {
      updateScore(maxScoreRef.current)
      totalScoreRef.current += maxScoreRef.current
      indexRef.current += 1
      maxScoreRef.current = 0
    }
  }

  function restart() {
    disable()
    indexRef.current = 0
    maxScoreRef.current = 0
    totalScoreRef.current = 0
    setText('')
  }

  function getResult() {
    const result = totalScoreRef.current / choreography.length
    return result
  }

  useImperativeHandle(ref, () => ({
    enableWebcam,
    disableWebcam,
    callbackLoop,
    restart,
    getResult,
  }))

  return (
    <div className='absolute top-0 right-0 p-12'>
      <AnimatedText text={text} />
      <video
        ref={videoRef}
        autoPlay
        muted
        style={{ transform: 'scaleX(-1)' }}
        className='opacity-0 absolute top-0 left-0'
      />
    </div>
  )
}
