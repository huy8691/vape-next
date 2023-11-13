import React, { useEffect, useState } from 'react'
import { ItemProduct } from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { SupplierType } from '../../featuredModel'
import { getListProduct } from './yourSupplierAPI'
import Grid from '@mui/material/Unstable_Grid2'
import { ProductDetailType } from './YourSupplierModel'
import { Box, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

interface Props {
  listProduct: SupplierType
}
const ProductOfSupplierComponent = (props: Props) => {
  const { t } = useTranslation('featured')

  const [pushMessage] = useEnqueueSnackbar()
  const [stateListProduct, setStateListProduct] = useState<ProductDetailType[]>(
    []
  )
  useEffect(() => {
    getListProduct(Number(props.listProduct.id))
      .then((res) => {
        const { data } = res.data
        setStateListProduct(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [props?.listProduct?.id])
  return (
    <Box
      sx={{
        background: '#F8F9FC',
        borderRadius: '10px',
        height: '100%',
        maxWidth: '750px',
      }}
      p={2}
    >
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography sx={{ fontSize: '1.6rem', color: '#0A0D14' }}>
          {props.listProduct.name}
        </Typography>
        {/* {props.listProduct.id} */}
        <Link
          href={`/retailer/market-place/browse-products?page=1&organization=org-${props?.listProduct?.id}-name${props?.listProduct?.name}&`}
          // href={`/retailer/market-place/browse-products?page=1&organization=org-117-nameMobile%20Merchant&`}
        >
          <a style={{ color: '#1DB46A', fontWeight: 500, fontSize: '1.6rem' }}>
            {t('viewAll')}
          </a>
        </Link>
      </Stack>
      <Grid container spacing={2} flexWrap="wrap">
        {stateListProduct.map((item, index) => {
          return (
            <Grid key={index} xs={6}>
              <ItemProduct dataProduct={item} />
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default ProductOfSupplierComponent
