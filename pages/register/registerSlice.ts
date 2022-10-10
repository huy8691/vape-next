import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RegisterType, RegisterResponseType } from './registerModels'

interface initialRegisterStateType {
  data: any
}

const initialState: initialRegisterStateType = {
  data: null,
}

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    doRegister(
      state: initialRegisterStateType,
      _action: PayloadAction<RegisterType>
    ) {},
    doRegisterSuccess(
      state: initialRegisterStateType,
      action: PayloadAction<RegisterResponseType>
    ) {
      const { data }: RegisterResponseType = action.payload
      state.data = data
    },
    doRegisterFailure(state: initialRegisterStateType) {},
  },
})

export const registerActions = registerSlice.actions
export default registerSlice.reducer
