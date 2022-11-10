import { AxiosResponse } from 'axios'
import { call, put, takeLatest } from 'redux-saga/effects'
import { getCartAPI } from './cartAPI'
import { CartResponseType } from './cartModels'
import { cartActions } from './cartSlice'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'

function* handleInfoSaga() {
  try {
    yield put(loadingActions.doLoading())
    const { data }: AxiosResponse<CartResponseType> = yield call(getCartAPI)
    yield put(cartActions.doCartSuccess(data))
    yield put(loadingActions.doLoadingSuccess())
  } catch (error: any) {
    yield put(cartActions.doCartFailure())
    yield put(loadingActions.doLoadingFailure())
    yield put(
      notificationActions.doNotification({
        message: error.response.data.message,
        type: 'error',
      })
    )
  }
}

function* cartSaga() {
  yield takeLatest(cartActions.doCart.type, handleInfoSaga)
}

export default cartSaga
