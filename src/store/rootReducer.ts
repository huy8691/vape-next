import loginReducer from 'pages/login/loginSlice'
import registerReducer from 'pages/register/registerSlice'
import loadingReducer from '../store/loading/loadingSlice'
import notificationReducer from '../store/notification/notificationSlice'
import userInfoSaga from '../store/userInfo/userInfoSlice'
export const rootReducer = {
  login: loginReducer,
  register: registerReducer,
  loading: loadingReducer,
  notification: notificationReducer,
  userInfo: userInfoSaga,
}

export default rootReducer
