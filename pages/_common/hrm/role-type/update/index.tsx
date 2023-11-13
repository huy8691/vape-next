import { useRouter } from 'next/router'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { updateRoleAPI } from './apiCreateRoleType'

import CreateUpdateComponent from '../_createUpdateComponent'
import { useTranslation } from 'next-i18next'

const UpdateRoleType = () => {
  const { t } = useTranslation('role-type')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()

  const onSubmit = (data: any) => {
    updateRoleAPI(Number(router.query.id), data)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        router.push(`/${platform().toLowerCase()}/hrm/role-type/list`)

        pushMessage(
          t('message.theRoleTypeHasBeenUpdatedSuccessfully'),
          'success'
        )
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  // const defaultChecked = (id) => {}

  return (
    <CreateUpdateComponent handleSubmit={(value) => onSubmit(value)} update />
  )
}

export default UpdateRoleType
