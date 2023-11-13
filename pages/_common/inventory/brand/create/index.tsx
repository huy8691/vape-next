import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'

import { useRouter } from 'next/router'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import CreateUpdateComponent from '../_createUpdateComponent'
import { addBrand } from './apiBrand'
import { AddBrandType } from './brandModel'
import { platform } from 'src/utils/global.utils'
import { useTranslation } from 'next-i18next'

const CreateBrandComponent = () => {
  const { t } = useTranslation('brand')
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()
  // // state use for list cata
  const dispatch = useAppDispatch()

  //onSubmit create brand
  const OnSubmitCreate = (values: AddBrandType) => {
    dispatch(loadingActions.doLoading())
    addBrand(values)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(
          t('createUpdate.message.productBrandHasBeenCreatedSuccessfully'),
          'success'
        )
        router.push(`/${platform().toLowerCase()}/inventory/brand/list`)
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <>
      <CreateUpdateComponent
        handleSubmit={(values) => OnSubmitCreate(values)}
      />
    </>
  )
}

export default CreateBrandComponent
