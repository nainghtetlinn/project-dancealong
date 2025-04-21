import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react'
import WaveSurfer from 'wavesurfer.js'
import { initWaveSurfer, readAudio } from '@/lib/audio'

interface AudioContext {
  AudioWaveSurferContainer: React.JSX.Element
  audio: File | null
  duration: number
  currentTime: number
  isPlaying: boolean
  onDrop: (files: File[]) => void
  removeAudio: () => void
  play: () => void
  pause: () => void
}

const audioContext = createContext<AudioContext>({
  AudioWaveSurferContainer: <div />,
  audio: null,
  duration: 0,
  currentTime: 0,
  isPlaying: false,
  onDrop: () => {},
  removeAudio: () => {},
  play: () => {},
  pause: () => {},
})

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer>(null)

  const [audio, setAudio] = useState<File | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    if (!audio || !containerRef.current) return

    const ws = initWaveSurfer(containerRef.current)
    wavesurferRef.current = ws

    readAudio(audio, blob => {
      ws.loadBlob(blob)
    })

    ws.on('decode', setDuration)
    ws.on('timeupdate', setCurrentTime)
    ws.on('finish', () => {
      ws.setTime(0)
      setIsPlaying(false)
    })

    return () => {
      setIsPlaying(false)
      ws.unAll()
      ws.destroy()
    }
  }, [audio])

  const onDrop = (acceptedFiles: File[]) => {
    setAudio(acceptedFiles[0])
  }

  const removeAudio = () => {
    setAudio(null)
  }

  const play = () => {
    setIsPlaying(true)
    wavesurferRef.current?.play()
  }

  const pause = () => {
    setIsPlaying(false)
    wavesurferRef.current?.pause()
  }

  const AudioWaveSurferContainer = <div ref={containerRef} />

  return (
    <audioContext.Provider
      value={{
        AudioWaveSurferContainer,
        audio,
        duration,
        currentTime,
        isPlaying,
        onDrop,
        removeAudio,
        play,
        pause,
      }}
    >
      {children}
    </audioContext.Provider>
  )
}

export const useAudio = () => useContext(audioContext)
