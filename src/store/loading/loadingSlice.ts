import { createSlice } from '@reduxjs/toolkit'

interface initialLoadingStateType {
  isLoading: boolean
}

const initialState: initialLoadingStateType = {
  isLoading: false,
}

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    doLoading(state: initialLoadingStateType) {
      state.isLoading = true
    },
    doLoadingSuccess(state: initialLoadingStateType) {
      state.isLoading = false
    },
    doLoadingFailure(state: initialLoadingStateType) {
      state.isLoading = false
    },
  },
})

export const loadingActions = loadingSlice.actions
export default loadingSlice.reducer
