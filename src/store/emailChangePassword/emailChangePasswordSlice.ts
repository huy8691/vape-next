import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface emailChangePasswordType {
  email: string
  old_password: string
}

const initialState: emailChangePasswordType = {
  email: '',
  old_password: '',
}

const emailChangePasswordSlice = createSlice({
  name: 'emailChangePassword',
  initialState,
  reducers: {
    doEmailChangePassword: (
      state: emailChangePasswordType,
      action: PayloadAction<emailChangePasswordType>
    ) => {
      state.email = action.payload.email
      state.old_password = action.payload.old_password
    },
  },
})

export const emailChangePasswordActions = emailChangePasswordSlice.actions
export default emailChangePasswordSlice.reducer
