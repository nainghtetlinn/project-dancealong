'use client'

import { Loader2 } from 'lucide-react'
import AudioDetails from './AudioDetails'
import AudioTimeline from './AudioTimeline'
import AudioUpload from './AudioUpload'
import Controls from './Controls'
import TrainingData from './TrainingData'

import { TProject } from '../../_types'

import { useAudio } from '../_lib/audioContext'
import { useTraining } from '../_lib/trainingContext'

export default function Studio() {
  const { loading, audio } = useAudio()
  const { hasTrained } = useTraining()

  if (loading)
    return (
      <div className='h-full flex items-center justify-center'>
        <Loader2 className='animate-spin' />
      </div>
    )

  if (audio === null)
    return (
      <div className='h-full flex items-center justify-center'>
        <AudioUpload />
      </div>
    )

  return (
    <>
      <section>
        <AudioTimeline />
        <AudioDetails />
      </section>

      {hasTrained ? <Controls /> : <TrainingData />}
    </>
  )
}
