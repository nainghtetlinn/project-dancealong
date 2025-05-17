'use client'

import {
  type TChoreography,
  type TParsedChoreography,
  type TProject,
  type TSong,
} from '@/types'

import React, { createContext, useContext } from 'react'

interface ProjectState {
  projectId: string
  projectName: string
  song: TSong | null
  choreography: TParsedChoreography[]
}

const initialState: ProjectState = {
  projectId: '',
  projectName: '',
  song: null,
  choreography: [],
}

const projectContext = createContext<ProjectState>(initialState)

export const ProjectDetailsProvider = ({
  children,
  project,
}: {
  children: React.ReactNode
  project: TProject & {
    songs: (TSong & { choreography: TChoreography[] }) | null
  }
}) => {
  return (
    <projectContext.Provider
      value={{
        projectId: project.id,
        projectName: project.project_name,
        song: project.songs
          ? {
              id: project.songs.id,
              title: project.songs.title,
              artist: project.songs.artist,
              audio_url: project.songs.audio_url,
              duration: project.songs.duration,
              bpm: project.songs.bpm,
              created_at: project.songs.created_at,
            }
          : null,
        choreography: project.songs
          ? project.songs.choreography.map(c => ({
              id: c.id,
              keypoints: JSON.parse(c.keypoints_json),
              timestamp: c.timestamp,
              image_url: c.image_url,
              is_key_pose: c.is_key_pose,
              song_id: c.song_id,
            }))
          : [],
      }}
    >
      {children}
    </projectContext.Provider>
  )
}

export const useProjectDetails = () => useContext(projectContext)
