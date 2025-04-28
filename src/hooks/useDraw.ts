'use client'

import type { Keypoints } from '@/types'

import HumanPose, { HumanPoseOptions } from '@/components/primitive/HumanPose'
import { useEffect, useRef } from 'react'

const useDraw = (width: number, height: number, options?: HumanPoseOptions) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) return
    ctxRef.current = context
  }, [width, height])

  const clean = () => {
    const ctx = ctxRef.current
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)
  }

  const draw = (keypoints: Keypoints) => {
    const ctx = ctxRef.current
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)

    const humanPose = new HumanPose(keypoints, width, height, options)

    humanPose.draw(ctx)
  }

  return { canvasRef, draw, clean }
}

export default useDraw
