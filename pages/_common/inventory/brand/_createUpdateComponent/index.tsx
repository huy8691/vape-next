import React, { useEffect } from 'react'

import { Stack, Box, FormControl, FormHelperText } from '@mui/material'
import Link from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCancel,
  ButtonCustom,
  InputLabelCustom,
  TextFieldCustom,
} from 'src/components'
import UploadImage from 'src/components/uploadImage'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'

import { AddBrandType } from './brandModel'

import RequiredLabel from 'src/components/requiredLabel'
import { platform } from 'src/utils/global.utils'
import { useTranslation } from 'next-i18next'
interface Props {
  brandDetail?: any
  handleSubmit: (value: any) => void
  update?: boolean
}
const CreateUpdateComponent: React.FC<Props> = (props) => {
  const { t } = useTranslation('brand')
  const {
    control,

    setValue,
    trigger,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<AddBrandType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })
  //onSubmit create brand
  const OnSubmitBrand = (values: AddBrandType) => {
    const submitBrand: AddBrandType = {
      name: values.name,
      logo: values.logo,
    }
    props.handleSubmit(submitBrand)
  }

  useEffect(() => {
    if (props.brandDetail) {
      setValue('name', props.brandDetail.name)
      setValue('logo', props.brandDetail.logo ? props.brandDetail.logo : null)
    }
  }, [props.brandDetail, setValue])
  return (
    <>
      <form onSubmit={handleSubmit(OnSubmitBrand)}>
        <InputLabelCustom sx={{ marginBottom: '15px' }}>
          {t('createUpdate.brandLogo')}
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
                  {t('createUpdate.brandName')}
                </InputLabelCustom>
                <FormControl fullWidth>
                  <TextFieldCustom
                    id="name"
                    error={!!errors.name}
                    {...field}
                    placeholder={t('createUpdate.enterBrandName')}
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
                ? '/supplier/inventory/brand/list'
                : '/retailer/inventory/brand/list'
            }
          >
            <a>
              <ButtonCancel variant="outlined" size="large">
                {t('createUpdate.cancel')}
              </ButtonCancel>
            </a>
          </Link>
          <ButtonCustom variant="contained" size="large" type="submit">
            {t('createUpdate.submit')}
          </ButtonCustom>
        </Stack>
      </form>
    </>
  )
}

export default CreateUpdateComponent
