import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PermissionResponseType, PermissionType } from './permissionModels'

interface initialPermissionStateType {
  data: PermissionType[]
  success?: boolean
}

const initialState: initialPermissionStateType = {
  data: [],
  success: false,
}

const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    doPermission(state: initialPermissionStateType) {
      state.data
    },
    doPermissionSuccess(
      state: initialPermissionStateType,
      action: PayloadAction<PermissionResponseType>
    ) {
      state.data = action.payload.data
      state.success = action.payload.success
    },
    doPermissionFailure(state: initialPermissionStateType) {
      state.data
    },
    doPermissionClear(state: initialPermissionStateType) {
      state.data
    },
  },
})

export const permissionActions = permissionSlice.actions
export default permissionSlice.reducer
