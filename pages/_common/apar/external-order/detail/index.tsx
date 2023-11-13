import { styled } from '@mui/material/styles'
import { Box, Dialog, Divider, IconButton, Typography } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import Stack from '@mui/material/Stack'
import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import Image from 'next/image'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  deleteExternalOrder,
  exportInvoiceExternalOrder,
  getDetailExternalOrder,
} from './externalOrderDetailAPI'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { ExternalOrderDetailTypeData } from './externalOrderDetailModel'
import { formatPhoneNumber } from 'src/utils/global.utils'
import { formatMoney } from 'src/utils/money.utils'
import { ArrowRight, X } from '@phosphor-icons/react'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  TypographyH2,
} from 'src/components'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

const TypographyTitle = styled(Typography)(() => ({
  color: '#49516F',
  fontWeight: 400,
  fontSize: '12px',
  fontFamily: 'Poppins',
}))

const TypographyValue = styled(Typography)(() => ({
  color: '#49516F',
  fontWeight: 500,
  fontSize: '14px',
  fontFamily: 'Poppins',
}))

const DividerCustom = styled('div')(() => ({
  backgroundColor: '#E1E6EF',
  height: '15px',
  width: '1px',
}))

const ExternalOrderDetailComponent: React.FC<{
  open: boolean
  onClose: React.Dispatch<React.SetStateAction<boolean>>
  idExternalOrder: number | undefined
  handleGetListExternalOrder?: (query: any) => void
  setFlagRefreshDelete?: React.Dispatch<React.SetStateAction<string>>
}> = (props) => {
  const { t } = useTranslation('external-order')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [stateOpenDialog, setStateOpenDialog] = useState(false)
  const [stateOpenDialogExport, setStateOpenDialogExport] = useState(false)
  const [stateExternalOrderDetail, setStateExternalOrderDetail] =
    useState<ExternalOrderDetailTypeData>()
  const [pushMessage] = useEnqueueSnackbar()

  const handleGetExternalOrderDetail = () => {
    dispatch(loadingActions.doLoading())
    getDetailExternalOrder(props.idExternalOrder as number)
      .then((res) => {
        const { data } = res.data
        setStateExternalOrderDetail(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }

  useEffect(() => {
    if (props.open) {
      handleGetExternalOrderDetail()
    } else {
      setStateExternalOrderDetail(undefined)
    }
  }, [props.open])

  const handleDialogDelete = () => {
    setStateOpenDialog(!stateOpenDialog)
  }

  const handleDialogExport = () => {
    setStateOpenDialogExport(!stateOpenDialogExport)
  }

  const handleDeleteActivityLog = () => {
    dispatch(loadingActions.doLoading())
    if (props.idExternalOrder) {
      deleteExternalOrder(props.idExternalOrder)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          handleDialogDelete()
          pushMessage(
            t('message.theExternalOrderHasBeenDeletedSuccessfully'),
            'success'
          )
          if (props.setFlagRefreshDelete) {
            props.setFlagRefreshDelete('' + new Date())
          }
          if (props.handleGetListExternalOrder) {
            props.handleGetListExternalOrder(router.query)
          }
          props.onClose(false)
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }

  const handleExport = () => {
    dispatch(loadingActions.doLoading())
    if (props.idExternalOrder) {
      exportInvoiceExternalOrder(props.idExternalOrder)
        .then((res) => {
          const { data } = res.data
          const link = document.createElement('a')
          link.href = data.url
          link.target = '_blank'
          link.setAttribute(
            'download',
            `twss_invocie_${props.idExternalOrder}.pdf`
          )
          document.body.appendChild(link)
          link.click()
          pushMessage('Export Invoice External Order Successfully', 'success')
          setStateOpenDialogExport(false)
        })
        .finally(() => dispatch(loadingActions.doLoadingSuccess()))
    }
  }

  return (
    <>
      <Drawer
        anchor="right"
        open={props.open}
        onClose={() => props.onClose(false)}
      >
        <Box sx={{ padding: '30px' }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              marginBottom: '10px',
            }}
          >
            <IconButton onClick={() => props.onClose(false)}>
              <ArrowRight size={24} />
            </IconButton>
            <Typography
              sx={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: '#49516F',
              }}
            >
              {t('externalOrderDetail')}
            </Typography>
          </Stack>
          <Grid
            container
            columnSpacing={'14px'}
            sx={{
              background: 'white',
              // width: `970px`,
              padding: '20px',
            }}
          >
            <Grid xs style={{ maxWidth: '400px' }}>
              <Box>
                <Typography
                  sx={{
                    color: '#0A0D14',
                    fontSize: '16px',
                    fontWeight: 500,
                  }}
                  mb={1}
                >
                  {t('externalSupplier')}
                </Typography>
                <Stack>
                  <Box
                    sx={{
                      padding: '15px',
                      borderRadius: '10px',
                      backgroundColor: '#F8F9FC',
                      maxWidth: '500px',
                    }}
                  >
                    <Stack>
                      <TypographyTitle>{t('supplierName')}</TypographyTitle>
                      <TypographyValue>
                        {stateExternalOrderDetail?.supplier?.name || 'N/A'}
                      </TypographyValue>
                    </Stack>
                    <Divider sx={{ margin: '10px 0' }} />
                    <Stack>
                      <TypographyTitle>{t('phoneNumber')}</TypographyTitle>
                      <TypographyValue>
                        {formatPhoneNumber(
                          stateExternalOrderDetail?.supplier?.phone_number || ''
                        ) || 'N/A'}
                      </TypographyValue>
                    </Stack>
                    <Divider sx={{ margin: '10px 0' }} />
                    <Stack>
                      <TypographyTitle>{t('email')}</TypographyTitle>
                      <TypographyValue>
                        {stateExternalOrderDetail?.supplier?.email || 'N/A'}
                      </TypographyValue>
                    </Stack>
                    <Divider sx={{ margin: '10px 0' }} />
                    <Stack>
                      <TypographyTitle>{t('streetAddress')}</TypographyTitle>
                      <TypographyValue>
                        {stateExternalOrderDetail?.supplier?.address || 'N/A'}
                      </TypographyValue>
                    </Stack>
                  </Box>
                </Stack>
              </Box>

              <Box mt={2}>
                <Typography
                  sx={{
                    color: '#0A0D14',
                    fontSize: '16px',
                    fontWeight: 500,
                  }}
                  mb={1}
                >
                  {t('deliveryInformation')}
                </Typography>
                <Stack>
                  <Box
                    sx={{
                      padding: '15px',
                      borderRadius: '5px',
                      border: '1px solid #e1e6ef',
                    }}
                  >
                    <Stack direction={'row'} alignItems={'center'} gap={1}>
                      <Typography>
                        {stateExternalOrderDetail?.address_name}
                      </Typography>
                      <DividerCustom />
                      <Typography>
                        {formatPhoneNumber(
                          stateExternalOrderDetail?.phone_number || ''
                        )}
                      </Typography>
                    </Stack>
                    <Typography mt={1}>
                      {stateExternalOrderDetail?.address || 'N/A'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              <Box mt={2}>
                <Typography
                  sx={{
                    color: '#0A0D14',
                    fontSize: '16px',
                    fontWeight: 500,
                  }}
                  mb={1}
                >
                  {t('billingOverview')}
                </Typography>

                <Stack
                  gap={1}
                  sx={{
                    padding: '15px',
                    borderRadius: '10px',
                    backgroundColor: '#F8F9FC',
                    maxWidth: '500px',
                  }}
                >
                  <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <TypographyTitle>{t('subtotal')}</TypographyTitle>
                    <TypographyValue>
                      {formatMoney(stateExternalOrderDetail?.sub_total)}
                    </TypographyValue>
                  </Stack>
                  <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <TypographyTitle>{t('discount')}</TypographyTitle>
                    <TypographyValue>
                      -{' '}
                      {formatMoney(stateExternalOrderDetail?.discount) ||
                        '$0.00'}
                    </TypographyValue>
                  </Stack>
                  <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <TypographyTitle>{t('tax')}</TypographyTitle>
                    <TypographyValue>
                      {formatMoney(stateExternalOrderDetail?.tax_amount)}
                    </TypographyValue>
                  </Stack>
                  <Divider />
                  <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <TypographyTitle>{t('total')}</TypographyTitle>
                    <TypographyValue>
                      {formatMoney(stateExternalOrderDetail?.total_value)}
                    </TypographyValue>
                  </Stack>
                </Stack>
              </Box>
              <ButtonCustom
                variant="outlined"
                size="large"
                sx={{
                  width: '100%',
                  marginTop: '15px',
                }}
                onClick={handleDialogExport}
              >
                {t('invoice')}
              </ButtonCustom>
              <ButtonCustom
                variant="outlined"
                size="large"
                sx={{
                  width: '100%',
                  border: '1px solid #E02D3C',
                  color: '#E02D3C',
                  marginTop: '15px',
                }}
                onClick={handleDialogDelete}
              >
                {t('delete')}
              </ButtonCustom>
              <ButtonCustom
                variant="outlined"
                size="large"
                sx={{ width: '100%', marginTop: '15px' }}
                onClick={() =>
                  router.push(
                    `/${platform().toLowerCase()}/account-payable/external-order/update/${
                      props.idExternalOrder as number
                    }`
                  )
                }
              >
                {t('edit')}
              </ButtonCustom>
            </Grid>
            <Grid xs style={{ width: '800px' }}>
              <Box>
                <Typography
                  sx={{
                    color: '#0A0D14',
                    fontSize: '16px',
                    fontWeight: 500,
                  }}
                  mb={1}
                >
                  {t('products')}
                </Typography>

                {stateExternalOrderDetail?.items?.length === 0 ? (
                  <Stack
                    p={5}
                    spacing={2}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Image
                      src={'/' + '/images/not-found.svg'}
                      alt="Logo"
                      width="100"
                      height="100"
                    />
                    <Typography
                      variant="h6"
                      sx={{ marginTop: '0', textAlign: 'center' }}
                    >
                      {t('thereAreNoProductsToShow')}
                    </Typography>
                  </Stack>
                ) : (
                  <Stack gap={1}>
                    {stateExternalOrderDetail?.items?.map((item, index) => {
                      return (
                        <Box
                          sx={{
                            borderRadius: '10px',
                            border: '1px solid #E1E6EF',
                            background: '#FFF',
                            padding: '10px',
                          }}
                          key={index}
                        >
                          <Stack
                            direction={'row'}
                            alignItems={'center'}
                            justifyContent={'space-between'}
                            gap={1}
                          >
                            <Image
                              alt="image"
                              src={
                                item.thumbnail
                                  ? item.thumbnail
                                  : '/' + '/images/default-brand.png'
                              }
                              width={50}
                              height={50}
                            />
                            <Typography>{item.name}</Typography>
                            <Typography>
                              {item.quantity} {t(`${item.unit_type}` as any)}
                            </Typography>
                          </Stack>
                        </Box>
                      )
                    })}
                  </Stack>
                )}
              </Box>
            </Grid>
          </Grid>
          <Dialog open={stateOpenDialog} onClose={handleDialogDelete}>
            <DialogTitleTws>
              <IconButton onClick={handleDialogDelete}>
                <X size={20} />
              </IconButton>
            </DialogTitleTws>
            <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
              {t('deleteExternalOrder')}
            </TypographyH2>
            <DialogContentTws>
              <DialogContentTextTws>
                {t('areYouSureToDeleteThisExternalOrder')}
              </DialogContentTextTws>
            </DialogContentTws>
            <DialogActionsTws>
              <Stack spacing={2} direction="row">
                <ButtonCancel
                  onClick={handleDialogDelete}
                  variant="outlined"
                  size="large"
                >
                  {t('no')}
                </ButtonCancel>
                <ButtonCustom
                  variant="contained"
                  onClick={handleDeleteActivityLog}
                  size="large"
                >
                  {t('yes')}
                </ButtonCustom>
              </Stack>
            </DialogActionsTws>
          </Dialog>
          <Dialog open={stateOpenDialogExport} onClose={handleDialogExport}>
            <DialogTitleTws>
              <IconButton onClick={handleDialogExport}>
                <X size={20} />
              </IconButton>
            </DialogTitleTws>
            <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
              Export Invoice External Order
            </TypographyH2>
            <DialogContentTws>
              <DialogContentTextTws>
                Are You Sure To Export This External Order
              </DialogContentTextTws>
            </DialogContentTws>
            <DialogActionsTws>
              <Stack spacing={2} direction="row">
                <ButtonCancel
                  onClick={handleDialogExport}
                  variant="outlined"
                  size="large"
                >
                  {t('no')}
                </ButtonCancel>
                <ButtonCustom
                  variant="contained"
                  onClick={handleExport}
                  size="large"
                >
                  {t('yes')}
                </ButtonCustom>
              </Stack>
            </DialogActionsTws>
          </Dialog>
        </Box>
      </Drawer>
    </>
  )
}

export default ExternalOrderDetailComponent
