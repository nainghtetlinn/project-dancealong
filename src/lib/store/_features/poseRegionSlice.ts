import type { Region } from '@/types'
import type { PayloadAction } from '@reduxjs/toolkit'

import { createSlice } from '@reduxjs/toolkit'

export interface PoseRegionState {
  poseRegions: Region[]
}

const initialState: PoseRegionState = {
  poseRegions: [],
}

export const poseRegionSlice = createSlice({
  name: 'poseRegion',
  initialState,
  reducers: {
    addPoseRegion: (
      state,
      action: PayloadAction<{
        id: string
        content: string
        start: number
        end: number
      }>
    ) => {
      state.poseRegions.push(action.payload)
    },
    removePoseRegion: (state, action: PayloadAction<string>) => {
      state.poseRegions = state.poseRegions.filter(
        region => region.id !== action.payload
      )
    },
    updatePoseRegion: (
      state,
      action: PayloadAction<{
        id: string
        value: { start: number; end: number }
      }>
    ) => {
      const { id, value } = action.payload
      const region = state.poseRegions.find(region => region.id === id)
      if (region) {
        region.start = value.start
        region.end = value.end
      }
    },
    clearRegions: state => {
      state.poseRegions = []
    },
  },
})

export const {
  addPoseRegion,
  removePoseRegion,
  updatePoseRegion,
  clearRegions,
} = poseRegionSlice.actions
export default poseRegionSlice.reducer
