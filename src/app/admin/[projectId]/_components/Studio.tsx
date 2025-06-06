'use client'

import { Loader2 } from 'lucide-react'
import AudioDetails from './AudioDetails'
import AudioTimeline from './AudioTimeline'
import AudioUpload from './AudioUpload'
import ChoreographyList from './ChoreographyList'
import RecordChoreography from './RecordChoreography'

import { useModel } from '@/provider/model-provider'
import { useAudio } from '../_lib/audioContext'
import { useProjectDetails } from '../_lib/projectContext'

export default function Studio() {
  const { loading: modelLoading } = useModel()
  const { loading, audio } = useAudio()
  const { choreography } = useProjectDetails()

  if (loading || modelLoading)
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
      <section className='grid grid-cols-2'>
        <RecordChoreography choreography={choreography} />
        <div>
          <AudioDetails />
          <AudioTimeline />
          <ChoreographyList choreography={choreography} />
        </div>
      </section>
    </>
  )
}
