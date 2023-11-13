import {
  Box,
  Card,
  CardContent,
  Grid,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
// import useMediaQuery from '@mui/material/useMediaQuery'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { TypographyTitlePage } from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  handlerGetErrMessage,
  isEmptyObject,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
} from 'src/utils/global.utils'
import { getWishList } from './apiWishList'
import { ProductDataType, ProductListDataResponseType } from './modelWishList'
// layout
import type { NextPageWithLayout } from 'pages/_app.page'
import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

// custom style
import { ButtonCustom } from 'src/components'
import ItemProduct from './part/itemProduct'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const CardCustom = styled(Card)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light' ? '#F8F9FC' : theme.palette.action.hover,
  boxShadow: 'none',
  height: '100%',
}))

const GridProduct = styled(Grid)(() => ({
  ['@media (min-width:1536px) and (max-width:1700px)']: {
    flexBasis: '20%',
    maxWidth: '20%',
  },
}))

const WishList: NextPageWithLayout = () => {
  const { t } = useTranslation('wish-list')

  // const limit = useMediaQuery('(max-width:1400px)')
  const [dataProducts, setDataProducts] =
    useState<ProductListDataResponseType>()

  const router = useRouter()
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()

  // handleChangePagination
  const handleChangePagination = (e: any, page: number) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
    console.log(e)
  }

  useEffect(() => {
    if (!isEmptyObject(router.query)) {
      dispatch(loadingActions.doLoading())
      getWishList(
        {
          ...router.query,
        },
        16
      )
        .then((res) => {
          setDataProducts({})
          const data = res.data
          setDataProducts(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(({ response }) => {
          const { status, data } = response
          dispatch(loadingActions.doLoadingFailure())
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
    if (router.asPath === '/retailer/market-place/wish-list') {
      dispatch(loadingActions.doLoading())
      getWishList({}, 16)
        .then((res) => {
          setDataProducts({})
          const data = res.data
          setDataProducts(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(({ response }) => {
          const { status, data } = response
          dispatch(loadingActions.doLoadingFailure())
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }, [router, dispatch])

  const renderResult = () => {
    if (!dataProducts?.data) {
      return (
        <Box mb={4}>
          <Grid container spacing={2}>
            {Array.from(Array(16).keys()).map((index: number) => (
              <GridProduct
                item
                xs={12}
                sm={6}
                md={3}
                lg={2}
                xl={1.7}
                key={index}
              >
                <CardCustom variant="outlined">
                  <Box mb={1}>
                    <Skeleton animation="wave" variant="rounded" height={204} />
                  </Box>
                  <CardContent style={{ paddingBottom: '16px' }}>
                    <Skeleton variant="text" sx={{ fontSize: '1.4rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1.6rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1.6rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} />
                  </CardContent>
                </CardCustom>
              </GridProduct>
            ))}
          </Grid>
        </Box>
      )
    }
    if (dataProducts?.data?.length === 0) {
      return (
        <Grid container spacing={2} justifyContent="center">
          <Grid>
            <Stack p={5} spacing={2}>
              <Image
                src={'/' + '/images/not-found.svg'}
                alt="Logo"
                width="200"
                height="300"
              />
              <Typography variant="h6">{t('productNotAvailable')}</Typography>
              <Link href="/retailer/market-place/browse-products">
                <ButtonCustom variant="contained" style={{ padding: '15px' }}>
                  <Typography style={{ fontWeight: '600' }}>
                    {t('searchMore')}
                  </Typography>
                </ButtonCustom>
              </Link>
            </Stack>
          </Grid>
        </Grid>
      )
    }
    return (
      <>
        <Box mb={4}>
          <Grid container spacing={2}>
            {dataProducts?.data.map((item: ProductDataType, index: number) => (
              <GridProduct
                item
                xs={12}
                sm={6}
                md={3}
                lg={2}
                xl={1.7}
                key={index}
              >
                <ItemProduct dataProduct={item} />
              </GridProduct>
            ))}
          </Grid>
        </Box>
        {Number(dataProducts?.totalPages) > 1 && (
          <Stack direction="row" justifyContent="flex-end">
            <Pagination
              color="primary"
              count={dataProducts?.totalPages}
              variant="outlined"
              shape="rounded"
              defaultPage={1}
              page={Number(router.query.page) ? Number(router.query.page) : 1}
              onChange={(e, page: number) => handleChangePagination(e, page)}
            />
          </Stack>
        )}
      </>
    )
  }
  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('title')}
      </TypographyTitlePage>
      {renderResult()}
    </>
  )
}

WishList.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
WishList.permissionPage = {
  key_module: KEY_MODULE.WishList,
  permission_rule: PERMISSION_RULE.ViewList,
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'wish-list',
      ])),
    },
  }
}
export default WishList
