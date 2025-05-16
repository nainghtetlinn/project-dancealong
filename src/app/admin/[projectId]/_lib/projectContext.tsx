'use client'

import { type TParsedChoreography, type TProject, type TSong } from '@/types'

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
  project: TProject
}) => {
  return (
    <projectContext.Provider
      value={{
        projectId: project.id,
        projectName: project.project_name,
        song: project.songs,
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
