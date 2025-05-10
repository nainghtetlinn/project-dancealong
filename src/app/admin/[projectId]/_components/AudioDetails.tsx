'use client'

import { Button } from '@/components/ui/button'
import { Music, Pause, Play, MinusSquare, Upload, Loader2 } from 'lucide-react'

import { formatTime } from '@/lib/utils'
import { useAudio } from '../_lib/audioContext'
import { useProjectDetails } from '../_lib/projectContext'
import { useState } from 'react'
import { uploadPosesEvents } from '../../action'

export default function AudioDetails() {
  const { projectId } = useProjectDetails()
  const {
    audio,
    regions,
    duration,
    currentTime,
    isPlaying,
    activeRegionId,
    play,
    pause,
    removeActiveRegion,
  } = useAudio()

  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (regions === null) return
    setLoading(true)
    const events = regions.getRegions().map(r => ({
      start: r.start,
      end: r.end,
      label: r.content?.innerText || '',
    }))
    await uploadPosesEvents(events, projectId)
    setLoading(false)
  }

  return (
    <div className='flex justify-between items-center px-2 py-1'>
      <div className='flex items-center gap-2'>
        <Music
          size={26}
          className='text-primary'
        />
        <h4>{audio?.name}</h4>
      </div>

      <Button
        size='icon'
        variant='secondary'
        disabled={!activeRegionId}
        onClick={removeActiveRegion}
      >
        <MinusSquare />
      </Button>

      <div className='flex items-center gap-2'>
        <p>
          <span className='text-muted-foreground'>{formatTime(duration)}</span>{' '}
          / {formatTime(currentTime)}
        </p>
        <Button
          size='icon'
          variant='secondary'
          onClick={isPlaying ? pause : play}
        >
          {isPlaying ? <Pause /> : <Play />}
        </Button>
        <Button
          size='icon'
          onClick={handleUpload}
        >
          {loading ? <Loader2 className='animate-spin' /> : <Upload />}
        </Button>
      </div>
    </div>
  )
}
