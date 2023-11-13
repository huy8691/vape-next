import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import CreateUpdateWarehouse from '../_createUpdateComponent'
import { getWarehouseDetailApi, updateWarehouseApi } from './apiWarehouse'
import { WarehouseDetailType } from './warehouseModel'
import { useTranslation } from 'next-i18next'

const UpdateWarehouseComponent = () => {
  const { t } = useTranslation('warehouse')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateWarehouseDetail, setStateWarehouseDetail] =
    useState<WarehouseDetailType>()

  useEffect(() => {
    if (router.query.id) {
      getWarehouseDetailApi(Number(router.query.id))
        .then((res) => {
          const { data } = res.data
          dispatch(loadingActions.doLoadingSuccess())
          setStateWarehouseDetail(data)
        })
        .catch(({ response }) => {
          const { status, data } = response
          dispatch(loadingActions.doLoadingFailure())

          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const onSubmit = (data: WarehouseDetailType) => {
    dispatch(loadingActions.doLoading())

    updateWarehouseApi(Number(router.query.id), data)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(
          t('message.theWarehouseHasBeenUpdatedSuccessfully'),
          'success'
        )
        router.push(`/${platform().toLowerCase()}/inventory/warehouse/list`)
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <>
      <CreateUpdateWarehouse
        update
        warehouseDetail={stateWarehouseDetail}
        handleSubmit={(value) => {
          onSubmit(value)
        }}
      />
    </>
  )
}

export default UpdateWarehouseComponent
