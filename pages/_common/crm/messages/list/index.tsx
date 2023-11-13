import {
  Box,
  Breadcrumbs,
  Checkbox,
  Dialog,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  MenuItem,
  Pagination,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import Head from 'next/head'

import React, { useEffect, useState } from 'react'
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
  TypographyTitlePage,
} from 'src/components'
import {
  createMessage,
  deleteMessage,
  getLeadList,
  getListCustomer,
  getListMessage,
  getRetailerList,
  sendMessage,
  updateMessage,
} from './messageAPI'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'

import {
  formatPhoneNumber,
  handlerGetErrMessage,
  objToStringParam,
  platform,
} from 'src/utils/global.utils'
import {
  CreateMessageType,
  ListClientResponseType,
  ListContactResponseType,
  ListMessageResponseType,
  MessageDetailType,
  RetailerDataResponseType,
  SendNMessageType,
} from './messageModel'
import moment from 'moment'
import { Controller, useForm } from 'react-hook-form'
import { ArrowRight, Gear, MagnifyingGlass, X } from '@phosphor-icons/react'
import { useRouter } from 'next/router'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  schema,
  schemaCreateMessage,
  schemaLead,
  schemaRetailer,
} from './validations'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/system'
import RequiredLabel from 'src/components/requiredLabel'
import { useTranslation } from 'next-i18next'

