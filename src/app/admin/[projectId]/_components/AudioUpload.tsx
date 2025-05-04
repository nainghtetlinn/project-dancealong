'use client'

import { Upload } from 'lucide-react'
import Dropzone from 'react-dropzone'
import { cn } from '@/lib/utils'
import { useAudio } from '../_lib/audioContext'

const AudioUpload = ({ projectId }: { projectId: number }) => {
  const { upload } = useAudio()

  const handleDrop = (acceptedFiles: File[]) => {
    upload(acceptedFiles[0], projectId)
  }

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
