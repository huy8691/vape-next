import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import { Box, Grid, Stack, Tabs, Typography } from '@mui/material'
import Tab from '@mui/material/Tab'
import { styled } from '@mui/system'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { TypographySectionTitle } from 'src/components'

//Notification
import Link from 'next/link'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  checkPermission,
  formatPhoneNumber,
  handlerGetErrMessage,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
} from 'src/utils/global.utils'
import ActivityLog from './_activity_note_log'
import OrderHistory from './_order-history'
import { getListAttachmentApi, getMerchantDetailAPI } from './detailMerchantAPI'
import { AttachmentsDataResponseType, MerchantDataType } from './merchantModel'
import DiscountComponent from './discount'
import { useTranslation } from 'next-i18next'

const TypographyCustom = styled(Typography)(() => ({
  // background: '#F8F9FC',
  color: '#49516F',
}))

const TabsTws = styled(Tabs)(({ theme }) => ({
  color: '#1B1F27',
  marginBottom: theme.spacing(1),
  '& .Mui-selected': {
    textTransform: 'capitalize',
    fontWeight: '700',
    fontSize: '1.6rem',
  },
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: '3.5px',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 27.7,
    width: '100%',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '10px',
  },
}))

const TabCustom = styled(Tab)(() => ({
  fontSize: '1.4rem',
  fontWeight: '400',
  lineHeight: '2rem',
  textTransform: 'capitalize',
  color: '#1B1F27',
}))
const arrayValueTab = ['ACTIVITY LOG', 'ORDER HISTORY', 'DISCOUNT']
const MerchantDetail: React.FC = () => {
  const { t } = useTranslation('merchant-management')
  const arrayPermission = useAppSelector((state) => state.permission.data)
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()
  const dispatch = useAppDispatch()
  //state MerchantDetail
  const [stateMerchantDetail, setStateMerchantDetail] =
    useState<MerchantDataType>()
  const [stateAttachments, setStateAttachment] =
    useState<AttachmentsDataResponseType>()
  const [valueTab, setValueTab] = useState<string>('ACTIVITY LOG')

  //Tabs
  const handleChangeTab = (_event: React.SyntheticEvent, newValue: string) => {
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          log_type: newValue,
          page: 1,
        })}`,
      },
      undefined,
      { scroll: false }
    )
    console.log('newValue', newValue)
    setValueTab(newValue)
  }

  const getListAttachments = () => {
    console.log('get listtttt')
    getListAttachmentApi(Number(router.query.id))
      .then((res) => {
        const { data } = res
        setStateAttachment(data)
        console.log('???', data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        // if (status === 404) {
        //   router.push('/404')
        // }
      })
  }

  //useEffect
  useEffect(() => {
    if (router.query.id) {
      if (
        !checkPermission(
          arrayPermission,
          KEY_MODULE.Merchant,
          PERMISSION_RULE.ViewListActivityLog
        )
      ) {
        setValueTab(arrayValueTab[1])
      } else if (
        !checkPermission(
          arrayPermission,
          KEY_MODULE.Merchant,
          PERMISSION_RULE.ViewListOrderHistory
        )
      ) {
        setValueTab('')
      }

      dispatch(loadingActions.doLoading())
      if (
        checkPermission(
          arrayPermission,
          KEY_MODULE.Merchant,
          PERMISSION_RULE.ViewListAttachments
        )
      ) {
        getListAttachments()
      }

      getMerchantDetailAPI(Number(router.query.id))
        .then((res) => {
          const { data } = res.data
          setStateMerchantDetail(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
          if (status === 404) {
            router.push('/404')
          }
        })
    }
  }, [router.query.id])

  return (
    <>
      <TypographySectionTitle sx={{ fontSize: '2rem' }}>
        {stateMerchantDetail?.business_name
          ? stateMerchantDetail.business_name
          : 'N/A'}
      </TypographySectionTitle>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box
            sx={{
              padding: '15px',
              borderRadius: '10px',
              backgroundColor: '#F8F9FC',
              gap: 10,
              marginBottom: '25px',
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <TypographyCustom>{t('details.businessName')}</TypographyCustom>
                <TypographyCustom sx={{ fontWeight: 500 }}>
                  {' '}
                  {stateMerchantDetail?.business_name
                    ? stateMerchantDetail.business_name
                    : 'N/A'}
                </TypographyCustom>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <TypographyCustom>{t('details.firstName')}</TypographyCustom>
                <TypographyCustom sx={{ fontWeight: 500 }}>
                  {stateMerchantDetail?.first_name
                    ? stateMerchantDetail.first_name
                    : 'N/A'}{' '}
                </TypographyCustom>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <TypographyCustom>{t('details.lastName')}</TypographyCustom>
                <TypographyCustom sx={{ fontWeight: 500 }}>
                  {stateMerchantDetail?.last_name
                    ? stateMerchantDetail.last_name
                    : 'N/A'}{' '}
                </TypographyCustom>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <TypographyCustom>{t('details.phoneNumber')}</TypographyCustom>
                <TypographyCustom sx={{ fontWeight: 500 }}>
                  {stateMerchantDetail?.phone_number
                    ? formatPhoneNumber(stateMerchantDetail.phone_number)
                    : 'N/A'}{' '}
                </TypographyCustom>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <TypographyCustom>{t('details.email')}</TypographyCustom>
                <TypographyCustom sx={{ fontWeight: 500 }}>
                  {' '}
                  {stateMerchantDetail?.email
                    ? stateMerchantDetail.email
                    : 'N/A'}{' '}
                </TypographyCustom>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <TypographyCustom>{t('details.federalTaxId')}</TypographyCustom>
                <TypographyCustom sx={{ fontWeight: 500 }}>
                  {' '}
                  {stateMerchantDetail?.federal_tax_id
                    ? stateMerchantDetail.federal_tax_id
                    : 'N/A'}{' '}
                </TypographyCustom>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <TypographyCustom>{t('details.address')}</TypographyCustom>
                <TypographyCustom sx={{ fontWeight: 500 }}>
                  {stateMerchantDetail?.address
                    ? stateMerchantDetail.address
                    : 'N/A'}{' '}
                </TypographyCustom>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <TypographyCustom>{t('details.assignee')}</TypographyCustom>
                <TypographyCustom sx={{ fontWeight: 500 }}>
                  {stateMerchantDetail?.assignee.length == 0
                    ? `N/A`
                    : stateMerchantDetail?.assignee
                        ?.map(
                          (item: any) =>
                            ' ' + item?.first_name + item?.last_name
                        )
                        .toString()}
                </TypographyCustom>
              </Stack>
            </Stack>
          </Box>
        </Grid>
        {checkPermission(
          arrayPermission,
          KEY_MODULE.Merchant,
          PERMISSION_RULE.ViewListAttachments
        ) && (
          <Grid item xs={4}>
            {Number(stateAttachments?.data?.length) > 0 && (
              <Box
                sx={{
                  border: '1px solid #E1E6EF',
                  borderRadius: '10px',
                  padding: '15px',
                  marginBottom: '15px',
                }}
              >
                <Typography sx={{ color: '#49516F', marginBottom: '15px' }}>
                  {t('details.attachments')}
                </Typography>
                <Stack direction="column" spacing={2}>
                  {stateAttachments?.data?.map((value: any, index: number) => (
                    <Stack key={index} direction="row" alignItems="center">
                      <Link href={value} target="_blank">
                        <a
                          style={{
                            width: '100%',
                            maxWidth: '135px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            direction: 'rtl',
                            color: '#2F6FED',
                          }}
                        >
                          {value}
                        </a>
                      </Link>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            )}
          </Grid>
        )}
      </Grid>

      <TabContext value={valueTab}>
        <TabsTws
          value={valueTab}
          onChange={handleChangeTab}
          TabIndicatorProps={{
            children: <span className="MuiTabs-indicatorSpan" />,
          }}
          sx={{ marginBottom: '15px' }}
        >
          {checkPermission(
            arrayPermission,
            KEY_MODULE.Merchant,
            PERMISSION_RULE.ViewListActivityLog
          ) && (
            <TabCustom label={t('details.activityLog')} value="ACTIVITY LOG" />
          )}
          {checkPermission(
            arrayPermission,
            KEY_MODULE.Merchant,
            PERMISSION_RULE.ViewListActivityLog
          ) && <TabCustom label={t('details.notes')} value="NOTE" />}
          {checkPermission(
            arrayPermission,
            KEY_MODULE.Merchant,
            PERMISSION_RULE.ViewListOrderHistory
          ) && (
            <TabCustom
              label={t('details.orderHistory')}
              value="ORDER HISTORY"
            />
          )}
          <TabCustom label={t('details.discount')} value="DISCOUNT" />
        </TabsTws>

        {checkPermission(
          arrayPermission,
          KEY_MODULE.Merchant,
          PERMISSION_RULE.ViewListActivityLog
        ) && (
          <TabPanel value="ACTIVITY LOG">
            {(router.query.log_type === 'ACTIVITY LOG' ||
              !router.query.log_type) && (
              <ActivityLog
                queryParam={router.query}
                handleGetAttachments={() => {
                  if (
                    checkPermission(
                      arrayPermission,
                      KEY_MODULE.Merchant,
                      PERMISSION_RULE.ViewListAttachments
                    )
                  ) {
                    getListAttachments()
                  }
                }}
              />
            )}
          </TabPanel>
        )}
        {checkPermission(
          arrayPermission,
          KEY_MODULE.Merchant,
          PERMISSION_RULE.ViewListActivityLog
        ) && (
          <TabPanel value="NOTE">
            {router.query.log_type === 'NOTE' && (
              <ActivityLog
                queryParam={router?.query}
                handleGetAttachments={() => {
                  if (
                    checkPermission(
                      arrayPermission,
                      KEY_MODULE.Merchant,
                      PERMISSION_RULE.ViewListAttachments
                    )
                  ) {
                    getListAttachments()
                  }
                }}
              />
            )}
          </TabPanel>
        )}
        {checkPermission(
          arrayPermission,
          KEY_MODULE.Merchant,
          PERMISSION_RULE.ViewListOrderHistory
        ) && (
          <TabPanel value="ORDER HISTORY">
            <OrderHistory />
          </TabPanel>
        )}
        <TabPanel value="DISCOUNT">
          <DiscountComponent
            merchantId={Number(stateMerchantDetail?.business_id)}
          />
        </TabPanel>
      </TabContext>
    </>
  )
}

export default MerchantDetail
