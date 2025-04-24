'use client'

import Point from '@/components/primitive/Point'
import Segment from '@/components/primitive/Segment'

import { useEffect, useState } from 'react'

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

const useDraw = (
  canvas: HTMLCanvasElement | null,
  width: number,
  height: number
) => {
  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (canvas) {
      setContext(canvas.getContext('2d'))
    }
  }, [canvas])

  const clean = () => {
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)
  }

  const draw = (keypoints: number[][]) => {
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)

    adjacentPairs.forEach(([i, j]) => {
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

      if (keypoints[i][2] > 0.3 && keypoints[j][2] > 0.3) {
        const segment = new Segment(points[i]!, points[j]!)
        segment.setColor('oklch(0.705 0.213 47.604)').draw(ctx)
      }

      points.forEach(point => {
        if (point) {
          point.draw(ctx)
        }
      })
    })
  }

  return { draw, clean }
}

export default useDraw
