/* eslint-disable react-hooks/exhaustive-deps */
//React/Next
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

//styles

//material

//Api
import { useAppDispatch } from 'src/store/hooks'
import { getManufacturerDetail, putManufacturers } from './apiUpdateDetail'

//model
import { manuTypeData } from './modelUpdateDetail'

// react-hook-form

import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import CreateUpdateComponent from '../_createUpdateComponent'
import { useTranslation } from 'next-i18next'

const UpdateManufacturerComponent = () => {
  const { t } = useTranslation('manufacturer')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateManuDetail, setStateManuDetail] = useState<manuTypeData>()

  // event submit
  const OnSubmitUpdate = (values: manuTypeData) => {
    dispatch(loadingActions.doLoading())
    putManufacturers(
      {
        name: values.name,
        logo: values.logo ? values.logo : null,
      },
      Number(router?.query?.id)
    )
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(
          t('message.productManufacturerHasBeenUpdatedSuccessfully'),
          'success'
        )
        router.push(`/${platform().toLowerCase()}/inventory/manufacturer/list/`)
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  useEffect(() => {
    if (router.query.id) {
      getManufacturerDetail(Number(router?.query?.id))
        .then((res) => {
          const { data } = res.data
          setStateManuDetail(data)
          dispatch(loadingActions.doLoadingSuccess())
        })

        .catch(({ response }) => {
          const { status, data } = response
          dispatch(loadingActions.doLoadingFailure())
          pushMessage(handlerGetErrMessage(status, data), 'error')
          if (status === 404) {
            router.push('/404')
          }
          dispatch(loadingActions.doLoadingFailure())
        })
    }
  }, [router.query.id])
  return (
    <>
      <CreateUpdateComponent
        manuDetail={stateManuDetail}
        handleSubmit={(value) => OnSubmitUpdate(value)}
        update
      />
    </>
  )
}

export default UpdateManufacturerComponent
