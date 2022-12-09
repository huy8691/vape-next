import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserInfoResponseType, UserInfoType } from './userInfoModels'

interface initialUserInfoStateType {
  data: UserInfoType
}

const initialState: initialUserInfoStateType = {
  data: {
    phone_number: '',
    email: '',
    first_name: '',
    last_name: '',
    gender: '',
    dob: '',
    avatar: '',
    address: '',
    user_type: '',
  },
}

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    doUserInfo(state: initialUserInfoStateType) {
      state.data
    },
    doUserInfoSuccess(
      state: initialUserInfoStateType,
      action: PayloadAction<UserInfoResponseType>
    ) {
      const { data }: UserInfoResponseType = action.payload
      if (data) {
        state.data = data
      }
    },
    doUserInfoFailure(state: initialUserInfoStateType) {
      state.data
    },
  },
})

export const userInfoActions = userInfoSlice.actions
export default userInfoSlice.reducer
