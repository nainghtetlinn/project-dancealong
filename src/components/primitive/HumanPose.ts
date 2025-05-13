import { type TKeypoints } from '@/types'

import Segment, { SegmentOptions } from './Segment'
import Point, { PointOptions } from './Point'

// const keypoints_order = [
//   'nose', // 0
//   'left eye', // 1
//   'right eye', // 2
//   'left ear', // 3
//   'right ear', // 4
//   'left shoulder', // 5
//   'right shoulder', // 6
//   'left elbow', // 7
//   'right elbow', // 8
//   'left wrist', // 9
//   'right wrist', // 10
//   'left hip', // 11
//   'right hip', // 12
//   'left knee', // 13
//   'right knee', // 14
//   'left ankle', // 15
//   'right ankle', // 16
// ]

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

export type HumanPoseOptions = {
  threshold?: number
  point?: PointOptions
  segment?: SegmentOptions
}

export default class HumanPose {
  private points: (Point | null)[] = []
  private segments: Segment[] = []

  constructor(
    keypoints: TKeypoints,
    width: number,
    height: number,
    options?: HumanPoseOptions
  ) {
    const threshold = options?.threshold ?? 0.3

    this.points = keypoints.map(([y, x, score]) => {
      if (score >= threshold) {
        const mirroredX = 1 - x // Mirror the x-coordinate
        return new Point(mirroredX * width, y * height, options?.point)
      }
      return null
    })

    for (const [i, j] of adjacentPairs) {
      const p1 = this.points[i]
      const p2 = this.points[j]
      if (p1 && p2) {
        this.segments.push(new Segment(p1, p2, options?.segment))
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const segment of this.segments) {
      segment.draw(ctx)
    }
    for (const point of this.points) {
      if (point) {
        point.draw(ctx)
      }
    }
  }
}
