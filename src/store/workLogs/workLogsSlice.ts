import { createSlice } from '@reduxjs/toolkit'

interface initialLoadingStateType {
  isRefresh: string
}

const initialState: initialLoadingStateType = {
  isRefresh: '',
}

const workLogs = createSlice({
  name: 'workLogs',
  initialState,
  reducers: {
    doRefresh(state: initialLoadingStateType) {
      state.isRefresh = '' + new Date().getTime()
    },
    doResetWorkLog(state: initialLoadingStateType) {
      state.isRefresh = ''
    },
  },
})

export const workLogsActions = workLogs.actions
export default workLogs.reducer
