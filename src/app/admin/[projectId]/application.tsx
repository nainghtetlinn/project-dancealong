import { TProject } from '@/types'

import Studio from './_components/Studio'
import { ProjectDetailsProvider } from './_lib/projectContext'
import { AudioProvider } from './_lib/audioContext'

export default function Application({ project }: { project: TProject }) {
  return (
    <ProjectDetailsProvider project={project}>
      <AudioProvider
        songUrl={project.songs?.audio_url || null}
        songTitle={project.songs?.title || null}
      >
        <Studio />
      </AudioProvider>
    </ProjectDetailsProvider>
  )
}
