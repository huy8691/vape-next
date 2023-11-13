import loadingReducer from '../store/loading/loadingSlice'
import notificationReducer from '../store/notification/notificationSlice'
import emailChangePasswordReducer from '../store/emailChangePassword/emailChangePasswordSlice'
import workLogsReducer from '../store/workLogs/workLogsSlice'
import paymentTypeReducer from '../store/paymentMethodType/paymentMethodTypeSlice'
import userInfoSaga from '../store/userInfo/userInfoSlice'
import cartSaga from '../store/cart/cartSlice'
import permissionSaga from '../store/permission/permissionSlice'
import notificationHistorySaga from '../store/notificationHistory/notificationHistorySlice'
export const rootReducer = {
  loading: loadingReducer,
  notification: notificationReducer,
  userInfo: userInfoSaga,
  emailChangePassword: emailChangePasswordReducer,
  cart: cartSaga,
  permission: permissionSaga,
  notificationHistory: notificationHistorySaga,
  workLogs: workLogsReducer,
  paymentType: paymentTypeReducer,
}

export default rootReducer
