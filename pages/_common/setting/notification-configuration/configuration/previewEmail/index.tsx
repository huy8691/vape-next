import {
  Box,
  Divider,
  Stack,
  TextareaAutosize,
  Typography,
  styled,
} from '@mui/material'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { doConfigNotification } from 'pages/_common/setting/notification-configuration/apiNotificationConfig'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { CaretDown, XCircle } from '@phosphor-icons/react'
import { ButtonCustom } from 'src/components'
import { useTranslation } from 'next-i18next'

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
}

const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f',
}

const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
    width: 100%;
    font-family: Poppins;
    font-size: 1.6rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === 'dark' ? grey[900] : grey[50]
    };
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === 'dark' ? blue[500] : blue[200]
      };
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
)

const PreviewEmail: React.FC<{
  contentEmail: string | undefined
  onClose: React.Dispatch<React.SetStateAction<boolean>>
  id?: number
}> = (props) => {
  const { t } = useTranslation('notification-configuration')
  const [pushMessage] = useEnqueueSnackbar()
  const [valueTextArea, setValueTextArea] = useState<string>(
    props.contentEmail || ''
  )

  useEffect(() => {
    setValueTextArea(props.contentEmail!)
  }, [props.contentEmail])

  const handleSaveContentEmail = () => {
    doConfigNotification(props.id as number, {
      email_content: valueTextArea,
    })
      .then(() => {
        pushMessage(t('message.configureNotificationSuccessfully'), 'success')
      })
      .catch((error) => {
        const { status, data } = error.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <Box
      p={2}
      sx={{
        width: '526px',
        backgroundColor: '#FFF',
      }}
    >
      <Box
        sx={{
          width: '100%',
          borderRadius: '10px',
          border: '1px solid  #E1E6EF',
          padding: '10px 15px',
          marginBottom: '20px',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            sx={{
              color: '#0A0D14',
              fontSize: '1.6rem',
              fontWeight: 500,
            }}
          >
            {t('previewNotificationMessage')}
          </Typography>
          <XCircle
            size={32}
            color="#1B1F27"
            style={{
              cursor: 'pointer',
            }}
            onClick={() => props.onClose(false)}
          />
        </Stack>
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          marginBottom: '20px',
        }}
      >
        <Typography
          sx={{
            color: '#49516F',
            fontSize: '2.4rem',
            fontWeight: 400,
          }}
        >
          {props.id === 2 && t('yourOrderHasBeenCanceled')}
          {props.id === 3 && t('yourOrderIsBeingShipped')}
          {props.id === 4 && t('yourOrderHasBeenDeliveredSuccessfully')}
          {props.id === 5 && t('thankYouForYourPurchase')}
        </Typography>
        <Box
          sx={{
            borderRadius: '15px',
            backgroundColor: '#E02D3C',
            padding: '5px 10px',
          }}
        >
          <Typography
            sx={{
              color: '#fff',
              fontSize: '1.4rem',
              fontWeight: 400,
            }}
          >
            {t('inbox')}
          </Typography>
        </Box>
      </Stack>

      <Stack direction="column" gap={2}>
        <Stack
          direction="row"
          alignItems="center"
          gap={2}
          sx={{
            borderRadius: '15px',
            background: '#F8F9FC',
            padding: '18px 10px',
          }}
        >
          <Image
            src={'/' + '/images/default-brand.png'}
            width={53}
            height={53}
            alt=""
          />
          <Stack
            direction="column"
            sx={{
              width: '100%',
            }}
          >
            <Stack
              direction="row"
              alignContent="center"
              gap={1}
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
                TWSS
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.4rem',
                  color: '#49516F',
                  fontWeight: 400,
                }}
              >
                04:00 PM
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontSize: '1.2rem',
                color: '#252626',
                fontWeight: 400,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              {t('toMe')} <CaretDown size={18} weight="bold" />
            </Typography>
          </Stack>
        </Stack>
        <Box
          sx={{
            borderRadius: '10px',
            border: '1px solid #E1E6EF',
            padding: '20px',
            textAlign: 'center',
            margin: '0 40px',
          }}
        >
          <Image
            src={'/' + '/images/default-brand-2.png'}
            width={107}
            height={68}
            alt=""
          />
          <Typography
            sx={{
              color: '#5A5A5A',
              fontSize: '2.7rem',
              fontWeight: 500,
              margin: '15px 0',
            }}
          >
            {t('hi')} Admin,
          </Typography>
          <Typography
            sx={{
              color: '#252626',
              fontSize: '1.4rem',
              fontWeight: 300,
              marginBottom: '15px',
            }}
          >
            {props.id === 2 &&
              t(
                'theOrder_123456HasBeenCanceledIfYouHaveAnyQuestionsPleaseContactTheSupplierForFurtherAssistance'
              )}
            {props.id === 3 &&
              t(
                'theOrder_123456BeingDeliveredToTheCarrierPleaseCheckTheShippingInformationInTheOrderDetails'
              )}
            {props.id === 4 && t('theOrder_123456HasBeenDeliveredSuccessfully')}
            {props.id === 5 &&
              t('thankYouForYourPurchaseBelowIsTheOrderDetails')}
          </Typography>

          <Box
            sx={{
              padding: '10px',
              borderRadius: '2px',
              backgroundColor: '#1DB46A',
              textAlign: 'left',
              marginBottom: '15px',
            }}
          >
            <Typography
              sx={{
                color: '#fff',
                fontSize: '1.4rem',
                fontWeight: 500,
              }}
            >
              Supplier Admin - 3501 Boardwalk, New Mexico, US
            </Typography>
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              width: '100%',
              marginBottom: '10px',
            }}
          >
            <Typography
              sx={{
                color: '#5A5A5A',
                fontSize: '1.6rem',
                fontWeight: 500,
              }}
            >
              {t('products')}
            </Typography>
            <Typography
              sx={{
                color: '#5A5A5A',
                fontSize: '1.6rem',
                fontWeight: 500,
              }}
            >
              {t('amount')}
            </Typography>
          </Stack>
          <Divider
            sx={{
              margin: '5px 0',
            }}
          />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              width: '100%',
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: '#5A5A5A',
                  fontSize: '1.4rem',
                  fontWeight: 400,
                }}
              >
                Product 1
              </Typography>
              <Typography
                sx={{
                  color: '#9098B1',
                  fontSize: '1.2rem',
                  fontWeight: 400,
                }}
              >
                x25 {t('unit')}
              </Typography>
            </Box>
            <Typography
              sx={{
                color: '#5A5A5A',
                fontSize: '1.6rem',
                fontWeight: 500,
              }}
            >
              $10.00
            </Typography>
          </Stack>
          <Divider
            sx={{
              margin: '5px 0',
            }}
          />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              width: '100%',
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: '#5A5A5A',
                  fontSize: '1.4rem',
                  fontWeight: 400,
                }}
              >
                Product 1
              </Typography>
              <Typography
                sx={{
                  color: '#9098B1',
                  fontSize: '1.2rem',
                  fontWeight: 400,
                }}
              >
                x25 {t('unit')}
              </Typography>
            </Box>
            <Typography
              sx={{
                color: '#5A5A5A',
                fontSize: '1.6rem',
                fontWeight: 500,
              }}
            >
              $10.00
            </Typography>
          </Stack>
          <Divider
            sx={{
              margin: '10px 0',
            }}
          />
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              width: '100%',
              marginBottom: '10px',
            }}
          >
            <Typography
              sx={{
                color: '#5A5A5A',
                fontSize: '1.4rem',
                fontWeight: 500,
              }}
            >
              {t('total')}
            </Typography>
            <Typography
              sx={{
                color: '#5A5A5A',
                fontSize: '1.4rem',
                fontWeight: 400,
              }}
            >
              $20.00
            </Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              width: '100%',
              marginBottom: '10px',
            }}
          >
            <Typography
              sx={{
                color: '#5A5A5A',
                fontSize: '1.4rem',
                fontWeight: 500,
              }}
            >
              {t('paymentStatus')}
            </Typography>
            <Typography
              sx={{
                color: '#53D1B6',
                fontSize: '1.4rem',
                fontWeight: 400,
              }}
            >
              {t('paid')}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              width: '100%',
              marginBottom: '10px',
            }}
          >
            <Typography
              sx={{
                color: '#5A5A5A',
                fontSize: '1.4rem',
                fontWeight: 500,
              }}
            >
              {t('creditCard')}
            </Typography>
            <Typography
              sx={{
                color: '#252626',
                fontSize: '1.4rem',
                fontWeight: 400,
              }}
            >
              ***4234
            </Typography>
          </Stack>
          <Divider />
          <Typography
            sx={{
              color: '#5A5A5A',
              fontSize: '1.4rem',
              fontWeight: 700,
              margin: '15px 0',
              textAlign: 'left',
            }}
          >
            {t('note')}
          </Typography>
          <StyledTextarea
            minRows={6}
            placeholder="Enter your note..."
            value={valueTextArea}
            onChange={(e) => {
              setValueTextArea(e.target.value)
            }}
          />
          <Divider
            sx={{
              margin: '15px 0',
            }}
          />
          <Typography
            sx={{
              color: '#5A5A5A',
              fontSize: '1.2rem',
              fontWeight: 500,
              textAlign: 'left',
            }}
          >
            {t('needSupport')}
          </Typography>
          <Typography
            sx={{
              color: '#5A5A5A',
              fontSize: '1.2rem',
              fontWeight: 400,
              textAlign: 'left',
              margin: '15px 0',
            }}
          >
            {t(
              'feelFreeToEmailUsIfYouHaveAnyQuestionsCommentsOrSuggestionsWeLlBeHappyToResolveYourIssues'
            )}
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              width: '100%',
              textAlign: 'left',
            }}
          >
            <Typography
              sx={{
                color: '#BBBBBB',
                fontSize: '1.2rem',
                fontWeight: 400,
              }}
            >
              {t('questionEmailUsAt')}
            </Typography>{' '}
            <Typography
              sx={{
                color: '#0000EE',
                fontSize: '1.2rem',
                fontWeight: 400,
              }}
            >
              dev@twssolutions.us
            </Typography>
          </Stack>
        </Box>

        <Stack
          direction="row"
          p={2}
          gap={2}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <ButtonCustom
            size="large"
            sx={{ padding: '11px 30px !important', width: '100%' }}
            variant="contained"
            onClick={() => handleSaveContentEmail()}
          >
            {t('save')}
          </ButtonCustom>
          <ButtonCustom
            variant="outlined"
            size="large"
            onClick={() => props.onClose(false)}
            sx={{ padding: '11px 30px !important', width: '100%' }}
          >
            {t('cancel')}
          </ButtonCustom>
        </Stack>
      </Stack>
    </Box>
  )
}

export default PreviewEmail
