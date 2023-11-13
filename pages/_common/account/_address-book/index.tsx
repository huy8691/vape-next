import {
  Box,
  Grid,
  Stack,
  Typography,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  FormControl,
  Pagination,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useRouter } from 'next/router'
import CreateAddressBook from './_create-address'
import UpdateAddressBook from './_update-address'
import { useTheme } from '@mui/material/styles'
import { NextPageWithLayout } from 'pages/_app.page'
import {
  MapPinLine,
  DotsThreeVertical,
  PlusCircle,
  X,
} from '@phosphor-icons/react'
import { useCallback, useEffect, useState } from 'react'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  TypographyH2,
  SelectPaginationCustom,
  MenuItemSelectCustom,
} from 'src/components'
import { handlerGetErrMessage, objToStringParam } from 'src/utils/global.utils'
import {
  deleteAddressBook,
  getListAddress,
  setDefaultAddressBook,
} from './listAddressAPI'
import { AddressDataResponsiveType } from './listAddressModels'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useTranslation } from 'next-i18next'

const components = (address: any) => {
  if (address == 'create') {
    return <CreateAddressBook />
  }
  if (address == 'update') {
    return <UpdateAddressBook />
  }
}

const formatPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2 $3')
}

const AddressBook: NextPageWithLayout = () => {
  const { t } = useTranslation('account')
  const theme = useTheme()
  const router = useRouter()
  const address = router.query.address
  const tabs = router.query.tab

  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()

  const [stateListAddress, setStateListAddress] =
    useState<AddressDataResponsiveType>()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [stateAddressName, setStateAddressName] = useState<string | undefined>()
  const [StateOpenDialog, setStateOpenDialog] = useState(false)
  const [stateIdDelete, setStateIdDelete] = useState<number | null>()
  const [stateDefault, setStateDefault] = useState<any>()

  const open = Boolean(anchorEl)

  const handleClickGear = (
    event: React.MouseEvent<HTMLElement>,
    id: number
  ) => {
    setStateIdDelete(id)
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDialogDelete = () => {
    setStateOpenDialog(!StateOpenDialog)
    handleClose()
  }

  const handleDeleteAddress = () => {
    console.log('id', stateIdDelete)
    deleteAddressBook(stateIdDelete)
      .then((res) => {
        console.log('res', res)
        dispatch(loadingActions.doLoadingSuccess())
        handleDialogDelete()
        if (!router.query?.page || Number(router.query?.page) === 1) {
          getDataAddressBook({ page: 1 })
        } else {
          if (stateListAddress?.data?.length === 1) {
            router.replace({
              search: `${objToStringParam({
                ...router.query,
                page: Number(router.query?.page) - 1,
              })}`,
            })
          } else {
            getDataAddressBook({ page: router.query?.page })
          }
        }
        pushMessage(
          t('theAddressStateAddressNameHasBeenDeletedSuccessfully', {
            0: stateAddressName,
          } as any),
          'success'
        )
        setStateAddressName(undefined)
        setStateIdDelete(null)
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response.response
        console.log('check', status, data)
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleClickSetDefault = (id: any, name: any) => {
    setDefaultAddressBook(id)
      .then((res) => {
        console.log('res', res)
        dispatch(loadingActions.doLoadingSuccess())

        if (!router.query?.page || Number(router.query?.page) === 1) {
          getDataAddressBook({ page: 1 })
        } else {
          router.replace({
            search: `${objToStringParam({
              ...router.query,
              page: 1,
            })}`,
          })
        }
        pushMessage(
          t('theAddressNameHasBeenMarkedAsDefaultSuccessfully', {
            0: name,
          } as any),
          'success'
        )
        setStateAddressName(undefined)
        setStateIdDelete(null)
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response.response
        console.log('check', status, data)
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const getDataAddressBook = useCallback(
    (params?: object) => {
      dispatch(loadingActions.doLoading())
      getListAddress(params)
        .then((res) => {
          const data = res.data
          console.log('data', data)
          setStateListAddress(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((response) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    },
    [dispatch]
  )

  useEffect(() => {
    console.log(address, tabs)
    if (tabs === 'address-book') {
      getDataAddressBook({
        page: router.query.page,
        limit: router.query.limit,
      })
    }
  }, [
    router.query.tab,
    router.query.page,
    router.query.limit,
    router.query.address,
  ])

  return (
    <>
      {tabs == 'address-book' && address ? (
        components(address)
      ) : (
        <Box
          sx={{
            width: '100%',
            // padding: '15px',
          }}
        >
          {/* <Grid container spacing={2}>
            {stateListAddress?.data?.map((item, index) => (
              <Grid key={index} item xs={12} md={6} lg={4} spacing={2}>
                <Grid
                  container
                  sx={{
                    border: '1px solid #E1E6EF',
                    borderRadius: '10px',
                    padding: '15px',
                  }}
                >
                  <Grid item xs={11}>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="space-between"
                      sx={{ marginBottom: '15px' }}
                    >
                      <Stack direction="row" spacing={1}>
                        <MapPinLine
                          size={24}
                          color={theme.palette.primary.main}
                        />
                        <Typography
                          sx={{ fontSize: '1.6rem', color: '#3F444D' }}
                        >
                          {' '}
                          {item.name}
                        </Typography>
                      </Stack>
                      {item.default_address ? (
                        <Stack
                          direction="row"
                          spacing={1}
                          // sx={{ marginBottom: '15px' }}
                        >
                          <CheckCircleIcon color="primary" fontSize="medium" />
                          <ButtonCustom
                            variant="contained"
                            size="small"
                            sx={{
                              fontSize: '1.4rem',
                              gap: '8px',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              height: '25px',
                            }}
                          >
                            Default
                          </ButtonCustom>
                        </Stack>
                      ) : (
                        <></>
                      )}
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ padding: '15px 0px' }}
                    >
                      <Typography sx={{ color: '#3F444D', fontWeight: '400' }}>
                        {item.receiver_name}
                      </Typography>
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                        sx={{
                          // height: '1.4rem',
                          marginTop: '3px !important',
                          marginBottom: '3px !important',
                          borderColor: '#3F444D',
                          border: '1px line #3F444D',
                        }}
                      />
                      <Typography sx={{ color: '#3F444D', fontWeight: '400' }}>
                        {formatPhoneNumber(item.phone_number)}
                      </Typography>
                    </Stack>
                    <Typography sx={{ color: '#3F444D', fontWeight: '400' }}>
                      {item.address}
                    </Typography>
                  </Grid>
                  <Grid item xs={1} sx={{ paddingLeft: '8px' }}>
                    <IconButton
                      onClick={(e) => {
                        handleClickGear(e, item.id)
                        setStateAddressName(item.name)
                        setStateDefault(item.default_address)
                      }}
                      sx={{ padding: '0', textAlign: 'end' }}
                    >
                      <DotsThreeVertical size={24} />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            ))}
            <Grid item xs={4} spacing={2}>
              <ButtonCustom
                sx={{
                  border: '1px dashed #49516F',
                  borderRadius: '10px',
                  // marginBottom: '35px',
                  padding: '50px',
                  alignItems: 'center',
                  height: '100%',
                  width: '100%',
                  backgroundColor: '#F8F9FC',
                  color: '#49516F',
                }}
                onClick={() =>
                  router.replace({
                    search: `${objToStringParam({
                      ...router.query,
                      address: 'create',
                    })}`,
                  })
                }
              >
                <PlusCircle size={25} color="#49516F" />
                <Typography> Add New</Typography>
              </ButtonCustom>
            </Grid>
          </Grid> */}
          <Grid container spacing={2} mb={3}>
            {stateListAddress?.data?.map((item, index) => (
              <Grid key={index} item xs={4}>
                <Box
                  style={{
                    border: '1px solid #E1E6EF',
                    borderRadius: '10px',
                    padding: '15px',
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Stack direction="row" spacing={1}>
                      <MapPinLine
                        size={24}
                        color={theme.palette.primary.main}
                      />
                      <Typography sx={{ fontSize: '1.6rem', color: '#3F444D' }}>
                        {item.name}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      {item.default_address && (
                        <>
                          <CheckCircleIcon color="primary" fontSize="medium" />
                          <ButtonCustom
                            variant="contained"
                            size="small"
                            sx={{
                              fontSize: '1.4rem',
                              gap: '8px',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              height: '25px',
                            }}
                          >
                            {t('default')}
                          </ButtonCustom>
                        </>
                      )}
                      <Box>
                        <IconButton
                          onClick={(e) => {
                            handleClickGear(e, item.id)
                            setStateAddressName(item.name)
                            setStateDefault(item.default_address)
                          }}
                          sx={{ padding: '0', textAlign: 'end' }}
                        >
                          <DotsThreeVertical size={24} />
                        </IconButton>
                      </Box>
                    </Stack>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ padding: '15px 0px' }}
                  >
                    <Typography sx={{ color: '#3F444D', fontWeight: '400' }}>
                      {item.receiver_name}
                    </Typography>
                    <Divider
                      orientation="vertical"
                      variant="middle"
                      flexItem
                      sx={{
                        // height: '1.4rem',
                        marginTop: '3px !important',
                        marginBottom: '3px !important',
                        borderColor: '#3F444D',
                        border: '1px line #3F444D',
                      }}
                    />
                    <Typography sx={{ color: '#3F444D', fontWeight: '400' }}>
                      {formatPhoneNumber(item.phone_number)}
                    </Typography>
                  </Stack>
                  <Typography sx={{ color: '#3F444D', fontWeight: '400' }}>
                    {item.address}
                  </Typography>
                </Box>
              </Grid>
            ))}
            <Grid item xs={4}>
              <ButtonCustom
                sx={{
                  border: '1px dashed #49516F',
                  borderRadius: '10px',
                  // marginBottom: '35px',
                  padding: '50px',
                  alignItems: 'center',
                  height: '100%',
                  width: '100%',
                  backgroundColor: '#F8F9FC',
                  color: '#49516F',
                }}
                onClick={() =>
                  router.replace({
                    search: `${objToStringParam({
                      ...router.query,
                      address: 'create',
                    })}`,
                  })
                }
              >
                <PlusCircle size={25} color="#49516F" />
                <Typography>{t('addNew')}</Typography>
              </ButtonCustom>
            </Grid>
          </Grid>
          {Number(stateListAddress?.totalPages) > 1 && (
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
                  onChange={(e) => {
                    router.replace({
                      search: `${objToStringParam({
                        ...router.query,
                        limit: Number(e.target.value),
                        page: 1,
                      })}`,
                    })
                  }}
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
                onChange={(e, page: number) => {
                  console.log(e)
                  router.replace({
                    search: `${objToStringParam({
                      ...router.query,
                      page: page,
                    })}`,
                  })
                }}
                count={stateListAddress ? stateListAddress?.totalPages : 0}
              />
            </Stack>
          )}

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem
              onClick={() => {
                handleClose(),
                  router.replace({
                    search: `${objToStringParam({
                      ...router.query,
                      address: 'update',
                      id: stateIdDelete,
                    })}`,
                  })
              }}
            >
              {t('update')}
            </MenuItem>
            <MenuItem onClick={handleDialogDelete}>Delete</MenuItem>
            {!stateDefault ? (
              <MenuItem
                onClick={() => (
                  handleClickSetDefault(stateIdDelete, stateAddressName),
                  handleClose()
                )}
              >
                {t('markAsDefault')}
              </MenuItem>
            ) : (
              <></>
            )}
          </Menu>

          <Dialog open={StateOpenDialog} onClose={handleDialogDelete}>
            <DialogTitleTws>
              <IconButton onClick={handleDialogDelete}>
                <X size={20} />
              </IconButton>
            </DialogTitleTws>
            <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
              {t('deleteAddressBook')}
            </TypographyH2>
            <DialogContentTws>
              <DialogContentTextTws>
                {
                  t('areYouSureToDeleteThisAddress', {
                    0: stateAddressName,
                  }) as any
                }
              </DialogContentTextTws>
            </DialogContentTws>
            <DialogActionsTws>
              <Stack spacing={2} direction="row">
                <ButtonCancel
                  onClick={handleDialogDelete}
                  variant="outlined"
                  size="large"
                >
                  {t('cancel')}
                </ButtonCancel>
                <ButtonCustom
                  variant="contained"
                  onClick={handleDeleteAddress}
                  size="large"
                >
                  {t('confirm')}
                </ButtonCustom>
              </Stack>
            </DialogActionsTws>
          </Dialog>
        </Box>
      )}
    </>
  )
}

export default AddressBook
