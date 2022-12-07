import React, { useEffect, useState } from 'react'

import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import type { NextPageWithLayout } from 'pages/_app.page'

import { useAppSelector } from 'src/store/hooks'

// mui
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import { Box, Container } from '@mui/material'
// mui

const Account: NextPageWithLayout = () => {
  const userInfo = useAppSelector((state) => state.userInfo)
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
        <List>
          <ListItem>
            <ListItemText primary="First name" />
            <ListItemText primary={userInfo.data.first_name} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Last name" />
            <ListItemText primary={userInfo.data.last_name} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Email" />
            <ListItemText primary={userInfo.data.email} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Address" />
            <ListItemText primary={userInfo.data.address} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Gender" />
            <ListItemText primary={userInfo.data.gender} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Dob" />
            <ListItemText primary={userInfo.data.dob} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Phone number" />
            <ListItemText primary={userInfo.data.phone_number} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Avatar" />
            <ListItemText primary={userInfo.data.avatar} />
          </ListItem>
        </List>
      </Container>
    </Box>
  )
}

Account.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default Account
