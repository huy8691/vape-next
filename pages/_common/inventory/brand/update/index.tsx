import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { getBrandDetail, updateBrand } from './apiUpdateBrand'
import { AddBrandType, brandTypeData } from './modelBrand'

import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import CreateUpdateComponent from '../_createUpdateComponent'
import { useTranslation } from 'next-i18next'

const UpdateBrandComponent = () => {
  const { t } = useTranslation('brand')
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [stateBrandDetail, setStateBrandDetail] = useState<brandTypeData>()
  //Update
  const OnSubmitUpdate = (values: AddBrandType) => {
    dispatch(loadingActions.doLoading())
    updateBrand(
      {
        name: values.name,
        logo: values.logo ? values.logo : null,
      },
      router?.query?.id
    )
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(
          t('createUpdate.message.productBrandHasBeenUpdatedSuccessfully'),
          'success'
        )
        router.push(`/${platform().toLowerCase()}/inventory/brand/list/`)
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  useEffect(() => {
    if (router.query.id) {
      dispatch(loadingActions.doLoading())

      getBrandDetail(Number(router.query.id))
        .then((res) => {
          const { data } = res.data
          setStateBrandDetail(data)
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
  }, [router.query])

  return (
    <>
      <CreateUpdateComponent
        brandDetail={stateBrandDetail}
        handleSubmit={(values) => OnSubmitUpdate(values)}
        update
      />
    </>
  )
}
UpdateBrandComponent.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export default UpdateBrandComponent
