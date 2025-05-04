export type TSong = {
  id: number
  created_at: string
  song_name: string
  duration_in_seconds: number
  song_public_url: string
}

export type TProject = {
  id: number
  created_at: string
  project_name: string
  model_url: string | null
  song_id: number | null
  songs: TSong | null
}
