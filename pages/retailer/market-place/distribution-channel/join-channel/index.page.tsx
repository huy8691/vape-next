import NestedLayout from 'src/layout/nestedLayout'
import { NextPageWithLayout } from 'pages/_app.page'
import React, { ReactElement } from 'react'
import Head from 'next/head'

//MUI
import {
  Box,
  FormControl,
  FormHelperText,
  Breadcrumbs,
  Typography,
  Stack,
} from '@mui/material'

//React hook form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'

//modal
import { ChannelDataType } from './addChannelModel'

//api
import { AddChannelApi } from './apiAddChannel'

//src and styled
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { useAppDispatch } from 'src/store/hooks'
import {
  ButtonCancel,
  ButtonCustom,
  InputLabelCustom,
  TextFieldCustom,
  TypographyTitlePage,
} from 'src/components'
import {
  handlerGetErrMessage,
  KEY_MODULE,
  PERMISSION_RULE,
} from 'src/utils/global.utils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const JoinChannel: NextPageWithLayout = () => {
  const { t } = useTranslation('dc')

  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()
  const {
    control,
    handleSubmit,
    // reset,
    setValue,
    formState: { errors },
  } = useForm<ChannelDataType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })

  const onSubmit = (data: ChannelDataType) => {
    const Addchannel: ChannelDataType = {
      code: data.code,
    }
    dispatch(loadingActions.doLoading())
    AddChannelApi(Addchannel)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(t('pushMessage.joinChannel'), 'success')
        // reset()
        setValue('code', '')
        router.push('/retailer/market-place/distribution-channel/list')
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  return (
    <>
      <Head>
        <title>{t('joinChannel')} | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        {t('joinDC')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '35px' }}
      >
        <Link href="/retailer/market-place/distribution-channel/list">
          <a>{t('title')}</a>
        </Link>
        <Typography>{t('joinDC')}</Typography>
      </Breadcrumbs>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box mb={'15px'} maxWidth={'458px'}>
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <>
                <InputLabelCustom htmlFor="code" error={!!errors.code}>
                  {t('codeChannel')}
                </InputLabelCustom>
                <FormControl fullWidth>
                  <TextFieldCustom
                    id="code"
                    placeholder={t('enterCodeChannel')}
                    error={!!errors.code}
                    {...field}
                  />
                  <FormHelperText error={!!errors.code}>
                    {errors.code && `${errors.code.message}`}
                  </FormHelperText>
                </FormControl>
              </>
            )}
          />
        </Box>
        <Stack direction="row" justifyContent="start" spacing={2}>
          <Link href="/retailer/market-place/distribution-channel/list">
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

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ['common', 'account', 'dc'])),
    },
  }
}
JoinChannel.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
JoinChannel.permissionPage = {
  key_module: KEY_MODULE.DistributionChannel,
  permission_rule: PERMISSION_RULE.JoinDC,
}
export default JoinChannel
