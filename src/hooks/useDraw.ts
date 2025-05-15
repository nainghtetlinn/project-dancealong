'use client'

import { type TKeypoints } from '@/types'

import HumanPose, { HumanPoseOptions } from '@/components/primitive/HumanPose'
import { useEffect, useRef } from 'react'

const useDraw = (width: number, height: number, options?: HumanPoseOptions) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) return
    ctxRef.current = context
  }, [])

  const clean = () => {
    if (ctxRef.current) {
      const ctx = ctxRef.current
      ctx.clearRect(0, 0, width, height)
    } else {
      console.error('Context not found.')
    }
  }

  const draw = (keypoints: TKeypoints) => {
    if (ctxRef.current) {
      const ctx = ctxRef.current
      ctx.clearRect(0, 0, width, height)
      const humanPose = new HumanPose(keypoints, width, height, options)
      humanPose.draw(ctx)
    } else {
      console.error('Context not found.')
    }
  }

  return { canvasRef, draw, clean }
}

export default useDraw
