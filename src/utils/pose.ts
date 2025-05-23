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

export const comparePoses = (
  player: TKeypoints,
  expected: TKeypoints,
  threashold: number = 0.3
): number => {
  const norm1 = normalizePose(player)
  const norm2 = normalizePose(expected)

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

function normalizePose(keypoints: TKeypoints) {
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

  return shifted.map(([x, y, score]) => [
    x / shoulderDist,
    y / shoulderDist,
    score,
  ])
}
