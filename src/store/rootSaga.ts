import { all } from 'redux-saga/effects'
import loadingSaga from './loading/loadingSaga'
import userInfoSaga from './userInfo/userInfoSaga'
import cartSaga from './cart/cartSaga'
import notificationHistorySaga from './notificationHistory/notificationHistorySaga'
function* rootSaga() {
  try {
    yield all([
      loadingSaga(),
      userInfoSaga(),
      cartSaga(),
      notificationHistorySaga(),
    ])
  } catch (err) {
    console.trace(err)
  }
}
export default rootSaga
