import type { ModelFitArgs, Sequential } from '@tensorflow/tfjs'
import type { AppThunk } from '../index'

import { createModel } from '@/lib/model'
import { startCountdown, startCountdownWithDisplay } from './counterThunk'
import {
  startCapturing,
  startTraining,
  stopCapturing,
  stopTraining,
} from './poseTrainingSlice'

export const startTimedCapture =
  (label: string): AppThunk<Promise<void>> =>
  async dispatch => {
    await dispatch(startCountdownWithDisplay())

    dispatch(startCapturing(label))

    await dispatch(startCountdown())

    dispatch(stopCapturing())
  }

export const trainModel =
  (
    options: ModelFitArgs
  ): AppThunk<
    Promise<{
      labels: string[]
      model: Sequential
    }>
  > =>
  async (dispatch, getState) => {
    dispatch(startTraining())

    const result = await createModel(getState().training.trainingData, options)

    dispatch(stopTraining())

    return result
  }
