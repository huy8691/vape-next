import { useEffect, useState } from 'react'
import { UpdateSellerDataType } from './sellerModel'

import { useRouter } from 'next/router'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import CreateUpdateUserComponent from '../_createUpdateComponent'
import { getDetailSeller, updateSeller } from './apiSeller'
import { useTranslation } from 'react-i18next'

const UpdateUserComponent = () => {
  const { t } = useTranslation('user-management')
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [stateStaffDetail, setStateStaffDetail] =
    useState<UpdateSellerDataType>()
  useEffect(() => {
    dispatch(loadingActions.doLoading())
    if (router.query.id) {
      getDetailSeller(Number(router.query.id))
        .then((res) => {
          const { data } = res.data
          console.log('detail seller', data)
          setStateStaffDetail(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
          dispatch(loadingActions.doLoadingFailure())
          if (status === 404) {
            router.push('/404')
          }
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const onSubmit = (value: UpdateSellerDataType) => {
    updateSeller(Number(router.query.id), value)
      .then(() => {
        pushMessage(t('message.updateStaffSuccessfully'), 'success')
        platform() === 'SUPPLIER' &&
          router.push('/supplier/hrm/user-management/list')
        platform() === 'RETAILER' &&
          router.push('/retailer/hrm/user-management/list')
      })
      .catch((response) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <>
      <CreateUpdateUserComponent
        update
        userDetail={stateStaffDetail}
        handleSubmit={(value: UpdateSellerDataType) => onSubmit(value)}
      />
    </>
  )
}

export default UpdateUserComponent
