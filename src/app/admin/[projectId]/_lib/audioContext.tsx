'use client'

import ShortUniqueID from 'short-unique-id'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'

import {
  getAudioDuration,
  initWaveSurfer,
  readAudio,
  readAudioFromUrl,
} from '@/lib/audio'
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { uploadAudio } from '../../action'
import { TSong } from '../../_types'
import { toast } from 'sonner'

const uid = new ShortUniqueID({ length: 6 })

interface AudioContext {
  audio: File | null
  loading: boolean
  upload: (audio: File, projectId: number) => void
}

const audioContext = createContext<AudioContext>({
  audio: null,
  loading: true,
  upload: () => {},
})

export const AudioProvider = ({
  children,
  song,
}: {
  children: React.ReactNode
  song: TSong | null
}) => {
  const hasLoadedSong = useRef(false)

  const [loading, setLoading] = useState(true)
  const [audio, setAudio] = useState<File | null>(null)

  const upload = async (audio: File, projectId: number) => {
    setLoading(true)
    const duration = await getAudioDuration(audio)
    await uploadAudio(audio, duration, projectId)
    setLoading(false)
    setAudio(audio)
  }

  if (song && !hasLoadedSong.current) {
    hasLoadedSong.current = true
    readAudioFromUrl(song.song_public_url, song.song_name)
      .then(audio => {
        setAudio(audio)
      })
      .finally(() => {
        setLoading(false)
      })
  } else if (!hasLoadedSong.current) {
    hasLoadedSong.current = true
    setLoading(false)
  }

  return (
    <audioContext.Provider
      value={{
        audio,
        loading,
        upload,
      }}
    >
      {children}
    </audioContext.Provider>
  )
}

export const useAudio = () => useContext(audioContext)
