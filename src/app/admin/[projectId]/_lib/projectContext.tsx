'use client'

import { TProject } from '../../_types'

import React, { createContext, useContext } from 'react'

type Song = {
  id: number
  name: string
  duration: number
  url: string
}

type Model = {
  id: number
  accuracy: number
  labels: string[]
  url: string
}

interface ProjectState {
  projectId: number
  projectName: string
  posesEvents: { start: number; end: number; label: string }[]
  song: Song | null
  model: Model | null
}

const initialState: ProjectState = {
  projectId: 0,
  projectName: '',
  posesEvents: [],
  song: null,
  model: null,
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
        //@ts-ignore
        posesEvents: JSON.parse(project.poses_events),
        song: project.songs
          ? {
              id: project.songs.id,
              name: project.songs.song_name,
              duration: project.songs.duration_in_seconds,
              url: project.songs.song_public_url,
            }
          : null,
        model: project.models
          ? {
              id: project.models.id,
              accuracy: project.models.accuracy,
              labels: project.models.labels,
              url: project.models.model_url,
            }
          : null,
      }}
    >
      {children}
    </projectContext.Provider>
  )
}

export const useProjectDetails = () => useContext(projectContext)
