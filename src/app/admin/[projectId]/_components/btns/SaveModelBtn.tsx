//@ts-nocheck
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

import { uploadModel } from '@/app/admin/action'
import * as tf from '@tensorflow/tfjs'
import { useState } from 'react'
import { toast } from 'sonner'
import { useProjectDetails } from '../../_lib/projectContext'
import { useTraining } from '../../_lib/trainingContext'

export default function SaveModelBtn() {
  const { projectId } = useProjectDetails()
  const {
    accuracy,
    hasLocalTrained,
    localTrainedModel,
    localTrainedModelLabels,
    saveLocalModel,
  } = useTraining()

  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!localTrainedModel) return
    setLoading(true)

    const handler = tf.io.withSaveHandler(async modelArtifacts => {
      return {
        modelArtifactsInfo: {
          dateSaved: new Date(),
          modelTopologyType: 'JSON',
          modelTopologyBytes: JSON.stringify(modelArtifacts.modelTopology)
            .length,
          weightSpecsBytes: JSON.stringify(modelArtifacts.weightSpecs).length,
          weightDataBytes: modelArtifacts.weightData!.byteLength,
        },
        modelArtifacts: modelArtifacts,
      }
    })
    const saveResult = await localTrainedModel.save(handler)

    const { modelTopology, weightSpecs, weightData } = saveResult.modelArtifacts

    const modelJsonBlob = new Blob(
      [
        JSON.stringify({
          modelTopology,
          weightsManifest: [
            {
              paths: ['group1-shard1of1.bin'],
              weights: weightSpecs,
            },
          ],
        }),
      ],
      { type: 'application/json' }
    )

    const modelBinBlob = new Blob([weightData!], {
      type: 'application/octet-stream',
    })

    const formData = new FormData()
    formData.append('modelJson', modelJsonBlob, 'model.json')
    formData.append('modelBin', modelBinBlob, 'group1-shard1of1.bin')

    await uploadModel(formData, localTrainedModelLabels, accuracy, projectId)
    saveLocalModel()
    setLoading(false)
    toast.success('Model successfully uploaded.')
  }

  return (
    <Button
      size='sm'
      disabled={!hasLocalTrained || loading}
      onClick={handleSave}
    >
      Save Model {loading && <Loader2 className='animate-spin' />}
    </Button>
  )
}
