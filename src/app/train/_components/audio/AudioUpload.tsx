import { Upload } from 'lucide-react'
import Dropzone from 'react-dropzone'
import { cn } from '@/lib/utils'
import { useAudio } from '@/provider/audio-provider'

const AudioUpload = () => {
  const { onDrop } = useAudio()

  return (
    <Dropzone onDrop={onDrop}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div
          {...getRootProps()}
          className='h-full flex items-center justify-center'
        >
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
