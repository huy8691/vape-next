//React/Next

//styles
import {
  ButtonCancel,
  ButtonCustom,
  InputLabelCustom,
  TextFieldCustom,
} from 'src/components'

//material
import { FormHelperText, Stack, FormControl, Box } from '@mui/material'

//model
import { AddManufactureType } from './modelCreate'

// react-hook-form
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import UploadImage from 'src/components/uploadImage'
import { schema } from './validations'
import Link from 'next/link'

import RequiredLabel from 'src/components/requiredLabel'
import { useEffect } from 'react'
import { platform } from 'src/utils/global.utils'
import { useTranslation } from 'next-i18next'
interface Props {
  manuDetail?: any
  handleSubmit: (value: any) => void
  update?: boolean
}
const CreateUpdateComponent: React.FC<Props> = (props) => {
  const { t } = useTranslation('manufacturer')
  const {
    setValue,
    handleSubmit,
    control,
    watch,

    trigger,
    formState: { errors },
  } = useForm<AddManufactureType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })

  // event submit
  const onSubmit = (values: AddManufactureType) => {
    const value: AddManufactureType = {
      name: values.name,
      logo: values.logo,
    }
    props.handleSubmit(value)
  }
  useEffect(() => {
    if (props.manuDetail) {
      setValue('name', props.manuDetail.name)
      setValue('logo', !props.manuDetail.logo ? null : props.manuDetail.logo)
    }
  }, [props.manuDetail, setValue])

  const invalid = (error: any) => {
    console.log(error)
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, invalid)}>
        <InputLabelCustom sx={{ marginBottom: '15px' }}>
          {t('createUpdate.manufacturerLogo')}
        </InputLabelCustom>
        <Box
          p={'15px'}
          mb={'25px'}
          maxWidth={'193px'}
          borderRadius={'10px'}
          sx={{
            backgroundColor: '#F8F9FC',
          }}
        >
          <UploadImage
            file={watch('logo') as string}
            onFileSelectSuccess={(file: string) => {
              setValue('logo', file)

              trigger('logo')
            }}
            onFileSelectError={() => {
              return
            }}
            onFileSelectDelete={() => {
              setValue('logo', null)

              trigger('logo')
            }}
          />
        </Box>
        <Box mb={'35px'} maxWidth={'458px'}>
          <Controller
            control={control}
            name="name"
            defaultValue=""
            render={({ field }) => (
              <>
                <InputLabelCustom
                  htmlFor="name"
                  sx={{ marginBottom: '15px' }}
                  error={!!errors.name}
                >
                  <RequiredLabel />
                  {t('createUpdate.manufacturerName')}
                </InputLabelCustom>
                <FormControl fullWidth>
                  <TextFieldCustom
                    id="name"
                    error={!!errors.name}
                    {...field}
                    placeholder={t('createUpdate.enterManufacturerName')}
                  />
                  <FormHelperText error={!!errors.name}>
                    {errors.name && `${errors.name.message}`}
                  </FormHelperText>
                </FormControl>
              </>
            )}
          />
        </Box>
        <Stack direction="row" justifyContent="start" spacing={2}>
          <Link
            href={
              platform() === 'SUPPLIER'
                ? '/supplier/inventory/manufacturer/list'
                : '/retailer/inventory/manufacturer/list'
            }
          >
            <a>
              <ButtonCancel variant="outlined" size="large">
                {t('createUpdate.cancel')}
              </ButtonCancel>
            </a>
          </Link>
          <ButtonCustom variant="contained" type="submit" size="large">
            {t('createUpdate.submit')}
          </ButtonCustom>
        </Stack>
      </form>
    </>
  )
}

export default CreateUpdateComponent
