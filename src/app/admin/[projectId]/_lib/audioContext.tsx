'use client'

import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'

import { type TSong } from '@/types'

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { initWaveSurfer, readAudio, readAudioFromUrl } from '@/lib/audio'

type Setup = (
  container: HTMLDivElement,
  onReady: (ws: WaveSurfer, rg: RegionsPlugin) => void
) => void

interface AudioContext {
  audio: File | null
  regions: RegionsPlugin | null
  loading: boolean
  isPlaying: boolean
  duration: number
  currentTime: number
  upload: (audio: File) => void
  restart: () => void
  play: () => void
  pause: () => void
  setupWavesurfer: Setup
}

const audioContext = createContext<AudioContext>({
  audio: null,
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
  songUrl,
  songTitle,
}: {
  children: React.ReactNode
  songUrl: string | null
  songTitle: string | null
}) => {
  const wavesurferRef = useRef<WaveSurfer>(null)
  const regionsRef = useRef<RegionsPlugin>(null)

  const [loading, setLoading] = useState(true)
  const [audio, setAudio] = useState<File | null>(null)
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

  const upload = (audio: File) => {
    setAudio(audio)
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
    if (songUrl && songTitle) {
      readAudioFromUrl(songUrl, songTitle)
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
