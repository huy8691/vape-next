import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Dialog,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ArrowLeft, Gear, MagnifyingGlass, X } from '@phosphor-icons/react'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { PatternFormat } from 'react-number-format'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  InputLabelCustom,
  MenuAction,
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldCustom,
  TextFieldSearchCustom,
  TypographyH2,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import RequiredLabel from 'src/components/requiredLabel'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  formatPhoneNumber,
  handlerGetErrMessage,
  isEmptyObject,
  objToStringParam,
} from 'src/utils/global.utils'
import {
  ClientDetailType,
  ListClientResponseType,
  SubmitClientType,
} from './clientListModel'
import {
  createClient,
  deleteClient,
  getListClient,
  getUrlUploadFileApi,
  readLicense,
  updateClient,
  uploadFileApi,
} from './listClientAPI'
import classes from './styles.module.scss'
import { schema, schemaCreateUpdate } from './validations'
import { useTranslation } from 'next-i18next'

const WalkinCustomerComponent = () => {
  const { t } = useTranslation('customer')
  const [stateListClient, setStateListClient] =
    useState<ListClientResponseType>()
  const [stateCurrentClientDetail, setStateCurrentClientDetail] =
    useState<ClientDetailType>()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [stateDrawerCreate, setStateDrawerCreate] = useState(false)
  const [stateDialog, setStateDialog] = useState(false)
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const open = Boolean(anchorEl)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
    setStateCurrentClientDetail(undefined)
  }
  const handleGetListClient = (query: any) => {
    dispatch(loadingActions.doLoading())

    getListClient(query)
      .then((res) => {
        const { data } = res
        setStateListClient(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }
  const handleDeleteClient = () => {
    if (!stateCurrentClientDetail) return
    deleteClient(stateCurrentClientDetail?.id)
      .then(() => {
        pushMessage(t('message.deleteCustomerSuccessfully'), 'success')
        setStateDialog(false)
        handleGetListClient(router.query)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  useEffect(() => {
    if (!isEmptyObject(router.query)) {
      handleGetListClient(router.query)
    } else {
      handleGetListClient({})
    }
  }, [router.query])
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
  const { handleSubmit: handleSubmitSearch, control: controlSearch } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<SubmitClientType>({
    resolver: yupResolver(schemaCreateUpdate(t)),
    mode: 'all',
    reValidateMode: 'onSubmit',
  })
  const onSubmitCreate = (value: SubmitClientType) => {
    console.log(value)
    console.log('onSubmitCreate', getValues('document'))

    const submitValue: SubmitClientType = {
      ...value,
      phone_number: value.phone_number
        .replace('(', '')
        .replace(')', '')
        .replaceAll(' ', ''),
      email: value.email ? value.email : null,
      last_name: value.last_name ? value.last_name : null,
      address: value.address ? value.address : null,
      business_name: value.business_name ? value.business_name : null,
      ...(getValues('document') && { document: getValues('document') }),
    }

    if (stateCurrentClientDetail) {
      updateClient(submitValue, stateCurrentClientDetail.id)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(t('message.updateCustomerSuccessfully'), 'success')
          handleGetListClient(router.query)
          setStateDrawerCreate(false)
          setStateCurrentClientDetail(undefined)
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
      return
    }
    createClient(submitValue)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(t('message.createCustomerSuccessfully'), 'success')
        handleGetListClient(router.query)
        setStateDrawerCreate(false)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleSearch = (values: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        search: values.search,
        page: 1,
      })}`,
    })
  }
  const handleOpenDrawerOpen = () => {
    reset()
    setStateDrawerCreate(true)
    handleCloseMenu()
  }
  const handleOpenDrawerUpdate = () => {
    setStateDrawerCreate(true)
    setAnchorEl(null)

    if (stateCurrentClientDetail) {
      setValue('first_name', stateCurrentClientDetail.first_name)
      setValue('last_name', stateCurrentClientDetail.last_name)
      setValue('email', stateCurrentClientDetail.email)
      setValue('business_name', stateCurrentClientDetail.business_name)
      setValue(
        'phone_number',
        formatPhoneNumber(stateCurrentClientDetail.phone_number)
      )
      setValue('address', stateCurrentClientDetail.address)
    }
  }
  const handleCloseDrawer = () => {
    clearErrors()
    reset()
    setStateDrawerCreate(false)
    setStateCurrentClientDetail(undefined)
  }
  const handleReadLicense = (e: any) => {
    // setStateListProductInvoice({ data: dumbData })
    // setStateDrawerOCR(true)
    dispatch(loadingActions.doLoading())
    const fileInput = e.target.files[0]
    const formData = new FormData()
    formData.append('file', fileInput)

    readLicense(formData)
      .then((res) => {
        handleUploadImage(fileInput)
        const { data } = res
        handleOpenDrawerOpen()
        const fullName = data.data.Name
        const nameParts = fullName.split(' ')

        setValue('address', data.data.Address)
        setValue('first_name', nameParts[0])
        setValue('last_name', nameParts[nameParts.length - 1])

        dispatch(loadingActions.doLoadingSuccess())
        // Coding here
      })
      .catch(({ response }) => {
        const { data, status } = response
        dispatch(loadingActions.doLoadingFailure())
        if (typeof data.data === 'string') {
          return
        }
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const beforeUpload = (file: any) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/heic'
    const isLt2M = file.size / 1024 / 1024 < 50
    if (!isLt2M) {
      pushMessage('File cannot be large than 50MB', 'error')
      return false
    }
    if (!isJpgOrPng) {
      pushMessage('The uploaded file must be an image', 'error')
      return false
    }
    return isLt2M && isJpgOrPng
  }
  const handleUploadImage = async (objImage: any) => {
    // const objImage = event.target.files[0]
    console.log('7777', objImage)
    try {
      if (!beforeUpload(objImage)) return
      if (typeof window !== 'undefined' && objImage.type === 'image/heic') {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const heic2any = require('heic2any')
        const convertedBlob = await heic2any({
          blob: objImage,
          toType: 'image/jpeg',
          quality: 0.5,
        })
        const jpgFile = new File([convertedBlob], `${objImage.name}.jpg`, {
          type: 'image/jpeg',
        })
        console.log('convertedBlob', convertedBlob, jpgFile)
        handleGetUrlUpload(jpgFile)
      } else {
        console.log('4444')
        handleGetUrlUpload(objImage)
      }
      // handleGetUrlUpload(objImage)
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleGetUrlUpload = (fileInput: any) => {
    console.log('8888', fileInput)
    getUrlUploadFileApi({
      files: [
        {
          name: fileInput.name,
        },
      ],
    })
      .then((response) => {
        const { data } = response.data
        const formData = new FormData()
        dispatch(loadingActions.doLoadingSuccess())
        dispatch(loadingActions.doLoading())
        formData.append('key', data.fields.key)
        formData.append('x-amz-algorithm', data.fields[`x-amz-algorithm`])
        formData.append('x-amz-credential', data.fields[`x-amz-credential`])
        formData.append('x-amz-date', data.fields[`x-amz-date`])
        formData.append('policy', data.fields[`policy`])
        formData.append('x-amz-signature', data.fields[`x-amz-signature`])
        formData.append('file', fileInput)
        console.log('data', data.url)
        console.log('formData', formData)
        uploadFileApi({
          url: data.url,
          formData: formData,
        })
          .then(() => {
            console.log('data new url', data.newUrl)
            setValue('document', data.newUrl)
            console.log('getValueDocument', getValues('document'))
            // props.onFileSelectSuccess(data.newUrl)
            dispatch(loadingActions.doLoadingSuccess())
          })
          .catch(({ response }) => {
            dispatch(loadingActions.doLoadingFailure())
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <>
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
          <Grid sx={{ maxWidth: '300px' }}>
            <ButtonCustom
              variant="contained"
              size="large"
              onClick={handleOpenDrawerOpen}
            >
              {t('addNewCustomer')}
            </ButtonCustom>
          </Grid>
          <Grid sx={{ maxWidth: '300px' }}>
            <ButtonCustom
              variant="contained"
              component="label"
              fullWidth
              size="large"
            >
              Create with OCR
              <input
                hidden
                accept=".pdf,.png,.jpeg"
                type="file"
                onChange={handleReadLicense}
              />
            </ButtonCustom>
          </Grid>
        </Grid>

        {stateListClient?.data?.length !== 0 ? (
          <>
            <TableContainerTws>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCellTws>
                      {t('list.customerNamePhoneNumber')}
                    </TableCellTws>
                    <TableCellTws>{t('list.emailAddress')}</TableCellTws>
                    <TableCellTws align="center">
                      {t('list.vipStatus')}
                    </TableCellTws>
                    <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                      {t('list.action')}
                    </TableCellTws>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stateListClient?.data.map((item, index) => {
                    return (
                      <TableRowTws
                        key={index}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() =>
                          router.push(
                            `/retailer/crm/customer/walk-in-customer-detail/${item.id}`
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
                        <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation()

                              handleOpenMenu(e)
                              console.log('item d', item)
                              setStateCurrentClientDetail(item)
                            }}
                          >
                            <Gear />
                          </IconButton>
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
                count={stateListClient ? stateListClient?.totalPages : 0}
              />
            </Stack>
            <MenuAction
              elevation={0}
              anchorEl={anchorEl}
              open={open}
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
              <MenuItem
                onClick={() =>
                  router.push(
                    `/retailer/crm/customer/walk-in-customer-detail/${stateCurrentClientDetail?.id}`
                  )
                }
              >
                {t('viewDetail')}
              </MenuItem>
              <MenuItem onClick={() => handleOpenDrawerUpdate()}>
                {t('update')}
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAnchorEl(null)
                  setStateDialog(true)
                }}
              >
                {t('delete')}
              </MenuItem>
            </MenuAction>

            <Dialog open={stateDialog} onClose={() => setStateDialog(false)}>
              <DialogTitleTws>
                {' '}
                <IconButton onClick={() => setStateDialog(false)}>
                  <X size={20} />
                </IconButton>
              </DialogTitleTws>

              <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
                {t('deleteCustomer')}{' '}
                {String(stateCurrentClientDetail?.first_name)}{' '}
                {String(stateCurrentClientDetail?.last_name)}
              </TypographyH2>
              <DialogContentTws>
                <DialogContentTextTws>
                  {t('areYouSureToDelete')}
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
                    onClick={handleDeleteClient}
                    size="large"
                  >
                    {t('yes')}
                  </ButtonCustom>
                </Stack>
              </DialogActionsTws>
            </Dialog>
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
      <Drawer
        anchor="right"
        open={stateDrawerCreate}
        onClose={() => handleCloseDrawer()}
        disableEnforceFocus
      >
        <Box sx={{ background: 'white', width: '500px', padding: '20px' }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: '15px' }}
          >
            <IconButton onClick={() => handleCloseDrawer()}>
              <ArrowLeft size={24} />
            </IconButton>
            <Typography sx={{ fontWeight: 600, fontSize: '2.4rem' }}>
              {stateCurrentClientDetail
                ? t('updateCustomer')
                : t('createCustomer')}
            </Typography>
          </Stack>
          <form onSubmit={handleSubmit(onSubmitCreate)}>
            <Box sx={{ marginBottom: '15px' }}>
              <Controller
                control={control}
                name="first_name"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      error={!!errors.first_name}
                      sx={{ marginBottom: '10px' }}
                    >
                      {t('firstName')}
                      <RequiredLabel />
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="first_name"
                        placeholder={t('enterFirstName')}
                        error={!!errors.first_name}
                        {...field}
                      />
                      <FormHelperText error={!!errors.first_name}>
                        {errors.first_name && `${errors.first_name.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
            <Box sx={{ marginBottom: '15px' }}>
              <Controller
                control={control}
                name="last_name"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      error={!!errors.last_name}
                      sx={{ marginBottom: '10px' }}
                    >
                      {t('lastName')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="last_name"
                        placeholder={t('enterLastName')}
                        error={!!errors.last_name}
                        {...field}
                      />
                      <FormHelperText error={!!errors.last_name}>
                        {errors.last_name && `${errors.last_name.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
            <Box sx={{ marginBottom: '15px' }}>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      error={!!errors.email}
                      sx={{ marginBottom: '10px' }}
                    >
                      {t('email')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="email"
                        placeholder={t('enterEmail')}
                        error={!!errors.email}
                        {...field}
                      />
                      <FormHelperText error={!!errors.email}>
                        {errors.email && `${errors.email.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
            <Box sx={{ marginBottom: '15px' }}>
              <Controller
                control={control}
                name="phone_number"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="phone_number"
                      sx={{ marginBottom: '10px' }}
                      error={!!errors.phone_number}
                    >
                      <RequiredLabel />
                      {t('phoneNumber')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <div className={classes['input-number']}>
                        <PatternFormat
                          id="phone_number"
                          customInput={TextField}
                          {...field}
                          error={!!errors.phone_number}
                          placeholder={t('enterPhoneNumber')}
                          format="(###) ### ####"
                        />
                      </div>
                      <FormHelperText error={!!errors.phone_number}>
                        {errors.phone_number &&
                          `${errors.phone_number.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
            <Box sx={{ marginBottom: '15px' }}>
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      error={!!errors.address}
                      sx={{ marginBottom: '10px' }}
                    >
                      {t('address')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="address"
                        placeholder={t('enterAddress')}
                        error={!!errors.address}
                        {...field}
                      />
                      <FormHelperText error={!!errors.address}>
                        {errors.address && `${errors.address.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
            <Box sx={{ marginBottom: '15px' }}>
              <Controller
                control={control}
                name="business_name"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      error={!!errors.business_name}
                      sx={{ marginBottom: '10px' }}
                    >
                      {t('businessName')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="business_name"
                        placeholder={t('enterBusinessName')}
                        error={!!errors.business_name}
                        {...field}
                      />
                      <FormHelperText error={!!errors.business_name}>
                        {errors.business_name &&
                          `${errors.business_name.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
            <Stack direction="row" spacing={2}>
              <ButtonCancel size="large" onClick={() => handleCloseDrawer()}>
                Cancel
              </ButtonCancel>
              <ButtonCustom variant="contained" size="large" type="submit">
                {t('submit')}
              </ButtonCustom>
            </Stack>
          </form>
        </Box>
      </Drawer>
    </>
  )
}

export default WalkinCustomerComponent
