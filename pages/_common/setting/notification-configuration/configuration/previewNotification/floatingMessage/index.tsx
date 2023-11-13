import { Skeleton, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import { useTranslation } from 'next-i18next'

const FloatingMessage: React.FC<{
  id: number | undefined
}> = (props) => {
  const { t } = useTranslation('notification-configuration')

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
            {props.id === 1 && t('yourOrderHasBeenConfirmed')}
            {props.id === 2 && t('yourOrderHasBeenCanceled')}
            {props.id === 3 && t('yourOrderIsBeingShipped')}
            {props.id === 4 && t('yourPackageHasBeenDeliveredSuccessfully')}
          </Typography>
          <Typography
            sx={{
              fontSize: '1.2rem',
              color: '#252626',
              fontWeight: 400,
            }}
          >
            {props.id === 1 && t('theOrder_123456HasBeenConfirmed')}
            {props.id === 2 &&
              t(
                'theOrder_123456HasBeenCanceledIfYouHaveAnyQuestionsPleaseContactTheSupplierForFurtherAssistance'
              )}
            {props.id === 3 &&
              t(
                'theOrder_123456BeingDeliveredToTheCarrierPleaseCheckTheShippingInformationInTheOrderDetails'
              )}
            {props.id === 4 && t('theOrder_123456HasBeenDeliveredSuccessfully')}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default FloatingMessage
