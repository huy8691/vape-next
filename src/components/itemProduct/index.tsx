import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { formatMoney } from 'src/utils/money.utils'
// import defaultImage from "/image/ProductImageComingSoon.png";

const CardCustom = styled(Card)(({ theme }) => ({
  borderRadius: '15px',
  // border: '1px solid #E1E6EF',
  border:
    theme.palette.mode === 'light'
      ? '1px solid #E1E6EF'
      : '1px solid rgba(255, 255, 255, 0.12)',
}))
type Props = {
  dataProduct: {
    id: number
    name: string
    thumbnail: string
    price: number
    unit_types?: string
    quantity?: number
  }
}
const ItemProduct: React.FC<Props> = (props: Props) => {
  return (
    <CardCustom variant="outlined">
      <Link href={`/detail/${props.dataProduct.id}`}>
        <a>
          <Image
            alt={props.dataProduct.name}
            src={
              props.dataProduct.thumbnail
                ? props.dataProduct.thumbnail
                : 'https://via.placeholder.com/200x200?text=VAPE'
            }
            width="210"
            height="210"
            objectFit="contain"
          />
        </a>
      </Link>
      <CardContent>
        <Typography variant="h6">{props.dataProduct.name}</Typography>
        <Typography variant="body1">{props.dataProduct.quantity}</Typography>
        <Box>
          {formatMoney(props.dataProduct.price)}
          {props.dataProduct.unit_types}
        </Box>
      </CardContent>
    </CardCustom>
  )
}

export default ItemProduct
