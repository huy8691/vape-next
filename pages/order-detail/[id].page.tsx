import { Box, Stack, Typography } from '@mui/material'
import { NextPageWithLayout } from 'pages/_app.page'
import { ClockClockwise } from 'phosphor-react'
import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

const OrderDetail: NextPageWithLayout = () => {
  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography>Order detail #5214ACB</Typography>
        <Box
          sx={{
            padding: '15px',
            border: '1px solid #B25E09',
            borderRadius: '32px',
          }}
          display="flex"
          alignItems="center"
        >
          <Box
            sx={{
              backgroundColor: '#FEF1F2',
              borderRadius: '9999px',
              padding: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: '10px',
            }}
          >
            <ClockClockwise size={15} />
          </Box>
          Waiting for Approval
        </Box>
      </Stack>
    </>
  )
}
OrderDetail.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default OrderDetail
