import useDraw from './useDraw'
import useDetection from './useDetection'
import { useTrain } from '@/provider/train-provider'

const useDetectAndDraw = (
  video: HTMLVideoElement | null,
  canvas: HTMLCanvasElement | null,
  callback: (keypoints: number[][]) => void
) => {
  const { constants } = useTrain()

  const { draw, clean } = useDraw(
    canvas,
    constants.canvas.width,
    constants.canvas.height
  )
  const { start, stop } = useDetection(video, keypoints => {
    draw(keypoints)
    callback(keypoints)
  })

  return { start, stop, clean }
}

export default useDetectAndDraw
