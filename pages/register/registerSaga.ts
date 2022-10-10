/**
 * @Copyright 2020, Exnodes. All Rights Reserved.
 * @date 2022/02/08 21:48
 */
import { AxiosResponse } from 'axios'
import { call, put, takeLatest } from 'redux-saga/effects'
import { registerApi } from './registerAPI'
import { RegisterResponseType } from './registerModels'
import { registerActions } from './registerSlice'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'

function* handleRegister({
  payload,
}: ReturnType<typeof registerActions.doRegister>) {
  try {
    yield put(loadingActions.doLoading())
    const { data }: AxiosResponse<RegisterResponseType> = yield call(
      registerApi,
      payload
    )
    yield put(registerActions.doRegisterSuccess(data))
    yield put(
      notificationActions.doNotification({
        message: 'Sign Up Success',
      })
    )
    yield put(loadingActions.doLoadingSuccess())

    setTimeout(function () {
      window.location.href = '/login'
    }, 3000)
  } catch (error: any) {
    const { data } = error.response
    yield put(registerActions.doRegisterFailure())
    yield put(loadingActions.doLoadingFailure())
    yield put(
      notificationActions.doNotification({
        message: data.message,
        type: 'error',
      })
    )
  }
}

function* registerSaga() {
  yield takeLatest(registerActions.doRegister.type, handleRegister)
}

export default registerSaga
