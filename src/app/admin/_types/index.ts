export type TSong = {
  id: number
  created_at: string
  song_name: string
  duration_in_seconds: number
  song_public_url: string
}

export type TModel = {
  id: number
  created_at: string
  labels: string[]
  accuracy: number
  model_url: string
}

export type TProject = {
  id: number
  created_at: string
  project_name: string
  poses_events: { start: number; end: number; label: string }[]
  song_id: number | null
  songs: TSong | null
  model_id: number | null
  models: TModel | null
}

export type TTrainingData = {
  id: string
  keypoints: number[][]
  label: string
}[]

export type TLabel = {
  name: string
  count: number
}

export type TSettings = {
  epochs: number
  batchSize: number
  validationSplit: number
}

export type TKeypoints = number[][]
