import { createSlice, PayloadAction } from '@reduxjs/toolkit'
type type = 'success' | 'info' | 'warning' | 'error'

interface notificationType {
  open?: boolean
  message: string
  duration?: number
  type?: type
}

const initialState: notificationType = {
  open: true,
  message: '',
  duration: 3000,
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
      state.open = !state.open
      state.message = action.payload.message
      state.duration = action.payload.duration ? action.payload.duration : 3000
      state.type = action.payload.type ? action.payload.type : 'success'
    },
  },
})

export const notificationActions = notificationSlice.actions
export default notificationSlice.reducer
