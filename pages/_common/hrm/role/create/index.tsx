import { useRouter } from 'next/router'
import React from 'react'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import CreateUpdateComponent from '../_createUpdateComponent'
import { addrole } from './apiRole'
import { ValidateAddroleType } from './modelRole'
import { useTranslation } from 'next-i18next'

const CreateRoleComponent = () => {
  const { t } = useTranslation('role')
  const [pushMessage] = useEnqueueSnackbar()
  // state use for list cata
  const router = useRouter()
  const dispatch = useAppDispatch()
  const onSubmit = (values: ValidateAddroleType) => {
    dispatch(loadingActions.doLoading())
    addrole(values)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(t('message.roleHasBeenCreatedSuccessfully'), 'success')
        router.push(`/${platform().toLowerCase()}/hrm/role/list/`)
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
        handleSubmit={(value: any) => {
          onSubmit(value)
        }}
      />
    </>
  )
}

export default CreateRoleComponent
