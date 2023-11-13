import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import React, { ReactElement, useEffect, useState } from 'react'
import classes from './styles.module.scss'
import WrapLayout from 'src/layout/wrapLayout'
import { useRouter } from 'next/router'
import { ButtonCustom } from 'src/components'
import { VerifySupplierType } from './verifySupplierModel'
import jwt_decode from 'jwt-decode'
import { verifySupplier } from './verifySupplierApi'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

const VerifySupplier: NextPageWithLayout = () => {
  const router = useRouter()
  const { t } = useTranslation('verify-supplier')
  const [stateTextVerify, setStateTextVerify] = useState(false)
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateLoadingVerifySupplier, setStateLoadingVerifySupplier] =
    useState(true)

  useEffect(() => {
    if (!router.query.code) {
      setStateTextVerify(false)
      setStateLoadingVerifySupplier(false)
      return
    }
    const codeVerify = router.query.code
    const statusVerify = router.query.status
    // const codeTest =
    //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk5NDM4MDEyLCJpYXQiOjE2OTkxNzg4MTIsImp0aSI6IjVkOTFjYmQwZDMxZDQwNGQ4Y2NjYzlkYzExZDEwZTJiIiwidXNlcl9pZCI6MzEsImVtYWlsIjoibWluSHV5X3Rlc3QxQGdtYWlsLmNvbSIsInBob25lX251bWJlciI6IjczNDczMjY0NzMiLCJidXNpbmVzc19uYW1lIjoibGltaW5obyJ9._zcmoHrPAa9P8JeRyOulrg2aHqeZW2BMAiS3hmzIKTE'
    // const codeVerify = codeTest
    try {
      const decodedCodeVerify: VerifySupplierType = jwt_decode(
        codeVerify.toString()
      )

      verifySupplier({
        business_name: decodedCodeVerify.business_name,
        email: decodedCodeVerify.email,
        phone_number: decodedCodeVerify.phone_number,
        user_id: decodedCodeVerify.user_id,
        status: Boolean(statusVerify),
      })
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          setStateLoadingVerifySupplier(false)
          pushMessage(t('youVerifiedSuccessfullyYourEmail'), 'success')
          setStateTextVerify(true)
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          setStateTextVerify(false)
          setStateLoadingVerifySupplier(false)
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    } catch (e) {
      setStateTextVerify(false)
      setStateLoadingVerifySupplier(false)
    }
  }, [dispatch, router.query])

  const IntervalTimerFunctional = () => {
    const [time, setTime] = React.useState(10)
    useEffect(() => {
      const timerId = setInterval(() => {
        setTime((t) => {
          if (t === 1) {
            router.push('/login')
          }
          return t - 1
        })
      }, 1000)

      return () => clearInterval(timerId)
    }, [])

    return <> {time}</>
  }
  return (
    <div className={classes['forgot-password-page']}>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <div className={classes['forgot-password-page__container']}>
        <div className={classes['forgot-password-page__content']}>
          <Box mb={4}>
            <Link href="/">
              <a>
                <Image
                  src={'/' + '/images/logo.svg'}
                  alt="Logo"
                  width="133"
                  height="52"
                />
              </a>
            </Link>
          </Box>
          <Box>
            <Stack direction={'column'} alignItems="center">
              {stateLoadingVerifySupplier && <CircularProgress />}
              {stateTextVerify && (
                <>
                  <Typography
                    mt={2}
                    mb={3}
                    variant="h5"
                    textAlign="center"
                    sx={{ fontSize: '1.8rem' }}
                  >
                    {t(
                      'youVerifiedSuccessfullyYourEmailGoBackToSignInPageAutomaticallyIn'
                    )}
                    <IntervalTimerFunctional /> {t('seconds')}
                  </Typography>
                  <ButtonCustom
                    variant="contained"
                    onClick={() => {
                      router.push('/login')
                    }}
                  >
                    {t('goBackToSignInPage')}
                  </ButtonCustom>
                </>
              )}
              {!stateLoadingVerifySupplier && !stateTextVerify && (
                <>
                  <Typography
                    mt={2}
                    mb={3}
                    variant="h5"
                    textAlign="center"
                    sx={{ fontSize: '1.8rem' }}
                  >
                    {t(
                      'accountVerificationFailedThePageWillAutomaticallyReloadLater'
                    )}
                    <IntervalTimerFunctional /> {t('seconds')}
                  </Typography>
                  <ButtonCustom
                    variant="contained"
                    onClick={() => {
                      router.push('/login')
                    }}
                  >
                    {t('goBackToSignInPage')}
                  </ButtonCustom>
                </>
              )}
            </Stack>
          </Box>
        </div>
      </div>
    </div>
  )
}
VerifySupplier.getLayout = function getLayout(page: ReactElement) {
  return <WrapLayout>{page}</WrapLayout>
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'verify-supplier',
        'account',
      ])),
    },
  }
}
export default VerifySupplier
