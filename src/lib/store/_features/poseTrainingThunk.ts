import { createModel } from '@/lib/model'
import { ModelFitArgs, Sequential } from '@tensorflow/tfjs'
import { AppThunk } from '../index'
import { startCountdown } from './counterThunk'
import {
  startCapturing,
  startTraining,
  stopCapturing,
  stopTraining,
} from './poseTrainingSlice'

export const startTimedCapture =
  (label: string): AppThunk =>
  async (dispatch, getState) => {
    await dispatch(startCountdown())

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
