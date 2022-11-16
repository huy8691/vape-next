import Head from 'next/head'
import React, { useState, useEffect } from 'react'

// mui
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Fab from '@mui/material/Fab'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

// mui

// import {
//   getNewProductList,
//   getSellingProductList,
//   getCategoryProduct,
//   getPromotion,
// } from './homepage/apiHomePage'
// import SectionPromotion from './homepage/parts/sectionPromotion'
// import SectionNewProducts from './homepage/parts/sectionNewProducts'
// import SectionSellingProducts from './homepage/parts/sectionSellingProducts'
// import SectionPreOrderProducts from './homepage/parts/sectionPreOrderProducts'
// import SectionFlashSellProducts from './homepage/parts/sectionFlashSellProducts'
// import SectionCategoryProduct from './homepage/parts/sectionCategoryProduct'

// layout
import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import type { NextPageWithLayout } from 'pages/_app.page'

// other
import { Folder } from 'phosphor-react'
// other

const CardCustom = styled(Card)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light' ? '#fff' : theme.palette.action.disabled,
  // boxShadow: 'none',
}))

const CardSection = styled(Card)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light' ? '#F1F3F9' : theme.palette.action.hover,
  // boxShadow: 'none',
}))

const Home: NextPageWithLayout = () => {
  // fix error when use next theme
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }
  // fix error when use next theme

  return (
    <>
      <Head>
        <title>VAPE | Homepage</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CardSection>
        <CardContent style={{ paddingBottom: '16px' }}>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <CardCustom variant="outlined">
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Box>
                      <Typography variant="h5">3</Typography>
                      <Typography variant="subtitle1">
                        Low Stock Items
                      </Typography>
                    </Box>
                    <Fab size="small" color="primary" aria-label="add">
                      <Folder size={24} />
                    </Fab>
                  </Stack>
                </CardContent>
              </CardCustom>
            </Grid>
            <Grid item xs={3}>
              <CardCustom variant="outlined">
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Box>
                      <Typography variant="h5">3</Typography>
                      <Typography variant="subtitle1">
                        Low Stock Items
                      </Typography>
                    </Box>
                    <Fab size="small" color="primary" aria-label="add">
                      <Folder size={24} />
                    </Fab>
                  </Stack>
                </CardContent>
              </CardCustom>
            </Grid>
            <Grid item xs={3}>
              <CardCustom variant="outlined">
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Box>
                      <Typography variant="h5">3</Typography>
                      <Typography variant="subtitle1">
                        Low Stock Items
                      </Typography>
                    </Box>
                    <Fab size="small" color="primary" aria-label="add">
                      <Folder size={24} />
                    </Fab>
                  </Stack>
                </CardContent>
              </CardCustom>
            </Grid>
            <Grid item xs={3}>
              <CardCustom variant="outlined">
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Box>
                      <Typography variant="h5">3</Typography>
                      <Typography variant="subtitle1">
                        Low Stock Items
                      </Typography>
                    </Box>
                    <Fab size="small" color="primary" aria-label="add">
                      <Folder size={24} />
                    </Fab>
                  </Stack>
                </CardContent>
              </CardCustom>
            </Grid>
          </Grid>
        </CardContent>
      </CardSection>

      {/* <SectionPromotion dataPromotion={dataPromotion} />
      <SectionFlashSellProducts dataNewProduct={dataNewProduct} />
      <SectionNewProducts dataNewProduct={dataNewProduct} />
      <SectionSellingProducts dataSellingProduct={dataSellingProduct} />
      <SectionPreOrderProducts dataNewProduct={dataNewProduct} />
      <SectionCategoryProduct dataCategoryProduct={dataCategoryProduct} /> */}
    </>
  )
}

// export async function getStaticProps() {
//   const dataNewProduct = await getNewProductList()
//     .then((res) => {
//       const data = res.data
//       return data
//     })
//     .catch((error) => {
//       const errors = error.response ? error.response.data : true
//       return errors
//     })
//   const dataSellingProduct = await getSellingProductList()
//     .then((res) => {
//       const data = res.data
//       return data
//     })
//     .catch((error) => {
//       const errors = error.response ? error.response.data : true
//       return errors
//     })

//   // category
//   const dataCategoryProduct = await getCategoryProduct()
//     .then((res) => {
//       const data = res.data
//       return data
//     })
//     .catch((error) => {
//       const errors = error.response ? error.response.data : true
//       return errors
//     })

//   // Promotion
//   const dataPromotion = await getPromotion()
//     .then((res) => {
//       const data = res.data
//       return data
//     })
//     .catch((error) => {
//       const errors = error.response ? error.response.data : true
//       return errors
//     })

//   return {
//     props: {
//       dataPromotion: dataPromotion,
//       dataNewProduct: dataNewProduct,
//       dataSellingProduct: dataSellingProduct,
//       dataCategoryProduct: dataCategoryProduct,
//     },
//   }
// }

Home.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default Home
