'use client'

import { Loader2 } from 'lucide-react'
import AudioUpload from './AudioUpload'

import { useAudio } from '../_lib/audioContext'
import { TProject } from '../../_types'

export default function Studio({ project }: { project: TProject }) {
  const { loading, audio } = useAudio()

  if (loading)
    return (
      <div className='h-full flex items-center justify-center'>
        <Loader2 className='animate-spin' />
      </div>
    )

  if (audio === null)
    return (
      <div className='h-full flex items-center justify-center'>
        <AudioUpload projectId={project.id} />
      </div>
    )

  return <div>Studio</div>
}
