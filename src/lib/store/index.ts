import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import counterReducer from './_features/counterSlice'
import poseRegionReducer from './_features/poseRegionSlice'
import poseTrainingReducer from './_features/poseTrainingSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      region: poseRegionReducer,
      counter: counterReducer,
      training: poseTrainingReducer,
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
