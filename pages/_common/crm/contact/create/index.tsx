import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import {
  getListContactOption,
  getListContactStatus,
  getListContactType,
} from '../detail/apiContactDetail'
import { SingleChoiceDataResponseType } from '../detail/modelContactDetail'
import CreateUpdateComponent from '../_createUpdateComponent'
import { createContact, getSourceApi, getTypeOfLeadApi } from './contactApi'
import { Contact } from './contactModel'
import { useTranslation } from 'next-i18next'

const CreateContact: React.FC = () => {
  const { t } = useTranslation('contact')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()
  const [dataTypeOfLead, setDataTypeOfLead] =
    useState<{ id: number; name: string }[]>()
  const [dataSource, setDataSource] = useState<{ id: number; name: string }[]>()
  const [stateContactOption, setStateContactOption] =
    useState<SingleChoiceDataResponseType>()
  const [stateContactType, setStateContactType] =
    useState<SingleChoiceDataResponseType>()
  const [stateContacStatus, setStateContactStatus] =
    useState<SingleChoiceDataResponseType>()

  useEffect(() => {
    dispatch(loadingActions.doLoading())
    getSourceApi()
      .then((res) => {
        const { data } = res.data
        dispatch(loadingActions.doLoadingSuccess())
        setDataSource(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        if (status === 404) {
          router.push('/404')
        }
        dispatch(loadingActions.doLoadingFailure())
      })
    getTypeOfLeadApi()
      .then((res) => {
        const { data } = res.data
        dispatch(loadingActions.doLoadingSuccess())
        setDataTypeOfLead(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        if (status === 404) {
          router.push('/404')
        }
        dispatch(loadingActions.doLoadingFailure())
      })
    getListContactStatus()
      .then((res) => {
        const data = res.data
        dispatch(loadingActions.doLoadingSuccess())
        setStateContactStatus(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        if (status === 404) {
          router.push('/404')
        }
        dispatch(loadingActions.doLoadingFailure())
      })
    getListContactType()
      .then((res) => {
        const data = res.data
        dispatch(loadingActions.doLoadingSuccess())
        setStateContactType(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        if (status === 404) {
          router.push('/404')
        }
        dispatch(loadingActions.doLoadingFailure())
      })
    getListContactOption()
      .then((res) => {
        const data = res.data
        dispatch(loadingActions.doLoadingSuccess())
        setStateContactOption(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        if (status === 404) {
          router.push('/404')
        }
        dispatch(loadingActions.doLoadingFailure())
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const onSubmit = (data: Contact) => {
    console.log('data', data)
    dispatch(loadingActions.doLoading())
    createContact(data)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(t('message.theLeadHasBeenCreatedSuccessfully'), 'success')
        if (platform() === 'SUPPLIER') {
          router.push('/supplier/crm/contact/list')
        }
        if (platform() === 'RETAILER') {
          router.push('/retailer/crm/contact/list')
        }
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
        handleSubmit={(values) => {
          onSubmit(values)
        }}
        dataTypeOfLead={dataTypeOfLead}
        dataSource={dataSource}
        dataContactType={stateContactType?.data}
        dataSaleStatus={stateContacStatus?.data}
        dataContactOption={stateContactOption?.data}
      />
    </>
  )
}

export default CreateContact
