export type TrainingData = { keypoints: number[][]; label: string }[]

export type Pose = {
  label: string
  numOfPosesCaptured: number
}

/**
 * @summary 17 keypoints with x, y, and confidence
 * @description [y, x, score][]
 */
export type Keypoints = number[][]
