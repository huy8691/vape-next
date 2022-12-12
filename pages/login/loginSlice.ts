import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { setAuthToken } from 'src/services/jwt-axios'
import { LoginResponseType, LoginType } from './loginModels'

interface initialLoginStateType {
  data: {
    access_token: string
  }
}

// Khởi tạo state cho slice, có thể kèm giá trị mặc định ban đầu
const initialState: initialLoginStateType = {
  data: {
    access_token: '',
  },
}

// Cấu hình slice
const loginSlice = createSlice({
  name: 'login', // Tên của slice, mỗi slice đặt 1 tên khác nhau để phân biệt
  initialState,
  // Reducers chứa các hàm xử lý cập nhật state
  reducers: {
    doLogin(state: initialLoginStateType, _action: PayloadAction<LoginType>) {
      state.data.access_token = ''
    },
    doLoginSuccess(
      state: initialLoginStateType,
      action: PayloadAction<LoginResponseType>
    ) {
      const { data }: LoginResponseType = action.payload
      if (state.data) {
        state.data.access_token = data.access_token
      }
      setAuthToken(data.access_token, data.refresh_token)
    },
    doLoginFailure(state: initialLoginStateType) {
      state.data.access_token = ''
    },
    doLogout(state: initialLoginStateType) {
      state.data.access_token = ''
    },
  },
})

// Export action ra để sử dụng cho tiện.
export const loginActions = loginSlice.actions
// Action là 1 hàm trả về object dạng {type, payload}, chạy thử console.log(login()) để xem chi tiết

// Export reducer để nhúng vào Store
export default loginSlice.reducer
