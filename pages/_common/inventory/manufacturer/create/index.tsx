//Api
import { postManufacturers } from './apiCreate'

//model
import { AddManufactureType } from './modelCreate'

// react-hook-form

import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { useRouter } from 'next/router'
import CreateUpdateComponent from '../_createUpdateComponent'
import { useTranslation } from 'next-i18next'

const CreateManufacturerComponent = () => {
  const { t } = useTranslation('manufacturer')
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()

  // event submit
  const onSubmit = (values: AddManufactureType) => {
    postManufacturers(values)
      .then(() => {
        pushMessage(
          t('message.productManufacturerHasBeenCreatedSuccessfully'),
          'success'
        )
        router.push(`/${platform().toLowerCase()}/inventory/manufacturer/list/`)
      })
      .catch(({ response }) => {
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

export default CreateManufacturerComponent
