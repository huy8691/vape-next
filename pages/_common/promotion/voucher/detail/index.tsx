import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { ArrowRight, X } from '@phosphor-icons/react'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  TabCustom,
  TabsTws,
  TypographyH2,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { formatMoney } from 'src/utils/money.utils'
import { VoucherData } from '../list/modelVoucher'
import {
  deleteVoucherProduct,
  getListProductOfVoucher,
  getVoucherDetail,
  putActiveDeactivate,
} from './apiVoucherDetail'
import { ProductOfVoucherDetail, VoucherDetail } from './modelVoucherDetail'
import ListSpecificProduct from './part/listSpecificProduct'
import TableAppliedOrder from './part/tableAppliedOrder'
import classes from './styles.module.scss'
import { useTranslation } from 'next-i18next'

const VoucherDetailComponent: React.FC<{
  open: boolean
  onClose: (value: boolean) => void
  stateIdProduct: VoucherData | undefined
  handleGetVoucherList: (query: any) => void
}> = (props) => {
  const { t } = useTranslation('voucher')
  const dispatch = useAppDispatch()
  const [stateVoucherDetail, setStateVoucherDetail] = useState<VoucherDetail>()
  const [reloadDetail, setReloadDetail] = useState('')
  const [pushMessage] = useEnqueueSnackbar()
  const [valueTab, setValueTab] = useState<string>('online-orders')
  const [stateOpenDialog, setStateOpenDialog] = useState(false)
  const [stateProductSelect, setStateProductSelect] = useState<
    ProductOfVoucherDetail[]
  >([])
  const router = useRouter()

  const enumAvailability: {
    [key: string]: string
  } = {
    MARKETPLACE: t('marketplace'),
    AT_STORE: t('atStore'),
  }

  const enumDiscountType: {
    [key: string]: string
  } = {
    PERCENTAGE: t('percentage'),
    FIXEDAMOUNT: t('fixedAmount'),
  }

  const handleGetVariantDetail = () => {
    dispatch(loadingActions.doLoading())
    getVoucherDetail(props.stateIdProduct?.id as number)
      .then((res) => {
        const { data } = res.data
        setStateVoucherDetail(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }

  const handleGetProductOfVoucher = () => {
    dispatch(loadingActions.doLoading())
    getListProductOfVoucher(props.stateIdProduct?.id as number, 1)
      .then((res) => {
        const { totalPages, data } = res.data

        const arrDataReturn: any[] = []
        const arrayTemp: any[] = []

        if (totalPages && totalPages > 1) {
          for (let page = 2; page <= totalPages; page++) {
            arrayTemp.push(
              getListProductOfVoucher(props.stateIdProduct?.id as number, page)
            )
          }
        }

        Promise.all(arrayTemp)
          .then((values) => {
            for (let i = 0; i < values.length; i++) {
              if (values[i].status === 200) {
                const dataPromise: any[] = values[i].data?.data
                  ? values[i].data?.data || []
                  : []

                arrDataReturn.push(...dataPromise)
              }
            }

            setStateProductSelect((prev: ProductOfVoucherDetail[]) => {
              const children = [...prev]

              for (const item of [...data, ...arrDataReturn]) {
                children.push(item)
              }

              return children
            })

            dispatch(loadingActions.doLoadingSuccess())
          })
          .catch((error) => Promise.reject(error))
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }

  const handleChangeTab = (event: React.SyntheticEvent, value: string) => {
    console.log(event)
    setValueTab(value)
  }

  useEffect(() => {
    if (props.open) {
      handleGetVariantDetail()
      handleGetProductOfVoucher()
    } else {
      setStateVoucherDetail(undefined)
    }
  }, [props.open, reloadDetail])

  const handleActiveDeactive = () => {
    dispatch(loadingActions.doLoading())
    putActiveDeactivate(props.stateIdProduct?.id as number)
      .then(() => {
        if (props.stateIdProduct?.status === 'ACTIVATED') {
          pushMessage(
            t('message.changeTheVoucherStatusToDeactivatedSuccessfully'),
            'success'
          )
        }
        if (props.stateIdProduct?.status === 'DEACTIVATED') {
          pushMessage(
            t('message.changeTheVoucherStatusToActivatedSuccessfully'),
            'success'
          )
        }

        setReloadDetail('' + new Date().getTime())
        props.handleGetVoucherList(router.query)
        props.onClose(false)
      })
      .catch(() => {
        pushMessage(t('message.changeTheVoucherStatusFailed'), 'error')
      })
      .finally(() => dispatch(loadingActions.doLoadingSuccess()))
  }

  const handleDialogDelete = () => {
    setStateOpenDialog(!stateOpenDialog)
  }

  const handleDeleteActivityLog = () => {
    dispatch(loadingActions.doLoading())
    if (props.stateIdProduct?.id) {
      deleteVoucherProduct(props.stateIdProduct?.id)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          handleDialogDelete()
          pushMessage(
            t('message.theVoucherHasBeenDeletedSuccessfully'),
            'success'
          )
          props.handleGetVoucherList(router.query)
          props.onClose(false)
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }

  return (
    <>
      <Drawer
        anchor="right"
        open={props.open}
        onClose={() => props.onClose(false)}
      >
        <Stack direction="row">
          <Box sx={{ width: '425px', padding: '20px' }}>
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
                {t('voucherDetail')}
              </Typography>
            </Stack>
            {stateVoucherDetail?.status &&
              stateVoucherDetail?.status !== 'EXPIRED' && (
                <ButtonCustom
                  variant="outlined"
                  size="large"
                  sx={{ width: '100%', margin: '15px 0px' }}
                  onClick={handleActiveDeactive}
                >
                  {stateVoucherDetail.status === 'ACTIVATED' && t('deactivate')}
                  {stateVoucherDetail.status === 'DEACTIVATED' && t('activate')}
                </ButtonCustom>
              )}

            <Box
              sx={{
                width: '100%',
                border: '1px solid #E1E6EF',
                padding: '25px',
                borderRadius: '10px',
                marginBottom: '15px',
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                sx={{ marginBottom: '10px' }}
              >
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#49516F',
                  }}
                >
                  {t('title')}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#0A0D14',
                  }}
                >
                  {stateVoucherDetail?.title || 'N/A'}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                sx={{ marginBottom: '10px' }}
              >
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#49516F',
                  }}
                >
                  {t('code')}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#0A0D14',
                  }}
                >
                  {stateVoucherDetail?.code || 'N/A'}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                sx={{ marginBottom: '10px' }}
              >
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#49516F',
                  }}
                >
                  {t('discountType')}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#0A0D14',
                  }}
                >
                  {enumDiscountType[stateVoucherDetail?.type as string] ||
                    'N/A'}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                sx={{ marginBottom: '10px' }}
              >
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#49516F',
                  }}
                >
                  {t('discountAmount')}
                </Typography>
                {stateVoucherDetail?.type ? (
                  <Typography
                    sx={{
                      fontWeight: '400',
                      color: '#0A0D14',
                    }}
                  >
                    {stateVoucherDetail?.type === 'PERCENTAGE' &&
                      formatMoney(stateVoucherDetail.discount_amount)}

                    {stateVoucherDetail?.type === 'FIXEDAMOUNT' &&
                      formatMoney(stateVoucherDetail.discount_amount)}
                  </Typography>
                ) : (
                  'N/A'
                )}
              </Stack>
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#49516F',
                  }}
                >
                  {t('status')}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: '700',
                    color: '#1DB46A',
                    fontSize: '14px',
                  }}
                >
                  {t(`${stateVoucherDetail?.status}` as any) || 'N/A'}
                </Typography>
              </Stack>
            </Box>
            <Box
              sx={{
                width: '100%',
                border: '1px solid #E1E6EF',
                padding: '25px',
                borderRadius: '10px',
                marginBottom: '15px',
              }}
            >
              <Typography
                sx={{
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#0A0D14',
                }}
              >
                {t('usageLimit')}
              </Typography>

              <Divider sx={{ margin: '15px 0px' }} />

              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                sx={{ marginBottom: '10px' }}
              >
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#49516F',
                  }}
                >
                  {t('startDate')}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#0A0D14',
                  }}
                >
                  {stateVoucherDetail?.start_date &&
                    moment(stateVoucherDetail?.start_date).format('MM/DD/YYYY')}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                sx={{ marginBottom: '10px' }}
              >
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#49516F',
                  }}
                >
                  {t('endDate')}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#0A0D14',
                  }}
                >
                  {stateVoucherDetail?.expiry_date &&
                    moment(stateVoucherDetail?.expiry_date).format(
                      'MM/DD/YYYY'
                    )}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                sx={{ marginBottom: '10px' }}
              >
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#49516F',
                  }}
                >
                  {t('usageLimitPerVoucher')}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#0A0D14',
                  }}
                >
                  <div className={classes['input-number']}></div>

                  {stateVoucherDetail?.limit_per_voucher?.toLocaleString(
                    'en-US'
                  ) || 'N/A'}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#49516F',
                  }}
                >
                  {t('usageLimitPerUser')}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#0A0D14',
                  }}
                >
                  {stateVoucherDetail?.limit_per_user?.toLocaleString(
                    'en-US'
                  ) || 'N/A'}
                </Typography>
              </Stack>
            </Box>
            <Box
              sx={{
                width: '100%',
                border: '1px solid #E1E6EF',
                padding: '25px',
                borderRadius: '10px',
                marginBottom: '15px',
              }}
            >
              <Typography
                sx={{
                  fontWeight: '500',
                  fontSize: '14px',
                  color: '#0A0D14',
                }}
              >
                {t('restriction')}
              </Typography>

              <Divider sx={{ margin: '15px 0px' }} />

              <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                sx={{ marginBottom: '10px' }}
              >
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#49516F',
                  }}
                >
                  {t('maximumDiscountAmount')}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#0A0D14',
                  }}
                >
                  {stateVoucherDetail?.max_discount_amount
                    ? formatMoney(stateVoucherDetail.max_discount_amount)
                    : 'N/A'}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#49516F',
                  }}
                >
                  {t('minimumSpend')}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#0A0D14',
                  }}
                >
                  {stateVoucherDetail?.minimum_spend
                    ? formatMoney(stateVoucherDetail?.minimum_spend)
                    : 'N/A'}
                </Typography>
              </Stack>
            </Box>
            <Box
              sx={{
                width: '100%',
                padding: '25px',
                borderRadius: '10px',
                backgroundColor: '#F8F9FC',
                marginBottom: '15px',
              }}
            >
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#49516F',
                  }}
                >
                  {t('availability')}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#0A0D14',
                  }}
                >
                  {stateVoucherDetail?.availability
                    ? stateVoucherDetail?.availability
                        ?.map((item) => enumAvailability[item])
                        .join(', ')
                    : 'N/A'}
                </Typography>
              </Stack>
            </Box>
            <Box
              sx={{
                width: '100%',
                padding: '25px',
                borderRadius: '10px',
                border: '1px solid #E1E6EF',
                marginBottom: '15px',
              }}
            >
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#49516F',
                  }}
                >
                  {t('productsCoverage')}
                </Typography>
              </Stack>
              <Divider sx={{ margin: '15px 0px' }} />
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Typography
                  sx={{
                    fontWeight: '400',
                    color: '#49516F',
                  }}
                >
                  {stateVoucherDetail?.product_coverage === 'ALL' &&
                    'All Products'}

                  {stateVoucherDetail?.product_coverage !== 'ALL' && (
                    <ListSpecificProduct
                      stateProductSelect={stateProductSelect}
                    />
                  )}
                </Typography>
              </Stack>
            </Box>

            {stateVoucherDetail?.id && (
              <>
                <ButtonCustom
                  variant="outlined"
                  size="large"
                  sx={{ width: '100%', marginBottom: '15px' }}
                  onClick={() =>
                    router.push(
                      `/${platform().toLowerCase()}/promotion/voucher/update/${
                        props.stateIdProduct?.id
                      }`
                    )
                  }
                >
                  {t('editVoucher')}
                </ButtonCustom>
                <ButtonCustom
                  variant="outlined"
                  size="large"
                  sx={{
                    width: '100%',
                    border: '1px solid #E02D3C',
                    color: '#E02D3C',
                    marginBottom: '15px',
                  }}
                  onClick={handleDialogDelete}
                >
                  {t('delete')}
                </ButtonCustom>
                <ButtonCustom
                  variant="outlined"
                  size="large"
                  sx={{ width: '100%', marginBottom: '15px' }}
                >
                  {t('print')}
                </ButtonCustom>
              </>
            )}
          </Box>

          <Box
            sx={{
              width: '850px',
              padding: '20px',
              backgroundColor: '#F8F9FC',
            }}
          >
            <TabContext value={valueTab}>
              <TabsTws
                value={valueTab}
                onChange={handleChangeTab}
                TabIndicatorProps={{
                  children: <span className="MuiTabs-indicatorSpan" />,
                }}
                sx={{ marginBottom: '15px' }}
              >
                <TabCustom
                  label={t('tabs.appliedOnlineOrders')}
                  value="online-orders"
                />
                <TabCustom
                  label={t('tabs.appliedRetailOrders')}
                  value="retail-orders"
                />
              </TabsTws>
              <TabPanel value="online-orders" sx={{ padding: '0' }}>
                <TableAppliedOrder
                  type="online-orders"
                  voucherId={props.stateIdProduct?.id}
                />
              </TabPanel>
              <TabPanel value="retail-orders" sx={{ padding: '0' }}>
                <TableAppliedOrder
                  type="retail-orders"
                  voucherId={props.stateIdProduct?.id}
                />
              </TabPanel>
            </TabContext>
          </Box>
        </Stack>
      </Drawer>

      <Dialog open={stateOpenDialog} onClose={handleDialogDelete}>
        <DialogTitleTws>
          <IconButton onClick={handleDialogDelete}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {t('deleteVoucherOfProducts')}
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>
            {t('areYouSureToDeleteThisVoucher')}
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
    </>
  )
}

export default VoucherDetailComponent
