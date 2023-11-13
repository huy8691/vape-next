import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement, useMemo } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import {
  // Breadcrumbs,
  FormControl,
  IconButton,
  Pagination,
  Stack,
  Tab,
  Table,
  TableBody,
  TableHead,
  Tabs,
  Typography,
} from '@mui/material'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/system'
import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { Controller, useForm } from 'react-hook-form'
import {
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldSearchCustom,
  TypographyTitlePage,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  checkPermission,
  handlerGetErrMessage,
  isEmptyObject,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
  platform,
} from 'src/utils/global.utils'
import { formatMoney } from 'src/utils/money.utils'
import * as yup from 'yup'
import { getListPurchaseOrder } from './purchaseApi'
import { purchaseOrderResponseTypeData } from './purchaseModel'
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

const PurchaseOrder: NextPageWithLayout = () => {
  const { t } = useTranslation(['field-sales-orders'])
  const permission = useAppSelector((state) => state.permission.data)
  // state use for tab
  const [valueTab, setValueTab] = useState<string | string[] | null>(null)
  //message
  const [pushMessage] = useEnqueueSnackbar()
  const [stateGetListPurchase, setStateGetListPurchase] =
    useState<purchaseOrderResponseTypeData>()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const Status = useMemo(
    () => [
      {
        status: 'WAITING_FOR_APPROVED',
        text: t('confirmation'),
        color: '#49516F',
      },
      {
        status: 'APPROVED',
        text: t('confirmed'),
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
  //search
  //search
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
            t('specialCharacterAreNotAllowedForThisField')
          ),
      })
    ),
  })
  const handleSearch = (values: any) => {
    if (hasWhiteSpace(values.code)) {
      pushMessage('Error', 'error')
    }
    if (hasSpecialCharacter(values.code)) {
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

  // Pagination
  const handleChangePagination = (e: any, page: number) => {
    console.log(e)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
  }
  // change per page
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
  //call api
  const handleGetListPurchase = (query: any) => {
    dispatch(loadingActions.doLoading())
    getListPurchaseOrder(query)
      .then((res) => {
        console.log('🚀 ~ file: index.page.tsx:189 ~ .then ~ res', res)

        const data = res.data
        console.log(data)
        setStateGetListPurchase(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response

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
        handleGetListPurchase(router.query)
      }
    } else {
      handleGetListPurchase({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router])

  return (
    <>
      <Head>
        <title>{t('title')} | VAPE</title>
      </Head>
      <TypographyTitlePage mb={2}>{t('title')}</TypographyTitlePage>
      {/* <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Typography>Field Sales Orders</Typography>
      </Breadcrumbs> */}
      <TabsTws
        value={valueTab}
        onChange={handleChangeTab}
        aria-label="basic tabs example"
        TabIndicatorProps={{
          children: <span className="MuiTabs-indicatorSpan" />,
        }}
      >
        <TabCustom label={t('allOrders')} value={null} />
        <TabCustom label={t('confirmation')} value="WAITING_FOR_APPROVED" />
        <TabCustom label={t('confirmed')} value="APPROVED" />
        <TabCustom label={t('rejected')} value="REJECTED" />
      </TabsTws>
      <Grid container spacing={2}>
        <Grid xs>
          <form onSubmit={handleSubmit(handleSearch)} className="form-search">
            {/* <form> */}

            <Controller
              control={control}
              name="code"
              render={({ field }) => (
                <>
                  <FormControl fullWidth>
                    <TextFieldSearchCustom
                      error={!!errors.code}
                      placeholder={t('searchOrderByCode')}
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
        </Grid>
      </Grid>
      {stateGetListPurchase?.data.length === 0 ? (
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
                  {t('thereAreNoOrdersAtThisTime')}
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
                  <TableCellTws>{t('orderNumber')}</TableCellTws>
                  <TableCellTws>{t('createdDate')}</TableCellTws>
                  <TableCellTws align="right">{t('totalBilling')}</TableCellTws>
                  <TableCellTws>{t('status')}</TableCellTws>
                  <TableCellTws>{t('businessName')}</TableCellTws>
                  <TableCellTws>{t('federalTaxId')}</TableCellTws>
                </TableRowTws>
              </TableHead>
              <TableBody>
                {stateGetListPurchase?.data?.map((item, index: any) => {
                  return (
                    <React.Fragment key={`item-${index}`}>
                      <TableRowTws
                        hover={checkPermission(
                          permission,
                          KEY_MODULE.PurchaseOrder,
                          PERMISSION_RULE.ViewDetails
                        )}
                        onClick={() => {
                          if (
                            checkPermission(
                              permission,
                              KEY_MODULE.PurchaseOrder,
                              PERMISSION_RULE.ViewDetails
                            )
                          ) {
                            router.push(
                              `/${platform().toLowerCase()}/market-place/field-sales-orders/detail/${
                                item.id
                              }/`
                            )
                          }
                        }}
                        sx={{
                          cursor: checkPermission(
                            permission,
                            KEY_MODULE.PurchaseOrder,
                            PERMISSION_RULE.ViewDetails
                          )
                            ? 'pointer'
                            : '',
                        }}
                      >
                        <TableCellTws>{item.purchase_order_code}</TableCellTws>
                        <TableCellTws>
                          {moment(item.created_at).format(
                            'MM/DD/YYYY - hh:mm A'
                          )}
                        </TableCellTws>
                        <TableCellTws align="right">
                          {formatMoney(item.total_value)}
                        </TableCellTws>
                        <TableCellTws
                          style={{
                            textTransform: 'capitalize',
                            color: `${
                              Status.find(
                                (items) => items.status === item?.status
                              )?.color
                            }`,
                          }}
                        >
                          {Status?.find(
                            (items) => items.status === item?.status
                          )?.text.toLowerCase()}
                        </TableCellTws>
                        <TableCellTws>
                          {item.contact_detail.business_name}
                        </TableCellTws>
                        <TableCellTws>
                          {item.contact_detail.federal_tax_id}
                        </TableCellTws>
                      </TableRowTws>
                    </React.Fragment>
                  )
                })}
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
              defaultPage={1}
              page={Number(router.query.page) ? Number(router.query.page) : 1}
              onChange={(e, page: number) => handleChangePagination(e, page)}
              count={
                stateGetListPurchase ? stateGetListPurchase?.totalPages : 0
              }
            />
          </Stack>
        </>
      )}
    </>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'order',
        'field-sales-orders',
      ])),
    },
  }
}

PurchaseOrder.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
PurchaseOrder.permissionPage = {
  key_module: KEY_MODULE.PurchaseOrder,
  permission_rule: PERMISSION_RULE.ViewList,
}
export default PurchaseOrder
