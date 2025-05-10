'use client'

import { Loader2, Upload } from 'lucide-react'
import Dropzone from 'react-dropzone'

import { getAudioDuration } from '@/lib/audio'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { uploadAudio } from '../../action'
import { useAudio } from '../_lib/audioContext'
import { useProjectDetails } from '../_lib/projectContext'

const AudioUpload = () => {
  const { projectId } = useProjectDetails()
  const { upload } = useAudio()

  const [loading, setLoading] = useState(false)

  const handleDrop = async (acceptedFiles: File[]) => {
    const audio = acceptedFiles[0]
    setLoading(true)
    const duration = await getAudioDuration(audio)
    await uploadAudio(audio, duration, projectId)
    setLoading(false)
    upload(audio)
  }

  if (loading) return <Loader2 className='animate-spin' />

  return (
    <Dropzone onDrop={handleDrop}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div {...getRootProps()}>
          <input
            {...getInputProps()}
            accept='audio/*'
          />
          <div
            className={cn(
              'p-2 w-[350px] aspect-square flex items-center justify-center bg-background cursor-pointer rounded-2xl border-2 border-dashed border-primary',
              isDragActive && 'bg-primary/30'
            )}
          >
            <div>
              <Upload
                size={40}
                className='mx-auto'
              />
              <p className='text-center font-bold'>
                Drag & drop to upload song
              </p>
              <p className='text-center text-sm text-primary'>or browse</p>
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  )
}

export default AudioUpload
