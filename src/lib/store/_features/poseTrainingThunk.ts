import { createModel } from '@/lib/model'
import { AppThunk } from '../index'
import { startCountdown } from './counterThunk'
import {
  startCapturing,
  stopCapturing,
  startTraining,
  stopTraining,
} from './poseTrainingSlice'
import { Sequential, ModelFitArgs } from '@tensorflow/tfjs'

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
    let trainablePoses = 0
    const poses = getState().training.poses
    poses.forEach(pose => {
      if (pose.numOfPosesCaptured > 0) trainablePoses++
    })

    if (trainablePoses !== poses.length)
      throw new Error('Not all poses have been captured')

    dispatch(startTraining())

    const result = await createModel(getState().training.trainingData, options)

    dispatch(stopTraining())

    return result
  }
