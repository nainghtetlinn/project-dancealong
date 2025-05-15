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
  choreography: TChoreography[]
  created_at: string
}

export type TChoreography = {
  id: string
  keypoints_json: string
  timestamp: number
  image_url: string | null
  is_key_pose: boolean
  song_id: string
}

export type TParsedChoreography = {
  id: string
  keypoints: TKeypoints
  timestamp: number
  image_url: string | null
  is_key_pose: boolean
  song_id: string
}
