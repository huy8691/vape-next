// react
import {
  FormControl,
  Pagination,
  Stack,
  Tab,
  Table,
  TableBody,
  TableHead,
  Tabs,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import React, { useEffect, useState } from 'react'

import moment from 'moment'
import { useRouter } from 'next/router'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  checkPermission,
  handlerGetErrMessage,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
  platform,
} from 'src/utils/global.utils'
import { getOrderListOfMerchant } from './orderAPI'

//Model
import Grid from '@mui/material/Grid'
import Image from 'next/image'
import {
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldSearchCustom,
} from 'src/components'
import { formatMoney } from 'src/utils/money.utils'
import { OrderMerchantDataResponseType } from './orderHistoryModel'

//Form
import { yupResolver } from '@hookform/resolvers/yup'
import IconButton from '@mui/material/IconButton'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { Controller, useForm } from 'react-hook-form'
import { schema } from './validations'
import { useTranslation } from 'next-i18next'

const TabsTws = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  '& .Mui-selected': {
    textTransform: 'capitalize',
    fontWeight: '700',
    fontSize: '1.4rem',
  },
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    heigth: '4px',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 24,
    width: '100%',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '10px',
  },
}))
const TabCustom = styled(Tab)(() => ({
  fontSize: '1.4rem',
  fontWeight: '400',
  textTransform: 'capitalize',
}))

