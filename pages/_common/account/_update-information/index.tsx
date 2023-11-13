import React, { useEffect } from 'react'

// next

import type { NextPageWithLayout } from 'pages/_app.page'

import { useAppSelector } from 'src/store/hooks'
// dayjs
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// import { NumberFormatBase } from 'react-number-format'
import { userInfoActions } from 'src/store/userInfo/userInfoSlice'

// mui
// import List from '@mui/material/List'
// import ListItem from '@mui/material/ListItem'
// import ListItemText from '@mui/material/ListItemText'
import {
  Box,
  FormControl,
  FormHelperText,
  TextField,
  Grid,
} from '@mui/material'
import {
  ButtonCustom,
  InputLabelCustom,
  // MenuItemSelectCustom,
  // PlaceholderSelect,
  // SelectCustom,
  TextFieldCustom,
} from 'src/components'
import RequiredLabel from 'src/components/requiredLabel'

// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
// import EditIcon from '@mui/icons-material/Edit'

import { AccountDataType } from './accountModel'
// mui
// import { styled } from '@mui/material/styles'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'

// api
import { updateUserInfo } from './accountAPI'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { PatternFormat } from 'react-number-format'
import classes from './styles.module.scss'
import { formatPhoneNumber } from 'src/utils/global.utils'

import { Stack } from '@mui/system'
import { useTranslation } from 'next-i18next'

const PersonalInformation: NextPageWithLayout = () => {
  const { t } = useTranslation('account')
  const dispatch = useAppDispatch()
  const userInfo = useAppSelector((state) => state.userInfo)
  // fix error when use next theme
  const {
    handleSubmit,
    control,
    setValue,
    // getValues,

    formState: { errors },
  } = useForm<AccountDataType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })

  const [pushMessage] = useEnqueueSnackbar()

  const onSubmit = (values: AccountDataType) => {
    values.phone_number = values.phone_number.replace(/\D/g, '')

    values.dob = values.dob == t('invalidDate') ? null : values.dob

    dispatch(loadingActions.doLoading())
    updateUserInfo(values)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(t('message.updatedProfileSuccessfully'), 'success')
        dispatch(userInfoActions.doUserInfo())
      })
      .catch((response) => {
        const { status, data } = response.response
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
        setValue('phone_number', formatPhoneNumber(userInfo.data.phone_number))
      })
  }
  // const handleChangeNumber = (event) => {
  //   const newValue = event.target.value
  //   if (!newValue || newValue.match(/^\(\d{3}\)\s\d{3}\-\d{4}$/)) {
  //     setValue(newValue)
  //   }
  // }

  useEffect(() => {
    setValue('first_name', userInfo.data.first_name)
    setValue('last_name', userInfo.data.last_name)
    setValue('gender', userInfo.data.gender)
    setValue('phone_number', formatPhoneNumber(userInfo.data.phone_number))
    setValue('dob', userInfo.data.dob)
    setValue('address', userInfo.data.address)
  }, [userInfo, setValue])

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            width: '100%',
            border: '1px solid #E1E6EF',
            padding: '25px',
            borderRadius: '10px',
            marginBottom: '35px',
          }}
        >
          <Grid container columnSpacing={2}>
            <Grid item mb={2} xs={6}>
              <Controller
                control={control}
                name="first_name"
                defaultValue=""
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="first_name"
                      error={!!errors.first_name}
                    >
                      <RequiredLabel />
                      {t('firstName')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="first_name"
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
            </Grid>
            <Grid item mb={2} xs={6}>
              <Controller
                control={control}
                name="last_name"
                defaultValue=""
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="last_name"
                      error={!!errors.last_name}
                    >
                      <RequiredLabel />
                      {t('lastName')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="last_name"
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
            </Grid>
            <Grid item mb={2} xs={6}>
              <Controller
                control={control}
                name="phone_number"
                defaultValue=""
                render={({ field }) => {
                  return (
                    <>
                      <InputLabelCustom
                        htmlFor="phone_number"
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
                  )
                }}
              />
            </Grid>
            <Grid item mb={2} xs={6}>
              <Controller
                control={control}
                name="dob"
                defaultValue=""
                render={({ field }) => (
                  <>
                    <InputLabelCustom htmlFor="dob" error={!!errors.dob}>
                      {t('dob')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          inputFormat="MM/DD/YYYY"
                          {...field}
                          onChange={(value: dayjs.Dayjs | null) => {
                            if (value == null) {
                              setValue('dob', null, {
                                shouldValidate: true,
                              })
                            } else {
                              setValue(
                                'dob',
                                dayjs(value).format('YYYY-MM-DD'),
                                {
                                  shouldValidate: true,
                                }
                              )
                            }
                          }}
                          shouldDisableDate={(day: any) => {
                            const date = new Date()
                            if (
                              dayjs(day).format('YYYY-MM-DD') >
                              dayjs(date).format('YYYY-MM-DD')
                            ) {
                              return true
                            }
                            return false
                          }}
                          renderInput={(params) => (
                            <TextFieldCustom
                              id="dob"
                              sx={{ marginLeft: '0' }}
                              {...params}
                              error={!!errors.dob}
                            />
                          )}
                        />
                      </LocalizationProvider>
                      <FormHelperText error={!!errors.dob}>
                        {errors.dob && `${errors.dob.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="address"
                defaultValue=""
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="address"
                      error={!!errors.address}
                    >
                      {t('address')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="address"
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
            </Grid>
          </Grid>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <ButtonCustom variant="contained" size="large" type="submit">
            {t('submit')}
          </ButtonCustom>
        </Stack>
      </form>
    </>
  )
}

// Account.getLayout = function getLayout(page: ReactElement) {
//   return <NestedLayout>{page}</NestedLayout>
// }
export default PersonalInformation
