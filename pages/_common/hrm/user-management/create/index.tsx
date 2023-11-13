import { CreateSellerDataType } from './sellerModel'
// import UploadImage from 'src/components/uploadImage'
// import dayjs from 'dayjs'
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { useRouter } from 'next/router'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { createSeller } from './apiSeller'

import CreateUpdateUserComponent from '../_createUpdateComponent'
import { useTranslation } from 'next-i18next'

const CreateUserComponent = () => {
  const { t } = useTranslation('user-management')
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()

  const onSubmit = (value: CreateSellerDataType) => {
    console.log('value from create update component', value)
    createSeller(value)
      .then(() => {
        pushMessage(t('message.theStaffHasBeenCreatedSuccessfully'), 'success')
        platform() === 'SUPPLIER' &&
          router.push('/supplier/hrm/user-management/list')
        platform() === 'RETAILER' &&
          router.push('/retailer/hrm/user-management/list')
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <>
      <CreateUpdateUserComponent handleSubmit={(value) => onSubmit(value)} />
    </>
  )
}

export default CreateUserComponent
