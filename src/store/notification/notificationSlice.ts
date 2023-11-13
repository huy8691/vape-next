import { createSlice, PayloadAction } from '@reduxjs/toolkit'
type type = 'success' | 'info' | 'warning' | 'error'

interface notificationType {
  message: string
  type?: type
}

const initialState: notificationType = {
  message: '',
  type: 'success',
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    doNotification: (
      state: notificationType,
      action: PayloadAction<notificationType>
    ) => {
      state.message = action.payload.message
      state.type = action.payload.type ? action.payload.type : 'success'
    },
  },
})

export const notificationActions = notificationSlice.actions
export default notificationSlice.reducer
