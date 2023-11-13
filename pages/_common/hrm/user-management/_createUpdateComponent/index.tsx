import { yupResolver } from '@hookform/resolvers/yup'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Link from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCancel,
  ButtonCustom,
  InputLabelCustom,
  MenuItemSelectCustom,
  PlaceholderSelect,
  SelectCustom,
  TextFieldCustom,
  UploadImage,
} from 'src/components'
import {
  CreateSellerDataType,
  listRoleResponseType,
  roleType,
  SellerDataType,
} from './sellerModel'
import { schema, schemaUpdate } from './validations'

import { useCallback, useEffect, useState } from 'react'
import { NumericFormat, PatternFormat } from 'react-number-format'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import RequiredLabel from 'src/components/requiredLabel'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  formatPhoneNumber,
  handlerGetErrMessage,
  platform,
} from 'src/utils/global.utils'
import InfiniteScrollSelectMultiple from './InfiniteScrollSelectMultiple'
import { getListRoles } from './sellerAPI'
import classes from './styles.module.scss'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment, { Moment } from 'moment'

import { useTranslation } from 'next-i18next'
import { TypographyCustom } from 'pages/retailer/market-place/purchase-orders/detail/styled'

interface Props {
  userDetail?: any
  handleSubmit: (value: any) => void
  update?: boolean
}

