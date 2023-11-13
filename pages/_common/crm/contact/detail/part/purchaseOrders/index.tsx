import { yupResolver } from '@hookform/resolvers/yup'
import {
  FormControl,
  FormHelperText,
  IconButton,
  Pagination,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableHead,
  Typography,
} from '@mui/material'
import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { MagnifyingGlass } from '@phosphor-icons/react'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import 'react-photo-view/dist/react-photo-view.css'
import {
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TabCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TabsTws,
  TextFieldSearchCustom,
} from 'src/components'
import Grid from '@mui/material/Unstable_Grid2'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  checkPermission,
  handlerGetErrMessage,
  hasSpecialCharacter,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
  platform,
} from 'src/utils/global.utils'

import * as yup from 'yup'
import { formatMoney } from 'src/utils/money.utils'
import {
  PurchaseOrderResponseTypeData,
  ResearchPurchaseOrderType,
} from '../../modelContactDetail'
import { getListPurchaseOrder } from '../../apiContactDetail'
import { useTranslation } from 'next-i18next'

const PurchaseOrders = () => {
  const { t } = useTranslation('contact')
  const arrayPermission = useAppSelector((state) => state.permission.data)
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const idContact = Number(router?.query?.id)
  const [valueTabPurchaseOrder, setValueTabPurchaseOrder] = useState<
    string | string[] | null
  >(null)

  const [stateGetListPurchase, setStateGetListPurchase] =
    useState<PurchaseOrderResponseTypeData>()

  const {
    control: controlSearch,
    handleSubmit: handleSubmitSearch,
    setValue: setValueSearch,
    formState: { errors: errorsSearch },
  } = useForm<{ code: string }>({
    defaultValues: {
      code: '',
    },
    resolver: yupResolver(
      yup.object().shape({
        code: yup.string(),
      })
    ),
  })
  const Status = [
    {
      status: 'WAITING_FOR_APPROVED',
      text: t('details.WAITING_FOR_APPROVED'),
      color: '#49516F',
    },
    {
      status: 'APPROVED',
      text: t('details.APPROVED'),
      color: '#1DB46A',
    },
    {
      status: 'REJECTED',
      text: t('details.REJECTED'),
      color: '#E02D3C',
    },
  ]

  const handleSearch = (values: ResearchPurchaseOrderType) => {
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          code: values.code,
          page: 1,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }

  //handle get purchase order
  const handleGetPurchaseOrder = () => {
    dispatch(loadingActions.doLoading())
    getListPurchaseOrder({ ...router.query })
      .then((response) => {
        const data = response.data
        setStateGetListPurchase(data)
        // console.log('dataaaaaaaa', data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  // Handle change tab purchase order history
  const handleChangeTabPurchaseOrder = (
    _event: React.SyntheticEvent,
    value: string
  ) => {
    setValueTabPurchaseOrder(value)
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          page: 1,
          status: value,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }

  const handleDetailOrder = (id: number) => {
    const url = `${`/${platform().toLowerCase()}/market-place/purchase-order/detail/${id}`}`
    router.push(url)
  }

  useEffect(() => {
    if (router.query.code) {
      setValueSearch('code', `${router.query.code}`)
    }
  }, [router.query.code, setValueSearch])

  useEffect(() => {
    if (idContact && router.query.log_type__name === 'purchase_order_history') {
      handleGetPurchaseOrder()
    }
  }, [
    idContact,
    router.query?.page,
    router.query?.limit,
    router.query?.status,
    router.query?.log_type__name,
    router.query.code,
  ])

  // trigger when change row per page option ( page size )
  const handleChangeRowsPerPage = (event: SelectChangeEvent<unknown>) => {
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          limit: Number(event.target.value),
          page: 1,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }

  // handle delete Activity log

  // handleChangePagination
  const handleChangePagination = (
    event: ChangeEvent<unknown>,
    page: number
  ) => {
    console.log('event', event)
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

  useEffect(() => {
    if (router.query?.status) {
      setValueTabPurchaseOrder(router.query?.status)
    }
  }, [router.query?.status])

  /**
   * A function that is used to get the detail of the activity log.
   */

  return (
    <>
      <TabsTws
        value={valueTabPurchaseOrder}
        onChange={handleChangeTabPurchaseOrder}
        TabIndicatorProps={{
          children: <span className="MuiTabs-indicatorSpan" />,
        }}
      >
        <TabCustom label={t('details.allOrders')} value={null} />
        <TabCustom
          label={t('details.waitingForApproval')}
          value="WAITING_FOR_APPROVED"
        />
        <TabCustom label={t('details.approved')} value="APPROVED" />

        <TabCustom label={t('details.rejected')} value="REJECTED" />
      </TabsTws>
      <Grid container spacing={2}>
        <Grid xs>
          <form
            onSubmit={handleSubmitSearch(handleSearch)}
            className="form-search"
          >
            <Controller
              control={controlSearch}
              name="code"
              render={({ field }) => (
                <>
                  <FormControl fullWidth>
                    <TextFieldSearchCustom
                      error={!!errorsSearch.code}
                      placeholder={t('details.searchPurchaseOrder')}
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

            <FormHelperText error>{errorsSearch.code?.message}</FormHelperText>
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
                  {t('details.thereAreNoNoteAtThisTime')}
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
                  <TableCellTws>
                    {t('details.purchaseOrderNumber')}
                  </TableCellTws>
                  <TableCellTws>{t('details.createdDate')}</TableCellTws>
                  <TableCellTws align="right">
                    {t('details.totalBilling')}
                  </TableCellTws>
                  <TableCellTws>{t('details.status')}</TableCellTws>
                  <TableCellTws>{t('details.businessName')}</TableCellTws>
                  <TableCellTws>{t('details.federalTaxId')}</TableCellTws>
                </TableRowTws>
              </TableHead>
              <TableBody>
                {stateGetListPurchase?.data?.map((item, index: number) => {
                  return (
                    <React.Fragment key={`item-${index}`}>
                      <TableRowTws
                        sx={{
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
            <Typography>{t('details.rowsPerPage')}</Typography>
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

export default PurchaseOrders
