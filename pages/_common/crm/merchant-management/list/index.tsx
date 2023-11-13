import {
  Avatar,
  Badge,
  Box,
  Chip,
  Drawer,
  FormControl,
  IconButton,
  MenuItem,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import Image from 'next/image'

import React, { useCallback, useEffect, useState } from 'react'
import {
  ButtonCancel,
  ButtonCustom,
  InfiniteScrollSelectMultiple,
  InputLabelCustom,
  MenuAction,
  MenuItemSelectCustom,
  PlaceholderSelect,
  SelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldSearchCustom,
} from 'src/components'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import Grid from '@mui/material/Unstable_Grid2'

//Form and validate
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import {
  ArrowRight,
  FunnelSimple,
  Gear,
  MagnifyingGlass,
} from '@phosphor-icons/react'
import { Controller, useForm } from 'react-hook-form'
import {
  checkPermission,
  formatPhoneNumber,
  handlerGetErrMessage,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
} from 'src/utils/global.utils'
import { assignSeller, filterSchema, schema } from './validations'

import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { platform } from 'src/utils/global.utils'
import {
  assignSellerAPI,
  getMerchantList,
  getSellerList,
} from './merchantListAPI'
import {
  AssignSellerDataType,
  MerchantDataResponseType,
  MerchantDataType,
  SellerDataResponseType,
  SellerDataType,
} from './merchantModel'
import InfiniteScrollSelectMultipleCustom from './parts/InfiniteScrollSelectMultiple'
import WithPermission from 'src/utils/permission.utils'
import { useTranslation } from 'next-i18next'

const MerchantManagement: React.FC = () => {
  const { t } = useTranslation('merchant-management')
  const permission = useAppSelector((state) => state.permission.data)
  const [pushMessage] = useEnqueueSnackbar()

  const router = useRouter()
  const dispatch = useAppDispatch()

  //state merchant list
  const [stateMerchantList, setStateMerchantList] =
    useState<MerchantDataResponseType>()

  //state assignee list
  const [stateAssignee, setStateAssignee] = useState<SellerDataResponseType>({
    data: [],
  })
  // const [stateSellerAssignee, setStateSellerAssignee] = useState<any>()

  //state filter
  const [anchorFilter, setAnchorFilter] = useState<HTMLElement | null>(null)
  const [stateMerchant, setStateMerchant] = useState<MerchantDataType>()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [anchorElSeller, setAnchorElSeller] = useState<null | HTMLElement>(null)
  const [openModalAssignSeller, setOpenModalAssignSeller] =
    React.useState(false)
  const [stateIdAssignee, setStateIdAssignee] = useState<string[]>([])

  const openFilter = Boolean(anchorFilter)
  const openMenu = Boolean(anchorEl)
  const openSellerInformation = Boolean(anchorElSeller)

  //State Dialog Assign Seller

  const [stateOpenDialogAssignSeller, setStateOpenDialogAssignSeller] =
    useState<boolean>(false)

  //popover

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSeller(event.currentTarget)
  }
  const handlePopoverClose = () => {
    setAnchorElSeller(null)
  }

  const handleIdQuery = (value: string | null) => {
    if (!value) return
    const newArr = value
      .split(',')
      .map(function (item: string) {
        return item.slice(0, item.indexOf('-'))
      })
      .toString()

    return newArr
  }

  //List merchant
  const handleGetListMerchant = useCallback(() => {
    dispatch(loadingActions.doLoading())
    getMerchantList({
      ...router.query,
      assignee: router.query.assignee
        ? handleIdQuery(`${router.query.assignee}`)
        : '',
    })
      .then((res) => {
        const data = res.data
        setStateMerchantList(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [dispatch, router.query])

  const handleGetListAssignee = (value: string | null) => {
    getSellerList(1, {
      multiple_user_type: 'SELLER',
      name: value ? value : null,
    })
      .then((res) => {
        const data = res.data
        setStateAssignee(data)
        setValueSeller('sellers', stateIdAssignee)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const fetchMoreDataAssignee = useCallback(
    (value: { page: number; name: string }) => {
      getSellerList(value.page, {
        multiple_user_type: 'SELLER',
        name: value.name,
      })
        .then((res) => {
          const { data } = res
          setStateAssignee((prev: any) => {
            return {
              ...data,
              data: [...prev.data, ...res.data.data],
            }
          })
        })
        .catch((error) => {
          const { status, data } = error.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [setStateAssignee]
  )

  //forward Detail
  const handleClickItem = (id: number) => {
    if (platform() === 'RETAILER') {
      router.push(`/retailer/crm/merchant-management/detail/${id}`)
    }
    if (platform() === 'SUPPLIER') {
      router.push(`/supplier/crm/merchant-management/detail/${id}`)
    }
  }

  //pagination
  const handleChangePagination = (event: any, page: number) => {
    console.log(event)
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

  //Menu
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
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
  //filter

  const handleOpenMenuFilter = (event: React.MouseEvent<HTMLElement>) => {
    handleGetListAssignee('')
    setAnchorFilter(event.currentTarget)
  }

  const handleCloseMenuFilter = () => {
    setAnchorFilter(null)
  }

  //form search
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  //form filter

  const {
    handleSubmit: handleSubmitFilter,
    setValue,
    control: controlFilter,
    reset: resetFilter,

    getValues,
    clearErrors,
    // formState: { errors },
  } = useForm({
    resolver: yupResolver(filterSchema),
    mode: 'all',
  })

  const onSubmitFilter = (values: any) => {
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          assignee: values.assignee.length == 0 ? '' : values.assignee,
          page: 1,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }

  const handleReset = () => {
    resetFilter({
      assignee: [],
    })

    router.replace(
      {
        search: `${objToStringParam({
          page: 1,
          limit: router.query.limit,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }

  //Dialog Assign Seller

  const handleOpenModelAssigSeller = () => {
    handleGetListAssignee('')
    setStateOpenDialogAssignSeller(!stateOpenDialogAssignSeller)
    setAnchorEl(null)
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

  const onSubmitAssignSeller = () => {
    const assignSellerArr: Array<number> = []
    getValuesSeller('sellers').forEach((item: string) => {
      assignSellerArr.push(Number(item.slice(0, item.indexOf('-'))))
    })
    const assignSeller: AssignSellerDataType = { sellers: assignSellerArr }
    assignSellerAPI(Number(stateMerchant?.business_id), assignSeller)
      .then(() => {
        pushMessage(
          t('message.theRetailerHasBeenUpdatedAndAssignedSuccessfully'),
          'success'
        )
        setAnchorEl(null)
        dispatch(loadingActions.doLoadingSuccess())
        handleCloseModalAssignSeller()
        handleGetListMerchant()
      })
      .catch(({ response }) => {
        const { data, status } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        handleCloseModalAssignSeller()
      })
  }

  const {
    handleSubmit: handleSubmitAssignSeller,
    control: controlAssignSeller,
    getValues: getValuesSeller,
    setValue: setValueSeller,
    clearErrors: clearErrorsSeller,
  } = useForm({
    resolver: yupResolver(assignSeller),
    mode: 'all',
  })

  //Model

  const handleCloseModalAssignSeller = () => {
    setOpenModalAssignSeller(false)
    // resetAssignSeller()
    setAnchorEl(null)
  }

  useEffect(() => {
    handleGetListMerchant()
    setValue(
      'assignee',
      router.query.assignee ? `${router.query.assignee}`.split(',') : []
    )
  }, [handleGetListMerchant, router.query])
  const handleCheckGear = () => {
    if (
      !checkPermission(
        permission,
        KEY_MODULE.Merchant,
        PERMISSION_RULE.ViewDetails
      ) &&
      !checkPermission(permission, KEY_MODULE.Merchant, PERMISSION_RULE.Assign)
    ) {
      return false
    }
    return true
  }
  return (
    <>
      <Grid container columnSpacing={'28px'}>
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
                    placeholder={t('searchRetailer')}
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

        <Grid xs style={{ maxWidth: '78px' }}>
          <ButtonCustom
            onClick={(e: React.MouseEvent<HTMLElement>) =>
              handleOpenMenuFilter(e)
            }
            variant="outlined"
            size="large"
            style={{ padding: '14px 0' }}
            sx={{
              border: '1px solid #E1E6EF',
              color: '#49516F',
              minWidth: '50px',
            }}
          >
            <Badge color="default">
              <FunnelSimple size={20} />
            </Badge>
          </ButtonCustom>
        </Grid>
        <Grid xs style={{ maxWidth: '288px' }}>
          {/* <Link href="/supplier/other/merchant-management/create"> */}
          {/* <ButtonCustom variant="contained" fullWidth size="large">
            Actions
          </ButtonCustom> */}
          {/* </Link> */}
        </Grid>
      </Grid>

      {stateMerchantList?.data.length == 0 ? (
        <>
          <Stack p={5} spacing={2} alignItems="center" justifyContent="center">
            <Image
              src={'/' + '/images/not-found.svg'}
              alt="Logo"
              width="200"
              height="200"
            />
            <Typography variant="h6" sx={{ marginTop: '0' }}>
              {t('thereAreNoRetailerToShow')}
            </Typography>
          </Stack>
        </>
      ) : (
        <>
          <TableContainerTws>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws>{t('list.no.')}</TableCellTws>
                  <TableCellTws>{t('list.businessName')}</TableCellTws>
                  <TableCellTws>{t('list.federalTaxId')}</TableCellTws>
                  <TableCellTws>{t('list.ownerName')}</TableCellTws>
                  <TableCellTws>{t('list.phoneNumber')}</TableCellTws>
                  <TableCellTws>{t('list.email')}</TableCellTws>
                  <TableCellTws>{t('list.assignee')}</TableCellTws>
                  {handleCheckGear() && (
                    <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                      {t('list.action')}
                    </TableCellTws>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {stateMerchantList?.data?.map(
                  (item: MerchantDataType, index: number) => {
                    return (
                      <TableRowTws
                        key={`item-${index}`}
                        hover
                        onClick={() => {
                          if (
                            checkPermission(
                              permission,
                              KEY_MODULE.Merchant,
                              PERMISSION_RULE.ViewDetails
                            )
                          ) {
                            handleClickItem(item.business_id)
                          }
                        }}
                        sx={{
                          '&:hover': {
                            cursor: checkPermission(
                              permission,
                              KEY_MODULE.Merchant,
                              PERMISSION_RULE.ViewDetails
                            )
                              ? 'pointer'
                              : '',
                          },
                        }}
                      >
                        <TableCellTws>{index + 1}</TableCellTws>
                        <TableCellTws>
                          {item.business_name ? item.business_name : 'N/A'}
                        </TableCellTws>
                        <TableCellTws sx={{ textTransform: 'capitalize' }}>
                          {item.federal_tax_id ? item.federal_tax_id : 'N/A'}
                        </TableCellTws>
                        <TableCellTws>
                          {item.owner_name ? item.owner_name : 'N/A'}
                        </TableCellTws>
                        <TableCellTws>
                          {item.phone_number
                            ? formatPhoneNumber(item.phone_number)
                            : 'N/A'}
                        </TableCellTws>
                        <TableCellTws>
                          {item.email ? item.email : 'N/A'}
                        </TableCellTws>
                        <TableCellTws width={300}>
                          <div
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                            aria-owns={
                              openSellerInformation
                                ? 'mouse-over-popover'
                                : undefined
                            }
                            aria-haspopup="true"
                            // onMouseEnter={(
                            //   event: React.MouseEvent<HTMLElement>
                            // ) => {
                            //   const valueAssignee = item.assignee.map(
                            //     (items: any) => items
                            //   )
                            //   setStateSellerAssignee(valueAssignee)
                            //   handlePopoverOpen(event)
                            // }}
                            onMouseLeave={handlePopoverClose}
                          >
                            {item.assignee.length > 0 ? (
                              <>
                                {item.assignee
                                  ?.map(
                                    (item: any) =>
                                      ' ' + item?.first_name + item?.last_name
                                  )
                                  .toString()}
                              </>
                            ) : (
                              'N/A'
                            )}
                          </div>
                        </TableCellTws>
                        {handleCheckGear() && (
                          <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                            <IconButton
                              onClick={(e) => {
                                setStateMerchant(item)
                                handleOpenMenu(e)
                                e.stopPropagation()
                                // WARNING keep stable return string
                                const idAssignee = item.assignee.map(
                                  (items: SellerDataType) => {
                                    return `${items.id}-${items.first_name} ${items.last_name}`
                                  }
                                )
                                setStateIdAssignee(idAssignee)
                              }}
                            >
                              <Gear size={28} />
                            </IconButton>
                          </TableCellTws>
                        )}
                      </TableRowTws>
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
              count={stateMerchantList ? stateMerchantList.totalPages : 0}
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
          <MenuItem
            onClick={() => handleClickItem(Number(stateMerchant?.business_id))}
          >
            {t('detail')}
          </MenuItem>,
          KEY_MODULE.Merchant,
          PERMISSION_RULE.ViewDetails
        )}
        {WithPermission(
          <MenuItem
            onClick={() => {
              handleOpenModelAssigSeller(), setOpenModalAssignSeller(true)
            }}
          >
            {t('assignSeller')}
          </MenuItem>,
          KEY_MODULE.Merchant,
          PERMISSION_RULE.Assign
        )}
      </MenuAction>

      {/* <MenuActionFilter
        elevation={0}
        anchorEl={anchorFilter}
        open={openFilter}
        onClose={handleCloseMenuFilter}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >

      </MenuActionFilter> */}

      <Drawer
        anchor={'right'}
        open={openFilter}
        onClose={handleCloseMenuFilter}
      >
        <Box sx={{ padding: '20px', width: '550px' }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ marginBottom: '10px' }}
          >
            <IconButton onClick={handleCloseMenuFilter}>
              <ArrowRight size={24} />
            </IconButton>
            <Typography
              sx={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: '#49516F',
              }}
            >
              {t('filter')}
            </Typography>
          </Stack>
          <form onSubmit={handleSubmitFilter(onSubmitFilter)}>
            <Box mb={2}>
              <InputLabelCustom
                htmlFor="assignee"
                sx={{
                  color: '#49516F',
                  fontSize: '1.2rem',
                }}
              >
                {t('assignee')}
              </InputLabelCustom>
              <Grid container>
                <Grid xs={6}>
                  <Controller
                    control={controlFilter}
                    defaultValue={[]}
                    name="assignee"
                    render={({ field }) => (
                      <Box sx={{ width: '500px' }}>
                        <FormControl fullWidth>
                          <SelectCustom
                            fullWidth
                            id="assignee"
                            displayEmpty
                            // multiple
                            IconComponent={() => <KeyboardArrowDownIcon />}
                            renderValue={(value: any) => {
                              console.log('?????', value)

                              if (value.length == 0 || !value) {
                                return (
                                  <PlaceholderSelect>
                                    <div>{t('selectAssignee')}</div>
                                  </PlaceholderSelect>
                                )
                              }
                              return value.map(function (
                                item: string,
                                idx: number
                              ) {
                                return (
                                  <span key={idx}>
                                    {idx > 0 ? ', ' : ''}
                                    {item.slice(
                                      item.indexOf('-') + 1,
                                      item.length
                                    )}
                                  </span>
                                )
                              })
                            }}
                            {...field}
                          >
                            <InfiniteScrollSelectMultiple
                              propData={stateAssignee}
                              handleSearch={(value) => {
                                setStateAssignee({ data: [] })
                                handleGetListAssignee(value)
                              }}
                              fetchMore={(value) => {
                                fetchMoreDataAssignee(value)
                              }}
                              onClickSelectItem={(item: any) => {
                                setValue('assignee', item)
                                clearErrors('assignee')
                                handlePopoverOpen(item)

                                // setState({
                                //   ...state,
                                //   openCategory: false,
                                // })
                              }}
                              propsGetValue={getValues('assignee')}
                              propName="full_name"
                            />
                          </SelectCustom>
                        </FormControl>
                      </Box>
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
            <Stack direction="row" spacing={2}>
              <ButtonCancel
                type="reset"
                onClick={handleReset}
                size="large"
                sx={{ color: '#49516F' }}
              >
                {t('reset')}
              </ButtonCancel>
              <ButtonCustom variant="contained" size="large" type="submit">
                {t('filter')}
              </ButtonCustom>
            </Stack>
          </form>
        </Box>
      </Drawer>

      <Drawer
        anchor={'right'}
        open={openModalAssignSeller}
        onClose={handleCloseModalAssignSeller}
      >
        <Box sx={{ padding: '30px', width: '550px' }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              marginBottom: '10px',
            }}
          >
            <IconButton onClick={handleCloseMenuFilter}>
              <ArrowRight size={24} onClick={handleCloseModalAssignSeller} />
            </IconButton>
            <Typography
              sx={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: '#49516F',
              }}
            >
              {t('assignSeller')}
            </Typography>
          </Stack>
          <Box
            sx={{
              position: 'absolute',
              top: '0',
              right: '0',
              padding: '10px',
            }}
          ></Box>

          <form onSubmit={handleSubmitAssignSeller(onSubmitAssignSeller)}>
            <Stack spacing={3}>
              <Grid xs={6}>
                <Controller
                  control={controlAssignSeller}
                  name="sellers"
                  defaultValue={[]}
                  render={({ field }) => (
                    <>
                      <InputLabelCustom htmlFor="sellers">
                        {t('selectSellers')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="sellers"
                          displayEmpty
                          multiple
                          // open={openSeller}
                          placeholder={t('selectSellers')}
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          {...field}
                          renderValue={(value: any) => {
                            console.log('valueeeeeeeee', value)
                            if (value.length == 0) {
                              return (
                                <PlaceholderSelect>
                                  <div>Select Seller</div>
                                </PlaceholderSelect>
                              )
                            }
                            return (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 0.5,
                                }}
                              >
                                {value.map(function (
                                  item: string,
                                  idx: number
                                ) {
                                  return (
                                    <Chip
                                      key={idx}
                                      sx={{
                                        maxWidth: '150px',
                                      }}
                                      onMouseDown={(event) =>
                                        event.stopPropagation()
                                      }
                                      onDelete={() => {
                                        const temporarySellerArr =
                                          getValuesSeller('sellers').filter(
                                            (x: string) => {
                                              return x != item
                                            }
                                          )

                                        setValueSeller(
                                          'sellers',
                                          temporarySellerArr
                                        )
                                      }}
                                      avatar={
                                        <Avatar
                                          src={
                                            stateAssignee?.data.find(
                                              (index: SellerDataType) =>
                                                index.id ===
                                                Number(
                                                  item.slice(
                                                    0,
                                                    item.indexOf('-')
                                                  )
                                                )
                                            )?.avatar
                                          }
                                        />
                                      }
                                      label={
                                        <Typography
                                          sx={{
                                            maxWidth: '100px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                          }}
                                        >
                                          {' '}
                                          {item.slice(
                                            item.indexOf('-') + 1,
                                            item.length
                                          )}
                                        </Typography>
                                      }
                                    />
                                  )
                                })}
                              </Box>
                            )
                          }}
                        >
                          <InfiniteScrollSelectMultipleCustom
                            propData={stateAssignee}
                            handleSearch={(value) => {
                              setStateAssignee({ data: [] })
                              handleGetListAssignee(value)
                            }}
                            fetchMore={(value) => {
                              fetchMoreDataAssignee(value)
                            }}
                            onClickSelectItem={(item: any) => {
                              setValueSeller('sellers', item)
                              // setStateSellerAssignee(item)
                              handlePopoverOpen(item)
                              clearErrorsSeller('sellers')
                              // setState({
                              //   ...state,
                              //   openCategory: false,
                              // })
                            }}
                            propsGetValue={getValuesSeller('sellers')}
                            propName="full_name"
                          />
                        </SelectCustom>
                        {/* <FormHelperText error={!!errorsAssignSeller.sellers}>
                          {errorsAssignSeller.sellers &&
                            `${errorsAssignSeller.sellers.message}`}
                        </FormHelperText> */}
                      </FormControl>
                    </>
                  )}
                />
              </Grid>
              <Stack direction="row" spacing={2}>
                <ButtonCancel
                  onClick={handleCloseModalAssignSeller}
                  variant="outlined"
                  size="large"
                >
                  {t('cancel')}
                </ButtonCancel>
                <ButtonCustom variant="contained" size="large" type="submit">
                  {t('submit')}
                </ButtonCustom>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Drawer>

      {/* <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={openSellerInformation}
        anchorEl={anchorElSeller}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Stack p="15px" spacing="15px" direction="column" borderRadius="10px">
          {stateSellerAssignee?.map(
            (item: ListSellerDataType, index: number) => {
              return (
                <MenuItemSelectCustom
                  value={item.id}
                  key={index + Math.random()}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar alt={item.first_name} src={item.avatar} />
                    <Typography>
                      {item.first_name} {item.last_name}
                    </Typography>
                  </Stack>
                </MenuItemSelectCustom>
              )
            }
          )}
        </Stack>
      </Popover> */}
    </>
  )
}

export default MerchantManagement
