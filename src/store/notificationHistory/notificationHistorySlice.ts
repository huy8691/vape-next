/**
 * @Copyright 2020, Exnodes. All Rights Reserved.
 * @date 2022/02/08 21:48
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { notificationHistoryResponseType } from './notificationHistoryModels'

const initialState: {
  unRead: number
} = {
  unRead: 0,
}

const notificationHistorySlice = createSlice({
  name: 'notificationHistory',
  initialState,
  reducers: {
    doNotificationHistory(state) {
      state.unRead
    },
    doNotificationHistorySuccess(
      state,
      action: PayloadAction<notificationHistoryResponseType>
    ) {
      const { data } = action.payload
      state.unRead = data.unRead
    },
    doNotificationHistoryFailure(state) {
      state.unRead
    },
  },
})

export const notificationHistoryActions = notificationHistorySlice.actions
export default notificationHistorySlice.reducer
