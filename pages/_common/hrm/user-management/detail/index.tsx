import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Modal,
  Stack,
  Typography,
  styled,
} from '@mui/material'
import moment from 'moment'
import { useRouter } from 'next/router'
import { ArrowRight, PencilLine, X } from '@phosphor-icons/react'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCancel,
  ButtonCustom,
  InputLabelCustom,
  PlaceholderSelect,
  SelectCustom,
  TypographyH2,
} from 'src/components'
import CurrencyNumberFormat from 'src/components/CurrencyNumberFormat'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { formatPhoneNumber, handlerGetErrMessage } from 'src/utils/global.utils'
import { getDetailSeller } from '../update/apiSeller'
import { getWorkShiftOfUser, updateIncome } from './apiSeller'
import { SellerDataType } from './sellerModel'
import WorkShift from './workShift'
import { payRateSchema } from './validations'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'

const BoxModalCustom = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '490px',
  background: 'white',
  borderStyle: 'none',
  padding: '50px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: '10px',
}))

const DetailUser: React.FC<{
  open: boolean
  stateSellerId: number | undefined
}> = (props) => {
  const { t } = useTranslation('user-management')
  const [flagUpdateDetail, setFlagUpdateDetail] = useState('')
  const [pushMessage] = useEnqueueSnackbar()
  const [stateDrawerWorkShift, setStateDrawerWorkShift] = useState(false)
  const [openModalIncome, setOpenModalIncome] = useState(false)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [stateStaffDetail, setStateStaffDetail] = useState<SellerDataType>()
  const [workShift, setWorkShift] = useState<
    {
      id?: number
      day_of_week?: string
      from_time?: string
      to_time?: string
      enable?: boolean
    }[]
  >()

  const {
    handleSubmit,
    setValue,
    control,
    register,
    trigger,
    reset,
    formState: { errors },
  } = useForm<{ type?: string; pay_rate?: number }>({
    resolver: yupResolver(payRateSchema(t)),
    mode: 'all',
  })

  useEffect(() => {
    if (!props.open || !props.stateSellerId) return

    dispatch(loadingActions.doLoading())
    getDetailSeller(props.stateSellerId)
      .then((res) => {
        const { data }: { data: SellerDataType } = res.data

        setStateStaffDetail(data)
        dispatch(loadingActions.doLoadingSuccess())
        setValue('type', data.income?.type)
        setValue('pay_rate', data.income?.pay_rate)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
        if (status === 404) {
          router.push('/404')
        }
      })
      .finally(() => dispatch(loadingActions.doLoadingSuccess()))

    dispatch(loadingActions.doLoading())

    getWorkShiftOfUser(props.stateSellerId)
      .then((res) => {
        const {
          data,
        }: {
          data: {
            id?: number
            day_of_week?: string
            from_time?: string
            to_time?: string
            enabled?: boolean
          }[]
        } = res.data
        setWorkShift(() =>
          data.map((item) => {
            const { enabled, ...rest } = item
            return { ...rest, enable: enabled }
          })
        )
        dispatch(loadingActions.doLoadingSuccess())
      })
      .finally(() => dispatch(loadingActions.doLoadingSuccess()))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, props.open, props.stateSellerId, router, flagUpdateDetail])

  const onUpdateIncome = (values: { type?: string; pay_rate?: number }) => {
    dispatch(loadingActions.doLoading())
    updateIncome(
      props.stateSellerId!,
      stateStaffDetail?.income?.id as number,
      values
    )
      .then(() => {
        setFlagUpdateDetail('' + new Date().getTime())
        pushMessage(t('message.updateIncomeSuccessfully'), 'success')
        handleCloseModalIncome()
      })
      .catch(() => {
        pushMessage(t('message.updateIncomeFailed'), 'error')
      })
      .finally(() => {
        dispatch(loadingActions.doLoadingSuccess())
      })
  }

  const handleCloseModalIncome = () => {
    setOpenModalIncome(false)
    reset()
  }

  return (
    <>
      <Box
        sx={{
          border: '1px solid #E1E6EF',
          marginBottom: '0',
          borderRadius: '10px',
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            padding: '15px 15px 10px',
          }}
          gap={'15px'}
        >
          <Avatar
            alt={stateStaffDetail?.first_name}
            src={stateStaffDetail?.avatar || ''}
            sx={{ width: 60, height: 60 }}
          />

          <Box>
            <Typography
              sx={{
                color: '#0A0D14',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {stateStaffDetail?.first_name} {stateStaffDetail?.last_name}{' '}
              <span
                style={{
                  fontWeight: 400,
                }}
              >
                {`(${stateStaffDetail?.nick_name})`}
              </span>
            </Typography>
            <Typography
              sx={{
                color: '#49516F',
                fontSize: '14px',
                fontWeight: 400,
              }}
            >
              {t('platform')}:{' '}
              <span
                style={{
                  fontWeight: 500,
                  color: '#0A0D14',
                }}
              >
                {stateStaffDetail?.user_type === 'MERCHANT'
                  ? t('retailer')
                  : t(`${stateStaffDetail?.user_type}` as any)}
              </span>
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent={'space-between'}
          sx={{
            padding: '0px 10px 15px',
          }}
        >
          <Typography sx={{ color: '#49516F' }}>{t('role')}:</Typography>
          <Typography>
            {stateStaffDetail?.roles?.map((item) => item.name).join(',')}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent={'space-between'}
          sx={{
            padding: '0px 10px 15px',
          }}
        >
          <Typography sx={{ color: '#49516F' }}>{t('email')}:</Typography>
          <Typography>{stateStaffDetail?.email}</Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent={'space-between'}
          sx={{
            padding: '0px 10px 15px',
          }}
        >
          <Typography sx={{ color: '#49516F' }}>{t('phone')}:</Typography>
          <Typography>
            {formatPhoneNumber(stateStaffDetail?.phone_number as string)}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent={'space-between'}
          sx={{
            padding: '0px 10px 15px',
          }}
        >
          <Typography sx={{ color: '#49516F' }}>{t('dob')}:</Typography>
          <Typography>
            {moment(stateStaffDetail?.dob).format('MM/DD/YYYY')}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent={'space-between'}
          sx={{
            padding: '0px 10px 15px',
          }}
        >
          <Typography sx={{ color: '#49516F' }}>
            {t('accountStatus')}:
          </Typography>
          <Typography sx={{ color: '#1DB46A', fontWeight: 600 }}>
            {stateStaffDetail?.status}
          </Typography>
        </Stack>
      </Box>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent={'space-between'}
        sx={{
          margin: '15px 0',
          padding: '15px',
          backgroundColor: '#F8F9FC',
          borderRadius: '5px',
        }}
      >
        <Typography sx={{ color: '#49516F' }}>{t('commission')}</Typography>
        <Typography sx={{ color: '#1DB46A', fontWeight: 500 }}>
          {stateStaffDetail?.commission?.toFixed(2)}%
        </Typography>
      </Stack>

      <Box
        sx={{
          margin: '15px 0',
          padding: '15px',
          borderRadius: '5px',
          border: '1px solid #E1E6EF',
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent={'space-between'}
          onClick={() => setOpenModalIncome(true)}
          sx={{
            cursor: 'pointer',
          }}
        >
          <Typography sx={{ color: '#0A0D14', fontSize: '16px' }}>
            {t('workship')}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{ color: '#1DB46A', fontWeight: 500 }}>
              {t('edit')}
            </Typography>
            <PencilLine size={16} color="#1DB46A" />
          </Stack>
        </Stack>

        <Divider sx={{ margin: '15px 0' }} />

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent={'space-between'}
        >
          <Typography sx={{ color: '#49516F', fontSize: '16px' }}>
            {t('incomeType')}
          </Typography>
          <Typography sx={{ color: '#0A0D14', fontWeight: 500 }}>
            {stateStaffDetail?.income?.type &&
              [
                {
                  value: 'MONTHLY_SALARY',
                  name: t('monthlySalary'),
                },
                {
                  value: 'HOURLY_SALARY',
                  name: t('hourlySalary'),
                },
              ].filter(
                (item) => item.value === stateStaffDetail?.income?.type
              )[0].name}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent={'space-between'}
        >
          <Typography sx={{ color: '#49516F', fontSize: '16px' }}>
            {t('payRate')}
          </Typography>
          <Typography sx={{ color: '#0A0D14', fontWeight: 500 }}>
            ${stateStaffDetail?.income?.pay_rate?.toFixed(2)}
          </Typography>
        </Stack>
      </Box>

      <Box
        sx={{
          margin: '15px 0',
          padding: '15px',
          borderRadius: '5px',
          border: '1px solid #E1E6EF',
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent={'space-between'}
        >
          <Typography sx={{ color: '#0A0D14', fontSize: '16px' }}>
            {t('workship')}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              cursor: 'pointer',
            }}
            onClick={() => setStateDrawerWorkShift(true)}
          >
            <Typography sx={{ color: '#1DB46A', fontWeight: 500 }}>
              {t('manage')}
            </Typography>
            <PencilLine size={16} color="#1DB46A" />
          </Stack>
        </Stack>

        <Divider sx={{ margin: '15px 0' }} />
        {workShift?.map((item) => {
          return (
            <Stack
              key={item.id}
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent={'space-between'}
              sx={{ marginBottom: '10px' }}
            >
              <Typography sx={{ color: '#49516F', fontSize: '16px' }}>
                {t(`${item.day_of_week}` as any)}s
              </Typography>
              <Typography sx={{ color: '#0A0D14' }}>
                {!item.enable
                  ? t('off')
                  : `${moment(item.from_time, 'hh:mm A').format(
                      'hh:mm A'
                    )} - ${moment(item.to_time, 'hh:mm A').format('hh:mm A')}`}
              </Typography>
            </Stack>
          )
        })}
      </Box>

      <Drawer
        anchor={'right'}
        open={stateDrawerWorkShift}
        onClose={() => {
          setStateDrawerWorkShift(false)
        }}
        disableEnforceFocus
      >
        <Box sx={{ padding: '30px', width: '700px' }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
            sx={{
              marginBottom: '10px',
            }}
          >
            <Typography
              sx={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: '#49516F',
              }}
            >
              {t('workship')}
            </Typography>
            <IconButton onClick={() => setStateDrawerWorkShift(false)}>
              <ArrowRight size={24} />
            </IconButton>
          </Stack>
          <WorkShift
            workShift={workShift}
            stateSellerId={props.stateSellerId}
            setFlagUpdateDetail={setFlagUpdateDetail}
          />
        </Box>
      </Drawer>

      <Modal open={openModalIncome} onClose={handleCloseModalIncome}>
        <BoxModalCustom>
          <Box
            sx={{
              position: 'absolute',
              top: '0',
              right: '0',
              padding: '10px',
            }}
          >
            <IconButton onClick={handleCloseModalIncome}>
              <X size={24} />
            </IconButton>
          </Box>
          <TypographyH2
            sx={{ fontSize: '2.4rem', marginBottom: '24px' }}
            alignSelf="center"
          >
            {t('updateIncome')}
          </TypographyH2>

          <form onSubmit={handleSubmit(onUpdateIncome)}>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <>
                  <InputLabelCustom
                    htmlFor="type"
                    sx={{ marginBottom: '10px' }}
                    error={!!errors.type}
                  >
                    {t('incomeType')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <SelectCustom
                      displayEmpty
                      IconComponent={() => <KeyboardArrowDownIcon />}
                      renderValue={(value: any) => {
                        if (!value) {
                          return (
                            <PlaceholderSelect>
                              <div>{t('selectValue')}</div>
                            </PlaceholderSelect>
                          )
                        }
                        return [
                          {
                            value: 'MONTHLY_SALARY',
                            name: t('monthlySalary'),
                          },
                          {
                            value: 'HOURLY_SALARY',
                            name: t('hourlySalary'),
                          },
                        ].filter((item) => item.value === value)[0].name
                      }}
                      {...field}
                      {...register('type')}
                      onChange={(event: any) => {
                        setValue('type', event.target.value)
                      }}
                    >
                      <MenuItem value={'MONTHLY_SALARY'}>
                        {t('monthlySalary')}
                      </MenuItem>
                      <MenuItem value={'HOURLY_SALARY'}>
                        {t('hourlySalary')}
                      </MenuItem>
                    </SelectCustom>
                  </FormControl>
                </>
              )}
            />
            <Controller
              control={control}
              name="pay_rate"
              render={({ field }) => (
                <>
                  <InputLabelCustom
                    htmlFor="pay_rate"
                    sx={{ marginBottom: '10px' }}
                    error={!!errors.pay_rate}
                  >
                    {t('payRate')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <CurrencyNumberFormat
                      defaultPrice={field.value}
                      propValue={(value) => {
                        setValue('pay_rate', Number(value))
                        trigger('pay_rate')
                      }}
                      error={!!errors.pay_rate}
                    />
                  </FormControl>
                  <FormHelperText error={!!errors.pay_rate}>
                    {errors.pay_rate && `${errors.pay_rate.message}`}
                  </FormHelperText>
                </>
              )}
            />

            <Stack
              spacing={2}
              sx={{
                marginTop: '10px',
              }}
            >
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <ButtonCancel
                  onClick={() => setOpenModalIncome(false)}
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
        </BoxModalCustom>
      </Modal>
    </>
  )
}

export default DetailUser
