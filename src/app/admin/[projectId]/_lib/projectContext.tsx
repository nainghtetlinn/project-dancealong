'use client'

import { type TProject, type TSong, TKeypoints } from '@/types'

import React, { createContext, useContext } from 'react'

interface ProjectState {
  projectId: string
  projectName: string
  song: TSong | null
  choreography: { keypoints: TKeypoints; timestamp: number }[]
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
              keypoints: JSON.parse(c.keypoints_json),
              timestamp: c.timestamp,
            }))
          : [],
      }}
    >
      {children}
    </projectContext.Provider>
  )
}

export const useProjectDetails = () => useContext(projectContext)
