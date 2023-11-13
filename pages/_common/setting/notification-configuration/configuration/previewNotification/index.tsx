import { Box } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import FloatingMessage from './floatingMessage'

const PreviewSMS: React.FC<{
  id: number | undefined
}> = (props) => {
  return (
    <Box
      p={2}
      sx={{
        width: '354px',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(63, 68, 77, 0.35)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
        }}
      >
        <Image
          src={'/' + '/images/IP14PROMAX.png'}
          width={354}
          height={731}
          alt=""
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50px',
            zIndex: 1,
            width: '100%',
            padding: '0px 20px',
          }}
        >
          <FloatingMessage id={props.id} />
        </Box>
      </Box>
    </Box>
  )
}

export default PreviewSMS
