'use client'

import { useRef, useEffect } from 'react'

const useAnimationFrame = (callback: (deltaTime: number) => void) => {
  const callbackRef = useRef(callback)
  const requestRef = useRef<number>(null)
  const previousTimeRef = useRef<number>(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const animate = (time: number) => {
    if (previousTimeRef.current !== null) {
      const deltaTime = time - previousTimeRef.current
      callbackRef.current(deltaTime)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  const start = () => {
    requestRef.current = requestAnimationFrame(animate)
  }

  const stop = () => {
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current)
      requestRef.current = null
      previousTimeRef.current = null
    }
  }

  return { start, stop }
}

export default useAnimationFrame
