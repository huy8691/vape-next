import {
  Box,
  Dialog,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import {
  getDetailSupplierRequest,
  updateStatus,
} from '../../supplierRequestAPI'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { SupplierDetailType } from '../../supplierRequestModel'
import Grid from '@mui/material/Unstable_Grid2'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  TextFieldCustom,
  TypographyH2,
} from 'src/components'
import { styled } from '@mui/material/styles'
import { formatPhoneNumber } from 'src/utils/global.utils'
import moment from 'moment'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { useRouter } from 'next/router'
import { ArrowRight, X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

const ButtonRejectCustom = styled(ButtonCustom)({
  backgroundColor: '#E02D3C',
})
const TypographyCustom = styled(Typography)({
  fontWeight: '500',
  color: '#49516F',
})

const CustomStack = styled(Stack)(({ theme }) => ({
  // background: '#F8F9FC',
  padding: '15px',
  borderRadius: '5px',
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F8F9FC',
}))
const CustomStackContent = styled(Stack)({
  // background: '#F8F9FC',
  justifyContent: 'space-between',
})
type Props = {
  stateShowDetail: boolean
  handleShowDetail: (isVisible: boolean) => void
  stateIdRequest?: number
  handleGetSupplierRequestList: (query: object) => void
}
const DetailSupplierRequest: React.FC<Props> = (props) => {
  const { t } = useTranslation('request-supplier')
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateDialog, setStateDialog] = useState(false)
  const [stateStatus, setStateStatus] = useState('')
  const dispatch = useAppDispatch()
  const [stateDataDetail, setStateDataDetail] = useState<SupplierDetailType>()
  const [stateReasons, setStateReasons] = useState('')
  const Status = useMemo(
    () => [
      {
        status: 'NEW',
        text: t('new'),
        color: '#49516F',
      },
      {
        status: 'APPROVED',
        text: t('approved'),
        color: '#1DB46A',
      },
      {
        status: 'REJECTED',
        text: t('rejected'),
        color: '#E02D3C',
      },
    ],
    [t]
  )
  const handleCloseDetail = () => {
    props.handleShowDetail(false)
  }
  const handleGetSupplierRequestDetail = () => {
    if (!props.stateShowDetail || !props.stateIdRequest) return
    dispatch(loadingActions.doLoading())
    getDetailSupplierRequest(props.stateIdRequest)
      .then((res) => {
        const { data } = res.data
        setStateDataDetail(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(() => {
        pushMessage(t('message.loadingDetailFailure'), 'error')
      })
  }
  useEffect(() => {
    if (!props.stateShowDetail || !props.stateIdRequest) return
    handleGetSupplierRequestDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.stateIdRequest, props.stateShowDetail])

  //update status of supplier request
  const handleUpdateStatus = (status: string) => {
    if (!props.stateIdRequest || stateStatus === '' || !props.stateShowDetail)
      return
    dispatch(loadingActions.doLoading())
    updateStatus(props.stateIdRequest, { status, reasons: stateReasons })
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(`${status} ${t('message.successfully')}`, 'success')
        handleGetSupplierRequestDetail()
        setStateDialog(false)
        setStateStatus('')
        props.handleGetSupplierRequestList(router.query)
        props.handleShowDetail(false)
      })
      .catch(() => {
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(`${status} ${t('message.failure')}`, 'error')
      })
  }
  return (
    <>
      <Drawer
        open={props.stateShowDetail}
        anchor="right"
        onClose={handleCloseDetail}
      >
        <Box sx={{ padding: '30px', width: '850px' }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              marginBottom: '10px',
            }}
          >
            <IconButton onClick={handleCloseDetail}>
              <ArrowRight size={24} />
            </IconButton>
            <Typography
              sx={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: '#49516F',
              }}
            >
              {t('requestDetails')}
            </Typography>
          </Stack>
          <Grid container columnSpacing={4}>
            <Grid xs={6}>
              <CustomStack mb={2}>
                <Stack direction={'row'} spacing={6}>
                  <Typography>Account Email</Typography>
                  <TypographyCustom>
                    {stateDataDetail?.email ? stateDataDetail.email : 'N/A'}
                  </TypographyCustom>
                </Stack>
              </CustomStack>
              <CustomStack mb={2}>
                <Stack direction={'row'} mb={1}>
                  <Typography
                    sx={{
                      fontSize: '1.6rem',
                      fontWeight: 500,
                      color: '#49516F',
                    }}
                  >
                    {t('businessInformation')}
                  </Typography>
                </Stack>
                <>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('businessName')}</Typography>
                    <TypographyCustom>
                      {stateDataDetail?.business_name
                        ? stateDataDetail.business_name
                        : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('businessPhoneNumber')}</Typography>
                    <TypographyCustom>
                      {formatPhoneNumber(
                        stateDataDetail?.business_phone_number
                          ? stateDataDetail?.business_phone_number
                          : 'N/A'
                      )}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent
                    direction={'row'}
                    spacing={6}
                    mb={1.5}
                    justifyContent="space-between"
                  >
                    <Typography>{t('websites')}</Typography>

                    <TypographyCustom>
                      {stateDataDetail?.website_link_url
                        ? stateDataDetail.website_link_url
                        : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('brands')}</Typography>
                    <TypographyCustom>
                      {stateDataDetail?.brands ? stateDataDetail.brands : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('streetAddress')}</Typography>
                    <TypographyCustom>
                      {stateDataDetail?.address
                        ? stateDataDetail.address
                        : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('city')}</Typography>
                    <TypographyCustom>
                      {stateDataDetail?.city ? stateDataDetail.city : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('state')}</Typography>
                    <TypographyCustom>
                      {stateDataDetail?.state ? stateDataDetail.state : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('postalCode')}</Typography>
                    <TypographyCustom>
                      {stateDataDetail?.postal_zipcode
                        ? stateDataDetail.postal_zipcode
                        : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('federalTaxId')}</Typography>
                    <TypographyCustom>
                      {stateDataDetail?.federal_tax_id
                        ? stateDataDetail.federal_tax_id
                        : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('businessTaxDocument')}</Typography>
                    <TypographyCustom
                      style={{
                        width: '100%',
                        maxWidth: '150px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: '#2F6FED',
                      }}
                    >
                      {stateDataDetail?.business_tax_document ? (
                        <>
                          <Link href={stateDataDetail.business_tax_document}>
                            <a target="_blank" rel="noopener noreferrer">
                              {stateDataDetail.business_tax_document}
                            </a>
                          </Link>
                        </>
                      ) : (
                        'N/A'
                      )}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('vaporTobaccoLicense')}</Typography>
                    <TypographyCustom
                      style={{
                        width: '100%',
                        maxWidth: '150px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        color: '#2F6FED',
                      }}
                    >
                      {stateDataDetail?.vapor_tobacco_license ? (
                        <>
                          <Link href={stateDataDetail.vapor_tobacco_license}>
                            <a target="_blank" rel="noopener noreferrer">
                              {stateDataDetail.vapor_tobacco_license}
                            </a>
                          </Link>
                        </>
                      ) : (
                        'N/A'
                      )}
                    </TypographyCustom>
                  </CustomStackContent>
                </>
              </CustomStack>
              <>
                <CustomStack mb={2}>
                  <Stack direction={'row'} mb={1} mt={2}>
                    <Typography
                      sx={{
                        fontSize: '1.6rem',
                        fontWeight: 500,
                        color: '#49516F',
                      }}
                    >
                      {t('ownerInformation')}
                    </Typography>
                  </Stack>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('firstName')}</Typography>
                    <TypographyCustom>
                      {stateDataDetail?.first_name
                        ? stateDataDetail.first_name
                        : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('lastName')}</Typography>
                    <TypographyCustom>
                      {stateDataDetail?.last_name
                        ? stateDataDetail.last_name
                        : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('email')}</Typography>
                    <TypographyCustom>
                      {stateDataDetail?.email ? stateDataDetail.email : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('phoneNumber')}</Typography>
                    <TypographyCustom>
                      {formatPhoneNumber(
                        stateDataDetail?.owner_email
                          ? stateDataDetail?.owner_email
                          : 'N/A'
                      )}
                    </TypographyCustom>
                  </CustomStackContent>
                </CustomStack>
              </>
              <>
                <CustomStack mb={2}>
                  <Stack direction={'row'} mb={1} mt={2}>
                    <Typography
                      sx={{
                        fontSize: '1.6rem',
                        fontWeight: 500,
                        color: '#49516F',
                      }}
                    >
                      {t('pointOfContact')}
                    </Typography>
                  </Stack>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('firstName')}</Typography>
                    <TypographyCustom>
                      {stateDataDetail?.poc_first_name
                        ? stateDataDetail.poc_first_name
                        : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('lastName')}</Typography>
                    <TypographyCustom>
                      {stateDataDetail?.poc_last_name
                        ? stateDataDetail.poc_last_name
                        : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('email')}</Typography>
                    <TypographyCustom>
                      {stateDataDetail?.poc_email
                        ? stateDataDetail.poc_email
                        : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('phoneNumber')}</Typography>
                    <TypographyCustom>
                      {formatPhoneNumber(
                        stateDataDetail?.poc_phone_number
                          ? stateDataDetail?.poc_phone_number
                          : 'N/A'
                      )}
                    </TypographyCustom>
                  </CustomStackContent>
                </CustomStack>
              </>
            </Grid>

            <Grid xs={6}>
              <>
                <CustomStack mb={2}>
                  <Stack direction={'row'} mb={1}>
                    <Typography
                      sx={{
                        fontSize: '1.6rem',
                        fontWeight: 500,
                        color: '#49516F',
                      }}
                    >
                      {t('bankWireInformation')}
                    </Typography>
                  </Stack>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('nameOnAccount')}</Typography>
                    <TypographyCustom>
                      {stateDataDetail?.name_on_account
                        ? stateDataDetail.name_on_account
                        : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('bankName')}</Typography>
                    <TypographyCustom>
                      {stateDataDetail?.bank_name
                        ? stateDataDetail.bank_name
                        : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('bankAddress')}</Typography>
                    <TypographyCustom>
                      {stateDataDetail?.bank_address
                        ? stateDataDetail.bank_address
                        : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('bankPhoneNumber')}</Typography>
                    <TypographyCustom>
                      {formatPhoneNumber(
                        stateDataDetail?.bank_phone_number
                          ? stateDataDetail?.bank_phone_number
                          : 'N/A'
                      )}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('routingNumber')}</Typography>
                    <TypographyCustom>
                      {stateDataDetail?.routing_number
                        ? stateDataDetail.routing_number
                        : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('accountNumber')}</Typography>
                    <TypographyCustom>
                      {stateDataDetail?.account_number
                        ? stateDataDetail.account_number
                        : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                </CustomStack>
              </>
              <>
                <CustomStack mb={2}>
                  <Stack direction={'row'} mb={1} mt={2} spacing={6}>
                    <Typography
                      sx={{
                        fontSize: '1.6rem',
                        fontWeight: 500,
                        color: '#49516F',
                      }}
                    >
                      {t('preferredShippingCarriers')}
                    </Typography>
                  </Stack>
                  <Stack mb={1} mt={1} spacing={6}>
                    <TypographyCustom>
                      {stateDataDetail?.shipping_services
                        ? stateDataDetail.shipping_services
                        : 'N/A'}
                    </TypographyCustom>
                  </Stack>
                </CustomStack>
              </>
              <>
                <CustomStack mb={2}>
                  <Stack direction={'row'} mb={1} mt={2}>
                    <Typography
                      sx={{
                        fontSize: '1.6rem',
                        fontWeight: 500,
                        color: '#49516F',
                      }}
                    >
                      {t('requestInfo')}
                    </Typography>
                  </Stack>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('requestDate')}</Typography>
                    <TypographyCustom>
                      {' '}
                      {stateDataDetail?.updated_at
                        ? moment(stateDataDetail?.updated_at).format('LLL')
                        : 'N/A'}
                    </TypographyCustom>
                  </CustomStackContent>
                  <CustomStackContent direction={'row'} spacing={6} mb={1.5}>
                    <Typography>{t('requestStatus')}</Typography>
                    <TypographyCustom
                      style={{
                        textTransform: 'capitalize',
                        color: `${
                          Status.find(
                            (items) => items.status === stateDataDetail?.status
                          )?.color
                        }`,
                      }}
                    >
                      {Status?.find(
                        (items) => items.status === stateDataDetail?.status
                      )?.text.toLowerCase()}
                    </TypographyCustom>
                  </CustomStackContent>
                </CustomStack>
              </>
              <></>
              <>
                <Stack direction="row" spacing={2} mt={4}>
                  {stateDataDetail?.status === 'NEW' && (
                    <>
                      <ButtonCustom
                        variant="contained"
                        size="large"
                        onClick={() => {
                          setStateStatus('APPROVED'), setStateDialog(true)
                        }}
                      >
                        {t('approve')}
                      </ButtonCustom>
                      <ButtonRejectCustom
                        variant="contained"
                        size="large"
                        onClick={() => {
                          setStateStatus('REJECTED'), setStateDialog(true)
                        }}
                      >
                        {t('reject')}
                      </ButtonRejectCustom>
                    </>
                  )}
                </Stack>
              </>
            </Grid>
          </Grid>
        </Box>
        <Dialog open={stateDialog} onClose={() => setStateDialog(false)}>
          <DialogTitleTws>
            {' '}
            <IconButton onClick={() => setStateDialog(false)}>
              <X size={20} />
            </IconButton>
          </DialogTitleTws>

          <TypographyH2
            sx={{ fontSize: '2.4rem', textTransform: 'capitalize' }}
            alignSelf="center"
          >
            {stateStatus}
          </TypographyH2>
          <DialogContentTws>
            <DialogContentTextTws sx={{ textTransform: 'capitalize' }}>
              {t('areYouSureTo')} {stateStatus}?
            </DialogContentTextTws>
          </DialogContentTws>
          <DialogActionsTws>
            <Stack direction={'column'}>
              {stateStatus === 'REJECTED' && (
                <Stack mb={2}>
                  <TextFieldCustom
                    placeholder="Enter reasons"
                    onChange={(e) => setStateReasons(e.target.value)}
                  />
                </Stack>
              )}
              <Stack spacing={2} direction="row">
                <ButtonCancel
                  onClick={() => setStateDialog(false)}
                  variant="outlined"
                  size="large"
                >
                  {t('no')}
                </ButtonCancel>
                <ButtonCustom
                  variant="contained"
                  onClick={() => {
                    handleUpdateStatus(stateStatus)
                  }}
                  size="large"
                >
                  {t('yes')}
                </ButtonCustom>
              </Stack>
            </Stack>
          </DialogActionsTws>
        </Dialog>
      </Drawer>
    </>
  )
}
export default DetailSupplierRequest
