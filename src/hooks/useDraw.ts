import { useEffect, useState } from 'react'

const keypoints_order = [
  'nose',
  'left eye',
  'right eye',
  'left ear',
  'right ear',
  'left shoulder',
  'right shoulder',
  'left elbow',
  'right elbow',
  'left wrist',
  'right wrist',
  'left hip',
  'right hip',
  'left knee',
  'right knee',
  'left ankle',
  'right ankle',
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

    keypoints.forEach(([y, x, score]) => {
      if (score > 0.3) {
        const mirroredX = 1 - x // Mirror the x-coordinate
        ctx.beginPath()
        ctx.arc(mirroredX * width, y * height, 5, 0, 2 * Math.PI)
        ctx.fillStyle = 'red'
        ctx.fill()
      }
    })
  }

  return { draw, clean }
}

export default useDraw
