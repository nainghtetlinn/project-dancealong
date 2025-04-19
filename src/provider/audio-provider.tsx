import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react'
import WaveSurfer from 'wavesurfer.js'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.esm.js'

interface AudioContext {
  AudioWaveSurferContainer: React.JSX.Element
  wavesurfer: WaveSurfer | null
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
  wavesurfer: null,
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

  const onDrop = (acceptedFiles: File[]) => {
    setAudio(acceptedFiles[0])
  }

  const removeAudio = () => {
    setAudio(null)
    wavesurferRef.current?.unAll()
    wavesurferRef.current?.destroy()
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

  useEffect(() => {
    if (!audio || !containerRef.current) return

    wavesurferRef.current = createWaveSurfer(containerRef.current)

    wavesurferRef.current.on('decode', setDuration)
    wavesurferRef.current.on('timeupdate', setCurrentTime)

    wavesurferRef.current.on('finish', () => {
      wavesurferRef.current?.setTime(0)
      setIsPlaying(false)
    })

    readAudio(audio, blob => {
      wavesurferRef.current?.loadBlob(blob)
    })

    return () => {
      setIsPlaying(false)
      wavesurferRef.current?.unAll()
      wavesurferRef.current?.destroy()
    }
  }, [audio, containerRef])

  return (
    <audioContext.Provider
      value={{
        AudioWaveSurferContainer,
        wavesurfer: wavesurferRef.current,
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

const createWaveSurfer = (ref: HTMLDivElement) => {
  return WaveSurfer.create({
    container: ref,
    height: 80,
    barWidth: 2,
    waveColor: 'oklch(.552 .016 285.938)',
    progressColor: 'oklch(.646 .222 41.116)',
    dragToSeek: true,
    hideScrollbar: true,
    plugins: [
      TimelinePlugin.create(),
      Hover.create({
        lineColor: 'oklch(0.623 0.214 259.815)',
        lineWidth: 2,
        labelBackground: '#555',
        labelColor: '#fff',
        labelSize: '11px',
      }),
      ZoomPlugin.create({
        scale: 0.1,
        maxZoom: 100,
      }),
    ],
  })
}

const readAudio = (audio: File, callback: (audio: Blob) => void) => {
  const fileReader = new FileReader()
  fileReader.onload = function (e) {
    if (e.target && e.target.result) {
      const blob = new Blob([e.target.result])
      callback(blob)
    }
  }
  fileReader.readAsArrayBuffer(audio)
}
