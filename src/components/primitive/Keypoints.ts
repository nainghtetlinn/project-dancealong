import { TKeypoints } from '@/types'

export default class Keypoints {
  private keypoints: TKeypoints

  constructor(keypoints: TKeypoints) {
    this.keypoints = keypoints
  }

  getKeypoints(): TKeypoints {
    return this.keypoints
  }

  public compareTo(
    other: Keypoints | TKeypoints,
    threashold: number = 0.3
  ): number {
    const norm1 = Keypoints.normalize(this.keypoints)
    const norm2 =
      other instanceof Keypoints
        ? Keypoints.normalize(other.getKeypoints())
        : Keypoints.normalize(other)

    let totalWeight = 0
    let weightedDistSum = 0

    for (let i = 0; i < norm1.length; i++) {
      const score1 = norm1[i][2] || 0
      const score2 = norm2[i][2] || 0

      if (score2 < threashold) continue

      const dx = norm1[i][0] - norm2[i][0]
      const dy = norm1[i][1] - norm2[i][1]
      const dist = Math.hypot(dx, dy)

      const weight = score2

      const penalty = score1 < threashold ? dist * 2 : dist

      weightedDistSum += penalty * weight
      totalWeight += weight
    }

    if (totalWeight === 0) return 0

    const avgDist = weightedDistSum / totalWeight
    const similarity = 1 - Math.min(avgDist, 2) // clamp so it stays in [0,1]

    return similarity
  }

  static normalize(keypoints: TKeypoints) {
    console.log('before', keypoints.toString())
    const leftHip = keypoints[11]
    const rightHip = keypoints[12]
    const center = [
      (leftHip[1] + rightHip[1]) / 2,
      (leftHip[0] + rightHip[0]) / 2,
    ]

    const shifted = keypoints.map(([y, x, score]) => [
      x - center[0],
      y - center[1],
      score,
    ])

    const leftShoulder = shifted[5]
    const rightShoulder = shifted[6]
    const shoulderDist =
      Math.hypot(
        leftShoulder[0] - rightShoulder[0],
        leftShoulder[1] - rightShoulder[1]
      ) || 1e-6 // prevent divide by zero

    const result = shifted.map(([x, y, score]) => [
      x / shoulderDist,
      y / shoulderDist,
      score,
    ])

    console.log('after', result.toString())

    return result
  }
}
