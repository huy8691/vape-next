import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import CreateUpdateComponent from '../_createUpdateComponent'
import { getRoleDetail, updateRoleApi } from './apiRole'
import { roleType, submitAddroleType } from './modelRole'
import { useTranslation } from 'next-i18next'

const UpdateRoleComponent = () => {
  const { t } = useTranslation('role')
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateRoleDetail, setStateRoleDetail] = useState<roleType>()
  useEffect(() => {
    if (router.query.id) {
      getRoleDetail(Number(router.query.id))
        .then((res) => {
          const { data } = res.data
          setStateRoleDetail(data)
        })
        .catch(({ response }) => {
          const { status, data } = response
          console.log('status,data', data)
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }, [router.query.id])
  const handleSubmit = (value: submitAddroleType) => {
    console.log('submitttt')
    updateRoleApi(value, Number(router.query.id))
      .then(() => {
        pushMessage(t('message.updateRoleSuccess'), 'success')
        router.push(`/${platform().toLowerCase()}/hrm/role/list`)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <>
      <CreateUpdateComponent
        handleSubmit={handleSubmit}
        update
        stateRoleDetail={stateRoleDetail}
      />
    </>
  )
}

export default UpdateRoleComponent
