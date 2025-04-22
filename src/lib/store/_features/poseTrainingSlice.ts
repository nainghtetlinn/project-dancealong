import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { TPose } from '@/types/pose'
import { exportJSON } from '@/lib/utils'
import ShortUniqueID from 'short-unique-id'
import { createModel } from '@/lib/model'
import * as tf from '@tensorflow/tfjs'

const uid = new ShortUniqueID({ length: 4 })

export interface PoseTrainingState {
  poses: TPose[]
  trainingData: { keypoints: number[][]; label: string }[]
  isCapturing: boolean
  activeLabel: string
}

const initialState: PoseTrainingState = {
  poses: [],
  trainingData: [],
  isCapturing: false,
  activeLabel: '',
}

export const poseTrainingSlice = createSlice({
  name: 'poseTraining',
  initialState,
  reducers: {
    addPose: state => {
      state.poses.push({ label: 'Pose_' + uid.rnd(), numOfPosesCaptured: 0 })
    },
    removePose: (state, action: PayloadAction<string>) => {
      state.poses = state.poses.filter(pose => pose.label !== action.payload)
      state.trainingData = state.trainingData.filter(
        data => data.label !== action.payload
      )
    },
    editPose: (
      state,
      action: PayloadAction<{ label: string; newLabel: string }>
    ) => {
      const { label, newLabel } = action.payload
      const poseIndex = state.poses.findIndex(pose => pose.label === label)
      if (poseIndex !== -1) {
        state.poses[poseIndex].label = newLabel
      }
      state.trainingData.forEach(data => {
        if (data.label === label) {
          data.label = newLabel
        }
      })
    },

    startCapturing: (state, action: PayloadAction<string>) => {
      state.activeLabel = action.payload
      state.isCapturing = true
    },
    stopCapturing: state => {
      state.isCapturing = false
    },
    capturePoses: (state, action: PayloadAction<number[][][]>) => {
      const poseIndex = state.poses.findIndex(
        pose => pose.label === state.activeLabel
      )

      if (poseIndex !== -1)
        state.poses[poseIndex].numOfPosesCaptured = action.payload.length

      action.payload.forEach(keypoints => {
        state.trainingData.push({
          label: state.activeLabel,
          keypoints,
        })
      })
    },
  },
})

export const {
  addPose,
  removePose,
  editPose,
  startCapturing,
  stopCapturing,
  capturePoses,
} = poseTrainingSlice.actions
export default poseTrainingSlice.reducer
