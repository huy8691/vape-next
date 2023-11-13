import {
  FormControl,
  FormHelperText,
  IconButton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableHead,
  Tabs,
  Tooltip,
  Typography,
  Pagination,
  // Breadcrumbs,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { NextPageWithLayout } from 'pages/_app.page'
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { styled } from '@mui/system'
import { MagnifyingGlass } from '@phosphor-icons/react'

import { formatMoney } from 'src/utils/money.utils'
import {
  isEmptyObject,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
} from 'src/utils/global.utils'

// store

// react-hook-form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { getOrders } from './apiOrders'
import { OrderListDataResponseType } from './modelOrders'
import moment from 'moment'
import Image from 'next/image'
import {
  TableCellTws,
  TableRowTws,
  SelectPaginationCustom,
  MenuItemSelectCustom,
  TableContainerTws,
  TypographyTitlePage,
  TextFieldSearchCustom,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import Head from 'next/head'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

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
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 24,
    width: '100%',
    backgroundColor: theme.palette.primary.main,
  },
}))
const TabCustom = styled(Tab)(() => ({
  fontSize: '1.4rem',
  fontWeight: '400',
  textTransform: 'capitalize',
}))

const OrderManagement: NextPageWithLayout = () => {
  const { t } = useTranslation('order')

  const [pushMessage] = useEnqueueSnackbar()

  // state use for tab

  const [valueTab, setValueTab] = useState<string | string[] | null>(null)
  // state use for list order
  const [stateDataOrders, setStateDataOrders] =
    useState<OrderListDataResponseType>()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const arrayPermission = useAppSelector((state) => state.permission.data)
  const Status = useMemo(
    () => [
      {
        text: 'WAITING_FOR_APPROVED',
        color: '#49516F',
        textDisplay: t('confirmation'),
      },
      {
        text: 'APPROVED',
        color: '#1DB46A',
        textDisplay: t('confirmed'),
      },
      {
        text: 'READY_FOR_SHIPPING',
        color: '#49516F',
        textDisplay: t('readyForShipping'),
      },
      {
        text: 'DELIVERING',
        color: '#2F6FED',
        textDisplay: t('delivering'),
      },
      {
        text: 'DELIVERED',
        color: '#1DB46A',
        textDisplay: t('delivered'),
      },
      {
        text: 'CANCELLED',
        color: '#E02D3C',
        textDisplay: t('cancel'),
      },
    ],
    [t]
  )
  // check error value form
  const hasWhiteSpace = (s: string) => {
    return /^\s+$/g.test(s)
  }
  const hasSpecialCharacter = (input: string) => {
    // eslint-disable-next-line no-useless-escape
    return /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-\/\\?\,]+$/g.test(
      input
    )
  }

  //pagination
  const handleChangePagination = (event: any, page: number) => {
    console.log(event)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
  }
  // trigger when change row per page option ( page size )
  const handleChangeRowsPerPage = (event: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: Number(event.target.value),
        page: 1,
      })}`,
    })
  }

  // change tab
  const handleChangeTab = (event: React.SyntheticEvent, value: string) => {
    console.log(event)
    setValueTab(value)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        status: value,
        page: 1,
      })}`,
    })
  }
  const {
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ code: string | string[] }>({
    defaultValues: {
      code: '',
    },
    resolver: yupResolver(
      yup.object().shape({
        code: yup
          .string()
          .matches(
            /^[\w-_.]*$/,
            'Special character are not allowed for this field '
          ),
      })
    ),
  })

  const handleGetOrders = (query: any) => {
    dispatch(loadingActions.doLoading())
    getOrders(query)
      .then((res) => {
        const data = res.data
        setStateDataOrders(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  useEffect(() => {
    if (router.asPath.length !== router.pathname.length) {
      if (router.query.code) {
        setValue('code', router.query.code)
      }
      if (router.query.status) {
        setValueTab(router.query.status)
      }
      if (!isEmptyObject(router.query)) {
        handleGetOrders(router.query)
      }
    } else {
      handleGetOrders({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.query])

  const onSubmit = (values: any) => {
    if (hasWhiteSpace(values.code) || hasSpecialCharacter(values.code)) {
      pushMessage('Error', 'error')
    } else {
      router.replace({
        search: `${objToStringParam({
          ...router.query,
          code: values.code,
          page: 1,
        })}`,
      })
    }
  }
  const handleRowClick = (id: number) => {
    router.push(`/supplier/market-place/orders/detail/${id}`)
  }

  const checkPermission = (moduleName: string, permissionRule: string) => {
    const foundModule = arrayPermission.findIndex(
      (item) => item.module === moduleName
    )

    if (foundModule < 0) return false
    const permissionObject = arrayPermission[foundModule].permissions
    if (Object.keys(permissionObject).includes(permissionRule)) {
      return true
    } else {
      return false
    }
  }
  return (
    <>
      <Head>
        <title>{t('orderManagement')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2}>{t('orderManagement')}</TypographyTitlePage>
      {/* <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Typography>Order Management</Typography>
      </Breadcrumbs> */}
      <TabsTws
        value={valueTab}
        onChange={handleChangeTab}
        aria-label="basic tabs example"
        TabIndicatorProps={{
          children: <span className="MuiTabs-indicatorSpan" />,
        }}
      >
        <TabCustom label={t('allOrder')} value={null} />
        <TabCustom label={t('confirmation')} value="WAITING_FOR_APPROVED" />
        <TabCustom label={t('readyForShipping')} value="READY_FOR_SHIPPING" />
        <TabCustom label={t('confirmed')} value="APPROVED" />
        <TabCustom label={t('delivering')} value="DELIVERING" />
        <TabCustom label={t('delivered')} value="DELIVERED" />
        <TabCustom label={t('cancelled')} value="CANCELLED" />
      </TabsTws>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-search"
        // style={{ width: 'calc(100% - 400px)' }}
      >
        <Controller
          control={control}
          name="code"
          render={({ field }) => (
            <>
              <FormControl fullWidth>
                <TextFieldSearchCustom
                  id="code"
                  error={!!errors.code}
                  placeholder={t('searchByOrderNo')}
                  onKeyPress={(event) => {
                    if (hasSpecialCharacter(event.key)) {
                      event.preventDefault()
                    }
                  }}
                  {...field}
                />
              </FormControl>
            </>
          )}
        />
        <IconButton
          aria-label="Search"
          type="submit"
          className="form-search__button"
        >
          <MagnifyingGlass size={20} />
        </IconButton>
        <FormHelperText error>{errors.code?.message}</FormHelperText>
      </form>
      {stateDataOrders?.data.length === 0 ? (
        <>
          <Grid container spacing={2} justifyContent="center">
            <Grid>
              <Stack
                p={5}
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src={'/' + '/images/not-found.svg'}
                  alt="Logo"
                  width="200"
                  height="200"
                />
                <Typography variant="h6" sx={{ marginTop: '0' }}>
                  {t('noOrderThisTime')}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
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
                  <TableCellTws>{t('orderNo')}</TableCellTws>
                  <TableCellTws width="210">{t('orderDate')}</TableCellTws>
                  <TableCellTws>{t('orderStatus')}</TableCellTws>
                  <TableCellTws align="right">{t('totalBilling')}</TableCellTws>
                  <TableCellTws>{t('totalBilling')}</TableCellTws>
                  <TableCellTws>{t('receiver')}</TableCellTws>
                  <TableCellTws>{t('retailer')}</TableCellTws>
                </TableRowTws>
              </TableHead>
              <TableBody>
                {stateDataOrders?.data.map((row, index: number) => (
                  <TableRowTws
                    hover={
                      !!checkPermission(
                        KEY_MODULE.Order,
                        PERMISSION_RULE.ViewDetails
                      )
                    }
                    key={`item-${index}`}
                    style={{
                      cursor: checkPermission(
                        KEY_MODULE.Order,
                        PERMISSION_RULE.ViewDetails
                      )
                        ? 'pointer'
                        : '',
                    }}
                    onClick={() => {
                      if (
                        checkPermission(
                          KEY_MODULE.Order,
                          PERMISSION_RULE.ViewDetails
                        )
                      ) {
                        handleRowClick(row.id)
                      } else {
                        return
                      }
                    }}
                  >
                    {/* <TableCell align="center" width={80}>
                    {(router.query.limit ? Number(router.query.limit) : 10) *
                      (router.query.page ? Number(router.query.page) : 1) -
                      (router.query.limit ? Number(router.query.limit) : 10) +
                      index +
                      1}
                  </TableCell> */}
                    <TableCellTws>#{row.code}</TableCellTws>
                    <TableCellTws>
                      {moment(row.orderDate).format('MM/DD/YYYY - hh:mm A')}{' '}
                    </TableCellTws>

                    <TableCellTws
                      style={{
                        textTransform: 'capitalize',
                        color: `${
                          Status.find((item) => item.text === row?.status)
                            ?.color
                        }`,
                      }}
                    >
                      {/* {row.status.toLowerCase()} */}
                      {
                        Status.find((item) => item.text === row?.status)
                          ?.textDisplay
                      }
                    </TableCellTws>
                    <TableCellTws align="right">
                      {formatMoney(row.total_value)}
                    </TableCellTws>
                    <TableCellTws style={{ textTransform: 'capitalize' }}>
                      {t(`${row.payment_status}` as any)}
                    </TableCellTws>
                    <TableCellTws>{row.receiver}</TableCellTws>
                    {row.merchant && row.merchant.length > 15 ? (
                      <Tooltip
                        title={row.merchant}
                        placement="top"
                        arrow
                        sx={{ fontSize: '14px' }}
                      >
                        <TableCellTws
                          style={{
                            maxWidth: '150px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {row.merchant}
                        </TableCellTws>
                      </Tooltip>
                    ) : (
                      <TableCellTws
                        style={{
                          maxWidth: '150px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {row.merchant ? row.merchant : 'N/A'}
                      </TableCellTws>
                    )}
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
            <Typography>{t('rowsPerPage')}</Typography>
            <FormControl sx={{ m: 1 }}>
              <SelectPaginationCustom
                value={
                  Number(router.query.limit) ? Number(router.query.limit) : 10
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
              count={stateDataOrders ? stateDataOrders?.totalPages : 0}
            />
          </Stack>
        </>
      )}
    </>
  )
}

OrderManagement.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
OrderManagement.permissionPage = {
  key_module: KEY_MODULE.Order,
  permission_rule: PERMISSION_RULE.SupplierViewList,
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'account', 'order'])),
    },
  }
}
export default OrderManagement
