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
export type TKeypoints = number[][]

export type TProject = {
  id: string
  project_name: string
  song_id: string | null
  songs: TSong | null
  created_at: string
}

export type TSong = {
  id: string
  title: string
  artist: string
  duration: number
  bpm: number
  audio_url: string
  created_at: string
}

export type TModel = {
  id: number
  created_at: string
  labels: string[]
  accuracy: number
  model_url: string
}
