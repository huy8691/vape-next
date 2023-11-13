import Image from 'next/image'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { formatMoney } from 'src/utils/money.utils'
import classes from './styles.module.scss'
import { Stack } from '@mui/material'
import { Cube } from '@phosphor-icons/react'
import { AttributeOptionInProductDetailType } from '../createRetailOrderModels'
import { useTranslation } from 'next-i18next'
// import defaultImage from "/image/ProductImageComingSoon.png";
const CardCustom = styled(Card)(({ theme }) => ({
  borderRadius: '15px',
  // border: '1px solid #E1E6EF',
  transition: '0.4s all ease',
  border:
    theme.palette.mode === 'light'
      ? '1px solid #E1E6EF'
      : '1px solid rgba(255, 255, 255, 0.12)',
}))

const TypographyCategory = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
}))

type Props = {
  dataProduct: {
    id: number

    name: string
    thumbnail: string
    retail_price?: number
    unit_type?: string
    tempQuantity?: number
    code?: string
    category?: {
      name: string
    }
    is_favorite?: boolean
    instock?: number
    isSelected?: boolean
    variants_count?: number
    quantity?: number
    attribute_options?: AttributeOptionInProductDetailType[]
    min_retail_price?: number
    max_retail_price?: number
    base_price?: number
  }
}
const ItemProduct: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation('retail-order-list')
  const theme = useTheme()
  const [fade, setFade] = useState(false)
  const triggerFade = () => {
    setFade((prevState) => {
      return !prevState
    })
  }

  return (
    <CardCustom
      variant="outlined"
      // className={classes['item-product']}
      onAnimationEnd={triggerFade}
      onClick={() => {
        triggerFade()
      }}
      className={
        fade
          ? `${classes['item-product']} ${classes['fadedClass']}`
          : classes['item-product']
      }
      sx={{
        cursor: 'pointer',
        border: props.dataProduct.isSelected
          ? `2px solid ${theme.palette.primary.main}`
          : '1px solid none',
      }}
    >
      {props.dataProduct.tempQuantity && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '-10px',
              left: '-30px',
              zIndex: 1000,
              background: theme.palette.primary.main,
              width: '80px',
              height: '40px',
              transform: 'rotate(-45deg)',
            }}
          ></Box>
          <Typography
            sx={{
              position: 'absolute',
              top: '8px',
              left: props.dataProduct.tempQuantity > 9 ? '5px' : '10px',
              zIndex: 1000,
              fontSize: '1.2rem',
              color: '#ffffff',
              fontWeight: 'bold',
            }}
          >
            {props.dataProduct.tempQuantity > 99
              ? '99+'
              : props.dataProduct.tempQuantity}
          </Typography>
        </>
      )}

      <Image
        alt={props.dataProduct.name}
        src={
          props.dataProduct.thumbnail
            ? props.dataProduct.thumbnail
            : 'https://via.placeholder.com/200x200?text=VAPE'
        }
        width="300"
        height="260"
        objectFit="fill"
      />

      <CardContent
        sx={{
          padding: { xs: '12px' },
          paddingBottom: { xs: '12px!important', lg: '16px!important' },
        }}
      >
        <TypographyCategory
          variant="body1"
          className={classes['item-product__category']}
        >
          {props.dataProduct.category?.name}
        </TypographyCategory>
        <Typography variant="h6" className={classes['item-product__name']}>
          {props.dataProduct.name}
        </Typography>
        <Box className={classes['item-product__price']}>
          {props.dataProduct.retail_price ? (
            props.dataProduct.base_price ? (
              formatMoney(props.dataProduct.base_price)
            ) : (
              formatMoney(props.dataProduct.retail_price)
            )
          ) : Number(props.dataProduct.min_retail_price) <
            Number(props.dataProduct.max_retail_price) ? (
            <>
              {formatMoney(props.dataProduct.min_retail_price)}
              {' - '}
              {formatMoney(props.dataProduct.max_retail_price)}
            </>
          ) : (
            formatMoney(props.dataProduct.min_retail_price)
          )}
          /
          <span
            style={{ display: 'inline-block' }}
            className={classes['item-product__price__unit']}
          >
            {t(
              `create.listRender.${props.dataProduct.unit_type?.toLowerCase()}` as any
            )}
          </span>
        </Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          className={classes['item-product__code']}
        >
          #{props.dataProduct.code}
          {props.dataProduct.variants_count ? <Cube size={18} /> : ''}
        </Stack>
        <Stack
          direction="row"
          justifyContent={'space-between'}
          alignItems="center"
        >
          {props.dataProduct.variants_count ? (
            <Box className={classes['item-product__code']}>
              <b>
                {props.dataProduct.variants_count
                  ? props.dataProduct.variants_count
                  : 0}
              </b>{' '}
              {t('create.listRender.variants')}
            </Box>
          ) : (
            <Box className={classes['item-product__code']}>
              <b>
                {props.dataProduct?.instock
                  ? props.dataProduct.instock
                  : props.dataProduct.quantity
                  ? props.dataProduct.quantity
                  : 0}
                {/* {!props.dataProduct.instock &&
                  !props.dataProduct.quantity &&
                  '0'} */}
              </b>{' '}
              {t('create.listRender.unitInStock')}
            </Box>
          )}
        </Stack>
        {props.dataProduct.attribute_options && (
          <Stack direction="row" sx={{ flexWrap: 'wrap' }}>
            {props.dataProduct.attribute_options.map((item, index) => {
              return (
                <Stack
                  direction="row"
                  key={index}
                  spacing={1}
                  sx={{ paddingRight: '5px' }}
                >
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: '#1B1F27',
                    }}
                  >
                    {item.attribute}
                  </span>
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: 300,
                      color: '#1B1F27',
                    }}
                  >
                    {item.option}
                  </span>
                </Stack>
              )
            })}
          </Stack>
        )}
      </CardContent>
    </CardCustom>
  )
}

export default ItemProduct
