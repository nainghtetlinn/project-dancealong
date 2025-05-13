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
