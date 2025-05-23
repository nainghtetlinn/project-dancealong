'use client'

import WaveSurfer from 'wavesurfer.js'

import { type TSong } from '@/types'

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { readAudioFromUrl, readAudio } from '@/utils/audio'

type Setup = (
  container: HTMLDivElement,
  onReady: (ws: WaveSurfer) => void
) => void

interface AudioContext {
  loading: boolean
  isFinished: boolean
  isPlaying: boolean
  duration: number
  currentTime: number
  restart: () => void
  play: () => void
  pause: () => void
  setupWavesurfer: Setup
}

const initialValues: AudioContext = {
  loading: true,
  isFinished: false,
  isPlaying: false,
  duration: 0,
  currentTime: 0,
  restart: () => {},
  play: () => {},
  pause: () => {},
  setupWavesurfer: () => {},
}

const audioContext = createContext<AudioContext>(initialValues)

export const AudioProvider = ({
  children,
  song,
}: {
  children: React.ReactNode
  song: TSong
}) => {
  const wavesurferRef = useRef<WaveSurfer>(null)

  const [loading, setLoading] = useState(true)
  const [audio, setAudio] = useState<File | null>(null)
  const [isFinished, setIsFinished] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  const setupWavesurfer: Setup = (container, onReady) => {
    if (wavesurferRef.current || !audio) return

    const ws = WaveSurfer.create({
      container,
      height: 60,
      barWidth: 2.5,
      barRadius: 12,
      cursorWidth: 0,
      waveColor: 'oklch(.552 .016 285.938)',
      progressColor: 'oklch(.646 .222 41.116)',
      minPxPerSec: 100,
      hideScrollbar: true,
      interact: false,
    })
    wavesurferRef.current = ws

    /**
     * Wavesurfer
     */
    ws.on('decode', setDuration)
    ws.on('timeupdate', setCurrentTime)
    ws.on('finish', () => {
      ws.setTime(0)
      setIsPlaying(false)
      setIsFinished(true)
    })
    ws.on('ready', () => {
      onReady(ws)
    })

    /**
     * Load audio
     */
    readAudio(audio, blob => {
      ws.loadBlob(blob)
    })
  }

  const restart = () => {
    setIsFinished(false)
    wavesurferRef.current?.setTime(0)
  }

  const play = () => {
    setIsPlaying(true)
    setIsFinished(false)
    wavesurferRef.current?.play()
  }

  const pause = () => {
    setIsPlaying(false)
    setIsFinished(false)
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
  }, [song])

  return (
    <audioContext.Provider
      value={{
        loading,
        isFinished,
        isPlaying,
        duration,
        currentTime,
        setupWavesurfer,
        play,
        pause,
        restart,
      }}
    >
      {children}
    </audioContext.Provider>
  )
}

export const useAudio = () => useContext(audioContext)
