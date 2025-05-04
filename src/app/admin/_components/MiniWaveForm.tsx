'use client'

import WaveSurfer from 'wavesurfer.js'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Play, Pause } from 'lucide-react'

import { useRef, useEffect, useState } from 'react'
import { formatTime } from '@/lib/utils'

export default function MiniWaveForm({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer>(null)

  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    if (wavesurferRef.current) return

    const ws = WaveSurfer.create({
      container: containerRef.current,
      height: 60,
      barWidth: 2.5,
      barRadius: 12,
      barHeight: 0.6,
      cursorWidth: 0,
      waveColor: 'oklch(.552 .016 285.938)',
      progressColor: 'oklch(.646 .222 41.116)',
      dragToSeek: true,
      hideScrollbar: true,
      plugins: [
        Hover.create({
          lineColor: 'oklch(0.723 0.219 149.579)',
          lineWidth: 2,
          labelBackground: '#555',
          labelColor: '#fff',
          labelSize: '11px',
        }),
      ],
    })

    wavesurferRef.current = ws

    ws.load(url)

    ws.on('decode', setDuration)
    ws.on('timeupdate', setCurrentTime)
    ws.on('finish', () => {
      ws.setTime(0)
      setIsPlaying(false)
    })
    ws.on('ready', () => {
      setLoading(false)
    })
  }, [])

  const play = () => {
    setIsPlaying(true)
    wavesurferRef.current?.play()
  }

  const pause = () => {
    setIsPlaying(false)
    wavesurferRef.current?.pause()
  }

  return (
    <div className='flex items-center gap-2 relative'>
      <div className='absolute top-0 right-0 -translate-y-full text-sm'>
        {`${formatTime(duration)} / ${formatTime(currentTime)}`}
      </div>
      <Button
        size='icon'
        variant='ghost'
        onClick={isPlaying ? pause : play}
      >
        {isPlaying ? <Pause /> : <Play />}
      </Button>
      <div
        ref={containerRef}
        className='h-[60px] w-full relative'
      >
        {loading && <Skeleton className='absolute inset-0 z-10' />}
      </div>
    </div>
  )
}
