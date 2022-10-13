import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { formatMoney } from 'src/utils/money.utils'
// import defaultImage from "/image/ProductImageComingSoon.png";
import classes from './styles.module.scss'
interface ImgProductType {
  url: string
}
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
    <Card>
      <Link href={`/detail/${props.dataProduct.id}`}>
        <a>
          <Image
            alt={props.dataProduct.name}
            src={
              props.dataProduct.thumbnail
                ? props.dataProduct.thumbnail
                : 'https://via.placeholder.com/200x200?text=VAPE'
            }
            width="200"
            height="200"
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
    </Card>
  )
}

export default ItemProduct
