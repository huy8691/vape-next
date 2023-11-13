import { AxiosResponse } from 'axios'
import { call, put, takeLatest } from 'redux-saga/effects'
import { getNotificationsNotRead } from './notificationHistoryAPI'
import { notificationHistoryActions } from './notificationHistorySlice'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
import { notificationHistoryResponseType } from './notificationHistoryModels'

function* handleInfoSaga() {
  try {
    yield put(loadingActions.doLoading())
    const { data }: AxiosResponse<notificationHistoryResponseType> = yield call(
      getNotificationsNotRead
    )
    yield put(notificationHistoryActions.doNotificationHistorySuccess(data))
    yield put(loadingActions.doLoadingSuccess())
  } catch (error: any) {
    yield put(notificationHistoryActions.doNotificationHistoryFailure())
    yield put(loadingActions.doLoadingFailure())
    yield put(
      notificationActions.doNotification({
        message: error.response.data.message,
        type: 'error',
      })
    )
  }
}

function* notificationHistorySaga() {
  yield takeLatest(
    notificationHistoryActions.doNotificationHistory.type,
    handleInfoSaga
  )
}

export default notificationHistorySaga
