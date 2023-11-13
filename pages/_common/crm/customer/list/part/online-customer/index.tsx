import {
  Box,
  FormControl,
  IconButton,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getListCustomer } from './onlineCustomerAPI'
import { ListOnlineCustomerResponseType } from './modelOnlineCustomer'
import {
  formatPhoneNumber,
  handlerGetErrMessage,
  objToStringParam,
  platform,
} from 'src/utils/global.utils'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import Grid from '@mui/material/Unstable_Grid2'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { MagnifyingGlass } from '@phosphor-icons/react'
import {
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldSearchCustom,
} from 'src/components'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'

const OnlineCustomerComponent = () => {
  const { t } = useTranslation('customer')
  const dispatch = useAppDispatch()
  const [stateOnlineCustomer, setStateOnlineCustomer] =
    useState<ListOnlineCustomerResponseType>()
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()
  const { control: controlSearch, handleSubmit: handleSubmitSearch } = useForm<{
    search: string
  }>({
    defaultValues: {
      search: '',
    },
    resolver: yupResolver(
      yup.object().shape({
        search: yup.string(),
      })
    ),
  })

  useEffect(() => {
    dispatch(loadingActions.doLoading())
    getListCustomer()
      .then((res) => {
        const { data } = res
        setStateOnlineCustomer(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }, [])
  const handleSearch = (values: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        search: values.search,
        page: 1,
      })}`,
    })
  }
  const handleChangePagination = (e: any, page: number) => {
    console.log(e)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
  }
  const handleChangeRowsPerPage = (event: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: Number(event.target.value),
        page: 1,
      })}`,
    })
  }
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid xs>
          <form
            onSubmit={handleSubmitSearch(handleSearch)}
            className="form-search"
          >
            <Controller
              control={controlSearch}
              name="search"
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextFieldSearchCustom
                    id="search"
                    placeholder={t('searchCustomer')}
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
      </Grid>
      <Box>
        {stateOnlineCustomer?.data?.length !== 0 ? (
          <>
            <TableContainerTws>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCellTws>
                      {' '}
                      {t('list.customerNamePhoneNumber')}
                    </TableCellTws>
                    <TableCellTws>{t('list.emailAddress')}</TableCellTws>
                    <TableCellTws align="center">
                      {t('list.vipStatus')}
                    </TableCellTws>
                    {/* <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                      Action
                    </TableCellTws> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stateOnlineCustomer?.data.map((item, index) => {
                    return (
                      <TableRowTws
                        key={index}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() =>
                          router.push(
                            `/${platform().toLowerCase()}/crm/customer/online-customer-detail/${
                              item.id
                            }/`
                          )
                        }
                      >
                        <TableCellTws>
                          <Stack spacing={1}>
                            <Typography>
                              {item.first_name} {item.last_name}
                            </Typography>
                            <Typography>
                              {formatPhoneNumber(item.phone_number)}
                            </Typography>
                          </Stack>
                        </TableCellTws>
                        <TableCellTws>
                          <Stack spacing={1}>
                            <Typography>{item.email}</Typography>
                            <Typography>{item.address}</Typography>
                          </Stack>
                        </TableCellTws>
                        <TableCellTws align="center">
                          {item.is_vip && (
                            <Typography
                              sx={{ color: '#1DB46A', fontWeight: 600 }}
                            >
                              VIP
                            </Typography>
                          )}
                        </TableCellTws>
                        {/* <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                          >
                            <Gear />
                          </IconButton>
                        </TableCellTws> */}
                      </TableRowTws>
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
              <Typography>{t('list.rowsPerPage')}</Typography>

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
                defaultPage={1}
                page={Number(router.query.page) ? Number(router.query.page) : 1}
                onChange={(event, page: number) =>
                  handleChangePagination(event, page)
                }
                count={
                  stateOnlineCustomer ? stateOnlineCustomer?.totalPages : 0
                }
              />
            </Stack>
          </>
        ) : (
          <Stack p={5} spacing={2} alignItems="center" justifyContent="center">
            <Image
              src={'/' + '/images/not-found.svg'}
              alt="Logo"
              width="200"
              height="200"
            />
            <Typography variant="h6" sx={{ marginTop: '0' }}>
              {t('thereAreNoCustomerAtThisTime')}
            </Typography>
          </Stack>
        )}
      </Box>
    </Box>
  )
}

export default OnlineCustomerComponent
