'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, Upload, Trash2 } from 'lucide-react'
import Dropzone from 'react-dropzone'
import MiniWaveForm from '../../_components/MiniWaveForm'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { cn } from '@/lib/utils'
import { uploadAudio } from '@/server-actions/audio'
import { getAudioDuration } from '@/utils/audio'
import { uploadAudioSchema } from '@/validators/audio-validator'
import { useAudio } from '../_lib/audioContext'
import { useProjectDetails } from '../_lib/projectContext'

type TForm = z.infer<typeof uploadAudioSchema>

const AudioUpload = () => {
  const { projectId } = useProjectDetails()
  const { upload } = useAudio()

  const form = useForm<TForm>({
    resolver: zodResolver(uploadAudioSchema),
    defaultValues: {
      title: '',
      artist: '',
      duration: 0,
    },
  })

  const [fileLoading, setFileLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [fileLocalUrl, setFileLocalUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleDrop = async (acceptedFiles: File[]) => {
    setFileLoading(true)
    const audio = acceptedFiles[0]
    const duration = await getAudioDuration(audio)
    form.setValue('duration', Math.floor(duration))
    setFile(audio)
    setFileLocalUrl(URL.createObjectURL(audio))
    setFileLoading(false)
  }

  const handleRemove = () => {
    form.resetField('duration')
    setFile(null)
    setFileLocalUrl('')
  }

  const onSubmit = async (values: TForm) => {
    setLoading(true)
    const result = await uploadAudio(values, file!, projectId)

    if (!result.success) toast.error(result.message)
    else {
      toast.success('Successfully uploaded.')
      upload(file!, result.data) // upload to audio context
    }

    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className='w-[350px]'>
          <CardHeader>
            <CardTitle>Upload a song</CardTitle>
            <CardDescription>Just give title and artist name.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='artist'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fileLoading ? (
              <Skeleton className='w-full h-[150px]' />
            ) : file === null ? (
              <Dropzone onDrop={handleDrop}>
                {({ getRootProps, getInputProps, isDragActive }) => (
                  <div {...getRootProps()}>
                    <input
                      {...getInputProps()}
                      accept='audio/*'
                    />
                    <div
                      className={cn(
                        'w-full h-[150px] flex items-center justify-center bg-background cursor-pointer rounded-2xl border-2 border-dashed border-primary',
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
                        <p className='text-center text-sm text-primary'>
                          or browse
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Dropzone>
            ) : (
              <FormField
                control={form.control}
                name='duration'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (s)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            {fileLocalUrl && (
              <div className='mt-8'>
                <MiniWaveForm url={fileLocalUrl} />
              </div>
            )}
          </CardContent>
          <CardFooter className='justify-between'>
            {file === null ? (
              <div></div>
            ) : (
              <Button
                size='icon'
                variant='destructive'
                type='button'
                onClick={handleRemove}
              >
                <Trash2 />
              </Button>
            )}
            <Button
              type='submit'
              disabled={loading}
            >
              Upload
              {loading ? <Loader2 className='animate-spin' /> : <Upload />}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

export default AudioUpload
