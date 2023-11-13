import { yupResolver } from '@hookform/resolvers/yup'
import { Autocomplete, Box, FormControl, FormHelperText } from '@mui/material'
import { Stack } from '@mui/system'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCancel,
  ButtonCustom,
  InputLabelCustom,
  TextFieldCustom,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import RequiredLabel from 'src/components/requiredLabel'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { createAttribute } from './attributeApi'
import { AttributeType } from './attributeModel'
import { schema } from './validation'
import { useTranslation } from 'next-i18next'

const CreateAttributeComponent = () => {
  const { t } = useTranslation('attribute-option')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()

  const {
    control,

    setValue,
    // getValues,
    // trigger,
    // watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AttributeType>({
    resolver: yupResolver(schema),
    mode: 'all',
    defaultValues: {
      options: [],
    },
  })
  const handleSubmitAttribute = (value: AttributeType) => {
    console.log('value', value)
    dispatch(loadingActions.doLoading())

    createAttribute(value)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(t('message.createAttributeSuccessfully'), 'success')
        router.push(
          `/${platform().toLowerCase()}/inventory/attribute-option/list`
        )
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <>
      <form onSubmit={handleSubmit(handleSubmitAttribute)}>
        <Stack sx={{ marginBottom: '15px' }} spacing={1}>
          <Box maxWidth={'400px'}>
            <Controller
              control={control}
              name="name"
              defaultValue=""
              render={({ field }) => (
                <>
                  <InputLabelCustom htmlFor="name" error={!!errors.name}>
                    <RequiredLabel />
                    {t('create.attributeName')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <TextFieldCustom
                      id="name"
                      error={!!errors.name}
                      {...field}
                      placeholder={t('create.enterAttributeName')}
                    />
                    <FormHelperText error={!!errors.name}>
                      {errors.name && `${errors.name.message}`}
                    </FormHelperText>
                  </FormControl>
                </>
              )}
            />
          </Box>
          <Box sx={{ width: '400px' }}>
            <Controller
              control={control}
              name={`options`}
              render={({ field: { value } }) => (
                <>
                  <InputLabelCustom
                    htmlFor={`options`}
                    error={!!errors?.options}
                  >
                    {t('create.option')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <Autocomplete
                      disablePortal
                      freeSolo
                      multiple
                      clearOnBlur
                      id="combo-box-demo"
                      value={value}
                      options={[]}
                      {...register(`options`)}
                      renderInput={(params) => (
                        <TextFieldCustom
                          {...(params as any)}
                          error={!!errors?.options}
                        />
                      )}
                      onChange={(e, value) => {
                        console.log('e', e)
                        setValue(`options`, value)
                        // if (stateEnableConfig) {
                        //   generateProductVariant()
                        // }
                      }}
                    />

                    <FormHelperText error={!!errors?.options}>
                      {errors?.options && `${errors?.options.message}`}
                    </FormHelperText>
                  </FormControl>
                </>
              )}
            />
          </Box>
        </Stack>

        <Stack direction="row" justifyContent="start" spacing={2}>
          <Link
            href={
              platform() === 'SUPPLIER'
                ? '/supplier/inventory/attribute-option/list'
                : '/retailer/inventory/attribute-option/list'
            }
          >
            <a>
              <ButtonCancel variant="outlined" size="large">
                {t('create.cancel')}
              </ButtonCancel>
            </a>
          </Link>
          <ButtonCustom variant="contained" size="large" type="submit">
            {t('create.submit')}
          </ButtonCustom>
        </Stack>
      </form>
    </>
  )
}

export default CreateAttributeComponent
