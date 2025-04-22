import { createModel } from '@/lib/model'
import { AppThunk } from '../index'
import { startCountdown } from './counterThunk'
import {
  startCapturing,
  stopCapturing,
  startTraining,
  stopTraining,
} from './poseTrainingSlice'
import { Sequential } from '@tensorflow/tfjs'

export const startTimedCapture =
  (label: string): AppThunk =>
  async (dispatch, getState) => {
    await dispatch(startCountdown())

    dispatch(startCapturing(label))

    await dispatch(startCountdown())

    dispatch(stopCapturing())
  }

export const trainModel =
  (): AppThunk<
    Promise<{
      labels: string[]
      model: Sequential
    }>
  > =>
  async (dispatch, getState) => {
    dispatch(startTraining())

    const result = await createModel(getState().training.trainingData)

    dispatch(stopTraining())

    return result
  }
