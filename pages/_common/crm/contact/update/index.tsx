import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import CreateUpdateComponent from '../_createUpdateComponent'
import { getContactDetail, getTypeOfLeadApi, updateContact } from './contactApi'
import { ContactUpdateType } from './contactModel'
import { useTranslation } from 'next-i18next'

const UpdateContact: React.FC = () => {
  const { t } = useTranslation('contact')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateContactDetail, setStateContactDetail] =
    useState<ContactUpdateType>()
  const [dataTypeOfLead, setDataTypeOfLead] =
    useState<{ id: number; name: string }[]>()
  const idContact = useMemo(() => Number(router.query.id), [router.query.id])

  useEffect(() => {
    if (idContact) {
      dispatch(loadingActions.doLoading())
      getContactDetail(idContact)
        .then((res) => {
          const { data } = res.data
          dispatch(loadingActions.doLoadingSuccess())
          setStateContactDetail(data)
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const onSubmit = (data: ContactUpdateType) => {
    dispatch(loadingActions.doLoading())
    updateContact(idContact, data)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(t('message.updateSuccessfully'), 'success')
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
        dataTypeOfLead={dataTypeOfLead}
        contactDetails={stateContactDetail}
        handleSubmit={(values) => {
          onSubmit(values)
        }}
        update
      />
    </>
  )
}

export default UpdateContact
