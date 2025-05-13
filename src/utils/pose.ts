import { TKeypoints } from '@/types'

export const interpolatePose = (
  kpA: TKeypoints,
  kpB: TKeypoints,
  tA: number,
  tB: number,
  tNow: number
) => {
  const percent = (tNow - tA) / (tB - tA)
  return kpA.map((kp, i) => [
    kp[0] + percent * (kpB[i][0] - kp[0]),
    kp[1] + percent * (kpB[i][1] - kp[1]),
    kp[2] + percent * (kpB[i][2] - kp[2]),
  ])
}

export const findPosePair = (
  choreography: { keypoints: TKeypoints; timestamp: number }[],
  tNow: number
) => {
  for (let i = 0; i < choreography.length - 1; i++) {
    const curr = choreography[i]
    const next = choreography[i + 1]
    if (curr.timestamp <= tNow && tNow <= next.timestamp) {
      return [curr, next]
    }
  }
  return null
}