const OrderHistory: React.FC = () => {
  const { t } = useTranslation('merchant-management')
  const arrayPermission = useAppSelector((state) => state.permission.data)
  const [pushMessage] = useEnqueueSnackbar()
  const [stateDataOrdersHistory, setStateDataOrdersHistory] =
    useState<OrderMerchantDataResponseType>()

  const [stateValueTab, setStateValueTab] = useState<string | string[] | null>(
    null
  )

  const router = useRouter()
  const dispatch = useAppDispatch()
  const status = router.query.status

  const handleGetOrders = (query: any) => {
    dispatch(loadingActions.doLoading())
    getOrderListOfMerchant(Number(router.query.id), query)
      .then((res) => {
        const { data } = res
        setStateDataOrdersHistory(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const Status = [
    {
      text: 'WAITING FOR APPROVED',
      color: '#49516F',
      textDisplay: t('details.waitingForApproval'),
    },
    {
      text: 'APPROVED',
      color: '#1DB46A',
      textDisplay: t('details.approved'),
    },
    {
      text: 'DELIVERING',
      color: '#2F6FED',
      textDisplay: t('details.delivering'),
    },
    {
      text: 'DELIVERED',
      color: '#1DB46A',
      textDisplay: t('details.delivered'),
    },
    {
      text: 'CANCELLED',
      color: '#E02D3C',
      textDisplay: t('details.cancelled'),
    },
  ]
  //Change Tab

  const handleChangeTab = (_event: React.SyntheticEvent, value: string) => {
    setStateValueTab(value)
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          status: value,
          page: 1,

          search: router.query.search,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }

  //Pagination

  const handleChangePagination = (event: any, page: number) => {
    console.log('e', event)
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          page: page,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }

  const handleChangeRowsPerPage = (event: any) => {
    // handleGetOrders({})
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: Number(event.target.value),
        page: 1,
      })}`,
    })
  }

  useEffect(() => {
    setValueSearch('search', router.query.search)
    handleGetOrders(router.query)
    setStateValueTab(status ? status : null)
  }, [router.query])

  //form search
  const {
    handleSubmit,
    control,
    setValue: setValueSearch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })
  const handleDetailOrder = (id: number) => {
    const url = `/${platform().toLowerCase()}/market-place/purchase-orders/detail/${id}`

    router.push(url)
  }

  const onSubmitSearch = (values: any) => {
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          search: values.search,
          page: 1,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }

  return (
    <>
      <TabsTws
        value={stateValueTab}
        onChange={handleChangeTab}
        aria-label="basic tabs example"
        TabIndicatorProps={{
          children: <span className="MuiTabs-indicatorSpan" />,
        }}
        sx={{ marginBottom: '15px' }}
      >
        <TabCustom label={t('details.allOrders')} value={null} />
        <TabCustom
          label={t('details.waitingForApproval')}
          value="WAITING_FOR_APPROVED"
        />
        <TabCustom label={t('details.approved')} value="APPROVED" />
        <TabCustom label={t('details.delivering')} value="DELIVERING" />
        <TabCustom label={t('details.delivered')} value="DELIVERED" />
        <TabCustom label={t('details.cancelled')} value="CANCELLED" />
      </TabsTws>

      <Grid xs>
        <form onSubmit={handleSubmit(onSubmitSearch)} className="form-search">
          <Controller
            control={control}
            name="search"
            defaultValue=""
            render={({ field }) => (
              <FormControl fullWidth>
                <TextFieldSearchCustom
                  id="search"
                  error={!!errors.search}
                  placeholder={t('details.searchOrderByCode')}
                  {...field}
                />
              </FormControl>
            )}
          />
          <IconButton
            aria-label="Search"
            type="submit"
            className="form-search__button"
          >
            <MagnifyingGlass size={20} />
          </IconButton>
        </form>
      </Grid>

      {stateDataOrdersHistory?.data.length === 0 ? (
        <>
          <Stack p={5} spacing={2} alignItems="center" justifyContent="center">
            <Image
              src={'/' + '/images/not-found.svg'}
              alt="Logo"
              width="200"
              height="200"
            />
            <Typography variant="h6" sx={{ marginTop: '0' }}>
              {t('details.thereAreNoOrdersAtThisTime')}
            </Typography>
          </Stack>
        </>
      ) : (
        <>
          <TableContainerTws>
            <Table>
              <TableHead>
                <TableRowTws>
                  {/* <TableCellHeadingTextTws align="center" width={80}>
                    No.
                  </TableCellHeadingTextTws> */}
                  <TableCellTws>{t('details.orderNo')}</TableCellTws>
                  <TableCellTws>{t('details.dateTime')}</TableCellTws>
                  <TableCellTws>{t('details.totalBilling')}</TableCellTws>
                  <TableCellTws>{t('details.orderStatus')}</TableCellTws>
                  <TableCellTws>{t('details.paymentStatus')}</TableCellTws>
                </TableRowTws>
              </TableHead>
              <TableBody>
                {stateDataOrdersHistory?.data.map((item, index: number) => (
                  <TableRowTws
                    hover={checkPermission(
                      arrayPermission,
                      KEY_MODULE.Order,
                      PERMISSION_RULE.ViewDetails
                    )}
                    key={`item-${index}`}
                    style={{
                      cursor: checkPermission(
                        arrayPermission,
                        KEY_MODULE.Order,
                        PERMISSION_RULE.ViewDetails
                      )
                        ? 'pointer'
                        : '',
                    }}
                    onClick={() => {
                      if (
                        checkPermission(
                          arrayPermission,
                          KEY_MODULE.Order,
                          PERMISSION_RULE.ViewDetails
                        )
                      ) {
                        handleDetailOrder(item.id)
                      }
                    }}
                  >
                    <TableCellTws>
                      #{item.code ? item.code : 'N/A'}
                    </TableCellTws>
                    <TableCellTws>
                      {moment(item.order_date).format('MM/DD/YYYY - h:mm A')}
                    </TableCellTws>

                    <TableCellTws>
                      {formatMoney(item.total_billing)}
                    </TableCellTws>

                    <TableCellTws
                      style={{
                        textTransform: 'capitalize',
                        color: `${
                          Status.find((stt) => stt.text === item?.status)?.color
                        }`,
                      }}
                    >
                      {/* {row.status.toLowerCase()} */}
                      {
                        Status.find((stt) => stt.text === item?.status)
                          ?.textDisplay
                      }
                    </TableCellTws>

                    <TableCellTws style={{ textTransform: 'capitalize' }}>
                      {item.payment_status.toLowerCase()}
                    </TableCellTws>
                  </TableRowTws>
                ))}
              </TableBody>
            </Table>
          </TableContainerTws>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={2}
          >
            <Typography>{t('details.rowsPerPage')}</Typography>
            <FormControl sx={{ m: 1 }}>
              <SelectPaginationCustom
                value={
                  Number(router.query?.limit) ? Number(router.query?.limit) : 10
                }
                onChange={handleChangeRowsPerPage}
                displayEmpty
              >
                <MenuItemSelectCustom value={10}>10</MenuItemSelectCustom>
                <MenuItemSelectCustom value={20}>20</MenuItemSelectCustom>
                <MenuItemSelectCustom value={50}>50</MenuItemSelectCustom>
                <MenuItemSelectCustom value={100}>100</MenuItemSelectCustom>
              </SelectPaginationCustom>
            </FormControl>
            <Pagination
              color="primary"
              variant="outlined"
              shape="rounded"
              // defaultPage={1}
              page={Number(router.query.page) ? Number(router.query.page) : 1}
              onChange={(event, page: number) =>
                handleChangePagination(event, page)
              }
              count={
                stateDataOrdersHistory ? stateDataOrdersHistory?.totalPages : 0
              }
            />
          </Stack>
        </>
      )}
    </>
  )
}

export default OrderHistory
