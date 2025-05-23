import { Button } from '@/components/ui/button'
import { LogOut, Pause, Play } from 'lucide-react'
import CameraAdjustment from './CameraAdjustment'
import ChoreographyList from './ChoreographyList'
import ChoreographyTimeline from './ChoreographyTimeline'
import Score from './Score'

import { TParsedChoreography } from '@/types'

import { useEffect, useRef, useState } from 'react'

import useAnimationFrame from '@/hooks/useAnimationFrame'
import { useAudio } from '../_lib/audioContext'

export default function Room({
  choreography,
}: {
  choreography: TParsedChoreography[]
}) {
  const ctlRef = useRef<{
    callbackAnimationLoop: (delta: number, elasped: number) => void
    restartAnimation: () => void
  }>(null)
  const clRef = useRef<{
    callbackAnimationLoop: () => void
    restartAnimation: () => void
  }>(null)
  const scoreRef = useRef<{
    enableWebcam: () => Promise<void>
    disableWebcam: () => void
    callbackLoop: (elasped: number) => void
    restart: () => void
    getResult: () => number
  }>(null)

  const elaspedTime = useRef(0)
  const [totalScore, setTotalScore] = useState(0)
  const [isPlaying, setIsplaying] = useState(false)
  const [isPause, setIsPause] = useState(false)
  const [count, setCount] = useState(0)

  const {
    isFinished,
    play: playAudio,
    pause: pauseAudio,
    restart: restartAudio,
  } = useAudio()

  useEffect(() => {
    if (isFinished && isPlaying) {
      stopAnimation()
      scoreRef.current?.disableWebcam()

      const ts = scoreRef.current?.getResult() || 0
      setTotalScore(ts)
    }
  }, [isFinished, isPlaying])

  const { start: startAnimation, stop: stopAnimation } = useAnimationFrame(
    delta => {
      if (isPause) return

      elaspedTime.current += delta

      ctlRef.current?.callbackAnimationLoop(delta, elaspedTime.current)
      clRef.current?.callbackAnimationLoop()
      scoreRef.current?.callbackLoop(elaspedTime.current)
    }
  )

  const handleGameStart = async () => {
    await scoreRef.current?.enableWebcam()

    setIsplaying(true)
    setIsPause(false)

    restartAudio()

    for (let i = 5; i >= 0; i--) {
      setCount(i)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    startAnimation()
  }

  const handleGamePause = () => {
    scoreRef.current?.disableWebcam()

    setIsPause(true)
    pauseAudio()
  }

  const handleGameResume = async () => {
    await scoreRef.current?.enableWebcam()

    setIsPause(false)
    playAudio()
  }

  const handleGameRestart = () => {
    setIsplaying(false)
    setIsPause(false)
    stopAnimation()

    pauseAudio()
    restartAudio()

    elaspedTime.current = 0
    ctlRef.current?.restartAnimation()
    clRef.current?.restartAnimation()
    scoreRef.current?.restart()
  }

  return (
    <section className='w-full flex-1 relative'>
      <div
        className={`absolute inset-0 bg-background z-40 flex flex-col items-center justify-center gap-8 ${
          isPlaying && 'hidden'
        }`}
      >
        <Button
          size='icon'
          disabled={isPlaying}
          className='w-16 h-16 rounded-full'
          onClick={handleGameStart}
        >
          <Play style={{ scale: 2 }} />
        </Button>
        <CameraAdjustment />
      </div>

      <div className={`h-full relative ${!isPlaying && 'hidden'}`}>
        {count > 0 && (
          <div className='absolute inset-0 z-50 bg-background/70 flex items-center justify-center'>
            <p className='font-bold text-4xl'>{count}</p>
          </div>
        )}
        {isPlaying && isFinished && (
          <div className='absolute inset-0 z-50 bg-background flex flex-col items-center justify-center'>
            <h5 className='font-bold text-lg'>Total Score</h5>
            <p className='font-bold text-4xl my-4'>
              {Number(totalScore * 100).toFixed(0)}%
            </p>
            <Button
              size='icon'
              variant='secondary'
              onClick={handleGameRestart}
            >
              <LogOut />
            </Button>
          </div>
        )}

        <div className='absolute top-0 left-0 p-2 space-x-2 z-40'>
          <Button
            size='icon'
            variant='secondary'
            onClick={isPause ? handleGameResume : handleGamePause}
          >
            {isPause ? <Play /> : <Pause />}
          </Button>
          <Button
            size='icon'
            variant='secondary'
            onClick={handleGameRestart}
          >
            <LogOut />
          </Button>
        </div>

        <Score
          ref={scoreRef}
          choreography={choreography.filter(c => c.is_key_pose)}
        />

        <ChoreographyTimeline
          ref={ctlRef}
          choreography={choreography.filter(c => c.is_key_pose)}
        />

        <div className='relative h-full flex items-center justify-center'>
          <ChoreographyList
            ref={clRef}
            choreography={choreography}
          />
        </div>
      </div>
    </section>
  )
}
