import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import CreateUpdateComponent from '../_createUpdateComponent'
import { getCategoryDetail, updateCategory } from './apiUpdateCategory'
import { categoryTypeData, UpdateCategoryType } from './modelCategories'
import { useTranslation } from 'next-i18next'

const UpdateCategoryComponent = () => {
  const { t } = useTranslation('category')
  const [pushMessage] = useEnqueueSnackbar()

  const router = useRouter()
  const dispatch = useAppDispatch()
  const [stateCategory, setStateCategory] = useState<categoryTypeData>()
  const [stateParentCategoryTextField, setStateParentCategoryTextField] =
    useState<boolean>(false)

  //Get Detail Category

  useEffect(() => {
    // if (router.asPath.length !== router.pathname.length) {
    //   if (!isEmptyObject(router.query)) {
    //     handlerGetDetailCategory(router.query)
    //   }
    // } else {
    //   handlerGetDetailCategory({})
    // }
    if (router.query.id) {
      console.log(router.query.id)
      getCategoryDetail(Number(router.query.id))
        .then((res) => {
          const { data } = res.data
          if (data?.child_category.length === 0) {
            setStateParentCategoryTextField(true)
          }
          setStateCategory(data)
          // setValue('name', data?.name as string)
          // if (data?.parent_category == null) return
          // setValue('parent_category', data?.parent_category.id as number)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(({ response }) => {
          const { status, data } = response
          dispatch(loadingActions.doLoadingFailure())
          pushMessage(handlerGetErrMessage(status, data), 'error')
          if (status === 404) {
            router.push('/404')
          }
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.query])

  const onSubmit = (data: UpdateCategoryType) => {
    dispatch(loadingActions.doLoading())

    updateCategory(data, router?.query?.id)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())

        pushMessage(
          t('message.productCategoryHasBeenUpdatedSuccessfully'),
          'success'
        )
        router.push(`/${platform().toLowerCase()}/inventory/category/list/`)
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  return (
    <>
      <CreateUpdateComponent
        handleSubmit={(value) => onSubmit(value)}
        stateCateId={stateCategory}
        update
        stateCateTextField={stateParentCategoryTextField}
      />
    </>
  )
}

export default UpdateCategoryComponent
