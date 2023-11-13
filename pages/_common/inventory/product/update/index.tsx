import { useEffect, useState } from 'react'
import UpdateComponent from '../_updateComponent'
import { ProductDetailType, UpdateProductDataType } from './updateProductModel'

import { useRouter } from 'next/router'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { getProductDetail, updateProductApi } from './apiUpdateProduct'
// import ModalAddNewBrand from './parts/ModalAddNewBrand'
import { platform } from 'src/utils/global.utils'
import { useTranslation } from 'react-i18next'

const UpdateProductComponent = () => {
  const { t } = useTranslation('product')
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [stateProductDetail, setStateProductDetail] =
    useState<ProductDetailType>()

  const onSubmit = (values: UpdateProductDataType) => {
    dispatch(loadingActions.doLoading())
    updateProductApi(values, Number(router.query.id))
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(
          t('createUpdate.message.updateProductSuccessfully'),
          'success'
        )
        // router.push(`/${platform().toLowerCase()}/inventory/product/list`)
        router.push(
          `/${platform().toLowerCase()}/inventory/product/product-template/${Number(
            router.query.id
          )}`
        )
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  useEffect(() => {
    if (router.query.id) {
      getProductDetail(router.query.id)
        .then((res) => {
          const { data } = res.data
          console.log('data', data)
          if (!data?.is_owner) {
            router.replace('/404')
          }
          setStateProductDetail(data)
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
          if (status === 404) {
            router.push('/404')
          }
          dispatch(loadingActions.doLoadingFailure())
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id])

  return (
    <>
      <UpdateComponent
        productDetail={stateProductDetail}
        handleSubmitProps={(values) => {
          onSubmit(values)
        }}
        update
      />
    </>
  )
}

export default UpdateProductComponent