const CreateUpdateUserComponent: React.FC<Props> = (props) => {
  const { t } = useTranslation('user-management')
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateCurrentDob, setStateCurrentDob] = useState<Date>()
  const [stateListRole, setStateListRole] = useState<listRoleResponseType>({
    data: [],
  })

  const platformArray = [
    {
      id: 1,
      name: t('seller'),
      value: 'SELLER',
    },
    {
      id: 2,
      name: t('supplier'),
      value: 'SUPPLIER',
    },
    {
      id: 3,
      name: t('merchant'),
      value: 'MERCHANT',
    },
  ]
  if (platform() === 'SUPPLIER') {
    platformArray.splice(2, 1)
  } else {
    platformArray.splice(1, 1)
  }
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    trigger,
    formState: { errors },
  } = useForm<SellerDataType>({
    resolver: yupResolver(props.update ? schemaUpdate(t) : schema(t)),
    mode: 'all',
  })

  const onSubmit = (data: any) => {
    const assignSellerArr: Array<number> = []
    getValues('roles').forEach((item: string) => {
      console.log(item)
      assignSellerArr.push(Number(item.slice(0, item.indexOf('-'))))
    })
    if (!props.update) {
      const sellerCreated: CreateSellerDataType = {
        ...data,
        ...(getValues('dob') && { dob: getValues('dob') }),
        ...(getValues('avatar') && { avatar: getValues('avatar') }),
        commission: Number(data.commission / 100),
        phone_number: data.phone_number
          .replace('(', '')
          .replace(')', '')
          .replaceAll(' ', ''),
        roles: assignSellerArr,
      }
      if (!data.commission) {
        delete sellerCreated.commission
      }
      if (!data.nick_name) {
        delete sellerCreated.nick_name
      }
      props.handleSubmit(sellerCreated)
      return
    }
    const sellerCreated: CreateSellerDataType = {
      ...data,
      ...(getValues('dob') && { dob: getValues('dob') }),
      ...(getValues('avatar') && { avatar: getValues('avatar') }),
      phone_number: data.phone_number
        .replace('(', '')
        .replace(')', '')
        .replaceAll(' ', ''),
      roles: assignSellerArr,
    }
    if (!data.nick_name) {
      delete sellerCreated.nick_name
    }
    props.handleSubmit(sellerCreated)
  }

  useEffect(() => {
    if (props.userDetail) {
      console.log('props.userDetail', props.userDetail)
      setValue('first_name', props.userDetail.first_name)
      setValue('nick_name', props.userDetail.nick_name)
      console.log('prop user nickname', props.userDetail.nickname)
      console.log('getValue nick name', getValues('nick_name'))
      setValue('last_name', props.userDetail.last_name)
      setValue('phone_number', formatPhoneNumber(props.userDetail.phone_number))
      setValue('avatar', props.userDetail.avatar)
      setValue('dob', props.userDetail.dob)
      setStateCurrentDob(moment(props.userDetail.dob).toDate())
      // setValue('avatar', )
      const temporaryListRole = props.userDetail.roles.map(
        (items: roleType) => {
          return `${items.id}-${items.name}`
        }
      )
      setValue('roles', temporaryListRole)
    }
  }, [props.userDetail, setValue])

  const handleGetRole = (value: string | null) => {
    getListRoles(1, { search: value })
      .then((response) => {
        const { data } = response
        setStateListRole(data)
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  useEffect(() => {
    handleGetRole(null)
  }, [])
  const fetchMoreDataRole = useCallback(
    (value: { page: number; name: string }) => {
      getListRoles(value.page, { search: value.name })
        .then((res) => {
          const { data } = res
          console.log('🚀 ~  data:', data)
          setStateListRole((prev: any) => {
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
    },
    [setStateListRole, pushMessage]
  )
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            marginBottom: '25px',
          }}
        >
          <TypographyCustom
            sx={{
              fontWeight: '500',
              fontSize: '1.4rem',
              lineHeight: '2.2rem',
              marginBottom: '15px',
            }}
          >
            Avatar
          </TypographyCustom>
          <UploadImage
            file={watch('avatar') as string}
            onFileSelectSuccess={(file: string) => {
              setValue('avatar', file)
              trigger('avatar')
            }}
            onFileSelectError={() => {
              return
            }}
            onFileSelectDelete={() => {
              setValue('avatar', '')
              trigger('avatar')
            }}
          />
        </Box>
        <Grid container spacing={2} mb={2} sx={{ maxWidth: '1000px' }}>
          <Grid xs={6}>
            <Box>
              <Controller
                control={control}
                name="first_name"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="first_name"
                      sx={{ marginBottom: '10px' }}
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
                        placeholder={t('enterFirstName')}
                      />
                      <FormHelperText error={!!errors.first_name}>
                        {errors.first_name && `${errors.first_name.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
          </Grid>
          <Grid xs={6}>
            <Box>
              <Controller
                control={control}
                name="last_name"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="last_name"
                      sx={{ marginBottom: '10px' }}
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
                        placeholder={t('enterLastName')}
                      />
                      <FormHelperText error={!!errors.last_name}>
                        {errors.last_name && `${errors.last_name.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
          </Grid>
          <Grid xs={6}>
            <Box>
              <Controller
                control={control}
                name="dob"
                render={({ field }) => (
                  <>
                    <InputLabelCustom>{t('dateOfBirth')}</InputLabelCustom>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="YYYY-MM-DD"
                          {...field}
                          value={stateCurrentDob ? stateCurrentDob : null}
                          onChange={(value: Moment | null) => {
                            if (value) {
                              setStateCurrentDob(value.toDate())
                              setValue(
                                'dob',
                                moment(value).format('YYYY-MM-DD')
                              )
                            }
                          }}
                          shouldDisableDate={(day: any) => {
                            const date = new Date()
                            if (
                              moment(day).format('YYYY-MM-DD') >
                              moment(date).format('YYYY-MM-DD')
                            ) {
                              return true
                            }
                            return false
                          }}
                          renderInput={(params: any) => {
                            return <TextFieldCustom {...params} />
                          }}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </>
                )}
              />
            </Box>
          </Grid>
          <Grid xs={6}>
            <Box>
              <Controller
                control={control}
                name="nick_name"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="nick_name"
                      sx={{ marginBottom: '10px' }}
                      error={!!errors.nick_name}
                    >
                      <RequiredLabel />
                      {t('nickName')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="nick_name"
                        error={!!errors.nick_name}
                        {...field}
                        placeholder={t('enterNickName')}
                      />
                      <FormHelperText error={!!errors.nick_name}>
                        {errors.nick_name && `${errors.nick_name.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
          </Grid>
          {!props.update && (
            <Grid xs={6}>
              <Box>
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="email"
                        sx={{ marginBottom: '10px' }}
                        error={!!errors.email}
                      >
                        <RequiredLabel />
                        {t('email')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="email"
                          error={!!errors.email}
                          {...field}
                          placeholder={t('enterEmail')}
                        />
                        <FormHelperText error={!!errors.email}>
                          {errors.email && `${errors.email.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
            </Grid>
          )}

          <Grid xs={6}>
            {' '}
            <Box>
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
          </Grid>
          {!props.update && (
            <Grid xs={6}>
              <Controller
                control={control}
                name="commission"
                render={() => (
                  <>
                    <InputLabelCustom> {t('commission')}</InputLabelCustom>
                    <div className={classes['input-number']}>
                      <NumericFormat
                        placeholder="0"
                        allowNegative={false}
                        isAllowed={(values) => {
                          const { floatValue, formattedValue } = values
                          if (!floatValue) {
                            return formattedValue === ''
                          }
                          return floatValue <= 100
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment
                              position="end"
                              sx={{ textTransform: 'capitalize' }}
                            >
                              %
                            </InputAdornment>
                          ),
                        }}
                        customInput={TextField}
                        error={!!errors.commission}
                        onValueChange={(value: any) => {
                          setValue('commission', value.floatValue)
                          // trigger('quantity')
                        }}
                      />
                    </div>
                    <FormHelperText error>
                      {errors.commission && errors.commission.message}
                    </FormHelperText>
                  </>
                )}
              />
            </Grid>
          )}
          {!props.update && (
            <Grid xs={6}>
              <Box>
                <Controller
                  control={control}
                  name="user_type"
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="user_type"
                        sx={{ marginBottom: '10px' }}
                        error={!!errors.user_type}
                      >
                        <RequiredLabel />
                        {t('platform')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="user_type"
                          displayEmpty
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  <div> {t('selectPlatform')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            return platformArray?.find(
                              (obj) => obj.value === value
                            )?.name
                          }}
                          {...field}
                          onChange={(event: any) => {
                            setValue('user_type', event.target.value)
                          }}
                        >
                          {platformArray?.map((item, index) => {
                            return (
                              <MenuItemSelectCustom
                                value={item.value}
                                key={index + Math.random()}
                                sx={{ textTransform: 'capitalize' }}
                              >
                                {item.name.toLowerCase()}
                              </MenuItemSelectCustom>
                            )
                          })}
                        </SelectCustom>
                        <FormHelperText error={!!errors.user_type}>
                          {errors.user_type && `${errors.user_type.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
            </Grid>
          )}
          {!props.update && (
            <Grid xs={6}>
              <Controller
                control={control}
                name="roles"
                defaultValue={[]}
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      sx={{ marginBottom: '10px' }}
                      htmlFor="roles"
                      error={!!errors.roles}
                    >
                      <RequiredLabel />
                      {t('selectRoles')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <SelectCustom
                        id="roles"
                        displayEmpty
                        multiple
                        placeholder="Select Seller"
                        IconComponent={() => <KeyboardArrowDownIcon />}
                        {...field}
                        renderValue={(value: any) => {
                          if (!value) {
                            return (
                              <PlaceholderSelect>
                                <div> {t('selectRoles')}</div>
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
                              {value.map(function (item: any, idx: number) {
                                console.log('value', value)
                                console.log('item', item)

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
                                      const temporaryRolesArr = getValues(
                                        'roles'
                                      ).filter((x: any) => {
                                        console.log('x', x)
                                        return x != item
                                      })
                                      console.log(
                                        'temporaryRolesArr',
                                        temporaryRolesArr
                                      )
                                      setValue('roles', temporaryRolesArr)
                                    }}
                                    label={
                                      <Typography
                                        sx={{
                                          maxWidth: '100px',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                        }}
                                      >
                                        {item.slice(
                                          item.indexOf('-') + 1,
                                          item.length
                                        )}
                                        {item.name}
                                      </Typography>
                                    }
                                  />
                                )
                              })}
                            </Box>
                          )
                        }}
                        onChange={(event: any) => {
                          console.log('change', event.target.value)
                        }}
                      >
                        <InfiniteScrollSelectMultiple
                          propData={stateListRole}
                          handleSearch={(value) => {
                            setStateListRole({ data: [] })
                            handleGetRole(value)
                          }}
                          fetchMore={(value) => {
                            fetchMoreDataRole(value)
                          }}
                          onClickSelectItem={(item: any) => {
                            setValue('roles', item)
                          }}
                          propsGetValue={getValues('roles')}
                          propName={'name'}
                        />
                      </SelectCustom>
                      <FormHelperText error={!!errors.roles}>
                        {errors.roles && `${errors.roles.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Grid>
          )}
        </Grid>

        <Stack direction="row" justifyContent="start" spacing={2}>
          <Link
            href={
              platform() === 'SUPPLIER'
                ? '/supplier/hrm/user-management/list'
                : '/retailer/hrm/user-management/list'
            }
          >
            <a>
              <ButtonCancel variant="outlined" size="large">
                {t('cancel')}
              </ButtonCancel>
            </a>
          </Link>
          <ButtonCustom variant="contained" type="submit" size="large">
            {t('submit')}
          </ButtonCustom>
        </Stack>
      </form>
    </>
  )
}
export default CreateUpdateUserComponent
