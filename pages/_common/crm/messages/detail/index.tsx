import React, { useEffect, useState } from 'react'
import {
  ListClientResponseType,
  ListContactResponseType,
  MessageDetailType,
  RetailerDataResponseType,
  SendNMessageType,
  UpdateMessageType,
} from './messageDetailModel'
import {
  Box,
  Breadcrumbs,
  Checkbox,
  Dialog,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
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
import { useRouter } from 'next/router'
import {
  deleteMessage,
  getDetailMessage,
  getLeadList,
  getListCustomer,
  getRetailerList,
  sendMessage,
  updateMessage,
} from './messageDetailAPI'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import {
  formatPhoneNumber,
  handlerGetErrMessage,
  platform,
} from 'src/utils/global.utils'
import Head from 'next/head'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  InputLabelCustom,
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
import Link from 'next/link'
import moment from 'moment'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/system'
import { ArrowRight, MagnifyingGlass, Trash, X } from '@phosphor-icons/react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, schemaLead, schemaUpdateMessage } from './validations'
import RequiredLabel from 'src/components/requiredLabel'
import { useTranslation } from 'next-i18next'

const CustomBoxDrawer = styled(Box)(() => ({
  width: '1000px',
  background: '#FFF',
  borderRadius: '10px',
  padding: '30px',
}))
const MessageDetailComponent = () => {
  const { t } = useTranslation('messages')
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateDetailMessage, setStateDetailMessage] =
    useState<MessageDetailType>()
  const [stateDrawerUpdateMessage, setStateDrawerUpdateMessage] =
    useState(false)
  const [stateCheckedViaEmail, setStateCheckedViaEmail] = useState(false)
  const [stateCheckedViaApp, setStateCheckedViaApp] = useState(false)
  //! state use for retailer
  const [stateRetailerList, setStateRetailerList] =
    useState<RetailerDataResponseType>()
  const [stateCheckedRetailer, setStateCheckedRetailer] = useState(false)
  const [stateRadioButtonForRetailer, setStateRadioButtonForRetailer] =
    useState(1)
  const [
    stateTemporaryListSelectedRetailerID,
    setStateTemporarySelectedRetailerID,
  ] = useState<number[]>([])
  const [stateListSelectedRetailerID, setStateListSelectedRetailer] = useState<
    number[]
  >([])
  const [stateDrawerListRetailer, setStateDrawerListRetailer] = useState(false)
  const [stateRouterQueryForRetailer, setStateRouterQueryForRetailer] =
    useState<{ page: number; limit: number; search: string }>({
      page: 1,
      limit: 10,
      search: '',
    })
  //! state use for lead
  const [stateListLead, setStateListLead] = useState<ListContactResponseType>()
  const [stateCheckedLead, setStateCheckedLead] = useState(false)
  const [stateRadioButtonForLead, setStateRadioButtonForLead] = useState(1)
  const [stateRouterQueryForLead, setStateRouterQueryForLead] = useState<{
    page: number
    limit: number
    key: string
  }>({
    page: 1,
    limit: 10,
    key: '',
  })

  const [stateDrawerListLead, setStateDrawerListLead] = useState(false)
  const [stateListSelectedLeadID, setStateListSelectedLeadID] = useState<
    number[]
  >([])
  const [stateTemporaryListSelectedLeadID, setStateTemporarySelectedLeadID] =
    useState<number[]>([])

  //! state use for customer
  const [stateCheckedCustomer, setStateCheckedCustomer] = useState(false)
  const [stateRadioButtonForCustomer, setStateRadioButtonForCustomer] =
    useState(1)
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
  const [stateListSelectedCustomerID, setStateListSelectedCustomerID] =
    useState<number[]>([])
  const [
    stateTemporaryListSelectedCustomerID,
    setStateTemporarySelectedCustomerID,
  ] = useState<number[]>([])
  const [stateListCustomer, setStateListCustomer] =
    useState<ListClientResponseType>()
  const [stateDrawerListCustomer, setStateDrawerListCustomer] = useState(false)
  const [stateOpenDialog, setStateOpenDialog] = useState(false)
  useEffect(() => {
    if (router.query.id) {
      getDetailMessage(Number(router.query.id))
        .then((res) => {
          const { data } = res.data
          setStateDetailMessage(data)
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }, [router.query.id])
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

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<UpdateMessageType>({
    resolver: yupResolver(schemaUpdateMessage(t)),
    mode: 'all',
  })
  const {
    handleSubmit: handleSubmitSearchRetailer,
    control: controlSearchRetailer,
  } = useForm<{ search: string }>({
    resolver: yupResolver(schema),
    mode: 'all',
  })
  const {
    handleSubmit: handleSubmitSearchCustomer,
    control: controlSearchCustomer,
  } = useForm<{ search: string }>({
    resolver: yupResolver(schema),
    mode: 'all',
  })
  const { handleSubmit: handleSubmitSearchLead, control: controlSearchLead } =
    useForm<{ key: string }>({
      resolver: yupResolver(schemaLead),
      mode: 'all',
    })

  const submitSendMessage = () => {
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
      pushMessage('Please select specific lead', 'error')
      return
    }
    if (
      stateRadioButtonForRetailer === 2 &&
      stateListSelectedRetailerID.length === 0
    ) {
      pushMessage(t('message.pleaseSelectSpecificCustomer'), 'error')
      return
    }
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
    // if (!stateCheckedCustomer) {
    //   delete submitValue.customers
    //   delete submitValue.all_customer
    // }
    // if (!stateCheckedLead) {
    //   delete submitValue.leads
    //   delete submitValue.all_leads
    // }
    // if (!stateCheckedRetailer) {
    //   delete submitValue.retailer
    //   delete submitValue.all_retailer
    // }
    // if (stateRadioButtonForRetailer === 1) {
    //   delete submitValue.retailer
    // }
    // if (stateRadioButtonForLead === 1) {
    //   delete submitValue.leads
    // }
    // if (stateRadioButtonForCustomer === 1) {
    //   delete submitValue.customers
    // }
    sendMessage(Number(router.query.id), submitValue)
      .then(() => {
        pushMessage(t('message.theMessageHasBeenSent'), 'success')
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleDeleteCurrentMessage = () => {
    deleteMessage(Number(router.query.id))
      .then(() => {
        pushMessage(t('message.theMessageHasBeenDeleted'), 'success')
        setStateOpenDialog(false)
        router.push(`/${platform().toLowerCase()}/crm/messages/list`)
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
  const handleChangeCheckedLead = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateCheckedLead(event.target.checked)
  }
  const handleChangeCheckedCustomer = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateCheckedCustomer(event.target.checked)
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

  const handleChangeRadioRetailer = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateRadioButtonForRetailer(
      Number((event.target as HTMLInputElement).value)
    )
  }
  const handleChangeRadioLead = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateRadioButtonForLead(Number((event.target as HTMLInputElement).value))
  }
  const handleChangeRadioCustomer = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateRadioButtonForCustomer(
      Number((event.target as HTMLInputElement).value)
    )
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
  const handleOpenDrawerRetailerList = () => {
    if (stateListSelectedRetailerID.length > 0) {
      const cloneListSelectedRetailerID: number[] = JSON.parse(
        JSON.stringify(stateListSelectedRetailerID)
      )
      setStateTemporarySelectedRetailerID(cloneListSelectedRetailerID)
    }
    setStateDrawerListRetailer(true)
  }
  const handleCheckIsSelectedInLeadList = (index: number) => {
    return stateTemporaryListSelectedLeadID.some((id) => id === index)
  }
  const handleCheckIsSelectedInCustomerList = (index: number) => {
    return stateTemporaryListSelectedCustomerID.some((id) => id === index)
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
  const handleConfirmSelectedRetailerList = () => {
    const cloneCurrentTemporaryList: number[] = JSON.parse(
      JSON.stringify(stateTemporaryListSelectedRetailerID)
    )
    setStateListSelectedRetailer(cloneCurrentTemporaryList)
    setStateDrawerListRetailer(false)
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

  const handleConfirmSelectedLeadList = () => {
    const cloneCurrentTemporaryList: number[] = JSON.parse(
      JSON.stringify(stateTemporaryListSelectedLeadID)
    )
    setStateListSelectedLeadID(cloneCurrentTemporaryList)
    setStateDrawerListLead(false)
  }
  const handleConfirmSelectedCustomerList = () => {
    const cloneCurrentTemporaryList: number[] = JSON.parse(
      JSON.stringify(stateTemporaryListSelectedCustomerID)
    )
    setStateListSelectedCustomerID(cloneCurrentTemporaryList)
    setStateDrawerListCustomer(false)
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

  const onSubmitUpdateMessage = (value: UpdateMessageType) => {
    updateMessage(Number(router.query.id), value)
      .then(() => {
        pushMessage(t('message.updateMessageSuccessfully'), 'success')
        getDetailMessage(Number(router.query.id))
          .then((res) => {
            const { data } = res.data
            setStateDetailMessage(data)
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
        setStateDrawerUpdateMessage(false)
      })
      .catch((response) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleOpenUpdateMessage = () => {
    if (!stateDetailMessage) return
    setValue('title', stateDetailMessage?.title)
    setValue('message', stateDetailMessage?.message)
    setStateDrawerUpdateMessage(true)
  }
  return (
    <Box>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('messageDetail')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href={`/${platform().toLowerCase()}/crm/messages/list`}>
          <a>{t('title')}</a>
        </Link>
        <Typography> {t('messageDetail')}</Typography>
      </Breadcrumbs>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: '2rem',
          color: '#49516F',
          marginBottom: '5px',
        }}
      >
        {stateDetailMessage?.title}
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        sx={{ marginBottom: '15px' }}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Typography sx={{ color: '#49516F' }}>
          {t('createDate')}{' '}
          {moment(stateDetailMessage?.created_at).format(
            'MMMM DD, YYYY - hh:mm A'
          )}
        </Typography>
        {stateDetailMessage?.latest_send && (
          <Typography sx={{ color: '#49516F' }}>
            {t('lastSend')}{' '}
            {moment(stateDetailMessage.latest_send).format(
              'MMMM DD, YYYY - hh:mm A'
            )}
          </Typography>
        )}
      </Stack>
      <Grid container spacing={2}>
        <Grid xs={8}>
          {' '}
          <Box
            sx={{
              width: '100%',
              background: '#F8F9FC',
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '10px',
            }}
          >
            {stateDetailMessage?.message}
          </Box>
          <Stack direction="row" spacing={2}>
            <ButtonCustom
              variant="outlined"
              size="large"
              startIcon={<Trash size={24} />}
              sx={{ border: '1px solid #E02D3C', color: '#E02D3C' }}
              onClick={() => setStateOpenDialog(true)}
            >
              {t('delete')}
            </ButtonCustom>
            <ButtonCustom
              onClick={() => handleOpenUpdateMessage()}
              variant="contained"
              size="large"
            >
              {t('update')}
            </ButtonCustom>
          </Stack>
        </Grid>
        <Grid xs={4}>
          <Box
            sx={{
              width: '100%',
              background: '#F8F9FC',
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
            <ButtonCustom
              size="large"
              variant="contained"
              onClick={submitSendMessage}
              sx={{ width: '100%' }}
            >
              {t('send')}
            </ButtonCustom>
          </Box>
        </Grid>
      </Grid>
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
      <Drawer
        anchor="right"
        open={stateDrawerUpdateMessage}
        onClose={() => setStateDrawerUpdateMessage(false)}
      >
        <CustomBoxDrawer>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ marginBottom: '15px' }}
          >
            <IconButton onClick={() => setStateDrawerUpdateMessage(false)}>
              <ArrowRight size={24} />
            </IconButton>
            <TypographyH2 textAlign="center">{t('updateMessage')}</TypographyH2>
          </Stack>
          <form onSubmit={handleSubmit(onSubmitUpdateMessage)}>
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
                      <TextFieldCustom error={!!errors.title} {...field} />
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
              <ButtonCustom
                variant="outlined"
                size="large"
                onClick={() => setStateDrawerUpdateMessage(false)}
              >
                {t('cancel')}
              </ButtonCustom>
              <ButtonCustom type="submit" variant="contained" size="large">
                {t('submit')}
              </ButtonCustom>
            </Stack>
          </form>
        </CustomBoxDrawer>
      </Drawer>
    </Box>
  )
}

export default MessageDetailComponent
