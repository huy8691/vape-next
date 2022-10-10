/**
 * @Copyright 2020, Exnodes. All Rights Reserved.
 * @date 2022/02/08 21:48
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserInfoResponseType, UserInfoType } from './userInfoModels'

interface initialUserInfoStateType {
  data: UserInfoType
  isSuccess: boolean
}

const initialState: initialUserInfoStateType = {
  data: {
    avatar: '',
    email: '',
    fullName: '',
    id: 0,
    phoneNumber: '',
  },
  isSuccess: false,
}

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    doUserInfo(state: initialUserInfoStateType) {},
    doUserInfoSuccess(
      state: initialUserInfoStateType,
      action: PayloadAction<UserInfoResponseType>
    ) {
      const { data }: UserInfoResponseType = action.payload
      state.data = data
      state.isSuccess = true
    },
    doUserInfoFailure(state: initialUserInfoStateType) {
      state.isSuccess = false
    },
  },
})

export const userInfoActions = userInfoSlice.actions
export default userInfoSlice.reducer
