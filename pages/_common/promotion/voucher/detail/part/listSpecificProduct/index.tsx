import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import ImageDefault from 'public/images/logo.svg'
import React from 'react'
import { ProductOfVoucherDetail } from '../../modelVoucherDetail'

const ListSpecificProduct: React.FC<{
  stateProductSelect: ProductOfVoucherDetail[]
}> = (props) => {
  return (
    <>
      {props.stateProductSelect?.map((item) => {
        return (
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            key={item.id}
            justifyContent={'space-between'}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                style={{
                  borderRadius: '5px',
                  // border: '1px solid #D9D9D9',
                  width: '40px',
                  height: '40px',
                  overflow: 'hidden',
                }}
              >
                <Image
                  alt="product-image"
                  src={item.thumbnail || ImageDefault}
                  width={30}
                  height={30}
                />
              </Box>
              <Typography>{item.name}</Typography>
            </Stack>
          </Stack>
        )
      })}
    </>
  )
}

export default ListSpecificProduct
