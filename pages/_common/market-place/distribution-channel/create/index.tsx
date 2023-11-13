import { Box, FormControl } from '@mui/material'

import React, { useEffect } from 'react'
import {
  ButtonCancel,
  ButtonCustom,
  InputLabelCustom,
  TextFieldCustom,
} from 'src/components'

//Form and validate
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'

import { Controller, useForm } from 'react-hook-form'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { schema } from './validations'
// import Link from 'next/link'

import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import FormHelperText from '@mui/material/FormHelperText'
import { DCDataType } from './modalCreateDC'
import Stack from '@mui/material/Stack'
import Link from 'next/link'
import {
  createChannelApi,
  getDetailDistributionChannel,
  updateChannelApi,
} from './createDCApi'
import RequiredLabel from 'src/components/requiredLabel'
import { useTranslation } from 'react-i18next'

interface Props {
  type: string
}

const CreateDistributionChannelForm: React.FC<Props> = (props) => {
  const { t } = useTranslation('dc')

  const [pushMessage] = useEnqueueSnackbar()

  const router = useRouter()
  const dispatch = useAppDispatch()
  console.log(props)
  useEffect

  const {
    control,
    handleSubmit,
    // reset,
    setValue,
    formState: { errors },
  } = useForm<DCDataType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })

  const url =
    platform() == 'RETAILER'
      ? `/retailer/market-place/distribution-channel/list`
      : platform() == 'SUPPLIER' &&
        '/supplier/market-place/distribution-channel/list'

  useEffect(() => {
    if (props.type == 'update') {
      if (!router.query.id) return

      getDetailDistributionChannel(Number(router.query.id))
        .then((res) => {
          const { data } = res
          console.log('create', data)
          setValue('name', `${data.data.name}`)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((response) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }, [router.query.id])

  const onSubmit = (data: DCDataType) => {
    dispatch(loadingActions.doLoading())
    if (props.type == 'create') {
      createChannelApi(data)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(t('pushMessage.createSuccessfully'), 'success')
          // reset()
          setValue('name', '')
          router.push(`${url}`)
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
    if (props.type == 'update') {
      updateChannelApi(Number(router.query.id), data)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(t('pushMessage.updateSuccessfully'), 'success')
          router.push(`${url}`)
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={'15px'} maxWidth={'458px'}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <>
                <InputLabelCustom htmlFor="code" error={!!errors.name}>
                  <RequiredLabel />
                  {t('dcName')}
                </InputLabelCustom>
                <FormControl fullWidth>
                  <TextFieldCustom
                    id="name"
                    placeholder={t('enterNameChannel')}
                    error={!!errors.name}
                    {...field}
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
          <Link href={`${url}`}>
            <a>
              <ButtonCancel variant="outlined" size="large">
                {t('cancel')}
              </ButtonCancel>
            </a>
          </Link>
          <ButtonCustom variant="contained" type="submit" size="large">
            {t('submit')}
          </ButtonCustom>
        </Stack>
      </form>
    </>
  )
}

export default CreateDistributionChannelForm
