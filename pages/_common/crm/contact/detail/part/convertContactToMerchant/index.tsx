import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Drawer,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { PatternFormat } from 'react-number-format'
import {
  ButtonCancel,
  ButtonCustom,
  ComponentFileUploader,
  InputLabelCustom,
  MenuItemSelectCustom,
  PlaceholderSelect,
  SelectCustom,
  TextFieldCustom,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import RequiredLabel from 'src/components/requiredLabel'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { formatPhoneNumber, handlerGetErrMessage } from 'src/utils/global.utils'
import { createMerchantFromAContact } from '../../apiContactDetail'
import {
  ContactDetailType,
  ConvertContactToMerchantType,
} from '../../modelContactDetail'
import { schemaConvertContactToMerchant } from '../../validations'
import classes from '../../styles.module.scss'
import {
  getFindUsOverApi,
  getMonthlyPurchaseApi,
  getMonthlySaleApi,
  getTypeOfSaleApi,
} from './apiConvertContact'
import {
  GetFindUsOverResponseType,
  MonthlyPurchaseResponseType,
  MonthlySaleResponseType,
  TypeOfSaleResponseType,
} from './modelConvertContact'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useTranslation } from 'next-i18next'

type Props = {
  stateOpenModal: boolean
  handleCloseModal: () => void
  stateContactDetail: ContactDetailType | undefined
  handleGetContact: () => void
}
const ConvertContactComponent: React.FC<Props> = (props) => {
  const { t } = useTranslation('contact')
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [stateValueMonthlyPurchase, setStateValueMonthlyPurchase] =
    useState<MonthlyPurchaseResponseType>()
  const [stateValueMonthlySale, setStateValueMonthlySale] =
    useState<MonthlySaleResponseType>()
  const [stateValueTypeOfSale, setStateValueTypeOfSale] =
    useState<TypeOfSaleResponseType>()
  const [stateValueFindUsOver, setStateValueFindUsOver] =
    useState<GetFindUsOverResponseType>()

  // state use for option choice
  const [stateOtherMonthlyPurchase, setStateOtherMonthlyPurchase] =
    useState<string>('')
  const [stateOtherMonthlySale, setStateOtherMonthlySale] = useState<string>('')
  const [stateOtherTypeOfSale, setStateOtherTypeOfSale] = useState<string>('')
  const [stateOtherGetFindUsOver, setStateOtherGetFindUsOver] =
    useState<string>('')

  const handleChangeMonthlyPurchase = (value: number) => {
    if (!stateValueMonthlyPurchase) return
    const findValue = stateValueMonthlyPurchase.data.find(
      (obj) => obj.id === value
    )?.monthly
    if (findValue) {
      setStateOtherMonthlyPurchase(findValue)
      clearErrorsConvertContact()
    }
  }

  const handleChangeMonthlySale = (value: number) => {
    if (!stateValueMonthlySale) return
    const findValue = stateValueMonthlySale.data.find(
      (obj) => obj.id === value
    )?.monthly_sale
    if (findValue) {
      setStateOtherMonthlySale(findValue)
      clearErrorsConvertContact()
    }
  }

  const handleChangeTypeOfSale = (value: number) => {
    if (!stateValueTypeOfSale) return
    const findValue = stateValueTypeOfSale.data.find(
      (obj) => obj.id === value
    )?.type_of_sale
    if (findValue) {
      setStateOtherTypeOfSale(findValue)
      clearErrorsConvertContact()
    }
  }

  const handleChangeFindUsOver = (value: number) => {
    if (!stateValueFindUsOver) return
    const findValue = stateValueFindUsOver.data.find(
      (obj) => obj.id === value
    )?.find_us_over
    if (findValue) {
      setStateOtherGetFindUsOver(findValue)
      clearErrorsConvertContact()
    }
  }

  const {
    control: controlConvertContact,
    handleSubmit: handleSubmitConvertContact,
    setValue: setValueConvertContact,
    clearErrors: clearErrorsConvertContact,
    reset: resetConvertContact,
    trigger: triggerConvertContact,
    formState: { errors: errorConvertContact },
  } = useForm<ConvertContactToMerchantType>({
    resolver: yupResolver(schemaConvertContactToMerchant(t)),
    mode: 'all',
  })

  const handleSetOpenDrawerConvertContact = useCallback(() => {
    if (!props.stateContactDetail) return
    setValueConvertContact('first_name', props.stateContactDetail?.first_name)
    setValueConvertContact('last_name', props.stateContactDetail?.last_name)
    setValueConvertContact('email', props.stateContactDetail?.email)
    setValueConvertContact('address', props.stateContactDetail?.address)
    setValueConvertContact(
      'phone_number',
      formatPhoneNumber(props.stateContactDetail?.phone_number)
    )
    setValueConvertContact(
      'federal_tax_id',
      props.stateContactDetail?.federal_tax_id
    )
    setValueConvertContact(
      'business_name',
      props.stateContactDetail?.business_name
    )
  }, [props.stateContactDetail, setValueConvertContact])
  useEffect(() => {
    if (props.stateOpenModal) {
      getMonthlyPurchaseApi()
        .then((res) => {
          const { data } = res
          setStateValueMonthlyPurchase(data)
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
      getMonthlySaleApi()
        .then((res) => {
          const { data } = res
          setStateValueMonthlySale(data)
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
      getTypeOfSaleApi()
        .then((res) => {
          const { data } = res
          setStateValueTypeOfSale(data)
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
      getFindUsOverApi()
        .then((res) => {
          const { data } = res
          setStateValueFindUsOver(data)
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }, [props.stateOpenModal])
  useEffect(() => {
    handleSetOpenDrawerConvertContact()
  }, [handleSetOpenDrawerConvertContact])

  useEffect(() => {
    if (!props.stateOpenModal) {
      setStateOtherGetFindUsOver('')
      clearErrorsConvertContact()
      resetConvertContact()
    }
  }, [clearErrorsConvertContact, props.stateOpenModal, resetConvertContact])
  // resolver for convert contact to merchant

  const onSubmitConvertContact = (value: ConvertContactToMerchantType) => {
    if (!props.stateContactDetail) return
    if (props.stateContactDetail.is_merchant) {
      pushMessage(
        t('message.thisContactHasAlreadyBeenConvertedToLead'),
        'error'
      )
      return
    }
    // if (props.stateContactDetail.is_requested) {
    //   pushMessage(
    //     'A retailer account creation request has been submitted: [account_creation_request_status]',
    //     'error'
    //   )
    //   return
    // }
    const convertContactToMerchantValues = {
      ...value,
      phone_number: value.phone_number
        .replace('(', '')
        .replace(')', '')
        .replaceAll(' ', ''),
    }
    createMerchantFromAContact(
      Number(router.query.id),
      convertContactToMerchantValues
    )
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(
          t('message.theRetailerAccountCreationRequestHasBeenSubmitted'),
          'success'
        )
        props.handleCloseModal()
        if (router.query.id) {
          props.handleGetContact()
        }
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <>
      <Drawer
        anchor={'right'}
        open={props.stateOpenModal}
        onClose={props.handleCloseModal}
        disableEnforceFocus
      >
        <Box
          sx={{
            background: 'white',
            width: `970px`,

            padding: '20px',
          }}
        >
          <form onSubmit={handleSubmitConvertContact(onSubmitConvertContact)}>
            <Typography
              sx={{
                fontSize: '2.4rem',
                marginBottom: '20px',
                color: '#49516F',
                fontWeight: 700,
              }}
            >
              {t('details.convertLeadToRetailer')}
            </Typography>
            <Typography
              sx={{ marginBottom: '15px', color: '#49516F', fontWeight: 700 }}
            >
              {t('details.generalInformation')}
            </Typography>
            <Stack direction="row" spacing={4} sx={{ marginBottom: '30px' }}>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  name="email"
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="email"
                        error={!!errorConvertContact.email}
                      >
                        {t('details.email')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="email"
                          error={!!errorConvertContact.email}
                          {...field}
                          placeholder={t('details.enterEmail')}
                        />
                        <FormHelperText error={!!errorConvertContact.email}>
                          {errorConvertContact.email &&
                            `${errorConvertContact.email.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  name="phone_number"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="phone_number"
                        error={!!errorConvertContact.phone_number}
                      >
                        <RequiredLabel />
                        {t('details.phoneNumber')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <div className={classes['input-number']}>
                          <PatternFormat
                            id="phone_number"
                            customInput={TextField}
                            {...field}
                            error={!!errorConvertContact.phone_number}
                            placeholder={t('details.enterPhoneNumber')}
                            format="(###) ### ####"
                          />
                        </div>

                        <FormHelperText
                          error={!!errorConvertContact.phone_number}
                        >
                          {errorConvertContact.phone_number &&
                            `${errorConvertContact.phone_number.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
            </Stack>
            <Stack direction="row" spacing={4} sx={{ marginBottom: '25px' }}>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  name="first_name"
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="first_name"
                        error={!!errorConvertContact.first_name}
                      >
                        <RequiredLabel />
                        {t('details.firstName')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="first_name"
                          error={!!errorConvertContact.first_name}
                          {...field}
                          placeholder={t('details.enterFirstName')}
                        />
                        <FormHelperText
                          error={!!errorConvertContact.first_name}
                        >
                          {errorConvertContact.first_name &&
                            `${errorConvertContact.first_name.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  name="last_name"
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="last_name"
                        error={!!errorConvertContact.last_name}
                      >
                        <RequiredLabel />
                        {t('details.lastName')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="last_name"
                          error={!!errorConvertContact.last_name}
                          {...field}
                          placeholder={t('details.enterLastName')}
                        />
                        <FormHelperText error={!!errorConvertContact.last_name}>
                          {errorConvertContact.last_name &&
                            `${errorConvertContact.last_name.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
            </Stack>
            <Typography
              sx={{ color: '#49516F', fontWeight: 700, marginBottom: '15px' }}
            >
              {t('details.businessInformation')}
            </Typography>
            <Stack direction="row" spacing={4} sx={{ marginBottom: '25px' }}>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  name="business_name"
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="business_name"
                        error={!!errorConvertContact.business_name}
                      >
                        <RequiredLabel />
                        {t('details.businessName')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="business_name"
                          error={!!errorConvertContact.business_name}
                          {...field}
                          placeholder={t('details.enterBusinessName')}
                        />
                        <FormHelperText
                          error={!!errorConvertContact.business_name}
                        >
                          {errorConvertContact.business_name &&
                            `${errorConvertContact.business_name.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  defaultValue=""
                  name="website_link_url"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="website_link_url"
                        error={!!errorConvertContact.website_link_url}
                      >
                        {t('details.websiteLinkUrl')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="website_link_url"
                          error={!!errorConvertContact.website_link_url}
                          placeholder="Ex: example.com"
                          {...field}
                        />
                        <FormHelperText
                          error={!!errorConvertContact.website_link_url}
                        >
                          {errorConvertContact.website_link_url &&
                            `${errorConvertContact.website_link_url.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
            </Stack>

            <Stack direction="row" spacing={4}>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  name="monthly_purchase"
                  defaultValue={0}
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="monthly_purchase"
                        error={!!errorConvertContact.monthly_purchase}
                      >
                        <RequiredLabel />
                        {t('details.averageMonthlyPurchaseVolume')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="monthly_purchase"
                          displayEmpty
                          disabled={
                            stateValueMonthlyPurchase &&
                            stateValueMonthlyPurchase.data.length > 0
                              ? false
                              : true
                          }
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === 0) {
                              return (
                                <PlaceholderSelect>
                                  <div>{t('details.selectValue')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            return stateValueMonthlyPurchase?.data.find(
                              (obj) => obj.id === value
                            )?.monthly
                          }}
                          {...field}
                          onChange={(event: any) => {
                            setValueConvertContact(
                              'monthly_purchase',
                              event.target.value
                            )
                            triggerConvertContact('monthly_purchase')
                            handleChangeMonthlyPurchase(event.target.value)
                          }}
                        >
                          {/* {stateSelectMonthlyPurchase?.map((item, index) => {
                            return (
                              <MenuItemSelectCustom
                                value={item.id}
                                key={index + Math.random()}
                              >
                                {item.monthly}
                              </MenuItemSelectCustom>
                            )
                          })} */}
                          {stateValueMonthlyPurchase?.data?.map(
                            (item, index) => {
                              return (
                                <MenuItemSelectCustom
                                  value={item.id}
                                  key={index + Math.random()}
                                >
                                  {item.monthly}
                                </MenuItemSelectCustom>
                              )
                            }
                          )}
                        </SelectCustom>

                        <FormHelperText
                          error={!!errorConvertContact.monthly_purchase}
                        >
                          {errorConvertContact.monthly_purchase &&
                            `${errorConvertContact.monthly_purchase.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
                {stateOtherMonthlyPurchase === 'OTHER' && (
                  <Controller
                    control={controlConvertContact}
                    name="monthly_purchase_other"
                    render={({ field }) => (
                      <Box mt={1}>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            multiline
                            id="monthly_purchase_other"
                            error={!!errorConvertContact.monthly_purchase_other}
                            inputProps={{ maxLength: 200 }}
                            placeholder={t(
                              'details.inputOtherAverageMonthlyPurchaseVolume'
                            )}
                            {...field}
                          />
                          <FormHelperText
                            error={!!errorConvertContact.monthly_purchase_other}
                          >
                            {errorConvertContact.monthly_purchase_other &&
                              `${errorConvertContact.monthly_purchase_other.message}`}
                          </FormHelperText>
                        </FormControl>
                      </Box>
                    )}
                  />
                )}
              </Box>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  defaultValue={0}
                  name="monthly_sale"
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="monthly_sale"
                        error={!!errorConvertContact.monthly_sale}
                      >
                        <RequiredLabel />
                        {t('details.averageMonthlySaleVolume')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="monthly_sale"
                          displayEmpty
                          disabled={
                            stateValueMonthlySale &&
                            stateValueMonthlySale.data.length > 0
                              ? false
                              : true
                          }
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === 0) {
                              return (
                                <PlaceholderSelect>
                                  <div>{t('details.selectValue')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            return stateValueMonthlySale?.data.find(
                              (obj) => obj.id === value
                            )?.monthly_sale
                          }}
                          {...field}
                          onChange={(event: any) => {
                            setValueConvertContact(
                              'monthly_sale',
                              event.target.value
                            )
                            triggerConvertContact('monthly_sale')
                            handleChangeMonthlySale(event.target.value)
                          }}
                        >
                          {stateValueMonthlySale?.data.map((item, index) => {
                            return (
                              <MenuItemSelectCustom
                                value={item.id}
                                key={index + Math.random()}
                              >
                                {item.monthly_sale}
                              </MenuItemSelectCustom>
                            )
                          })}
                        </SelectCustom>
                        <FormHelperText
                          error={!!errorConvertContact.monthly_sale}
                        >
                          {errorConvertContact.monthly_sale &&
                            `${errorConvertContact.monthly_sale.message}`}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                />
                {stateOtherMonthlySale === 'OTHER' && (
                  <Controller
                    control={controlConvertContact}
                    name="monthly_sale_other"
                    render={({ field }) => (
                      <Box mt={1}>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            multiline
                            rows={2}
                            id="monthly_sale_other"
                            error={!!errorConvertContact.monthly_sale_other}
                            inputProps={{ maxLength: 200 }}
                            placeholder={t(
                              'details.inputOtherAverageMonthlySaleVolume'
                            )}
                            {...field}
                          />
                          <FormHelperText
                            error={!!errorConvertContact.monthly_sale_other}
                          >
                            {errorConvertContact.monthly_sale_other &&
                              `${errorConvertContact.monthly_sale_other.message}`}
                          </FormHelperText>
                        </FormControl>
                      </Box>
                    )}
                  />
                )}
              </Box>
            </Stack>
            <Stack direction="row" spacing={4} sx={{ marginBottom: '25px' }}>
              <Box sx={{ width: '100%' }}></Box>
              <Box sx={{ width: '100%' }}></Box>
            </Stack>
            <Stack direction="row" spacing={4} sx={{ marginBottom: '25px' }}>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  name="type_of_sale"
                  defaultValue={0}
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="type_of_sale"
                        error={!!errorConvertContact.type_of_sale}
                      >
                        <RequiredLabel />
                        {t('details.typeOfSale')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="type_of_sale"
                          displayEmpty
                          disabled={
                            stateValueTypeOfSale &&
                            stateValueTypeOfSale.data.length > 0
                              ? false
                              : true
                          }
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === 0) {
                              return (
                                <PlaceholderSelect>
                                  <div>{t('details.selectValue')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            return stateValueTypeOfSale?.data.find(
                              (obj) => obj.id === value
                            )?.type_of_sale
                          }}
                          {...field}
                          onChange={(event: any) => {
                            setValueConvertContact(
                              'type_of_sale',
                              event.target.value
                            )
                            triggerConvertContact('type_of_sale')
                            handleChangeTypeOfSale(event.target.value)
                          }}
                        >
                          {stateValueTypeOfSale?.data.map((item, index) => {
                            return (
                              <MenuItemSelectCustom
                                value={item.id}
                                key={index + Math.random()}
                              >
                                {item.type_of_sale}
                              </MenuItemSelectCustom>
                            )
                          })}
                        </SelectCustom>
                        <FormHelperText
                          error={!!errorConvertContact.type_of_sale}
                        >
                          {errorConvertContact.type_of_sale &&
                            `${errorConvertContact.type_of_sale.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
                {stateOtherTypeOfSale === 'OTHER' && (
                  <Controller
                    control={controlConvertContact}
                    name="type_of_sale_other"
                    render={({ field }) => (
                      <Box mt={1}>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="type_of_sale_other"
                            error={!!errorConvertContact.type_of_sale_other}
                            placeholder={t('details.inputValue')}
                            {...field}
                          />
                          {errorConvertContact.type_of_sale_other && (
                            <FormHelperText
                              error={!!errorConvertContact.type_of_sale_other}
                            >
                              {errorConvertContact.type_of_sale_other &&
                                `${errorConvertContact.type_of_sale_other.message}`}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Box>
                    )}
                  />
                )}
              </Box>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  name="total_locations"
                  // defaultValue=""
                  render={({ field }) => (
                    <div className={classes['input-howmany']}>
                      <InputLabelCustom
                        htmlFor="total_locations"
                        error={!!errorConvertContact.total_locations}
                      >
                        <RequiredLabel />
                        {t('details.howManyLocations')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="total_locations"
                          error={!!errorConvertContact.total_locations}
                          type="number"
                          {...field}
                          placeholder="Ex: 0 > 10.000"
                        />
                        <FormHelperText
                          error={!!errorConvertContact.total_locations}
                        >
                          {errorConvertContact.total_locations &&
                            `${errorConvertContact.total_locations.message}`}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  )}
                />
              </Box>
            </Stack>
            <Stack direction="row" spacing={4} sx={{ marginBottom: '25px' }}>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  name="find_us_over"
                  defaultValue={0}
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="find_us_over"
                        error={!!errorConvertContact.find_us_over}
                      >
                        <RequiredLabel />
                        {t('details.howDidYouFindUs')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="find_us_over"
                          displayEmpty
                          disabled={
                            stateValueFindUsOver &&
                            stateValueFindUsOver?.data.length > 0
                              ? false
                              : true
                          }
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === 0) {
                              return (
                                <PlaceholderSelect>
                                  <div>{t('details.selectValue')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            return stateValueFindUsOver?.data.find(
                              (obj) => obj.id === value
                            )?.find_us_over
                          }}
                          {...field}
                          onChange={(event: any) => {
                            setValueConvertContact(
                              'find_us_over',
                              event.target.value
                            )
                            triggerConvertContact('find_us_over')
                            handleChangeFindUsOver(event.target.value)
                          }}
                        >
                          {stateValueFindUsOver?.data.map((item, index) => {
                            return (
                              <MenuItemSelectCustom
                                value={item.id}
                                key={index + Math.random()}
                              >
                                {item.find_us_over}
                              </MenuItemSelectCustom>
                            )
                          })}
                        </SelectCustom>
                        <FormHelperText
                          error={!!errorConvertContact.find_us_over}
                        >
                          {errorConvertContact.find_us_over &&
                            `${errorConvertContact.find_us_over.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
                {stateOtherGetFindUsOver === 'OTHER' && (
                  <Controller
                    control={controlConvertContact}
                    name="find_us_over_other"
                    render={({ field }) => (
                      <Box mt={1}>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="find_us_over_other"
                            error={!!errorConvertContact.find_us_over_other}
                            placeholder={t('details.inputValue')}
                            {...field}
                          />
                          <FormHelperText
                            error={!!errorConvertContact.find_us_over_other}
                          >
                            {errorConvertContact.find_us_over_other &&
                              `${errorConvertContact.find_us_over_other.message}`}
                          </FormHelperText>
                        </FormControl>
                      </Box>
                    )}
                  />
                )}
              </Box>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  name="id_verification"
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="id_verification"
                        error={!!errorConvertContact.id_verification}
                      >
                        <RequiredLabel />
                        {t('details.doYouHaveAnIdAgeVerificationSystem')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="id_verification"
                          displayEmpty
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  <div>{t('details.selectValue')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            return [
                              { value: 'YES', label: 'Yes' },
                              { value: 'NO', label: 'No' },
                            ].find((obj) => obj.value === value)?.label
                          }}
                          {...field}
                          onChange={(event: any) => {
                            setValueConvertContact(
                              'id_verification',
                              event.target.value
                            )
                            triggerConvertContact('id_verification')
                          }}
                        >
                          <MenuItemSelectCustom value="YES">
                            {t('details.yes')}{' '}
                          </MenuItemSelectCustom>
                          <MenuItemSelectCustom value="NO">
                            {t('details.no')}
                          </MenuItemSelectCustom>
                        </SelectCustom>
                        <FormHelperText
                          error={!!errorConvertContact.id_verification}
                        >
                          {errorConvertContact.id_verification &&
                            `${errorConvertContact.id_verification.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
            </Stack>
            <Stack direction="row" spacing={4} sx={{ marginBottom: '25px' }}>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  name="payment_processing"
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="payment_processing"
                        error={!!errorConvertContact.payment_processing}
                      >
                        <RequiredLabel />
                        {t(
                          'details.doYouCurrentlyHaveAPaymentProcessingSystem'
                        )}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="payment_processing"
                          displayEmpty
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  <div>{t('details.selectValue')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            return [
                              { value: 'YES', label: 'Yes' },
                              { value: 'NO', label: 'No' },
                              { value: 'IN_PROCESS', label: 'In Process' },
                            ].find((obj) => obj.value === value)?.label
                          }}
                          {...field}
                          onChange={(event: any) => {
                            setValueConvertContact(
                              'payment_processing',
                              event.target.value
                            )
                            triggerConvertContact('payment_processing')
                          }}
                        >
                          <MenuItemSelectCustom value="YES">
                            {t('details.yes')}
                          </MenuItemSelectCustom>
                          <MenuItemSelectCustom value="NO">
                            {t('details.no')}
                          </MenuItemSelectCustom>
                          <MenuItemSelectCustom value="IN_PROCESS">
                            {t('details.inProcess')}
                          </MenuItemSelectCustom>
                        </SelectCustom>
                        <FormHelperText
                          error={!!errorConvertContact.payment_processing}
                        >
                          {errorConvertContact.payment_processing &&
                            `${errorConvertContact.payment_processing.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  name="federal_tax_id"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="federal_tax_id"
                        error={!!errorConvertContact.federal_tax_id}
                      >
                        <RequiredLabel />
                        {t('details.federalTaxId')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="federal_tax_id"
                          disabled
                          // sx={{ cursor: 'not-allowed' }}
                          error={!!errorConvertContact.federal_tax_id}
                          {...field}
                          placeholder={t('details.enterFederalTaxId')}
                        />

                        <FormHelperText
                          error={!!errorConvertContact.federal_tax_id}
                        >
                          {errorConvertContact.federal_tax_id &&
                            `${errorConvertContact.federal_tax_id.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
            </Stack>
            <Stack direction="row" spacing={4} sx={{ marginBottom: '25px' }}>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  name="address"
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="address"
                        error={!!errorConvertContact.address}
                      >
                        <RequiredLabel />
                        {t('details.streetAddress')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="address"
                          error={!!errorConvertContact.address}
                          {...field}
                          placeholder={t('details.enterAddress')}
                        />
                        <FormHelperText error={!!errorConvertContact.address}>
                          {errorConvertContact.address &&
                            `${errorConvertContact.address.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  name="sub_address"
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="sub_address"
                        error={!!errorConvertContact.sub_address}
                      >
                        {t('details.addressLine_2')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="sub_address"
                          error={!!errorConvertContact.sub_address}
                          {...field}
                          placeholder={t('details.enterAddress2')}
                        />
                        <FormHelperText
                          error={!!errorConvertContact.sub_address}
                        >
                          {errorConvertContact.sub_address &&
                            `${errorConvertContact.sub_address.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
            </Stack>
            <Stack direction="row" spacing={4} sx={{ marginBottom: '25px' }}>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  name="city"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="city"
                        error={!!errorConvertContact.city}
                      >
                        <RequiredLabel />
                        {t('details.city')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="city"
                          error={!!errorConvertContact.city}
                          {...field}
                          placeholder={t('details.enterCity')}
                        />
                        <FormHelperText error={!!errorConvertContact.city}>
                          {errorConvertContact.city &&
                            `${errorConvertContact.city.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  name="state"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="state"
                        error={!!errorConvertContact.state}
                      >
                        <RequiredLabel />
                        {t('details.state')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="state"
                          error={!!errorConvertContact.state}
                          {...field}
                          placeholder={t('details.enterState')}
                        />
                        <FormHelperText error={!!errorConvertContact.state}>
                          {errorConvertContact.state &&
                            `${errorConvertContact.state.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  name="postal_zipcode"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="postal_zipcode"
                        error={!!errorConvertContact.postal_zipcode}
                      >
                        <RequiredLabel />
                        {t('details.postalZipCode')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="postal_zipcode"
                          error={!!errorConvertContact.postal_zipcode}
                          {...field}
                          placeholder={t('details.enterZipCode')}
                        />
                        <FormHelperText
                          error={!!errorConvertContact.postal_zipcode}
                        >
                          {errorConvertContact.postal_zipcode &&
                            `${errorConvertContact.postal_zipcode.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ marginBottom: '25px' }}>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  defaultValue=""
                  name="vapor_tobacco_license"
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="vapor_tobacco_license"
                        error={!!errorConvertContact.vapor_tobacco_license}
                      >
                        <RequiredLabel />
                        {t('details.vaporTobaccoLicensesIfRequiredByYourState')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <input id="vapor_tobacco_license" {...field} hidden />
                        <ComponentFileUploader
                          onFileSelectSuccess={(file: any) => {
                            setValueConvertContact(
                              'vapor_tobacco_license',
                              file
                            )
                            triggerConvertContact('vapor_tobacco_license')
                          }}
                          onFileSelectError={() => {
                            return
                          }}
                          onFileSelectDelete={() => {
                            setValueConvertContact('vapor_tobacco_license', '')
                            triggerConvertContact('vapor_tobacco_license')
                          }}
                          errors={errorConvertContact.vapor_tobacco_license}
                        />
                        <FormHelperText
                          error={!!errorConvertContact.vapor_tobacco_license}
                        >
                          {errorConvertContact.vapor_tobacco_license &&
                            `${errorConvertContact.vapor_tobacco_license.message}`}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlConvertContact}
                  defaultValue=""
                  name="business_tax_document"
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="business_tax_document"
                        error={!!errorConvertContact.business_tax_document}
                      >
                        <RequiredLabel />
                        {t('details.businessTaxDocument')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <input id="business_tax_document" {...field} hidden />
                        <ComponentFileUploader
                          onFileSelectSuccess={(file: any) => {
                            setValueConvertContact(
                              'business_tax_document',
                              file
                            )
                            triggerConvertContact('business_tax_document')
                          }}
                          onFileSelectError={() => {
                            return
                          }}
                          onFileSelectDelete={() => {
                            setValueConvertContact('business_tax_document', '')
                            triggerConvertContact('business_tax_document')
                          }}
                          errors={errorConvertContact.business_tax_document}
                        />
                        <FormHelperText
                          error={!!errorConvertContact.business_tax_document}
                        >
                          {errorConvertContact.business_tax_document &&
                            `${errorConvertContact.business_tax_document.message}`}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                />
              </Box>
            </Stack>
            <Stack spacing={2} direction="row">
              <ButtonCancel
                onClick={props.handleCloseModal}
                variant="outlined"
                size="large"
              >
                {t('details.cancel')}
              </ButtonCancel>
              <ButtonCustom variant="contained" type="submit" size="large">
                {t('details.confirm')}
              </ButtonCustom>
            </Stack>
          </form>
        </Box>
      </Drawer>
    </>
  )
}

export default ConvertContactComponent
