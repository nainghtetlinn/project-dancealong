import { Upload } from 'lucide-react'
import Dropzone from 'react-dropzone'
import { cn } from '@/lib/utils'
import { useAudio } from '@/provider/audio-provider'

const AudioUpload = () => {
  const { onDrop } = useAudio()

  return (
    <Dropzone onDrop={onDrop}>
      {({ getRootProps, getInputProps, isDragActive }) => (
        <div {...getRootProps()}>
          <input
            {...getInputProps()}
            accept='audio/*'
          />

          <div
            className={cn(
              'cursor-pointer rounded-2xl border-2 border-dashed border-primary mt-2 p-2 bg-background',
              isDragActive && 'bg-primary/30'
            )}
          >
            <Upload
              size={40}
              className='mx-auto'
            />
            <p className='text-center font-bold'>Drag & drop to upload song</p>
            <p className='text-center text-sm text-primary'>or browse</p>
          </div>
        </div>
      )}
    </Dropzone>
  )
}

export default AudioUpload
