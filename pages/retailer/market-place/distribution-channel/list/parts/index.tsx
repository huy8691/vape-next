/* eslint-disable react-hooks/exhaustive-deps */
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import * as yup from 'yup'

// react-hook-form
import { loadingActions } from 'src/store/loading/loadingSlice'

//Api
import {
  getListOwnedDCMerchant,
  leaveDistributionChannel,
  ListDataDCMerchant,
} from '../apiListDCMerchant'
import {
  ListDCMerchantResponsiveType,
  ListOwnedDCType,
} from '../listDCMerchantModel'

//Src
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  MenuAction,
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TypographyH2,
  TypographyTitlePage,
  TextFieldSearchCustom,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import {
  checkPermission,
  handlerGetErrMessage,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
  isEmptyObject,
} from 'src/utils/global.utils'

//material
import {
  Dialog,
  FormControl,
  IconButton,
  MenuItem,
  Pagination,
  Stack,
  styled,
  Tab,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  Grid,
  Breadcrumbs,
} from '@mui/material'
import moment from 'moment'
import OwnerDCMerchant from '../ownerDc'
import { Gear, X, MagnifyingGlass } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
// react-hook-form
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

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
const TabPanelCustom = styled('div')(() => ({
  minHeight: '300px',
}))
const DCMerchantComponent: React.FC = () => {
  const { t } = useTranslation('dc')

  const permission = useAppSelector((state) => state.permission.data)
  const [listDCMerchant, setListDCMerchant] =
    useState<ListDCMerchantResponsiveType>()
  const [pushMessage] = useEnqueueSnackbar()

  const dispatch = useAppDispatch()
  const router = useRouter()

  const [stateValueTab, setStateValueTab] = useState(0)
  const [stateOwnedDC, setStateOwnedDC] = useState<ListOwnedDCType>()
  const [stateCurrentIndex, setStateCurrentIndex] = useState(-1)
  const [stateDialog, setStateDialog] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)
  const handleGetListDistributionChannel = useCallback(
    (query: any) => {
      dispatch(loadingActions.doLoading())
      ListDataDCMerchant(query)
        .then((res) => {
          const data = res.data
          setListDCMerchant(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((response) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    },
    [dispatch]
  )
  const handleGetListOwnedDC = useCallback(
    (query: any) => {
      dispatch(loadingActions.doLoading())
      getListOwnedDCMerchant(query)
        .then((res) => {
          const data = res.data
          setStateOwnedDC(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    },
    [dispatch]
  )

  useEffect(() => {
    if (!router.query) {
      if (stateValueTab === 0) {
        handleGetListOwnedDC({})
      } else {
        handleGetListDistributionChannel({})
      }
      return
    }
    if (stateValueTab === 0) {
      handleGetListOwnedDC(router.query)
    } else {
      handleGetListDistributionChannel(router.query)
    }
  }, [dispatch, router])

  useEffect(() => {
    handleGetListDistributionChannel({})
  }, [])

  //pagination
  const handleChangePagination = (page: number) => {
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
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  // tabs
  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setStateValueTab(newValue)
    router.replace({
      search: `${objToStringParam({
        limit: 10,
        page: 1,
      })}`,
    })
  }
  interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
  }

  const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props
    return (
      <TabPanelCustom
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <>{children}</>}
      </TabPanelCustom>
    )
  }

  const a11yProps = (index: number) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }
  const handleLeaveCurrentChannel = () => {
    if (!stateCurrentIndex) return
    leaveDistributionChannel(Number(stateCurrentIndex))
      .then(() => {
        pushMessage('Leave channel successfully', 'success')
        handleGetListDistributionChannel({})

        setStateDialog(false)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().max(255),
      })
    ),
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

  return (
    <>
      <Head>
        <title>{t('vendorChannel')} | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        {t('vendorChannel')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Typography>{t('title')}</Typography>
      </Breadcrumbs>
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
        {stateValueTab === 1 ? (
          <>
            {checkPermission(
              permission,
              KEY_MODULE.DistributionChannel,
              PERMISSION_RULE.JoinDC
            ) && (
              <Grid item xs={4}>
                <Link href="/retailer/market-place/distribution-channel/join-channel">
                  <a>
                    <ButtonCustom variant="contained" size="large">
                      {t('joinChannel')}
                    </ButtonCustom>
                  </a>
                </Link>
              </Grid>
            )}
          </>
        ) : (
          <>
            {checkPermission(
              permission,
              KEY_MODULE.DistributionChannel,
              PERMISSION_RULE.Create
            ) && (
              <Grid item xs={4}>
                <Link href="/retailer/market-place/distribution-channel/create">
                  <a>
                    <ButtonCustom variant="contained" size="large">
                      {t('createChannel')}
                    </ButtonCustom>
                  </a>
                </Link>
              </Grid>
            )}
          </>

          // <></>
        )}
      </Grid>
      {checkPermission(
        permission,
        KEY_MODULE.DistributionChannel,
        PERMISSION_RULE.ViewJoinedList
      ) && (
        <TabsTws
          value={stateValueTab}
          onChange={handleChangeTab}
          aria-label="basic tabs example"
          TabIndicatorProps={{
            children: <span className="MuiTabs-indicatorSpan" />,
          }}
        >
          <TabCustom label={t('ownedChannel')} {...a11yProps(0)} />
          <TabCustom label={t('vendorChannel')} {...a11yProps(1)} />
        </TabsTws>
      )}

      <TabPanel value={stateValueTab} index={0}>
        <OwnerDCMerchant data={stateOwnedDC} />
      </TabPanel>
      <TabPanel value={stateValueTab} index={1}>
        <TableContainerTws sx={{ marginTop: '0' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                  {t('numericOrder')}
                </TableCellTws>
                <TableCellTws>{t('merchantName')}</TableCellTws>

                <TableCellTws>{t('joinDate')}</TableCellTws>
                <TableCellTws width={80}>{t('action')}</TableCellTws>
              </TableRow>
            </TableHead>
            <TableBody>
              {listDCMerchant?.data?.map((item, index) => {
                return (
                  <TableRowTws key={`item-${index}`}>
                    <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                      {(router.query.limit ? Number(router.query.limit) : 10) *
                        (router.query.page ? Number(router.query.page) : 1) -
                        (router.query.limit ? Number(router.query.limit) : 10) +
                        index +
                        1}
                    </TableCellTws>
                    <TableCellTws>
                      {item.distribution_channel_name}
                    </TableCellTws>

                    <TableCellTws>
                      {moment(item.joined_date).format('MM/DD/YYYY - hh:mm A')}
                    </TableCellTws>
                    <TableCellTws>
                      <IconButton
                        onClick={(e) => {
                          handleOpenMenu(e)
                          setStateCurrentIndex(item.id)
                          e.stopPropagation()
                        }}
                      >
                        <Gear size={28} />
                      </IconButton>
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
                        <MenuItem onClick={() => setStateDialog(true)}>
                          {t('leaveChannel')}
                        </MenuItem>
                      </MenuAction>
                    </TableCellTws>
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
            onChange={(e, page) => {
              console.log(e)
              handleChangePagination(page)
            }}
            count={listDCMerchant ? listDCMerchant?.totalPages : 0}
          />
        </Stack>

        <Dialog open={stateDialog} onClose={() => setStateDialog(false)}>
          <DialogTitleTws>
            <IconButton onClick={() => setStateDialog(false)}>
              <X size={20} />
            </IconButton>
          </DialogTitleTws>
          <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
            {t('leaveDistributionChannel')}
          </TypographyH2>
          <DialogContentTws>
            <DialogContentTextTws>
              {t('areYouSureToDelete')} ?
            </DialogContentTextTws>
          </DialogContentTws>
          <DialogActionsTws>
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
                onClick={handleLeaveCurrentChannel}
                size="large"
              >
                {t('yes')}
              </ButtonCustom>
            </Stack>
          </DialogActionsTws>
        </Dialog>
      </TabPanel>
    </>
  )
}

export default DCMerchantComponent
