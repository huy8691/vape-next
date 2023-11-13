/* eslint-disable react-hooks/exhaustive-deps */
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { TabContext, TabPanel } from '@mui/lab'
import { Box, IconButton, MenuItem, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import 'react-photo-view/dist/react-photo-view.css'
import {
  BoxCustom,
  ButtonCustom,
  MenuAction,
  TabCustom,
  TabsTws,
  TypographySectionTitle,
} from 'src/components'
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
import { formatMoney } from 'src/utils/money.utils'
import {
  getContactDetail,
  getLastPurchaseOrderOfContact,
  getListAttachmentApi,
  getListContactOption,
  getListContactStatus,
  getListContactType,
  getTotalRevenueOfContact,
  UpdateInformation,
} from './apiContactDetail'
import {
  AttachmentsDataResponseType,
  ContactDetailType,
  LastPODataResponseType,
  SingleChoiceDataResponseType,
  SingleChoiceDataType,
  TotalRevenueOfContact,
} from './modelContactDetail'
import ConvertContactComponent from './part/convertContactToMerchant'
import PurchaseOrders from './part/purchaseOrders'
import ActivityLog from './part/_activity_note_log'
import Note from './part/note'
import WithPermission from 'src/utils/permission.utils'
import { useTranslation } from 'next-i18next'
const arrayValueTab = ['ACTIVITY LOG', 'purchase_order_history']
const DetailsContactComponent = () => {
  const { t } = useTranslation('contact')
  const arrayPermission = useAppSelector((state) => state.permission.data)
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const idContact = Number(router?.query?.id)
  const [stateContactDetail, setStateContactDetail] =
    useState<ContactDetailType>()

  const [valueTab, setValueTab] = useState<string>('ACTIVITY LOG')

  const [anchorElMenuInformation, setAnchorElMenuInformation] =
    useState<null | HTMLElement>(null)

  const [stateInformationMenuAction, setStateInformationMenuAction] =
    useState<string>()

  const [stateContactType, setStateContactType] =
    useState<SingleChoiceDataResponseType>()
  const [stateContactStatus, setStateContactStatus] =
    useState<SingleChoiceDataResponseType>()
  const [stateContactOption, setStateContactOption] =
    useState<SingleChoiceDataResponseType>()
  const [stateLastPO, setStateLastPO] = useState<LastPODataResponseType>()
  const [stateTotalRevenue, setStateTotalRevenue] =
    useState<TotalRevenueOfContact>()

  const openMenuInformation = Boolean(anchorElMenuInformation)
  const [stateAttachments, setStateAttachment] =
    useState<AttachmentsDataResponseType>()
  const [stateSidebar, setStateSidebar] = useState(false)

  const getStateContact = () => {
    dispatch(loadingActions.doLoading())
    getListContactType()
      .then((response) => {
        const data = response.data
        setStateContactType(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })

    getListContactStatus()
      .then((response) => {
        const data = response.data
        setStateContactStatus(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
    getListContactOption()
      .then((response) => {
        const data = response.data
        setStateContactOption(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
    if (
      checkPermission(
        arrayPermission,
        KEY_MODULE.Contact,
        PERMISSION_RULE.ViewLastPurchaseOrder
      )
    ) {
      getLastPurchaseOrderOfContact(idContact)
        .then((response) => {
          const data = response.data
          setStateLastPO(data)

          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
    if (
      checkPermission(
        arrayPermission,
        KEY_MODULE.Contact,
        PERMISSION_RULE.ViewTotalRevenue
      )
    ) {
      getTotalRevenueOfContact(idContact)
        .then((response) => {
          const data = response.data
          setStateTotalRevenue(data)

          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }

  //attachments

  const getListAttachments = () => {
    dispatch(loadingActions.doLoading())
    getListAttachmentApi(Number(router.query.id))
      .then((res) => {
        const { data } = res
        setStateAttachment(data)
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

  // Information

  const handleOpenMenuInformation = (
    event: React.MouseEvent<HTMLElement>,
    typeOpen: string
  ) => {
    setAnchorElMenuInformation(event.currentTarget)
    setStateInformationMenuAction(typeOpen)
  }

  const handleCloseMenuInformation = () => {
    setAnchorElMenuInformation(null)
  }

  // Additional Information

  const handleChangeStatusInformation = (item: SingleChoiceDataType) => {
    // Contact / Sale / Wonlost
    // console.log('data', item)
    if (stateInformationMenuAction == 'Sale') {
      UpdateInformation(Number(router.query.id), { contact_status: item.id })
        .then(() => {
          pushMessage(
            t('message.theSaleStatusHasBeenChangedToItemName', item.name),
            'success'
          )
          dispatch(loadingActions.doLoadingSuccess())
          handleGetContactDetail()
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
    if (stateInformationMenuAction == 'Contact') {
      UpdateInformation(Number(router.query.id), { contact_type: item.id })
        .then(() => {
          pushMessage(
            t('message.theContactTypeHasBeenChangedToItemName', {
              0: item.name,
            }),
            'success'
          )
          dispatch(loadingActions.doLoadingSuccess())
          handleGetContactDetail()
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
    if (stateInformationMenuAction == 'Wonlost') {
      UpdateInformation(Number(router.query.id), { contact_option: item.id })
        .then(() => {
          pushMessage(
            t('message.theLeadHasBeenMarkedAsItemName', { 0: item.name }),
            'success'
          )
          dispatch(loadingActions.doLoadingSuccess())
          handleGetContactDetail()
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }

    handleCloseMenuInformation()
  }

  // Handle change tab log type
  const handleChangeTab = (event: React.SyntheticEvent, value: string) => {
    console.log('🚀 ~  event:', event, value)
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          page: 1,
          limit: 10,
          log_type__name: value,
        })}`,
      },
      undefined,
      { scroll: false }
    )

    setValueTab(value)
  }
  // Handle change tab purchase order history

  const handleGetContactDetail = useCallback(() => {
    dispatch(loadingActions.doLoading())
    getContactDetail(idContact)
      .then((response) => {
        const { data } = response.data
        setStateContactDetail(data)
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
  }, [router.query])

  useEffect(() => {
    if (idContact) {
      handleGetContactDetail()
      getListAttachments()
      getStateContact()
    }
  }, [idContact])
  useEffect(() => {
    if (
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Contact,
        PERMISSION_RULE.ViewListActivityLog
      )
    ) {
      setValueTab(arrayValueTab[1])
    } else if (
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Contact,
        PERMISSION_RULE.ViewListPurchaseOrderOfContact
      )
    ) {
      setValueTab('')
    }
  }, [])
  const handleCloseDrawer = () => {
    setStateSidebar(false)
  }
  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ marginBottom: '15px' }}
      >
        <TypographySectionTitle sx={{ fontSize: '2rem', marginBottom: 0 }}>
          {stateContactDetail?.business_name
            ? stateContactDetail.business_name
            : 'N/A'}
        </TypographySectionTitle>
        {WithPermission(
          <ButtonCustom
            variant="contained"
            size="small"
            onClick={() => {
              setStateSidebar(true)
            }}
          >
            {t('details.convertLeadToRetailer')}
          </ButtonCustom>,
          KEY_MODULE.Contact,
          PERMISSION_RULE.Convert
        )}
      </Stack>
      <Grid container spacing={2}>
        <Grid xs={8} sx={{ marginBottom: '25px' }}>
          <BoxCustom sx={{ marginBottom: '15px' }}>
            <Stack spacing={2} sx={{ color: '#49516F' }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography> {t('details.businessName')}</Typography>
                <Typography sx={{ fontWeight: '500' }}>
                  {stateContactDetail?.business_name}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography> {t('details.firstName')}</Typography>
                <Typography sx={{ fontWeight: '500' }}>
                  {stateContactDetail?.first_name}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography> {t('details.lastName')}</Typography>
                <Typography sx={{ fontWeight: '500' }}>
                  {stateContactDetail?.last_name}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography> {t('details.phoneNumber')}</Typography>
                <Typography sx={{ fontWeight: '500' }}>
                  {formatPhoneNumber(
                    stateContactDetail?.phone_number
                      ? stateContactDetail?.phone_number
                      : 'N/A'
                  )}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography> {t('details.email')}</Typography>
                <Typography sx={{ fontWeight: '500' }}>
                  {stateContactDetail?.email
                    ? stateContactDetail?.email
                    : 'N/A'}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography> {t('details.federalTaxId')}</Typography>
                <Typography sx={{ fontWeight: '500' }}>
                  {stateContactDetail?.federal_tax_id}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography> {t('details.address')}</Typography>
                <Typography sx={{ fontWeight: '500' }}>
                  {stateContactDetail?.address}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography> {t('details.leadType')}</Typography>
                <Typography sx={{ fontWeight: '500' }}>
                  {stateContactDetail?.lead_type}
                </Typography>
              </Stack>
            </Stack>
          </BoxCustom>
          <BoxCustom>
            <Stack spacing={2} sx={{ color: '#49516F' }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography> {t('details.contactType')}</Typography>
                <Stack direction="row">
                  <Typography sx={{ fontWeight: '500' }}>
                    {stateContactDetail?.contact_type?.name
                      ? stateContactDetail?.contact_type?.name
                      : 'N/A'}
                  </Typography>
                  {WithPermission(
                    <IconButton
                      onClick={(e) => handleOpenMenuInformation(e, 'Contact')}
                      sx={{ padding: '0px' }}
                    >
                      <ArrowDropDownIcon />
                    </IconButton>,
                    KEY_MODULE.Contact,
                    PERMISSION_RULE.Update
                  )}
                </Stack>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography> {t('details.leadSource')}</Typography>
                <Stack direction="row">
                  <Typography sx={{ fontWeight: '500', paddingRight: '25px' }}>
                    {stateContactDetail?.type_of_lead?.name
                      ? `${stateContactDetail?.type_of_lead?.name}`
                      : 'N/A'}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography> {t('details.expectedRevenue')}</Typography>
                <Typography sx={{ fontWeight: '500', paddingRight: '25px' }}>
                  {stateContactDetail?.expected_revenue
                    ? formatMoney(stateContactDetail?.expected_revenue)
                    : 'N/A'}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography> {t('details.saleStatus')}</Typography>
                <Stack direction="row">
                  <Typography sx={{ fontWeight: '500' }}>
                    {stateContactDetail?.contact_status?.name
                      ? stateContactDetail?.contact_status?.name
                      : 'N/A'}
                  </Typography>
                  {WithPermission(
                    <IconButton
                      onClick={(e) => handleOpenMenuInformation(e, 'Sale')}
                      sx={{ padding: '0px' }}
                    >
                      <ArrowDropDownIcon />
                    </IconButton>,
                    KEY_MODULE.Contact,
                    PERMISSION_RULE.Update
                  )}
                </Stack>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography> {t('details.wonLost')}</Typography>
                <Stack direction="row">
                  <Typography sx={{ fontWeight: '500' }}>
                    {stateContactDetail?.contact_option?.name
                      ? stateContactDetail?.contact_option?.name
                      : 'N/A'}
                  </Typography>
                  {WithPermission(
                    <IconButton
                      onClick={(e) => handleOpenMenuInformation(e, 'Wonlost')}
                      sx={{ padding: '0px' }}
                    >
                      <ArrowDropDownIcon />
                    </IconButton>,
                    KEY_MODULE.Contact,
                    PERMISSION_RULE.Update
                  )}
                </Stack>
              </Stack>
            </Stack>
          </BoxCustom>
        </Grid>
        <Grid xs={4}>
          {WithPermission(
            <Box
              sx={{
                border: '1px solid #E1E6EF',
                borderRadius: '10px',
                padding: '15px',
                marginBottom: '15px',
              }}
            >
              <Stack spacing={2}>
                <Typography sx={{ color: '#49516F' }}>
                  {' '}
                  {t('details.totalRevenue')}
                </Typography>
                <Typography
                  sx={{ fontWeight: 700, fontSize: '2.4rem', color: '#49516F' }}
                >
                  {stateTotalRevenue?.data?.total_revenue
                    ? formatMoney(stateTotalRevenue?.data?.total_revenue)
                    : 'N/A'}
                </Typography>
              </Stack>
            </Box>,
            KEY_MODULE.Contact,
            PERMISSION_RULE.ViewTotalRevenue
          )}
          {WithPermission(
            <Box
              sx={{
                border: '1px solid #E1E6EF',
                borderRadius: '10px',
                padding: '15px',
                marginBottom: '15px',
              }}
            >
              <Stack spacing={1}>
                <Typography sx={{ color: '#49516F' }}>
                  {t('details.lastPurchaseOrder')}
                </Typography>
                <Stack direction="row" justifyContent="space-between">
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '2.4rem',
                      color: '#49516F',
                    }}
                  >
                    {stateLastPO?.data?.code
                      ? `#${stateLastPO?.data?.code}`
                      : 'N/A'}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: '2.4rem',
                      color: '#49516F',
                    }}
                  >
                    {stateLastPO?.data?.total_billing
                      ? formatMoney(stateLastPO?.data?.total_billing)
                      : formatMoney(0)}
                  </Typography>
                </Stack>
                <Typography sx={{ color: '#49516F' }}>
                  {!stateLastPO?.data?.order_date
                    ? 'N/A'
                    : `${moment(stateLastPO?.data?.order_date).format(
                        'MM/DD/YYYY'
                      )} -
                ${moment(
                  `${moment(stateLastPO?.data?.order_date).format(
                    'MM/DD/YYYY : h:mm:ss a'
                  )}`,
                  'MMDDYYYY : h:mm:ss a'
                ).fromNow()}`}
                </Typography>
              </Stack>
            </Box>,
            KEY_MODULE.Contact,
            PERMISSION_RULE.ViewLastPurchaseOrder
          )}

          {checkPermission(
            arrayPermission,
            KEY_MODULE.Contact,
            PERMISSION_RULE.ViewListAttachments
          ) &&
            Number(stateAttachments?.data?.length) > 0 && (
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
      </Grid>

      <MenuAction
        elevation={0}
        anchorEl={anchorElMenuInformation}
        open={openMenuInformation}
        onClose={handleCloseMenuInformation}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ Width: '125px' }}
      >
        {stateInformationMenuAction == 'Contact'
          ? stateContactType?.data?.map((item: any) => {
              if (item.name !== stateContactDetail?.contact_type.name) {
                return (
                  <MenuItem
                    onClick={() => handleChangeStatusInformation(item)}
                    value={item.id}
                    key={item.id}
                  >
                    {item.name}
                  </MenuItem>
                )
              }
            })
          : stateInformationMenuAction == 'Sale'
          ? stateContactStatus?.data.map((item: any) => {
              if (item.name !== stateContactDetail?.contact_status.name) {
                return (
                  <MenuItem
                    onClick={() => handleChangeStatusInformation(item)}
                    key={item.id}
                  >
                    {item.name}
                  </MenuItem>
                )
              }
            })
          : stateInformationMenuAction == 'Wonlost' &&
            stateContactOption?.data.map((item: any) => {
              if (item.name !== stateContactDetail?.contact_option.name) {
                return (
                  <MenuItem
                    onClick={() => handleChangeStatusInformation(item)}
                    key={item.id}
                  >
                    {item.name}
                  </MenuItem>
                )
              }
            })}
      </MenuAction>

      <TabContext value={valueTab}>
        <TabsTws
          value={valueTab}
          defaultValue="ACTIVITY LOG"
          onChange={handleChangeTab}
          TabIndicatorProps={{
            children: <span className="MuiTabs-indicatorSpan" />,
          }}
        >
          {/* {WithPermission(
            <Box>
              <TabCustom label="Activity Log" value="ACTIVITY LOG" />
            </Box>,
            KEY_MODULE.Contact,
            PERMISSION_RULE.ViewListActivityLog
          )} */}
          {checkPermission(
            arrayPermission,
            KEY_MODULE.Contact,
            PERMISSION_RULE.ViewListActivityLog
          ) && <TabCustom label="Activity Log" value="ACTIVITY LOG" />}
          ,
          {checkPermission(
            arrayPermission,
            KEY_MODULE.Contact,
            PERMISSION_RULE.ViewListActivityLog
          ) && <TabCustom label="Notes" value="NOTE" />}
          {checkPermission(
            arrayPermission,
            KEY_MODULE.Contact,
            PERMISSION_RULE.ViewListPurchaseOrderOfContact
          ) && (
            <TabCustom
              label="Purchase Order History"
              value="purchase_order_history"
            />
          )}
        </TabsTws>
        <TabPanel value="ACTIVITY LOG" style={{ padding: '10px 0px' }}>
          <ActivityLog handleGetAttachments={getListAttachments} />
        </TabPanel>
        <TabPanel value="NOTE" style={{ padding: '10px 0px' }}>
          <Note />
        </TabPanel>
        <TabPanel
          value="purchase_order_history"
          style={{ padding: '10px 0px' }}
        >
          <PurchaseOrders />
        </TabPanel>
      </TabContext>
      {WithPermission(
        <ConvertContactComponent
          stateOpenModal={stateSidebar}
          handleCloseModal={handleCloseDrawer}
          stateContactDetail={stateContactDetail}
          handleGetContact={handleGetContactDetail}
        />,
        KEY_MODULE.Contact,
        PERMISSION_RULE.Convert
      )}
    </>
  )
}

export default React.memo(DetailsContactComponent)
