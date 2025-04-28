import type { Keypoints, Pose, TrainingData } from '@/types'
import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'
import ShortUniqueID from 'short-unique-id'

const uid = new ShortUniqueID({ length: 4 })

export interface PoseTrainingState {
  poses: Pose[]
  trainingData: TrainingData
  isCapturing: boolean
  activeLabel: string
  isTraining: boolean
  startTime: number
  endTime: number
}

const initialState: PoseTrainingState = {
  poses: [],
  trainingData: [],
  isCapturing: false,
  activeLabel: '',
  isTraining: false,
  startTime: 0,
  endTime: 0,
}

export const poseTrainingSlice = createSlice({
  name: 'poseTraining',
  initialState,
  reducers: {
    addLabel: state => {
      state.poses.push({ label: 'Pose_' + uid.rnd(), numOfPosesCaptured: 0 })
    },
    removeLabel: (state, action: PayloadAction<string>) => {
      state.poses = state.poses.filter(pose => pose.label !== action.payload)
      state.trainingData = state.trainingData.filter(
        data => data.label !== action.payload
      )
    },
    editLabel: (
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

    importPoses: (state, action: PayloadAction<TrainingData>) => {
      const poses: Pose[] = []

      action.payload.forEach(pose => {
        const existingPose = poses.find(p => p.label === pose.label)

        if (existingPose) {
          existingPose.numOfPosesCaptured += 1
        } else {
          poses.push({
            label: pose.label,
            numOfPosesCaptured: 1,
          })
        }
      })

      state.poses = poses
      state.trainingData = action.payload
    },

    startCapturing: (state, action: PayloadAction<string>) => {
      state.activeLabel = action.payload
      state.isCapturing = true
    },
    stopCapturing: state => {
      state.isCapturing = false
    },
    capturePoses: (state, action: PayloadAction<Keypoints[]>) => {
      const poseIndex = state.poses.findIndex(
        pose => pose.label === state.activeLabel
      )

      if (poseIndex !== -1)
        state.poses[poseIndex].numOfPosesCaptured += action.payload.length

      action.payload.forEach(keypoints => {
        state.trainingData.push({
          label: state.activeLabel,
          keypoints,
        })
      })
    },

    startTraining: state => {
      state.isTraining = true
      state.startTime = Date.now()
    },
    stopTraining: state => {
      state.isTraining = false
      state.endTime = Date.now()
    },
  },
})

export const {
  addLabel,
  removeLabel,
  editLabel,
  importPoses,
  startCapturing,
  stopCapturing,
  capturePoses,
  startTraining,
  stopTraining,
} = poseTrainingSlice.actions
export default poseTrainingSlice.reducer
