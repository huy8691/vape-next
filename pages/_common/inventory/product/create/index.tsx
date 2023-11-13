import { loadingActions } from 'src/store/loading/loadingSlice'
import { createProductApi, createProductVariantApi } from './apiAddProduct'
import React, { useState } from 'react'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import CreateUpdateComponent from '../_createUpdateComponent'

import { useRouter } from 'next/router'
import { useAppDispatch } from 'src/store/hooks'
import { platform } from 'src/utils/global.utils'
import { useTranslation } from 'react-i18next'

const CreateProductComponent = () => {
  const { t } = useTranslation('product')
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()
  const dispatch = useAppDispatch()
  const [errorApi, setErrorApi] = useState(0)

  const onSubmit = (values: any, hasVariant: boolean) => {
    // dispatch(loadingActions.doLoading())

    if (hasVariant) {
      createProductVariantApi(values)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(
            t('createUpdate.message.createProductSuccessfully'),
            'success'
          )
          router.push(`/${platform().toLowerCase()}/inventory/product/list`)
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
          setErrorApi((current) => current + 1)
        })
    } else {
      createProductApi(values)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(
            t('createUpdate.message.createProductSuccessfully'),
            'success'
          )
          router.push(`/${platform().toLowerCase()}/inventory/product/list`)
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
          setErrorApi((current) => current + 1)
        })
    }
  }

  return (
    <>
      <CreateUpdateComponent
        handleSubmit={(values, hasBoolean) => {
          onSubmit(values, hasBoolean)
        }}
        errorApi={errorApi}
      />
    </>
  )
}

export default CreateProductComponent
