import type { Keypoints, Pose, TrainingData } from '@/types'
import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'
import ShortUniqueID from 'short-unique-id'

const uid = new ShortUniqueID({ length: 6 })

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
      const pose = state.poses.find(pose => pose.label === label)
      if (pose) {
        pose.label = newLabel
      }
      state.trainingData.forEach(data => {
        if (data.label === label) {
          data.label = newLabel
        }
      })
    },

    importPoses: (state, action: PayloadAction<TrainingData>) => {
      const posesToImport: Pose[] = []

      action.payload.forEach(pose => {
        const existingPose = posesToImport.find(p => p.label === pose.label)

        if (existingPose) {
          existingPose.numOfPosesCaptured += 1
        } else {
          posesToImport.push({
            label: pose.label,
            numOfPosesCaptured: 1,
          })
        }
      })

      state.poses = posesToImport
      state.trainingData = action.payload
    },

    startCapturing: (state, action: PayloadAction<string>) => {
      state.activeLabel = action.payload
      state.isCapturing = true
    },
    stopCapturing: state => {
      // It's important not to clear the activeLabel because later capturePoses will be called.
      state.isCapturing = false
    },
    capturePoses: (state, action: PayloadAction<Keypoints[]>) => {
      const pose = state.poses.find(pose => pose.label === state.activeLabel)

      if (pose) pose.numOfPosesCaptured += action.payload.length

      state.trainingData = action.payload.map(keypoints => ({
        id: uid.rnd(),
        label: state.activeLabel,
        keypoints,
      }))
    },
    removePose: (state, action: PayloadAction<string>) => {
      let label: string
      state.trainingData = state.trainingData.filter(data => {
        if (data.id === action.payload) label = data.label
        return data.id !== action.payload
      })
      const pose = state.poses.find(pose => pose.label === label)
      if (pose) pose.numOfPosesCaptured -= 1
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
  removePose,
  startTraining,
  stopTraining,
} = poseTrainingSlice.actions
export default poseTrainingSlice.reducer
