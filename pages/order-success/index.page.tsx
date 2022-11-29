import { Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import Image from 'next/image'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import React, { ReactElement } from 'react'
import { ButtonCustom } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'

const OrderSuccess: NextPageWithLayout = () => {
  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        <Grid>
          <Stack p={5} spacing={2} textAlign="center">
            <Image
              src="/images/success.svg"
              alt="Logo"
              width="300"
              height="300"
            />
            <Typography variant="h6" sx={{ marginTop: '0' }}>
              Create order successfully
            </Typography>
            <Link href="/browse-products">
              <ButtonCustom variant="contained" style={{ padding: '15px' }}>
                <Typography style={{ fontWeight: '600' }}>
                  Back to home
                </Typography>
              </ButtonCustom>
            </Link>
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}
OrderSuccess.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default OrderSuccess
