//React/Next
import React, { ReactElement, useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { NextPageWithLayout } from 'pages/_app.page'
import NestedLayout from 'src/layout/nestedLayout'

//styles
import {
  TextFieldSearchCustom,
  TypographyTitlePage,
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableRowTws,
  TableContainerTws,
  ButtonCustom,
  MenuAction,
} from 'src/components'
import {
  objToStringParam,
  isEmptyObject,
  handlerGetErrMessage,
  platform,
  KEY_MODULE,
  PERMISSION_RULE,
  checkPermission,
} from 'src/utils/global.utils'

//material

import {
  Stack,
  Typography,
  Pagination,
  IconButton,
  Table,
  TableBody,
  TableHead,
  TableRow,
  FormControl,
  // Breadcrumbs,
  MenuItem,
  useMediaQuery,
  Grid,
} from '@mui/material'

import { useTheme } from '@mui/material/styles'
import Link from 'next/link'

import { Gear, MagnifyingGlass } from '@phosphor-icons/react'

//Api
import { getListDistributionChannel } from './distributionChannelAPI'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'

//model
import {
  DistributionChannelType,
  DistributionChannelListResponseType,
} from './distributionChannelModel'

// react-hook-form
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'
import { loadingActions } from 'src/store/loading/loadingSlice'
import Image from 'next/image'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import WithPermission from 'src/utils/permission.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

const DistributionChannel: NextPageWithLayout = () => {
  const { t } = useTranslation('dc')
  const permission = useAppSelector((state) => state.permission.data)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [stateIdDC, setStateIdDC] = useState<number>()

  const openMenu = Boolean(anchorEl)

  // state use for
  const [stateDistributionChannelList, setStateDistributionChannelList] =
    useState<DistributionChannelListResponseType>()

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    console.log(event.currentTarget)
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const theme = useTheme()

  const isMdScr = useMediaQuery(theme.breakpoints.down('md'))
  const isSmScr = useMediaQuery(theme.breakpoints.down('sm'))

  const screen = isSmScr ? 'small' : isMdScr ? 'medium' : 'large'

  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  // event submit
  const onSubmitSearch = (values: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        name: values.name,
      })}`,
    })
  }

  //pagination
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

  // handle call api distribution channel list
  const handleGetListDistributionChannel = useCallback(
    (query: any) => {
      dispatch(loadingActions.doLoading())
      getListDistributionChannel(query)
        .then((res) => {
          const data = res.data
          setStateDistributionChannelList(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((response) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    },
    [dispatch]
  )

  const handleClickItem = (id: number) => {
    if (platform() === 'RETAILER') {
      router.push(`/retailer/market-place/distribution-channel/update/${id}`)
    }
    if (platform() === 'SUPPLIER') {
      router.push(`/supplier/market-place/distribution-channel/update/${id}`)
    }
  }

  useEffect(() => {
    dispatch(loadingActions.doLoading())
    if (router.asPath.length !== router.pathname.length) {
      if (router.query.name) {
        setValue('name', router.query.name)
      }
      if (!isEmptyObject(router.query)) {
        handleGetListDistributionChannel(router.query)
      }
    } else {
      handleGetListDistributionChannel({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, handleGetListDistributionChannel, router])

  const handleCheckGear = () => {
    return checkPermission(
      permission,
      KEY_MODULE.DistributionChannel,
      PERMISSION_RULE.Update
    )
  }
  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        {t('title')}
      </TypographyTitlePage>
      {/* <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Typography>Distribution Channel</Typography>
      </Breadcrumbs> */}
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <form onSubmit={handleSubmit(onSubmitSearch)} className="form-search">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextFieldSearchCustom
                    sx={{ height: { md: 'auto', lg: 'auto', sm: '40px' } }}
                    id="name"
                    error={!!errors.name}
                    placeholder={t('searchChannel')}
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
        {WithPermission(
          <Grid item xs={4}>
            <Link href={`/supplier/market-place/distribution-channel/create`}>
              <a>
                <ButtonCustom
                  variant="contained"
                  sx={{
                    '&.MuiButton-sizeMedium': {
                      fontSize: '1.158rem',
                    },
                    '&.MuiButton-sizeLarge': {
                      fontSize: '1.6rem',
                    },
                  }}
                  size={screen}
                >
                  {t('createChannel')}
                </ButtonCustom>
              </a>
            </Link>
          </Grid>,
          KEY_MODULE.DistributionChannel,
          PERMISSION_RULE.Create
        )}
      </Grid>
      {stateDistributionChannelList?.data.length === 0 ? (
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
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
                {t('youDonTHaveAnyChannel')}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <>
          <TableContainerTws>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws>{t('name')}</TableCellTws>
                  <TableCellTws>{t('code')}</TableCellTws>
                  {handleCheckGear() && (
                    <TableCellTws width={25}>{t('action')}</TableCellTws>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {stateDistributionChannelList?.data?.map(
                  (row: DistributionChannelType, index: number) => {
                    return (
                      <>
                        {checkPermission(
                          permission,
                          KEY_MODULE.DistributionChannel,
                          PERMISSION_RULE.ViewDetails
                        ) ? (
                          <Link
                            key={`item-${index}`}
                            href={`/supplier/market-place/distribution-channel/detail/${row?.id}`}
                          >
                            <TableRowTws hover style={{ cursor: 'pointer' }}>
                              <TableCellTws>{row?.name}</TableCellTws>
                              <TableCellTws>#{row?.code}</TableCellTws>
                              {handleCheckGear() && (
                                <TableCellTws>
                                  <IconButton
                                    onClick={(e) => {
                                      handleOpenMenu(e)
                                      setStateIdDC(row.id)
                                      e.stopPropagation()
                                    }}
                                  >
                                    <Gear size={28} />
                                  </IconButton>
                                </TableCellTws>
                              )}
                            </TableRowTws>
                          </Link>
                        ) : (
                          <TableRowTws>
                            <TableCellTws>{row?.name}</TableCellTws>
                            <TableCellTws>#{row?.code}</TableCellTws>
                            {handleCheckGear() && (
                              <TableCellTws>
                                <IconButton
                                  onClick={(e) => {
                                    handleOpenMenu(e)
                                    setStateIdDC(row.id)
                                    e.stopPropagation()
                                  }}
                                >
                                  <Gear size={28} />
                                </IconButton>
                              </TableCellTws>
                            )}
                          </TableRowTws>
                        )}
                      </>
                    )
                  }
                )}
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
                stateDistributionChannelList
                  ? stateDistributionChannelList?.totalPages
                  : 0
              }
            />
          </Stack>
        </>
      )}

      <MenuAction
        elevation={0}
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {WithPermission(
          <MenuItem onClick={() => handleClickItem(Number(stateIdDC))}>
            {t('update')}
          </MenuItem>,
          KEY_MODULE.DistributionChannel,
          PERMISSION_RULE.Update
        )}
      </MenuAction>
    </>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ['common', 'account', 'dc'])),
    },
  }
}

DistributionChannel.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
DistributionChannel.permissionPage = {
  key_module: KEY_MODULE.DistributionChannel,
  permission_rule: PERMISSION_RULE.ViewList,
}
export default DistributionChannel
