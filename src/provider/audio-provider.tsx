'use client'

import ShortUniqueID from 'short-unique-id'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'

import { initWaveSurfer, readAudio } from '@/lib/audio'
import {
  addPoseRegion,
  clearRegions,
  removePoseRegion,
  updatePoseRegion,
} from '@/lib/store/_features/poseRegionSlice'
import { useAppDispatch } from '@/lib/store/hooks'
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

const uid = new ShortUniqueID({ length: 6 })

interface AudioContext {
  AudioWaveSurferContainer: React.JSX.Element
  audio: File | null
  duration: number
  currentTime: number
  isPlaying: boolean
  activeRegion: string
  onDrop: (files: File[]) => void
  removeAudio: () => void
  play: () => void
  pause: () => void
  addRegion: (label: string) => void
  removeRegion: () => void
}

const audioContext = createContext<AudioContext>({
  AudioWaveSurferContainer: <div />,
  audio: null,
  duration: 0,
  currentTime: 0,
  isPlaying: false,
  activeRegion: '',
  onDrop: () => {},
  removeAudio: () => {},
  play: () => {},
  pause: () => {},
  addRegion: () => {},
  removeRegion: () => {},
})

const colors = {
  DEFAULT: 'oklch(0.606 0.25 292.717/50%)',
  ACTIVE: 'oklch(0.606 0.25 292.717/70%)',
}

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch()
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer>(null)
  const regionsRef = useRef<RegionsPlugin>(null)
  const activeRegionRef = useRef<string>(null)

  const [audio, setAudio] = useState<File | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [activeRegion, setActiveRegion] = useState('')

  useEffect(() => {
    if (!audio || !containerRef.current) return

    const { ws, regions } = initWaveSurfer(containerRef.current)
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
    ws.on('click', () => {
      regions.getRegions().forEach(r => {
        r.setOptions({ color: colors.DEFAULT })
      })
      activeRegionRef.current = null
      setActiveRegion('')
    })

    /**
     * Region plugin
     */
    regions.on('region-updated', e => {
      dispatch(
        updatePoseRegion({ id: e.id, value: { start: e.start, end: e.end } })
      )
    })

    regions.on('region-clicked', (region, e) => {
      e.stopPropagation()

      regionsRef.current
        ?.getRegions()
        .forEach(r => r.setOptions({ color: colors.DEFAULT }))

      if (activeRegionRef.current === region.id) {
        region.setOptions({ color: colors.DEFAULT })
        activeRegionRef.current = null
        setActiveRegion('')
      } else {
        region.setOptions({ color: colors.ACTIVE })
        activeRegionRef.current = region.id
        setActiveRegion(region.id)
      }
    })

    /**
     * Load audio
     */
    readAudio(audio, blob => {
      ws.loadBlob(blob)
    })

    return () => {
      setIsPlaying(false)
      setDuration(0)
      setCurrentTime(0)
      dispatch(clearRegions())
      setActiveRegion('')
      ws.unAll()
      ws.destroy()
      regions.unAll()
      regions.destroy()
    }
  }, [audio])

  const onDrop = (acceptedFiles: File[]) => {
    setAudio(acceptedFiles[0])
  }

  const removeAudio = () => {
    setAudio(null)
    dispatch(clearRegions())
  }

  const play = () => {
    setIsPlaying(true)
    wavesurferRef.current?.play()
  }

  const pause = () => {
    setIsPlaying(false)
    wavesurferRef.current?.pause()
  }

  const addRegion = (label: string) => {
    const newRegion = {
      id: uid.rnd(),
      content: label,
      start: currentTime,
      end: currentTime + 0.7,
    }
    regionsRef.current?.addRegion({ ...newRegion, color: colors.DEFAULT })
    dispatch(addPoseRegion(newRegion))
  }

  const removeRegion = () => {
    if (!activeRegion) return

    regionsRef.current?.getRegions().forEach(p => {
      if (p.id === activeRegion) {
        p.remove()
      }
    })
    dispatch(removePoseRegion(activeRegion))
    setActiveRegion('')
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
        activeRegion,
        onDrop,
        removeAudio,
        play,
        pause,
        addRegion,
        removeRegion,
      }}
    >
      {children}
    </audioContext.Provider>
  )
}

export const useAudio = () => useContext(audioContext)
