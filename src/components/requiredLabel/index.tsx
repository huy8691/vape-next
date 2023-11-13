import { useTheme } from '@mui/material'
import React from 'react'

const RequiredLabel = () => {
  const theme = useTheme()
  return (
    <>
      <span
        style={{
          color: theme.palette.error.main,
        }}
      >
        * {''}
      </span>
    </>
  )
}
export default RequiredLabel
