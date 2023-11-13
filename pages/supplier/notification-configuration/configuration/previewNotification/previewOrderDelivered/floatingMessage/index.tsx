import { Skeleton, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'

const FloatingMessage: React.FC = () => {
  return (
    <Stack direction="column" gap={2}>
      <Stack
        direction="row"
        alignItems="center"
        gap={2}
        sx={{
          borderRadius: '15px',
          background: '#D0EEFB',
          padding: '18px 21px',
        }}
      >
        <Image
          src={'/' + '/images/default-brand.png'}
          width={30}
          height={30}
          alt=""
        />
        <Stack
          direction="column"
          sx={{
            width: '100%',
          }}
        >
          <Skeleton animation={false} />
          <Skeleton animation={false} />
        </Stack>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        gap={2}
        sx={{
          borderRadius: '15px',
          background: '#D0EEFB',
          padding: '18px 10px',
        }}
      >
        <Image
          src={'/' + '/images/default-brand.png'}
          width={30}
          height={30}
          alt=""
        />
        <Stack
          direction="column"
          sx={{
            width: '100%',
          }}
        >
          <Typography
            sx={{
              fontSize: '1.4rem',
              color: '#252626',
              fontWeight: 600,
            }}
          >
            Your package has been delivered successfully
          </Typography>
          <Typography
            sx={{
              fontSize: '1.2rem',
              color: '#252626',
              fontWeight: 400,
            }}
          >
            The order #[ORDER_CODE] has been delivered successfully
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default FloatingMessage
