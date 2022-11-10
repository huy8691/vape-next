// import React from 'react'
// // import Link from 'next/link'
// // layout
// import type { NextPageWithLayout } from 'pages/_app.page'

// const Custom404: NextPageWithLayout = () => {
//   return <div className="container">404</div>
// }

// export default Custom404

import React, { useEffect, useState } from 'react'
import Link from '@mui/material/Link'
import { Box, Button, Container, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
// import Link from 'next/link'
// layout
// layout
import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import type { NextPageWithLayout } from 'pages/_app.page'

const Custom404: NextPageWithLayout = () => {
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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid xs={6}>
            <Typography variant="h1">404</Typography>
            <Typography variant="h6" mb={2}>
              The page you’re looking for doesn’t exist.
            </Typography>
            <Link underline="none" color="link" href="/">
              <a>
                <Button variant="contained">Back Home</Button>
              </a>
            </Link>
          </Grid>
          <Grid xs={6}>
            <img
              src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
              alt=""
              width={500}
              height={250}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

Custom404.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default Custom404
