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
  isPlaying: boolean
  duration: number
  currentTime: number
  activeRegionId: string
  upload: (audio: File, projectId: number) => void
  play: () => void
  pause: () => void
  setupWavesurfer: (container: HTMLDivElement, onReady: () => void) => void
  removeRegion: () => void
}

const audioContext = createContext<AudioContext>({
  audio: null,
  loading: true,
  isPlaying: false,
  duration: 0,
  currentTime: 0,
  activeRegionId:'',
  upload: () => {},
  play: () => {},
  pause: () => {},
  setupWavesurfer: () => {},
  removeRegion: () => {},
})

export const AudioProvider = ({
  children,
  song,
}: {
  children: React.ReactNode
  song: TSong | null
}) => {
  const hasLoadedSong = useRef(false)
  const wavesurferRef = useRef<WaveSurfer>(null)
  const regionsRef = useRef<RegionsPlugin>(null)

  const [loading, setLoading] = useState(true)
  const [audio, setAudio] = useState<File | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [activeRegionId, setActiveRegionId] = useState('')


  const removeRegion = () => {}

  const setupWavesurfer = (container: HTMLDivElement, onReady: () => void) => {
    if (wavesurferRef.current || regionsRef.current || !audio) return

    const { ws, regions } = initWaveSurfer(container)
    wavesurferRef.current = ws
    regionsRef.current = regions

    /**
     * Wavesurfer
     */
    ws.on('decode', setDuration)
    ws.on('timeupdate', setCurrentTime)
    ws.on('finish', () => {
      ws.setTime(0)
      setIsPlaying(false)
    })
    ws.on('ready', onReady)

    /**
     * Region plugin
     */
    regions.on('region-updated', e => {})

    regions.on('region-clicked', (region, e) => {
      e.stopPropagation()
    })

    /**
     * Load audio
     */
    readAudio(audio, blob => {
      ws.loadBlob(blob)
    })
  }

  const upload = async (audio: File, projectId: number) => {
    setLoading(true)
    const duration = await getAudioDuration(audio)
    await uploadAudio(audio, duration, projectId)
    setLoading(false)
    setAudio(audio)
  }

  const play = () => {
    setIsPlaying(true)
    wavesurferRef.current?.play()
  }

  const pause = () => {
    setIsPlaying(false)
    wavesurferRef.current?.pause()
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
        isPlaying,
        duration,
        currentTime,
        activeRegionId,
        upload,
        play,
        pause,
        setupWavesurfer,
        removeRegion,
      }}
    >
      {children}
    </audioContext.Provider>
  )
}

export const useAudio = () => useContext(audioContext)