const CustomBoxDrawer = styled(Box)(() => ({
  width: '1500px',
  background: '#FFF',
  borderRadius: '10px',
  padding: '30px',
}))
const MessageManagementComponent = () => {
  const { t } = useTranslation('messages')
  const [pushMessage] = useEnqueueSnackbar()
  const [stateListMessage, setStateListMessage] =
    useState<ListMessageResponseType>()
  const [stateDrawerCreateMessage, setStateDrawerCreateMessage] =
    useState(false)
  const [stateDrawerUpdateMessage, setStateDrawerUpdateMessage] =
    useState(false)
  const [stateCurrentMessage, setStateCurrentMessage] =
    useState<MessageDetailType>()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)
  const [stateOpenDialog, setStateOpenDialog] = useState(false)
  const [stateCheckedRetailer, setStateCheckedRetailer] = useState(false)
  const [stateRadioButtonForRetailer, setStateRadioButtonForRetailer] =
    useState(1)
  const [stateListSelectedRetailerID, setStateListSelectedRetailer] = useState<
    number[]
  >([])
  const [
    stateTemporaryListSelectedRetailerID,
    setStateTemporarySelectedRetailerID,
  ] = useState<number[]>([])
  const [stateDrawerListRetailer, setStateDrawerListRetailer] = useState(false)
  const [stateCheckedLead, setStateCheckedLead] = useState(false)
  const [stateRadioButtonForLead, setStateRadioButtonForLead] = useState(1)
  const [stateListSelectedLeadID, setStateListSelectedLeadID] = useState<
    number[]
  >([])
  const [stateDrawerListLead, setStateDrawerListLead] = useState(false)

  const [stateTemporaryListSelectedLeadID, setStateTemporarySelectedLeadID] =
    useState<number[]>([])

  const [stateCheckedCustomer, setStateCheckedCustomer] = useState(false)
  const [stateRadioButtonForCustomer, setStateRadioButtonForCustomer] =
    useState(1)
  const [stateListSelectedCustomerID, setStateListSelectedCustomerID] =
    useState<number[]>([])
  const [
    stateTemporaryListSelectedCustomerID,
    setStateTemporarySelectedCustomerID,
  ] = useState<number[]>([])
  const [stateDrawerListCustomer, setStateDrawerListCustomer] = useState(false)
  const [stateCheckedViaEmail, setStateCheckedViaEmail] = useState(false)
  const [stateCheckedViaApp, setStateCheckedViaApp] = useState(false)
  const [stateRetailerList, setStateRetailerList] =
    useState<RetailerDataResponseType>()
  const [stateListLead, setStateListLead] = useState<ListContactResponseType>()
  const [stateListCustomer, setStateListCustomer] =
    useState<ListClientResponseType>()
  const [stateRouterQueryForCustomer, setStateRouterQueryForCustomer] =
    useState<{
      page: number
      limit: number
      search: string
    }>({
      page: 1,
      limit: 10,
      search: '',
    })
  const [stateRouterQueryForRetailer, setStateRouterQueryForRetailer] =
    useState<{ page: number; limit: number; search: string }>({
      page: 1,
      limit: 10,
      search: '',
    })
  const [stateRouterQueryForLead, setStateRouterQueryForLead] = useState<{
    page: number
    limit: number
    key: string
  }>({
    page: 1,
    limit: 10,
    key: '',
  })
  const handleChangeCheckedCustomer = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateCheckedCustomer(event.target.checked)
  }
  const handleChangeRadioCustomer = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateRadioButtonForCustomer(
      Number((event.target as HTMLInputElement).value)
    )
  }
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
    setStateCurrentMessage(undefined)
  }
  const router = useRouter()
  const {
    handleSubmit,
    control,
    reset,
    clearErrors,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<CreateMessageType>({
    resolver: yupResolver(schemaCreateMessage(t)),
    mode: 'all',
  })
  const {
    handleSubmit: handleSubmitUpdate,
    control: controlUpdate,
    reset: resetUpdate,
    setValue: setValueUpdate,
    clearErrors: clearErrorsUpdate,
    formState: { errors: errorsUpdate },
  } = useForm<CreateMessageType>({
    resolver: yupResolver(schemaCreateMessage(t)),
    mode: 'all',
  })
  const {
    handleSubmit: handleSubmitSearch,
    control: controlSearch,

    formState: { errors: errorsSearch },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })
  const {
    handleSubmit: handleSubmitSearchRetailer,
    control: controlSearchRetailer,
  } = useForm<{ search: string }>({
    resolver: yupResolver(schemaRetailer),
    mode: 'all',
  })
  const {
    handleSubmit: handleSubmitSearchCustomer,
    control: controlSearchCustomer,
  } = useForm<{ search: string }>({
    resolver: yupResolver(schemaRetailer),
    mode: 'all',
  })
  useEffect(() => {
    getRetailerList(stateRouterQueryForRetailer)
      .then((res) => {
        const { data } = res
        setStateRetailerList(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [stateRouterQueryForRetailer])

  useEffect(() => {
    getLeadList(stateRouterQueryForLead)
      .then((res) => {
        const { data } = res
        setStateListLead(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [stateRouterQueryForLead])
  useEffect(() => {
    getListCustomer(stateRouterQueryForCustomer)
      .then((res) => {
        const { data } = res
        setStateListCustomer(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [stateRouterQueryForCustomer])
  const { handleSubmit: handleSubmitSearchLead, control: controlSearchLead } =
    useForm<{ key: string }>({
      resolver: yupResolver(schemaLead),
      mode: 'all',
    })
  const handleSearch = (values: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        key: values.key,
        page: 1,
      })}`,
    })
  }
  const handleSearchRetailer = (value: { search: string }) => {
    setStateRouterQueryForRetailer({
      ...stateRouterQueryForRetailer,
      search: value.search,
    })
  }
  const handleSearchLead = (value: { key: string }) => {
    setStateRouterQueryForLead({
      ...stateRouterQueryForLead,
      key: value.key,
    })
  }
  const handleSearchCustomer = (value: { search: string }) => {
    setStateRouterQueryForCustomer({
      ...stateRouterQueryForCustomer,
      search: value.search,
    })
  }
  const handleGetListMessage = (query: any) => {
    getListMessage(query)
      .then((res) => {
        const { data } = res
        setStateListMessage(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  useEffect(() => {
    handleGetListMessage(router.query)
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
  const handleCloseDrawerCreateMessage = () => {
    setStateDrawerCreateMessage(false)
    reset()
    clearErrors()
  }
  const handleCloseDrawerUpdateMessage = () => {
    setStateDrawerUpdateMessage(false)
    resetUpdate()
    clearErrorsUpdate()
  }
  const onSubmitCreateMessage = (value: CreateMessageType) => {
    createMessage(value)
      .then(() => {
        handleGetListMessage(router.query)

        pushMessage(t('message.createMessageSuccessfully'), 'success')
        handleCloseDrawerCreateMessage()
        handleGetListMessage(router.query)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const onSubmitUpdateMessage = (value: CreateMessageType) => {
    updateMessage(Number(stateCurrentMessage?.id), value)
      .then(() => {
        pushMessage(t('message.updateMessageSuccessfully'), 'success')
        handleCloseDrawerUpdateMessage()
        handleGetListMessage(router.query)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleClickUpdateMessage = () => {
    if (!stateCurrentMessage) return
    setValueUpdate('title', stateCurrentMessage?.title)
    setValueUpdate('message', stateCurrentMessage?.message)
    setAnchorEl(null)
    setStateDrawerUpdateMessage(true)
  }
  const handleDeleteCurrentMessage = () => {
    deleteMessage(Number(stateCurrentMessage?.id))
      .then(() => {
        pushMessage(t('message.deleteMessageSuccessfully'), 'success')
        handleGetListMessage(router.query)

        setStateOpenDialog(false)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleChangeCheckedRetailer = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateCheckedRetailer(event.target.checked)
  }
  const handleChangeRadioRetailer = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateRadioButtonForRetailer(
      Number((event.target as HTMLInputElement).value)
    )
  }
  const handleOpenDrawerRetailerList = () => {
    if (stateListSelectedRetailerID.length > 0) {
      const cloneListSelectedRetailerID: number[] = JSON.parse(
        JSON.stringify(stateListSelectedRetailerID)
      )
      setStateTemporarySelectedRetailerID(cloneListSelectedRetailerID)
    }
    setStateDrawerListRetailer(true)
  }
  const handleChangeCheckedLead = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateCheckedLead(event.target.checked)
  }
  const handleChangeRadioLead = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateRadioButtonForLead(Number((event.target as HTMLInputElement).value))
  }
  const handleOpenDrawerLeadList = () => {
    if (stateListSelectedLeadID.length > 0) {
      const cloneListSelectedLeadID: number[] = JSON.parse(
        JSON.stringify(stateListSelectedLeadID)
      )
      setStateTemporarySelectedLeadID(cloneListSelectedLeadID)
    }
    setStateDrawerListLead(true)
  }
  const handleOpenDrawerCustomerList = () => {
    if (stateListSelectedCustomerID.length > 0) {
      const cloneListSelectedCustomerID: number[] = JSON.parse(
        JSON.stringify(stateListSelectedCustomerID)
      )
      setStateTemporarySelectedCustomerID(cloneListSelectedCustomerID)
    }
    setStateDrawerListCustomer(true)
  }
  const handleChangeCheckedViaEmail = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateCheckedViaEmail(event.target.checked)
  }
  const handleChangeCheckedViaApp = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateCheckedViaApp(event.target.checked)
  }
  const handleConfirmSelectedRetailerList = () => {
    const cloneCurrentTemporaryList: number[] = JSON.parse(
      JSON.stringify(stateTemporaryListSelectedRetailerID)
    )
    setStateListSelectedRetailer(cloneCurrentTemporaryList)
    setStateDrawerListRetailer(false)
  }
  const handleCloseDrawerRetailerList = () => {
    setStateTemporarySelectedRetailerID([])
    setStateDrawerListRetailer(false)
  }
  const handleCloseDrawerLeadList = () => {
    setStateTemporarySelectedLeadID([])
    setStateDrawerListLead(false)
  }
  const handleCloseDrawerCustomerList = () => {
    setStateTemporarySelectedCustomerID([])
    setStateDrawerListCustomer(false)
  }
  const handleCheckIsSelectedInRetailerList = (index: number) => {
    return stateTemporaryListSelectedRetailerID.some((id) => id === index)
  }
  const submitSendMessage = () => {
    trigger()
    if (errors.message || errors.title) return
    if (!stateCheckedViaApp && !stateCheckedViaEmail) {
      pushMessage(t('message.pleaseSelectAtLeastOneSendMethod'), 'error')
      return
    }
    if (!stateCheckedCustomer && !stateCheckedLead && !stateCheckedRetailer) {
      pushMessage(t('message.pleaseSelectAtLeastOneSendTarget'), 'error')
      return
    }
    if (
      platform() !== 'SUPPLIER' &&
      stateRadioButtonForCustomer === 2 &&
      stateListSelectedCustomerID.length === 0
    ) {
      pushMessage(t('message.pleaseSelectSpecificCustomer'), 'error')
      return
    }
    if (stateRadioButtonForLead === 2 && stateListSelectedLeadID.length === 0) {
      pushMessage(t('message.pleaseSelectSpecificLead'), 'error')
      return
    }
    if (
      stateRadioButtonForRetailer === 2 &&
      stateListSelectedRetailerID.length === 0
    ) {
      pushMessage(t('message.pleaseSelectSpecificCustomer'), 'error')
      return
    }
    createMessage({ title: getValues('title'), message: getValues('message') })
      .then((res) => {
        const { data } = res.data
        const submitValue: SendNMessageType = {
          enable_retailer: stateCheckedRetailer,
          all_retailer: stateRadioButtonForRetailer === 1 ? true : false,
          retailer: stateListSelectedRetailerID,
          enable_leads: stateCheckedLead,
          all_leads: stateRadioButtonForLead === 1 ? true : false,
          leads: stateListSelectedLeadID,
          enable_customers: stateCheckedCustomer,
          all_customer: stateRadioButtonForCustomer === 1 ? true : false,
          customers: stateListSelectedCustomerID,
          over_email: stateCheckedViaEmail,
          over_noti: stateCheckedViaApp,
        }

        sendMessage(data.id, submitValue)
          .then(() => {
            pushMessage(t('message.theMessageHasBeenCreateSent'), 'success')
            handleGetListMessage(router.query)

            pushMessage(t('message.createMessageSuccessfully'), 'success')
            handleCloseDrawerCreateMessage()
            handleGetListMessage(router.query)
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleChangeSelectedInRetailerList = (index: number) => {
    const cloneCurrentListSelectedRetailerID: number[] = JSON.parse(
      JSON.stringify(stateTemporaryListSelectedRetailerID)
    )
    if (handleCheckIsSelectedInRetailerList(index)) {
      const result = stateTemporaryListSelectedRetailerID.findIndex(
        (id) => id === index
      )
      cloneCurrentListSelectedRetailerID.splice(result, 1)
      setStateTemporarySelectedRetailerID(cloneCurrentListSelectedRetailerID)
    } else {
      cloneCurrentListSelectedRetailerID.push(index)
      setStateTemporarySelectedRetailerID(cloneCurrentListSelectedRetailerID)
    }
  }
  const handleCheckIsSelectedInLeadList = (index: number) => {
    return stateTemporaryListSelectedLeadID.some((id) => id === index)
  }
  const handleCheckIsSelectedInCustomerList = (index: number) => {
    return stateTemporaryListSelectedCustomerID.some((id) => id === index)
  }
  const handleChangeSelectedInLeadList = (index: number) => {
    const cloneCurrentListSelectedLeadID: number[] = JSON.parse(
      JSON.stringify(stateTemporaryListSelectedLeadID)
    )
    if (handleCheckIsSelectedInLeadList(index)) {
      const result = stateTemporaryListSelectedLeadID.findIndex(
        (id) => id === index
      )
      cloneCurrentListSelectedLeadID.splice(result, 1)
      setStateTemporarySelectedLeadID(cloneCurrentListSelectedLeadID)
    } else {
      cloneCurrentListSelectedLeadID.push(index)
      setStateTemporarySelectedLeadID(cloneCurrentListSelectedLeadID)
    }
  }
  const handleConfirmSelectedLeadList = () => {
    const cloneCurrentTemporaryList: number[] = JSON.parse(
      JSON.stringify(stateTemporaryListSelectedLeadID)
    )
    setStateListSelectedLeadID(cloneCurrentTemporaryList)
    setStateDrawerListLead(false)
  }
  const handleChangeSelectedInCustomerList = (index: number) => {
    const cloneCurrentListSelectedCustomerID: number[] = JSON.parse(
      JSON.stringify(stateTemporaryListSelectedCustomerID)
    )
    if (handleCheckIsSelectedInCustomerList(index)) {
      const result = stateTemporaryListSelectedCustomerID.findIndex(
        (id) => id === index
      )
      cloneCurrentListSelectedCustomerID.splice(result, 1)
      setStateTemporarySelectedCustomerID(cloneCurrentListSelectedCustomerID)
    } else {
      cloneCurrentListSelectedCustomerID.push(index)
      setStateTemporarySelectedCustomerID(cloneCurrentListSelectedCustomerID)
    }
  }

  const handleConfirmSelectedCustomerList = () => {
    const cloneCurrentTemporaryList: number[] = JSON.parse(
      JSON.stringify(stateTemporaryListSelectedCustomerID)
    )
    setStateListSelectedCustomerID(cloneCurrentTemporaryList)
    setStateDrawerListCustomer(false)
  }
  return (
    <Box>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('title')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Typography>{t('title')}</Typography>
      </Breadcrumbs>
      <Grid container spacing={2}>
        <Grid xs>
          <form
            onSubmit={handleSubmitSearch(handleSearch)}
            className="form-search"
          >
            <Controller
              control={controlSearch}
              name="key"
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextFieldSearchCustom
                    id="key"
                    error={!!errorsSearch.key}
                    placeholder={t('searchMessages')}
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
        <Grid xs={2.5}>
          <ButtonCustom
            onClick={() => setStateDrawerCreateMessage(true)}
            variant="contained"
            size="large"
            sx={{ width: '100%' }}
          >
            {t('createNewMessage')}
          </ButtonCustom>
        </Grid>
      </Grid>

      <TableContainerTws>
        <Table>
          <TableHead>
            <TableRow>
              <TableCellTws width={200}>{t('list.title')}</TableCellTws>
              <TableCellTws>{t('list.content')}</TableCellTws>
              <TableCellTws width={200}>{t('list.createdDate')}</TableCellTws>
              <TableCellTws width={80}>{t('list.action')}</TableCellTws>
            </TableRow>
          </TableHead>
          <TableBody>
            {stateListMessage?.data.map((item, index) => {
              return (
                <TableRowTws
                  key={index}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() =>
                    router.push(
                      `/${platform().toLowerCase()}/crm/messages/detail/${
                        item.id
                      }`
                    )
                  }
                >
                  <TableCellTws>{item.title}</TableCellTws>
                  <TableCellTws>{item.message}</TableCellTws>
                  <TableCellTws>
                    {moment(item.created_at).format('MM/DD/YYYY - hh:mm A')}
                  </TableCellTws>
                  <TableCellTws>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenMenu(e)
                        setStateCurrentMessage(item)
                      }}
                    >
                      <Gear size={28} />
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
            value={Number(router.query.limit) ? Number(router.query.limit) : 10}
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
          count={stateListMessage ? stateListMessage?.totalPages : 0}
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
          onClick={() => {
            handleClickUpdateMessage()
          }}
        >
          {t('update')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null)

            setStateOpenDialog(true)
          }}
        >
          {t('delete')}
        </MenuItem>

        {/* <MenuItem onClick={handleCloseMenu}>Delete</MenuItem> */}
      </MenuAction>
      <Drawer
        anchor="right"
        open={stateDrawerCreateMessage}
        onClose={() => handleCloseDrawerCreateMessage()}
      >
        <CustomBoxDrawer>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ marginBottom: '15px' }}
          >
            <IconButton onClick={handleCloseDrawerCreateMessage}>
              <ArrowRight size={24} />
            </IconButton>
            <TypographyH2 textAlign="center">
              {t('createNewMessage')}
            </TypographyH2>
          </Stack>

          <Grid container>
            <Grid xs={8}>
              <Box>
                <form onSubmit={handleSubmit(onSubmitCreateMessage)}>
                  <Box sx={{ marginBottom: '15px' }}>
                    <Controller
                      control={control}
                      name="title"
                      render={({ field }) => (
                        <>
                          <InputLabelCustom>
                            {t('Title')}
                            <RequiredLabel />
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              error={!!errors.title}
                              {...field}
                            />
                          </FormControl>
                          <FormHelperText error={!!errors.title}>
                            {errors.title && `${errors.title.message}`}
                          </FormHelperText>
                        </>
                      )}
                    />
                  </Box>
                  <Box sx={{ marginBottom: '15px' }}>
                    <Controller
                      control={control}
                      name="message"
                      render={({ field }) => (
                        <>
                          <InputLabelCustom>
                            {t('Message')}
                            <RequiredLabel />
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              multiline
                              rows={20}
                              error={!!errors.message}
                              {...field}
                            />
                          </FormControl>
                          <FormHelperText error={!!errors.message}>
                            {errors.message && `${errors.message.message}`}
                          </FormHelperText>
                        </>
                      )}
                    />
                  </Box>
                  <Stack direction="row" spacing={2}>
                    <ButtonCustom variant="outlined" size="large">
                      {t('cancel')}
                    </ButtonCustom>
                    <ButtonCustom
                      type="submit"
                      variant="contained"
                      size="large"
                    >
                      {t('create')}
                    </ButtonCustom>
                    <ButtonCustom
                      size="large"
                      variant="contained"
                      onClick={submitSendMessage}
                    >
                      {t('createSend')}
                    </ButtonCustom>
                  </Stack>
                </form>
              </Box>
            </Grid>
            <Grid xs={4}>
              <Box
                sx={{
                  width: '100%',

                  padding: '15px',
                  borderRadius: '10px',
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: '#0A0D14',
                    fontSize: '1.6rem',
                    marginBottom: '15px',
                  }}
                >
                  {t('sendSettings')}
                </Typography>
                <Stack
                  sx={{
                    border: '1px solid #E1E6EF',
                    background: 'white',
                    marginBottom: '15px',
                  }}
                >
                  <Box sx={{ borderBottom: '1px solid #E1E6EF' }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        padding: '20px',
                      }}
                    >
                      <Typography sx={{ color: '#49516F', fontWeight: 600 }}>
                        {t('sendToRetailer')}
                      </Typography>
                      <Switch
                        checked={stateCheckedRetailer}
                        onChange={handleChangeCheckedRetailer}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Stack>
                  </Box>
                  <Box sx={{ padding: '20px' }}>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={stateRadioButtonForRetailer}
                        onChange={handleChangeRadioRetailer}
                      >
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label={t('allRetailers')}
                        />
                        <FormControlLabel
                          value={2}
                          control={<Radio />}
                          label={t('specificRetailer')}
                        />
                      </RadioGroup>
                    </FormControl>
                    {stateRadioButtonForRetailer === 2 && (
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography>
                          {stateListSelectedRetailerID.length} {t('selected')}
                        </Typography>
                        <ButtonCustom
                          variant="contained"
                          size="large"
                          onClick={() => {
                            handleOpenDrawerRetailerList()
                          }}
                        >
                          {t('select')}
                        </ButtonCustom>
                      </Stack>
                    )}
                  </Box>
                </Stack>
                <Stack
                  sx={{
                    border: '1px solid #E1E6EF',
                    background: 'white',
                    marginBottom: '15px',
                  }}
                >
                  <Box sx={{ borderBottom: '1px solid #E1E6EF' }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        padding: '20px',
                      }}
                    >
                      <Typography sx={{ color: '#49516F', fontWeight: 600 }}>
                        {t('sendToLeads')}
                      </Typography>
                      <Switch
                        checked={stateCheckedLead}
                        onChange={handleChangeCheckedLead}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Stack>
                  </Box>
                  <Box sx={{ padding: '20px' }}>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={stateRadioButtonForLead}
                        onChange={handleChangeRadioLead}
                      >
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label={t('allLeads')}
                        />
                        <FormControlLabel
                          value={2}
                          control={<Radio />}
                          label={t('specificLeads')}
                        />
                      </RadioGroup>
                    </FormControl>
                    {stateRadioButtonForLead === 2 && (
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography>
                          {stateListSelectedLeadID.length} {t('selected')}
                        </Typography>
                        <ButtonCustom
                          variant="contained"
                          size="large"
                          onClick={() => {
                            handleOpenDrawerLeadList()
                          }}
                        >
                          {t('select')}
                        </ButtonCustom>
                      </Stack>
                    )}
                  </Box>
                </Stack>
                {platform() !== 'SUPPLIER' && (
                  <Stack
                    sx={{
                      border: '1px solid #E1E6EF',
                      background: 'white',
                      marginBottom: '15px',
                    }}
                  >
                    <Box sx={{ borderBottom: '1px solid #E1E6EF' }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          padding: '20px',
                        }}
                      >
                        <Typography sx={{ color: '#49516F', fontWeight: 600 }}>
                          {t('sendToCustomers')}
                        </Typography>
                        <Switch
                          checked={stateCheckedCustomer}
                          onChange={handleChangeCheckedCustomer}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </Stack>
                    </Box>
                    <Box sx={{ padding: '20px' }}>
                      <FormControl>
                        <RadioGroup
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={stateRadioButtonForCustomer}
                          onChange={handleChangeRadioCustomer}
                        >
                          <FormControlLabel
                            value={1}
                            control={<Radio />}
                            label={t('allCustomers')}
                          />
                          <FormControlLabel
                            value={2}
                            control={<Radio />}
                            label={t('specificCustomers')}
                          />
                        </RadioGroup>
                      </FormControl>
                      {stateRadioButtonForCustomer === 2 && (
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography>
                            {stateListSelectedCustomerID.length} {t('selected')}
                          </Typography>
                          <ButtonCustom
                            variant="contained"
                            size="large"
                            onClick={() => {
                              handleOpenDrawerCustomerList()
                            }}
                          >
                            {t('select')}
                          </ButtonCustom>
                        </Stack>
                      )}
                    </Box>
                  </Stack>
                )}
                <Stack
                  sx={{
                    border: '1px solid #E1E6EF',
                    background: 'white',
                    marginBottom: '15px',
                  }}
                >
                  <Box
                    sx={{
                      padding: '20px',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, color: '#49516F' }}>
                      {t('sendMethods')}
                    </Typography>
                  </Box>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      padding: '20px',
                    }}
                  >
                    <Typography sx={{ color: '#49516F', fontWeight: 600 }}>
                      {t('email')}
                    </Typography>
                    <Switch
                      checked={stateCheckedViaEmail}
                      onChange={handleChangeCheckedViaEmail}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      padding: '20px',
                    }}
                  >
                    <Typography sx={{ color: '#49516F', fontWeight: 600 }}>
                      {t('inAppNotification')}
                    </Typography>
                    <Switch
                      checked={stateCheckedViaApp}
                      onChange={handleChangeCheckedViaApp}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  </Stack>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </CustomBoxDrawer>
      </Drawer>
      <Drawer
        anchor="right"
        open={stateDrawerUpdateMessage}
        onClose={() => handleCloseDrawerUpdateMessage()}
      >
        <CustomBoxDrawer>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ marginBottom: '15px' }}
          >
            <IconButton onClick={() => handleCloseDrawerUpdateMessage()}>
              <ArrowRight size={24} />
            </IconButton>
            <TypographyH2 textAlign="center">{t('updateMessage')}</TypographyH2>
          </Stack>
          <Box>
            <form onSubmit={handleSubmitUpdate(onSubmitUpdateMessage)}>
              <Box sx={{ marginBottom: '15px' }}>
                <Controller
                  control={controlUpdate}
                  name="title"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom>
                        {t('Title')}
                        <RequiredLabel />
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          error={!!errorsUpdate.title}
                          {...field}
                        />
                      </FormControl>
                      <FormHelperText error={!!errorsUpdate.title}>
                        {errorsUpdate.title && `${errorsUpdate.title.message}`}
                      </FormHelperText>
                    </>
                  )}
                />
              </Box>
              <Box sx={{ marginBottom: '15px' }}>
                <Controller
                  control={controlUpdate}
                  name="message"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom>
                        {t('Message')}
                        <RequiredLabel />
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          multiline
                          rows={20}
                          error={!!errorsUpdate.message}
                          {...field}
                        />
                      </FormControl>
                      <FormHelperText error={!!errorsUpdate.message}>
                        {errorsUpdate.message &&
                          `${errorsUpdate.message.message}`}
                      </FormHelperText>
                    </>
                  )}
                />
              </Box>
              <Stack direction="row" spacing={2}>
                <ButtonCustom variant="outlined" size="large">
                  {t('cancel')}
                </ButtonCustom>
                <ButtonCustom type="submit" variant="contained" size="large">
                  {t('submit')}
                </ButtonCustom>
              </Stack>
            </form>
          </Box>
        </CustomBoxDrawer>
      </Drawer>
      <Dialog open={stateOpenDialog} onClose={() => setStateOpenDialog(false)}>
        <DialogTitleTws>
          <IconButton onClick={() => setStateOpenDialog(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {t('deleteMessage')}
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>{t('areYouSureToDelete')}</DialogContentTextTws>
        </DialogContentTws>
        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => setStateOpenDialog(false)}
              variant="outlined"
              size="large"
            >
              {t('no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={handleDeleteCurrentMessage}
              size="large"
            >
              {t('yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
      {/* //! Drawer for retailer  */}
      <Drawer
        anchor="right"
        open={stateDrawerListRetailer}
        onClose={handleCloseDrawerRetailerList}
        disableEnforceFocus
      >
        <CustomBoxDrawer>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ marginBottom: '15px' }}
          >
            <IconButton onClick={handleCloseDrawerRetailerList}>
              <ArrowRight size={24} />
            </IconButton>
            <TypographyH2 textAlign="center">
              {t('selectRetailer')}
            </TypographyH2>
          </Stack>
          <Box sx={{ marginBottom: '15px' }}>
            <form
              onSubmit={handleSubmitSearchRetailer(handleSearchRetailer)}
              className="form-search"
            >
              <Controller
                control={controlSearchRetailer}
                name="search"
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth>
                    <TextFieldSearchCustom
                      id="search"
                      placeholder={t('searchRetailerByName')}
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
          </Box>
          <TableContainerTws>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws></TableCellTws>
                  <TableCellTws>
                    <Typography sx={{ color: '#49516F' }}>
                      {t('businessOwnerName')}
                    </Typography>
                  </TableCellTws>

                  <TableCellTws align="right">
                    <Typography sx={{ color: '#49516F' }}>
                      {t('federalTaxId')}
                    </Typography>
                  </TableCellTws>
                  <TableCellTws>
                    <Typography sx={{ color: '#49516F' }}>
                      {t('email')}
                    </Typography>
                  </TableCellTws>
                  <TableCellTws align="center">
                    <Typography sx={{ color: '#49516F' }}>
                      {t('phoneNumber')}
                    </Typography>
                  </TableCellTws>
                </TableRow>
              </TableHead>
              <TableBody>
                {stateRetailerList?.data.map((item, index) => {
                  return (
                    <TableRowTws key={index}>
                      <TableCellTws>
                        <Checkbox
                          checked={handleCheckIsSelectedInRetailerList(
                            item.business_id
                          )}
                          onChange={(e) => {
                            console.log(e)
                            handleChangeSelectedInRetailerList(item.business_id)
                          }}
                        />
                      </TableCellTws>

                      <TableCellTws>
                        <Stack spacing={1}>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: '1.6rem',
                              color: '#595959',
                            }}
                          >
                            {item.business_name}
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              color: '#9098B1',
                            }}
                          >
                            {item.owner_name}
                          </Typography>
                        </Stack>
                      </TableCellTws>
                      <TableCellTws align="right">
                        {item.federal_tax_id}
                      </TableCellTws>

                      <TableCellTws>{item.email}</TableCellTws>
                      <TableCellTws align="center">
                        {formatPhoneNumber(item.phone_number)}
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
                value={stateRouterQueryForRetailer.limit}
                onChange={(e) => {
                  setStateRouterQueryForRetailer({
                    ...stateRouterQueryForRetailer,
                    limit: Number(e.target.value),
                  })
                }}
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
              page={stateRouterQueryForRetailer.page}
              onChange={(event, page: number) => {
                console.log(event)
                setStateRouterQueryForRetailer({
                  ...stateRouterQueryForRetailer,
                  page: page,
                })
              }}
              count={
                stateRetailerList
                  ? Math.ceil(
                      Number(stateRetailerList.totalItems) /
                        stateRouterQueryForRetailer.limit
                    )
                  : 0
              }
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <ButtonCustom
              variant="outlined"
              size="large"
              onClick={() => {
                handleCloseDrawerRetailerList()
              }}
            >
              {t('cancel')}
            </ButtonCustom>
            <ButtonCustom
              variant="contained"
              size="large"
              onClick={() => {
                handleConfirmSelectedRetailerList()
              }}
            >
              {t('select')}
            </ButtonCustom>
          </Stack>
        </CustomBoxDrawer>
      </Drawer>
      {/* //!  Drawer for lead */}
      <Drawer
        anchor="right"
        open={stateDrawerListLead}
        onClose={() => {
          handleCloseDrawerLeadList()
        }}
      >
        <CustomBoxDrawer>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ marginBottom: '15px' }}
          >
            <IconButton onClick={handleCloseDrawerLeadList}>
              <ArrowRight size={24} />
            </IconButton>
            <TypographyH2 textAlign="center">{t('selectLead')}</TypographyH2>
          </Stack>
          <Box sx={{ marginBottom: '15px' }}>
            <form
              onSubmit={handleSubmitSearchLead(handleSearchLead)}
              className="form-search"
            >
              <Controller
                control={controlSearchLead}
                name="key"
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth>
                    <TextFieldSearchCustom
                      id="key"
                      placeholder={t('searchLead')}
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
          </Box>
          <TableContainerTws>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws></TableCellTws>
                  <TableCellTws>
                    <Typography sx={{ color: '#49516F' }}>
                      {t('businessLeadName')}
                    </Typography>
                  </TableCellTws>
                  <TableCellTws>
                    <Typography sx={{ color: '#49516F' }}>
                      {t('federalTaxId')}
                    </Typography>
                  </TableCellTws>
                  <TableCellTws align="center">
                    <Typography sx={{ color: '#49516F' }}>
                      {t('phoneNumberEmail')}
                    </Typography>
                  </TableCellTws>
                  <TableCellTws align="right">
                    <Typography sx={{ color: '#49516F' }}>
                      {t('address')}
                    </Typography>
                  </TableCellTws>
                </TableRow>
              </TableHead>
              <TableBody>
                {stateListLead?.data.map((item, index) => {
                  return (
                    <TableRowTws key={index}>
                      <TableCellTws>
                        <Checkbox
                          checked={handleCheckIsSelectedInLeadList(item.id)}
                          onChange={(e) => {
                            console.log(e)
                            handleChangeSelectedInLeadList(item.id)
                          }}
                        />
                      </TableCellTws>

                      <TableCellTws>
                        <Stack spacing={1}>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: '1.6rem',
                              color: '#595959',
                            }}
                          >
                            {item.business_name}
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              color: '#9098B1',
                            }}
                          >
                            {item.first_name}{' '}
                            {item.last_name ? item.last_name : ''}
                          </Typography>
                        </Stack>
                      </TableCellTws>
                      <TableCellTws align="right">
                        <Stack spacing={1}>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: '1.6rem',
                              color: '#595959',
                            }}
                          >
                            {item.federal_tax_id}
                          </Typography>
                          {item.type_of_lead && (
                            <Typography
                              sx={{
                                fontWeight: 500,
                                color: '#9098B1',
                                textTransform: 'capitalize',
                              }}
                            >
                              {item?.type_of_lead?.name?.toLowerCase()}
                            </Typography>
                          )}
                        </Stack>
                      </TableCellTws>
                      <TableCellTws align="center">
                        <Stack spacing={1}>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: '1.6rem',
                              color: '#595959',
                            }}
                          >
                            {' '}
                            {formatPhoneNumber(item.phone_number)}
                          </Typography>
                          <Typography
                            sx={{ color: '#9098B1', fontWeight: 500 }}
                          >
                            {item.email}
                          </Typography>
                        </Stack>
                      </TableCellTws>
                      <TableCellTws align="right">{item.address}</TableCellTws>
                      {/* <TableCellTws>{item}</TableCellTws> */}
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
                value={stateRouterQueryForLead.limit}
                onChange={(e) => {
                  setStateRouterQueryForLead({
                    ...stateRouterQueryForLead,
                    limit: Number(e.target.value),
                  })
                }}
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
              page={stateRouterQueryForLead.page}
              onChange={(event, page: number) => {
                console.log(event)
                setStateRouterQueryForLead({
                  ...stateRouterQueryForLead,
                  page: page,
                })
              }}
              count={
                stateListLead
                  ? Math.ceil(
                      Number(stateListLead.totalItems) /
                        stateRouterQueryForLead.limit
                    )
                  : 0
              }
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <ButtonCustom
              variant="outlined"
              size="large"
              onClick={() => {
                handleCloseDrawerLeadList()
              }}
            >
              {t('cancel')}
            </ButtonCustom>
            <ButtonCustom
              variant="contained"
              size="large"
              onClick={() => {
                handleConfirmSelectedLeadList()
              }}
            >
              {t('select')}
            </ButtonCustom>
          </Stack>
        </CustomBoxDrawer>
      </Drawer>
      {/* //! Drawer for client */}
      <Drawer
        anchor="right"
        open={stateDrawerListCustomer}
        onClose={() => {
          handleCloseDrawerCustomerList()
        }}
      >
        <CustomBoxDrawer>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ marginBottom: '15px' }}
          >
            <IconButton onClick={handleCloseDrawerCustomerList}>
              <ArrowRight size={24} />
            </IconButton>
            <TypographyH2 textAlign="center">
              {t('selectCustomer')}
            </TypographyH2>
          </Stack>
          <Box sx={{ marginBottom: '15px' }}>
            <form
              onSubmit={handleSubmitSearchCustomer(handleSearchCustomer)}
              className="form-search"
            >
              <Controller
                control={controlSearchCustomer}
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
          </Box>
          <TableContainerTws>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws></TableCellTws>
                  <TableCellTws>
                    <Typography sx={{ color: '#49516F' }}>
                      {t('customerName')}
                    </Typography>
                  </TableCellTws>
                  <TableCellTws>
                    <Typography sx={{ color: '#49516F' }}>
                      {t('phoneNumber')}
                    </Typography>
                  </TableCellTws>
                  <TableCellTws>
                    <Typography sx={{ color: '#49516F' }}>
                      {t('emailAddress')}
                    </Typography>
                  </TableCellTws>
                  <TableCellTws>
                    <Typography sx={{ color: '#49516F' }}>
                      {t('vipStatus')}
                    </Typography>
                  </TableCellTws>
                </TableRow>
              </TableHead>
              <TableBody>
                {stateListCustomer?.data.map((item, index) => {
                  return (
                    <TableRowTws key={index}>
                      <TableCellTws>
                        <Checkbox
                          checked={handleCheckIsSelectedInCustomerList(item.id)}
                          onChange={(e) => {
                            console.log(e)
                            handleChangeSelectedInCustomerList(item.id)
                          }}
                        />
                      </TableCellTws>

                      <TableCellTws>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: '1.6rem',
                            color: '#595959',
                          }}
                        >
                          {item.full_name}
                        </Typography>
                      </TableCellTws>

                      <TableCellTws>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: '1.6rem',
                            color: '#595959',
                          }}
                        >
                          {' '}
                          {formatPhoneNumber(item.phone_number)}
                        </Typography>
                      </TableCellTws>
                      <TableCellTws>
                        <Stack spacing={1}>
                          <Typography
                            sx={{
                              color: '#49516F',
                              fontWeight: 500,
                              fontSize: '1.6rem',
                            }}
                          >
                            {item.email}
                          </Typography>
                          <Typography
                            sx={{ color: '#9098B1', fontWeight: 500 }}
                          >
                            {item.address}
                          </Typography>
                        </Stack>
                      </TableCellTws>
                      <TableCellTws>
                        {item.is_vip ? (
                          <Box
                            sx={{
                              background: '#1DB46A',
                              borderRadius: '40px',
                              padding: '5px 20px',
                              color: 'white',
                              maxWidth: '60px',
                              fontWeight: 600,
                            }}
                          >
                            VIP
                          </Box>
                        ) : (
                          'N/A'
                        )}
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
                value={stateRouterQueryForCustomer.limit}
                onChange={(e) => {
                  setStateRouterQueryForCustomer({
                    ...stateRouterQueryForCustomer,
                    limit: Number(e.target.value),
                  })
                }}
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
              page={stateRouterQueryForCustomer.page}
              onChange={(event, page: number) => {
                console.log(event)
                setStateRouterQueryForCustomer({
                  ...stateRouterQueryForCustomer,
                  page: page,
                })
              }}
              count={
                stateListCustomer
                  ? Math.ceil(
                      Number(stateListCustomer.totalItems) /
                        stateRouterQueryForCustomer.limit
                    )
                  : 0
              }
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <ButtonCustom
              variant="outlined"
              size="large"
              onClick={() => {
                handleCloseDrawerCustomerList()
              }}
            >
              {t('cancel')}
            </ButtonCustom>
            <ButtonCustom
              variant="contained"
              size="large"
              onClick={() => {
                handleConfirmSelectedCustomerList()
              }}
            >
              {t('select')}
            </ButtonCustom>
          </Stack>
        </CustomBoxDrawer>
      </Drawer>
    </Box>
  )
}

export default MessageManagementComponent
