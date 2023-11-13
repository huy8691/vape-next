import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Dialog,
  DialogContentText,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { ArrowRight, X } from '@phosphor-icons/react'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTws,
  DialogTitleTws,
  InputLabelCustom,
  TextFieldCustom,
  TypographyH2,
} from 'src/components'

import RequiredLabel from 'src/components/requiredLabel'
import { AddContactType, ContactDetailType } from './addContactFormModel'
import { schema, schemaAddGuest } from './validation'
import classes from './styles.module.scss'
import { PatternFormat } from 'react-number-format'
import { useDebouncedCallback } from 'use-debounce'
import {
  createGuestInformation,
  getContactInformation,
  getUrlUploadFileApi,
  readLicense,
  uploadFileApi,
} from './apiAddContact'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { useTranslation } from 'next-i18next'

interface Props {
  stateOpen: boolean
  setStateOpen: () => void
  setDrawerRetailOrderClose: () => void
  addContactToRetail: (value: ContactDetailType) => void
}
const AddContactForm = (props: Props) => {
  const { t } = useTranslation('retail-order-list')
  const [stateDetailContact, setStateDetailContact] =
    useState<ContactDetailType>()
  const [stateHaveContact, setStateHaveContact] = useState(false)
  const [pushMessage] = useEnqueueSnackbar()
  const [stateDrawerGuestInformation, setStateDrawerGuestInformation] =
    useState(false)
  const dispatch = useAppDispatch()
  const {
    handleSubmit,
    control,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<AddContactType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })

  const {
    handleSubmit: handleSubmitCreateGuestInformation,
    control: controlGuestInformation,
    setValue: setValueGuestInformation,
    getValues: getValuesGuestInformation,
    formState: { errors: errosGuestInformation },
  } = useForm<ContactDetailType>({
    resolver: yupResolver(schemaAddGuest(t)),
    mode: 'all',
  })

  const onSubmitAddContact = (value: AddContactType) => {
    if (stateHaveContact) {
      if (!stateDetailContact) return
      props.addContactToRetail(stateDetailContact)
      props.setStateOpen()
    } else {
      setValueGuestInformation('phone_number', value.phone_number)
      setStateDrawerGuestInformation(true)
    }
  }

  const handleCheckValidPhoneNumber = (value: string) => {
    return /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/.test(value)
  }
  const debounced = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue('phone_number', e.target.value)
      trigger('phone_number')
      setStateDetailContact(undefined)

      if (handleCheckValidPhoneNumber(e.target.value)) {
        console.log('valid', e.target.value)
        console.log(
          'valid replace',
          e.target.value.replace('(', '').replace(')', '').replaceAll(' ', '')
        )
        dispatch(loadingActions.doLoading())
        getContactInformation(
          e.target.value.replace('(', '').replace(')', '').replaceAll(' ', '')
        )
          .then((res) => {
            const { data } = res.data
            setStateDetailContact(data)
            setStateHaveContact(true)
            dispatch(loadingActions.doLoadingSuccess())
          })
          .catch(({ response }) => {
            const { status, data } = response

            if (status === 404) {
              setStateHaveContact(false)
              dispatch(loadingActions.doLoadingSuccess())
              return
            }
            setStateHaveContact(false)
            dispatch(loadingActions.doLoadingFailure())
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
      }
    },
    200
  )
  const onSubmitGuestInformation = (value: ContactDetailType) => {
    const submitValue: ContactDetailType = {
      ...value,
      phone_number: value.phone_number
        .replace(')', '')
        .replace('(', '')
        .replaceAll(' ', ''),
      ...(getValuesGuestInformation('document') && {
        document: getValuesGuestInformation('document'),
      }),
    }
    createGuestInformation(submitValue)
      .then(() => {
        pushMessage(
          t('create.addContactForm.createGuestInformation'),
          'success'
        )
        props.addContactToRetail(submitValue)
        props.setStateOpen()
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleReadLicense = (e: any) => {
    readLicense
    dispatch(loadingActions.doLoading())
    const fileInput = e.target.files[0]
    const formData = new FormData()
    formData.append('file', fileInput)

    readLicense(formData)
      .then((res) => {
        handleUploadImage(fileInput)
        const { data } = res
        setValueGuestInformation('address', data.data.Address)
        const fullName = data.data.Name.split(' ')
        setValueGuestInformation('first_name', fullName[0])
        setValueGuestInformation('last_name', fullName[fullName.length - 1])
        console.log('🚀 ~ .then ~ data:', data)
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage('Import with OCR successfully', 'success')
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
            setValueGuestInformation('document', data.newUrl)
            console.log(
              'getValueDocument',
              getValuesGuestInformation('document')
            )
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
      {!stateDrawerGuestInformation && (
        <Dialog
          open={props.stateOpen}
          onClose={() => {
            props.setStateOpen()
          }}
        >
          <form onSubmit={handleSubmit(onSubmitAddContact)}>
            <DialogTitleTws>
              <IconButton
                onClick={() => {
                  props.setStateOpen()
                }}
              >
                <X size={20} />
              </IconButton>
            </DialogTitleTws>
            <DialogContentTws>
              <DialogContentText textAlign="center" sx={{ minWidth: '300px' }}>
                <TypographyH2
                  sx={{
                    fontSize: '2.4rem',
                    fontWeight: '500',
                    width: '100%',
                  }}
                  alignSelf="center"
                >
                  {' '}
                  {t('create.addContactForm.addContact')}
                </TypographyH2>
              </DialogContentText>
              <Box>
                <Controller
                  control={control}
                  name="phone_number"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="phone_number"
                        error={!!errors.phone_number}
                      >
                        <RequiredLabel />{' '}
                        {t('create.addContactForm.phoneNumber')}
                      </InputLabelCustom>
                      <div className={classes['input-number']}>
                        <PatternFormat
                          id="phone_number"
                          customInput={TextField}
                          {...field}
                          onChange={(e) => debounced(e)}
                          error={!!errors.phone_number}
                          placeholder={t(
                            'create.addContactForm.enterPhoneNumber'
                          )}
                          format="(###) ### ####"
                        />
                      </div>
                      <FormHelperText error>
                        {errors.phone_number &&
                          `${errors.phone_number.message}`}
                      </FormHelperText>
                      {watch('phone_number') &&
                        handleCheckValidPhoneNumber(watch('phone_number')) &&
                        !stateHaveContact && (
                          <FormHelperText error>
                            {t('create.addContactForm.phoneNumberNotExisting')}
                          </FormHelperText>
                        )}
                    </>
                  )}
                />
              </Box>
              <Stack></Stack>
              {stateDetailContact && stateHaveContact && (
                <Stack
                  sx={{
                    marginTop: '15px',
                    padding: '10px',
                    borderRadius: '5px',
                    background: '#F8FAFB',
                  }}
                  spacing={2}
                >
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>{t('create.addContactForm.name')}</Typography>
                    <Typography>
                      {stateDetailContact.first_name}{' '}
                      {stateDetailContact.last_name}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>{t('create.addContactForm.email')}</Typography>
                    <Typography>{stateDetailContact.email}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>
                      {t('create.addContactForm.address')}
                    </Typography>
                    <Box
                      sx={{
                        width: '200px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      <Typography>{stateDetailContact.address}</Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>
                      {t('create.addContactForm.businessName')}
                    </Typography>
                    <Typography>{stateDetailContact.business_name}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Loyalty Level</Typography>
                    <Typography>
                      {stateDetailContact.loyalty_info &&
                      stateDetailContact.loyalty_info.tiered_loyalty_level
                        ? stateDetailContact.loyalty_info &&
                          stateDetailContact.loyalty_info.tiered_loyalty_level
                        : 'N/A'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Loyalty point</Typography>
                    <Typography>
                      {stateDetailContact.loyalty_info &&
                      stateDetailContact.loyalty_info.current_points
                        ? stateDetailContact.loyalty_info &&
                          stateDetailContact.loyalty_info.current_points
                        : 'N/A'}
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </DialogContentTws>
            <DialogActionsTws>
              <Stack spacing={2} direction="row">
                <ButtonCancel
                  onClick={() => {
                    props.setStateOpen()
                  }}
                  variant="outlined"
                  size="large"
                >
                  {t('create.addContactForm.no')}
                </ButtonCancel>
                {handleCheckValidPhoneNumber(watch('phone_number')) && (
                  <ButtonCustom variant="contained" size="large" type="submit">
                    {stateHaveContact
                      ? t('create.addContactForm.confirm')
                      : t('create.addContactForm.createLead')}
                  </ButtonCustom>
                )}
              </Stack>
            </DialogActionsTws>
          </form>
        </Dialog>
      )}
      <Drawer
        open={stateDrawerGuestInformation}
        onClose={() => {
          setStateDrawerGuestInformation(false)
          props.setStateOpen()
        }}
        anchor="right"
        disableEnforceFocus
      >
        <Box sx={{ width: '550px', padding: '25px' }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: '15px' }}
          >
            <IconButton
              onClick={() => {
                setStateDrawerGuestInformation(false)
                props.setStateOpen()
              }}
            >
              <ArrowRight size={24} />
            </IconButton>
            <TypographyH2>
              {t('create.addContactForm.guestInformation')}
            </TypographyH2>
          </Stack>
          <Box>
            <form
              onSubmit={handleSubmitCreateGuestInformation(
                onSubmitGuestInformation
              )}
            >
              <Box sx={{ marginBottom: '15px' }}>
                <Controller
                  control={controlGuestInformation}
                  name="first_name"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="first_name"
                        error={!!errosGuestInformation.first_name}
                      >
                        <RequiredLabel />
                        {t('create.addContactForm.firstName')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          error={!!errosGuestInformation.first_name}
                          {...field}
                        />
                      </FormControl>

                      <FormHelperText error>
                        {errosGuestInformation.first_name &&
                          `${errosGuestInformation.first_name.message}`}
                      </FormHelperText>
                    </>
                  )}
                />
              </Box>
              <Box sx={{ marginBottom: '15px' }}>
                <Controller
                  control={controlGuestInformation}
                  name="last_name"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="last_name"
                        error={!!errosGuestInformation.last_name}
                      >
                        {t('create.addContactForm.lastName')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          error={!!errosGuestInformation.last_name}
                          {...field}
                        />
                      </FormControl>

                      <FormHelperText error>
                        {errosGuestInformation.last_name &&
                          `${errosGuestInformation.last_name.message}`}
                      </FormHelperText>
                    </>
                  )}
                />
                <Box sx={{ marginBottom: '15px' }}>
                  <Controller
                    control={controlGuestInformation}
                    name="email"
                    render={({ field }) => (
                      <>
                        <InputLabelCustom
                          htmlFor="email"
                          error={!!errosGuestInformation.email}
                        >
                          {t('create.addContactForm.email')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            error={!!errosGuestInformation.email}
                            {...field}
                          />
                        </FormControl>

                        <FormHelperText error>
                          {errosGuestInformation.email &&
                            `${errosGuestInformation.email.message}`}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Box>
                <Box sx={{ marginBottom: '15px' }}>
                  <Controller
                    control={controlGuestInformation}
                    name="phone_number"
                    render={({ field }) => (
                      <>
                        <InputLabelCustom
                          htmlFor="phone_number"
                          error={!!errosGuestInformation.phone_number}
                        >
                          <RequiredLabel />
                          {t('create.addContactForm.phoneNumber')}
                        </InputLabelCustom>
                        <div className={classes['input-number']}>
                          <PatternFormat
                            id="phone_number"
                            customInput={TextField}
                            {...field}
                            onChange={(e) => debounced(e)}
                            error={!!errosGuestInformation.phone_number}
                            placeholder={t(
                              'create.addContactForm.enterPhoneNumber'
                            )}
                            format="(###) ### ####"
                          />
                        </div>
                        <FormHelperText error>
                          {errosGuestInformation.phone_number &&
                            `${errosGuestInformation.phone_number.message}`}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Box>
                <Box sx={{ marginBottom: '15px' }}>
                  <Controller
                    control={controlGuestInformation}
                    name="address"
                    render={({ field }) => (
                      <>
                        <InputLabelCustom
                          htmlFor="address"
                          error={!!errosGuestInformation.address}
                        >
                          {t('create.addContactForm.address')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            error={!!errosGuestInformation.address}
                            {...field}
                          />
                        </FormControl>

                        <FormHelperText error>
                          {errosGuestInformation.address &&
                            `${errosGuestInformation.address.message}`}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Box>
                <Box sx={{ marginBottom: '15px' }}>
                  <Controller
                    control={controlGuestInformation}
                    name="business_name"
                    render={({ field }) => (
                      <>
                        <InputLabelCustom
                          htmlFor="business_name"
                          error={!!errosGuestInformation.business_name}
                        >
                          <RequiredLabel />
                          {t('create.addContactForm.businessName')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            error={!!errosGuestInformation.business_name}
                            {...field}
                          />
                        </FormControl>

                        <FormHelperText error>
                          {errosGuestInformation.business_name &&
                            `${errosGuestInformation.business_name.message}`}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Box>
              </Box>
              <Stack spacing={2} direction="row" mb={2}>
                <ButtonCancel
                  fullWidth
                  size="large"
                  onClick={() => {
                    props.setStateOpen()
                    setStateDrawerGuestInformation(false)
                  }}
                  variant="outlined"
                >
                  {t('create.addContactForm.cancel')}
                </ButtonCancel>
                <ButtonCustom
                  fullWidth
                  variant="contained"
                  type="submit"
                  size="large"
                >
                  {t('create.addContactForm.submit')}
                </ButtonCustom>
              </Stack>
              <ButtonCustom
                fullWidth
                size="large"
                component="label"
                variant="outlined"
              >
                Import OCR{' '}
                <input
                  hidden
                  accept=".pdf,.png,.jpeg"
                  type="file"
                  onChange={handleReadLicense}
                />
              </ButtonCustom>
            </form>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}

export default AddContactForm
