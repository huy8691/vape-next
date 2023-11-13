import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  FormHelperText,
  InputAdornment,
  Stack,
  Typography,
  styled,
} from '@mui/material'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ButtonCustom, TextFieldCustom } from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import {
  getRankingConfigOfOrganization,
  updateLoyaltyLevel,
} from './loyaltyAPI'
import { LoyaltyLevelValidateType, SubmitValueType } from './loyaltyLevelModel'
import { validationSchema } from './validation'
import Image from 'next/image'

const DividerCustom = styled('div')(() => ({
  backgroundColor: '#E1E6EF',
  height: '15px',
  width: '2px',
  margin: '0 10px',
}))
import { useTranslation } from 'next-i18next'

const LoyaltyLevelCompany = () => {
  const { t } = useTranslation('loyalty')
  const dispatch = useAppDispatch()

  const [pushMessgage] = useEnqueueSnackbar()
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<LoyaltyLevelValidateType>({
    resolver: yupResolver(validationSchema),
    mode: 'all',
  })
  const handleGetRankingConfigOfOrg = () => {
    getRankingConfigOfOrganization()
      .then((res) => {
        const { data } = res.data

        setValue('bronze_point', data[0].points_to_reach)
        setValue('silver_point', data[1].points_to_reach)
        setValue('gold_point', data[2].points_to_reach)
        setValue('platinum_point', data[3].points_to_reach)
        setValue('diamond_point', data[4].points_to_reach)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessgage(handlerGetErrMessage(status, data), 'error')
      })
  }
  useEffect(() => {
    handleGetRankingConfigOfOrg()
  }, [])
  const handleSubmitLoyaltyLevel = (value: LoyaltyLevelValidateType) => {
    console.log('value suvbmit', value)

    // const arrayOfRanking: SubmitLoyaltyLevelValidateType[] = []
    // for (const [index, [key, obj]] of Object.entries(Object.entries(value))) {
    //   console.log(`${index}-${obj}`)
    //   const pushedValue: SubmitLoyaltyLevelValidateType = {
    //     rank: Number(index) + 1,
    //     point_to_reach: obj,
    //   }
    //   arrayOfRanking.push(pushedValue)
    //   console.log('key', key)
    // }
    const submitValue: SubmitValueType = {
      items: [
        {
          rank: 1,
          point_to_reach: value.bronze_point,
        },
        { rank: 2, point_to_reach: value.silver_point },
        { rank: 3, point_to_reach: value.gold_point },
        { rank: 4, point_to_reach: value.platinum_point },
        { rank: 5, point_to_reach: value.diamond_point },
      ],
    }

    updateLoyaltyLevel(submitValue)
      .then(() => {
        handleGetRankingConfigOfOrg()
        dispatch(loadingActions.doLoadingSuccess())
        pushMessgage(t('message.configLoyaltyLevelSuccessfully'), 'success')
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessgage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <Box>
      <form onSubmit={handleSubmit(handleSubmitLoyaltyLevel)}>
        <Stack spacing={1} sx={{ maxWidth: '450px', marginBottom: '20px' }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Image
                width={50}
                height={50}
                alt="image"
                src={'/' + '/images/bronze_level.png'}
              />
              <Typography>{t('bronze')}</Typography>
            </Stack>
            <Box>
              <Controller
                control={control}
                name="bronze_point"
                render={({ field }) => (
                  <>
                    <TextFieldCustom
                      error={!!errors.bronze_point}
                      sx={{
                        '& .MuiInputBase-input': {
                          textAlign: 'right',
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            Point to reach <DividerCustom />
                          </InputAdornment>
                        ),
                      }}
                      {...field}
                    />
                    <FormHelperText error={!!errors.bronze_point}>
                      {errors.bronze_point && `${errors.bronze_point.message}`}
                    </FormHelperText>
                  </>
                )}
              />
            </Box>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Image
                width={50}
                height={50}
                alt="image"
                src={'/' + '/images/silver_level.png'}
              />
              <Typography>{t('silver')}</Typography>
            </Stack>
            <Box>
              <Controller
                control={control}
                name="silver_point"
                render={({ field }) => (
                  <>
                    <TextFieldCustom
                      error={!!errors.silver_point}
                      sx={{
                        '& .MuiInputBase-input': {
                          textAlign: 'right',
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            Point to reach <DividerCustom />
                          </InputAdornment>
                        ),
                      }}
                      {...field}
                    />
                    <FormHelperText error={!!errors.silver_point}>
                      {errors.silver_point && `${errors.silver_point.message}`}
                    </FormHelperText>
                  </>
                )}
              />
            </Box>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Image
                width={50}
                height={50}
                alt="image"
                src={'/' + '/images/gold_level.png'}
              />
              <Typography>{t('gold')}</Typography>
            </Stack>
            <Box>
              <Controller
                control={control}
                name="gold_point"
                render={({ field }) => (
                  <>
                    <TextFieldCustom
                      error={!!errors.gold_point}
                      sx={{
                        '& .MuiInputBase-input': {
                          textAlign: 'right',
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            Point to reach <DividerCustom />
                          </InputAdornment>
                        ),
                      }}
                      {...field}
                    />
                    <FormHelperText error={!!errors.gold_point}>
                      {errors.gold_point && `${errors.gold_point.message}`}
                    </FormHelperText>
                  </>
                )}
              />
            </Box>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Image
                width={50}
                height={50}
                alt="image"
                src={'/' + '/images/platinum_level.png'}
              />
              <Typography>{t('platinum')}</Typography>
            </Stack>
            <Box>
              <Controller
                control={control}
                name="platinum_point"
                render={({ field }) => (
                  <>
                    <TextFieldCustom
                      sx={{
                        '& .MuiInputBase-input': {
                          textAlign: 'right',
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            Point to reach <DividerCustom />
                          </InputAdornment>
                        ),
                      }}
                      error={!!errors.platinum_point}
                      {...field}
                    />
                    <FormHelperText error={!!errors.platinum_point}>
                      {errors.platinum_point &&
                        `${errors.platinum_point.message}`}
                    </FormHelperText>
                  </>
                )}
              />
            </Box>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Image
                width={50}
                height={50}
                alt="image"
                src={'/' + '/images/diamond_level.png'}
              />
              <Typography>{t('diamond')}</Typography>
            </Stack>
            <Box>
              <Controller
                control={control}
                name="diamond_point"
                render={({ field }) => (
                  <>
                    <TextFieldCustom
                      sx={{
                        '& .MuiInputBase-input': {
                          textAlign: 'right',
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            Point to reach <DividerCustom />
                          </InputAdornment>
                        ),
                      }}
                      error={!!errors.diamond_point}
                      {...field}
                    />
                    <FormHelperText error={!!errors.diamond_point}>
                      {errors.diamond_point &&
                        `${errors.diamond_point.message}`}
                    </FormHelperText>
                  </>
                )}
              />
            </Box>
          </Stack>
        </Stack>
        <ButtonCustom type="submit" variant="contained" size="large">
          {t('save')}
        </ButtonCustom>
      </form>
    </Box>
  )
}

export default LoyaltyLevelCompany
