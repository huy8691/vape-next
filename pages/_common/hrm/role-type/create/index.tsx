import { useRouter } from 'next/router'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { CreateRoleAPI } from './apiCreateRoleType'
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import CreateUpdateComponent from '../_createUpdateComponent'
import { useTranslation } from 'react-i18next'

const CreateRoleType = () => {
  const { t } = useTranslation('role-type')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()

  // const [stateRoleList, setStateRoleList] = useState<ListRoleDataResponseType>()

  const onSubmit = (data: any) => {
    CreateRoleAPI(data)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        router.push(`/${platform().toLowerCase()}/hrm/role-type/list`)
        pushMessage(
          t('message.theRoleTypeHasBeenCreatedSuccessfully'),
          'success'
        )
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  return (
    <>
      <CreateUpdateComponent handleSubmit={(value) => onSubmit(value)} />
    </>
  )
}

export default CreateRoleType
