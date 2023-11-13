// react
import { useEffect, useState, type ReactElement } from 'react'

// next
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

// mui
import Box from '@mui/material/Box'

import Typography from '@mui/material/Typography'

// layout
import type { NextPageWithLayout } from 'pages/_app.page'
import WrapLayout from 'src/layout/wrapLayout'

import classes from './styles.module.scss'
// style

// api
import { CircularProgress } from '@mui/material'
import jwt_decode from 'jwt-decode'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { verifyCustomer } from './verifyApi'
import { DecodeJSONType } from './verifyModel'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const VerifyCustomer: NextPageWithLayout = () => {
  const { t } = useTranslation('verify-customer')
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [stateLoadingVerifyCustomer, setStateLoadingVerifyCustomer] =
    useState(true)
  const [stateTextVerify, setStateTextVerify] = useState(true)
  //   const handleParseJwt = (token: string) => {
  //     const base64Url = token.split('.')[1]
  //     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  //     const jsonPayload = decodeURIComponent(
  //       window
  //         .atob(base64)
  //         .split('')
  //         .map(function (c) {
  //           return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  //         })
  //         .join('')
  //     )

  //     return JSON.parse(jsonPayload)
  //   }

  useEffect(() => {
    if (!router.query.code) return
    const codeVerify = router.query.code
    try {
      const decodedCodeVerify: DecodeJSONType = jwt_decode(
        codeVerify.toString()
      )
      console.log('decodedCodeVerify', decodedCodeVerify)

      verifyCustomer({
        email: decodedCodeVerify.email,
        user_id: decodedCodeVerify.user_id,
      })
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          setStateLoadingVerifyCustomer(false)
          pushMessage(
            t('youVerifedSuccessfullyYourEmailYouCanSignInNow'),
            'success'
          )
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          setStateLoadingVerifyCustomer(false)
          setStateTextVerify(false)
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    } catch (e) {
      setStateLoadingVerifyCustomer(false)
      setStateTextVerify(false)
    }

    // if (!handleTestValidJson(decodedCodeVerify)) return
  }, [router.query.code])
  // check password

  // set time count down in cookie
  // const countFunction = useMemo(() => {
  //   let time = Math.floor(Date.now() / 1000)
  //   let timeCountCookies = Cookies.get('timeCountCookies')
  //   if (timeCountCookies) {
  //     if (time - parseInt(timeCountCookies) > 60) {
  //       setStateCount(60)
  //       Cookies.remove('timeCountCookies')
  //     } else {
  //       // setStateActiveStep('2')
  //       setStateCount(60 - time + parseInt(timeCountCookies))
  //       let countDown = setInterval(() => {
  //         setStateCount((prevCount) => {
  //           if (prevCount === 1) {
  //             clearInterval(countDown)
  //             prevCount = 60
  //             return prevCount
  //           }
  //           prevCount = prevCount - 1
  //           return prevCount
  //         })
  //       }, 1000)
  //     }
  //   }
  // }, [])

  // fix error when use next theme

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
            {stateLoadingVerifyCustomer ? (
              <CircularProgress />
            ) : (
              <Typography>
                {stateTextVerify
                  ? t('youVerifedSuccessfullyYourEmailYouCanSignInNow')
                  : t('somethingWentWrongPleaseTryAgain')}
              </Typography>
            )}
          </Box>
        </div>
      </div>
    </div>
  )
}

VerifyCustomer.getLayout = function getLayout(page: ReactElement) {
  return <WrapLayout>{page}</WrapLayout>
}
VerifyCustomer.theme = 'light'
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'verify-customer',
        'account',
      ])),
    },
  }
}
export default VerifyCustomer
