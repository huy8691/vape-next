import { takeLatest } from 'redux-saga/effects'
import { loadingActions } from './loadingSlice'

function* handleLoading() {}
function* loadingSaga() {
  yield takeLatest(loadingActions.doLoading.type, handleLoading)
}
export default loadingSaga
