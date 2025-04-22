import { AppThunk } from '../index'
import { startCountdown } from './counterThunk'
import { startCapturing, stopCapturing } from './poseTrainingSlice'

export const startTimedCapture =
  (label: string): AppThunk =>
  async (dispatch, getState) => {
    await dispatch(startCountdown())

    dispatch(startCapturing(label))

    await dispatch(startCountdown())

    dispatch(stopCapturing())
  }
