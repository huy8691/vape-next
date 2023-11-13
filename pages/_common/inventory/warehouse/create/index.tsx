import { useRouter } from 'next/router'
import { NextPageWithLayout } from 'pages/_app.page'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { CreateWarehouseApi } from './apiWarehouse'
import { CreateWarehouseType } from './warehouseModel'

import CreateUpdateWarehouse from '../_createUpdateComponent'
import { useTranslation } from 'next-i18next'

const CreateWarehouseComponent: NextPageWithLayout = () => {
  const { t } = useTranslation('warehouse')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()

  const onSubmit = (data: CreateWarehouseType) => {
    const warehouseCreated: CreateWarehouseType = {
      name: data.name,
      address: data.address ? data.address : null,
      description: data.description ? data.description : null,
      city: data.city,
      postal_zipcode: data.postal_zipcode,
      state: data.state,
    }
    dispatch(loadingActions.doLoading())

    CreateWarehouseApi(warehouseCreated)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(
          t('message.theWarehouseHasBeenCreatedSuccessfully'),
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
      <CreateUpdateWarehouse handleSubmit={(values) => onSubmit(values)} />
    </>
  )
}

export default CreateWarehouseComponent
