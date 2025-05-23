'use client'

import { TChoreography, TParsedChoreography, TProject, TSong } from '@/types'

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
  song,
  choreography,
}: {
  children: React.ReactNode
  project: TProject
  song: TSong | null
  choreography: TChoreography[] | null
}) => {
  return (
    <projectContext.Provider
      value={{
        projectId: project.id,
        projectName: project.project_name,
        song,
        choreography:
          choreography !== null
            ? choreography.map(c => ({
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
