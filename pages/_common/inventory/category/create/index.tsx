import { useRouter } from 'next/router'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { addCategories } from './apiCategories'
import { AddCategoryType } from './modelProductCategories'

import CreateUpdateComponent from '../_createUpdateComponent'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useTranslation } from 'next-i18next'

const CreateCategoriesComponent = () => {
  const { t } = useTranslation('category')
  const [pushMessage] = useEnqueueSnackbar()
  // state use for list cata
  const router = useRouter()
  const dispatch = useAppDispatch()

  //
  const onSubmit = (values: AddCategoryType) => {
    dispatch(loadingActions.doLoading())
    addCategories(values)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(
          t('message.productCategoryHasBeenCreatedSuccessfully'),
          'success'
        )
        router.push(`/${platform().toLowerCase()}/inventory/category/list/`)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')

        dispatch(loadingActions.doLoadingFailure())
      })
  }
  return (
    <>
      <CreateUpdateComponent
        handleSubmit={(value) => {
          onSubmit(value)
        }}
      />
    </>
  )
}

export default CreateCategoriesComponent
