'use client'

import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'

import { TSong } from '@/types'

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { initWaveSurfer, readAudio, readAudioFromUrl } from '@/utils/audio'

type Setup = (
  container: HTMLDivElement,
  onReady: (ws: WaveSurfer, rg: RegionsPlugin) => void
) => void

interface AudioContext {
  audio: File | null
  audioDetails: TSong | null
  regions: RegionsPlugin | null
  loading: boolean
  isPlaying: boolean
  duration: number
  currentTime: number
  upload: (audio: File, song: TSong) => void
  restart: () => void
  play: () => void
  pause: () => void
  setupWavesurfer: Setup
}

const audioContext = createContext<AudioContext>({
  audio: null,
  audioDetails: null,
  regions: null,
  loading: true,
  isPlaying: false,
  duration: 0,
  currentTime: 0,
  upload: () => {},
  restart: () => {},
  play: () => {},
  pause: () => {},
  setupWavesurfer: () => {},
})

export const AudioProvider = ({
  children,
  song,
}: {
  children: React.ReactNode
  song: TSong | null
}) => {
  const wavesurferRef = useRef<WaveSurfer>(null)
  const regionsRef = useRef<RegionsPlugin>(null)

  const [loading, setLoading] = useState(true)
  const [audio, setAudio] = useState<File | null>(null)
  const [audioDetails, setAudioDetails] = useState<TSong | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const setupWavesurfer: Setup = (container, onReady) => {
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
    ws.on('ready', () => {
      onReady(ws, regions)
    })

    /**
     * Load audio
     */
    readAudio(audio, blob => {
      ws.loadBlob(blob)
    })
  }

  const upload = (audio: File, song: TSong) => {
    setAudio(audio)
    setAudioDetails(song)
  }

  const restart = () => {
    wavesurferRef.current?.setTime(0)
  }

  const play = () => {
    setIsPlaying(true)
    wavesurferRef.current?.play()
  }

  const pause = () => {
    setIsPlaying(false)
    wavesurferRef.current?.pause()
  }

  useEffect(() => {
    if (song) {
      readAudioFromUrl(song.audio_url, song.title)
        .then(audio => {
          setAudio(audio)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <audioContext.Provider
      value={{
        audio,
        audioDetails,
        regions: regionsRef.current,
        loading,
        isPlaying,
        duration,
        currentTime,
        upload,
        restart,
        play,
        pause,
        setupWavesurfer,
      }}
    >
      {children}
    </audioContext.Provider>
  )
}

export const useAudio = () => useContext(audioContext)
