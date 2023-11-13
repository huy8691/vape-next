import { Box, Typography, Divider, Card, CardActionArea } from '@mui/material'
import Head from 'next/head'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import React, { ReactElement, useEffect, useState } from 'react'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import NestedLayout from 'src/layout/nestedLayout'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import {
  getListManufacturer,
  getSupplier,
  getProductCategoryOnMarketPlace,
} from './featuredAPI'
import { ListManufacturerType, SupplierType } from './featuredModel'
import BannerComponent from './part/BannerComponent'
import Grid from '@mui/material/Unstable_Grid2'
import { Stack } from '@mui/material'
import ProductOfSupplierComponent from './part/YourSupplierProduct'
import Image from 'next/image'
import classes from './styles.module.scss'
import { SquaresFour } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const Featured: NextPageWithLayout = () => {
  const { t } = useTranslation('featured')

  const [pushMessage] = useEnqueueSnackbar()
  const [stateListManufacturer, setStateListManufacturer] = useState<
    ListManufacturerType[]
  >([])
  const [stateListSupplier, setStateListSupplier] = useState<SupplierType[]>([])

  const [
    stateProductCategoryOnMarketPlace,
    setStateProductCategoryOnMarketPlace,
  ] = useState<{ id: number; name: string; thumbnail: string }[]>([])

  useEffect(() => {
    getListManufacturer()
      .then((res) => {
        const { data } = res.data
        setStateListManufacturer(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
    getSupplier()
      .then((res) => {
        const { data } = res.data
        setStateListSupplier(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })

    getProductCategoryOnMarketPlace({ page: 1, limit: 100 })
      .then((res) => {
        const { data } = res.data
        console.log('sadsa', data)
        setStateProductCategoryOnMarketPlace(data)
      })
      .catch((error) => {
        const { status, data } = error.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [])
  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <Box mb={3}>
        <BannerComponent />
      </Box>
      <Stack direction="row" useFlexGap flexWrap="wrap" spacing={2} mb={4}>
        <Box>
          <Link href={`/retailer/market-place/browse-products`}>
            <a>
              <Card
                variant="outlined"
                sx={{
                  border: `1px solid #E1E6EF`,
                  borderRadius: '10px',
                }}
              >
                <CardActionArea
                  sx={{
                    p: 2,
                    width: '110px',
                    aspectRatio: 1,
                    alignItems: 'center',
                    borderRadius: '10px',
                    justifyItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <Box mb={0.5}>
                    <SquaresFour size={35} />
                  </Box>
                  <Typography
                    // color={
                    //   arr.includes(`${item.id}`)
                    //     ? theme.palette.primary.main
                    //     : '#0A0D14'
                    // }
                    sx={{ fontSize: '12px' }}
                  >
                    {t('allProducts')}
                  </Typography>
                </CardActionArea>
              </Card>
            </a>
          </Link>
        </Box>
        {stateProductCategoryOnMarketPlace?.map((item, index) => {
          return (
            <Box key={index}>
              <Link
                href={`/retailer/market-place/browse-products?category_marketplace=${item.id}`}
              >
                <a>
                  <Card
                    key={index}
                    variant="outlined"
                    sx={{
                      border: '1px solid #E1E6EF',
                      borderRadius: '10px',
                    }}
                  >
                    <CardActionArea
                      sx={{
                        p: 2,
                        width: '110px',
                        aspectRatio: 1,
                        alignItems: 'center',
                        borderRadius: '10px',
                        justifyItems: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <Box mb={0.5}>
                        <Image
                          src={
                            item?.thumbnail
                              ? item.thumbnail
                              : '/' + '/images/defaultProductImage.png'
                          }
                          alt=""
                          width={35}
                          height={35}
                        />
                      </Box>
                      <Typography color="#0A0D14" sx={{ fontSize: '12px' }}>
                        {item.name}
                      </Typography>
                    </CardActionArea>
                  </Card>
                </a>
              </Link>
            </Box>
          )
        })}
      </Stack>
      <Box mb={6}>
        <Typography sx={{ fontSize: '2rem', fontWeight: '500' }} mb={1}>
          {t('suggestManufacturer')}
        </Typography>
        <Grid container spacing={2}>
          {stateListManufacturer.map((item, index) => {
            return (
              <Grid xs={6} key={index} className={classes['col-product']}>
                <ProductOfSupplierComponent listProduct={item} />
              </Grid>
            )
          })}
        </Grid>
      </Box>
      <Divider sx={{ marginBottom: '32px' }} />
      <Box>
        <Typography sx={{ fontSize: '2rem', fontWeight: '500' }} mb={1}>
          {t('yourVendors')}
        </Typography>
        <Grid container spacing={2} sx={{ marginBottom: '15px' }}>
          {stateListSupplier.map((item, index) => {
            return (
              <Grid xs={6} key={index} className={classes['col-product']}>
                <ProductOfSupplierComponent listProduct={item} />
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </>
  )
}
Featured.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'featured',
      ])),
    },
  }
}
export default Featured
