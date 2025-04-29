export type TrainingData = {
  id: string
  keypoints: number[][]
  label: string
}[]

export type Pose = {
  label: string
  numOfPosesCaptured: number
}

export type Region = {
  id: string
  content: string
  start: number
  end: number
}

/**
 * @summary 17 keypoints with x, y, and confidence
 * @description [y, x, score][]
 */
export type Keypoints = number[][]
