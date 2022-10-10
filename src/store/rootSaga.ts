import { all } from 'redux-saga/effects'
import loginSaga from 'pages/login/loginSaga'
import registerSaga from 'pages/register/registerSaga'
import loadingSaga from './loading/loadingSaga'
import userInfoSaga from './userInfo/userInfoSaga'
function* rootSaga() {
  try {
    yield all([loginSaga(), registerSaga(), loadingSaga(), userInfoSaga()])
  } catch (err) {
    console.trace(err)
  }
}
export default rootSaga
