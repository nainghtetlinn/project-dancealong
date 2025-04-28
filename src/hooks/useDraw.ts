'use client'

import type { Keypoints } from '@/types'

import Point from '@/components/primitive/Point'
import Segment from '@/components/primitive/Segment'

import { useEffect, useRef } from 'react'

const keypoints_order = [
  'nose', // 0
  'left eye', // 1
  'right eye', // 2
  'left ear', // 3
  'right ear', // 4
  'left shoulder', // 5
  'right shoulder', // 6
  'left elbow', // 7
  'right elbow', // 8
  'left wrist', // 9
  'right wrist', // 10
  'left hip', // 11
  'right hip', // 12
  'left knee', // 13
  'right knee', // 14
  'left ankle', // 15
  'right ankle', // 16
]

const adjacentPairs = [
  // eyes to ears
  [3, 1],
  [1, 0],
  [0, 2],
  [2, 4],
  // arms
  [9, 7],
  [7, 5],
  [6, 8],
  [8, 10],
  // shoulders to hips
  [5, 6],
  [5, 11],
  [6, 12],
  // legs
  [15, 13],
  [13, 11],
  [12, 14],
  [14, 16],
  // hips
  [11, 12],
]

const useDraw = (width: number, height: number) => {
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

    const points: (Point | null)[] = keypoints.map(([y, x, score]) => {
      if (score > 0.3) {
        const mirroredX = 1 - x // Mirror the x-coordinate
        const point = new Point(mirroredX * width, y * height)
        point
          .setSize(16)
          .setColor('oklch(0.705 0.213 47.604)')
          .enableFill('white')

        return point
      } else {
        return null
      }
    })
    adjacentPairs.forEach(([i, j]) => {
      if (points[i] && points[j]) {
        const segment = new Segment(points[i], points[j])
        segment.setColor('oklch(0.705 0.213 47.604)').draw(ctx)
      }
    })
    points.forEach(point => {
      point?.draw(ctx)
    })
  }

  return { canvasRef, draw, clean }
}

export default useDraw
