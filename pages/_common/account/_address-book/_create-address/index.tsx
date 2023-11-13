import { NextPageWithLayout } from 'pages/_app.page'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'
import {
  Box,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
  Autocomplete,
} from '@mui/material'
import {
  ButtonCancel,
  ButtonCustom,
  InputLabelCustom,
  TextFieldCustom,
} from 'src/components'
import RequiredLabel from 'src/components/requiredLabel'
import { PatternFormat } from 'react-number-format'
import { createAddressBookAPI } from './createAddressAPI'

import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { CreateAddressBookDataType } from './createAddressModels'
import { handlerGetErrMessage, objToStringParam } from 'src/utils/global.utils'
import { useRouter } from 'next/router'
import dataState from '../states.json'
import { useTranslation } from 'next-i18next'

const CreateAddressBook: NextPageWithLayout = () => {
  const { t } = useTranslation('account')
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useForm<CreateAddressBookDataType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })

  const onSubmit = (values: CreateAddressBookDataType) => {
    // values.phone_number = values.phone_number.replace(/\D/g, '')
    values.phone_number = values.phone_number.replace(/\D/g, '')

    console.log('valueSubmit', values)

    dispatch(loadingActions.doLoading())
    createAddressBookAPI({
      ...values,
      state: values.state.abbreviation,
    })
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(
          t('message.theAddressHasBeenCreatedSuccessfully'),
          'success'
        )
        router.push({
          search: `${objToStringParam({
            ...router.query,
            address: null,
            page: 1,
          })}`,
        })
      })
      .catch((response) => {
        const { status, data } = response.response
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  // console.log('data', data)

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} mb={3} sx={{ maxWidth: '450px' }}>
          <Box>
            <Controller
              control={control}
              name="name"
              defaultValue=""
              render={({ field }) => (
                <>
                  <InputLabelCustom htmlFor="name" error={!!errors.name}>
                    <RequiredLabel />
                    {t('addressName')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <TextFieldCustom
                      placeholder="Address Name"
                      id="name"
                      error={!!errors.name}
                      {...field}
                    />
                    <FormHelperText error={!!errors.name}>
                      {errors.name && `${errors.name.message}`}
                    </FormHelperText>
                  </FormControl>
                </>
              )}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="receiver_name"
              defaultValue=""
              render={({ field }) => (
                <>
                  <InputLabelCustom
                    htmlFor="receiver_name"
                    error={!!errors.receiver_name}
                  >
                    <RequiredLabel />
                    {t('receiverName')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <TextFieldCustom
                      placeholder="Receiver name"
                      id="receiver_name"
                      error={!!errors.receiver_name}
                      {...field}
                    />
                    <FormHelperText error={!!errors.receiver_name}>
                      {errors.receiver_name &&
                        `${errors.receiver_name.message}`}
                    </FormHelperText>
                  </FormControl>
                </>
              )}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="phone_number"
              defaultValue=""
              render={({ field }) => (
                <>
                  <InputLabelCustom
                    htmlFor="phone_number"
                    error={!!errors.phone_number}
                  >
                    <RequiredLabel />
                    {t('phoneNumber')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <div className="input-number">
                      <PatternFormat
                        placeholder="(xxx) xxx xxxx "
                        id="phone_number"
                        customInput={TextField}
                        {...field}
                        error={!!errors.phone_number}
                        format="(###) ### ####"
                      />
                    </div>
                    <FormHelperText error={!!errors.phone_number}>
                      {errors.phone_number && `${errors.phone_number.message}`}
                    </FormHelperText>
                  </FormControl>
                </>
              )}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="address"
              defaultValue=""
              render={({ field }) => (
                <>
                  <InputLabelCustom htmlFor="address" error={!!errors.address}>
                    <RequiredLabel />
                    {t('address')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <TextFieldCustom
                      placeholder="Input Address"
                      id="address"
                      multiline
                      rows={6}
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
          <Box>
            <Controller
              control={control}
              name="city"
              defaultValue=""
              render={({ field }) => (
                <>
                  <InputLabelCustom htmlFor="city" error={!!errors.city}>
                    <RequiredLabel />
                    {t('city')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <TextFieldCustom
                      id="city"
                      error={!!errors.city}
                      {...field}
                    />
                    <FormHelperText error={!!errors.city}>
                      {errors.city && `${errors.city.message}`}
                    </FormHelperText>
                  </FormControl>
                </>
              )}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="state"
              render={({ field: { value } }) => (
                <>
                  <InputLabelCustom
                    htmlFor="state"
                    error={!!errors.state?.name}
                  >
                    <RequiredLabel />
                    {t('state')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <Autocomplete
                      getOptionLabel={(option) => option.name}
                      options={dataState}
                      value={value}
                      renderInput={(params) => (
                        <TextFieldCustom
                          error={!!errors.state?.name}
                          {...(params as any)}
                        />
                      )}
                      onChange={(_, newValue) => {
                        console.log('event', newValue)
                        if (newValue) {
                          setValue('state', newValue)
                        } else {
                          setValue('state', {
                            name: '',
                            abbreviation: '',
                          })
                        }
                        trigger('state')
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
                          padding: '1px 5px',
                        },
                      }}
                    />
                    <FormHelperText error={!!errors.state?.name}>
                      {errors.state?.name && `${errors.state?.name?.message}`}
                    </FormHelperText>
                  </FormControl>
                </>
              )}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="postal_zipcode"
              defaultValue=""
              render={({ field }) => (
                <>
                  <InputLabelCustom
                    htmlFor="postal_zipcode"
                    error={!!errors.postal_zipcode}
                  >
                    <RequiredLabel />
                    {t('postalZipcode')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <TextFieldCustom
                      id="postal_zipcode"
                      error={!!errors.postal_zipcode}
                      {...field}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        console.log('e', e, getValues('state'))
                        setValue('postal_zipcode', e.target.value)
                        trigger('postal_zipcode')
                      }}
                    />
                    <FormHelperText error={!!errors.postal_zipcode}>
                      {errors.postal_zipcode &&
                        `${errors.postal_zipcode.message}`}
                    </FormHelperText>
                  </FormControl>
                </>
              )}
            />
          </Box>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          spacing={2}
        >
          <ButtonCancel
            variant="outlined"
            size="large"
            onClick={() =>
              router.replace({
                search: `${objToStringParam({
                  ...router.query,
                  tab: 'address-book',
                  address: '',
                  id: '',
                })}`,
              })
            }
          >
            {t('cancel')}
          </ButtonCancel>
          <ButtonCustom variant="contained" size="large" type="submit">
            {t('submit')}
          </ButtonCustom>
        </Stack>
      </form>
    </>
  )
}

export default CreateAddressBook
