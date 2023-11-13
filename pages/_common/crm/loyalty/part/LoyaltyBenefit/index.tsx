import { Box, Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { getTieredBenefit } from './loyaltyBenefitAPI'
import { TieredBenefitType } from './loyaltyBenefitModel'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { handlerGetErrMessage, objToStringParam } from 'src/utils/global.utils'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { TabContext, TabPanel } from '@mui/lab'
import { useRouter } from 'next/router'
import { TabCustom, TabsTws } from 'src/components'
import BenefitOfRankComponent from './part/BenefitOfRank'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'

const LoyaltyBenefitComponent = () => {
  const { t } = useTranslation('loyalty')
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [pushMessgage] = useEnqueueSnackbar()
  const [stateLoyaltyBenefit, setStateLoyaltyBenefit] = useState<
    TieredBenefitType[]
  >([])
  const [stateValueRank, setStateValueRank] = useState('Bronze')

  useEffect(() => {
    router.replace(
      {
        search: `${objToStringParam({
          tab: 'tiered-benefit',
          subtab: stateValueRank,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }, [])

  const handleGetLoyaltyBenefit = () => {
    dispatch(loadingActions.doLoading())
    getTieredBenefit()
      .then((res) => {
        const { data } = res.data
        setStateLoyaltyBenefit(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessgage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: string) => {
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          subtab: newValue,
        })}`,
      },
      undefined,
      { scroll: false }
    )
    console.log('newValue', newValue)
    setStateValueRank(newValue)
  }

  useEffect(() => {
    handleGetLoyaltyBenefit()
  }, [])

  const renderTabCustom = useCallback((name: string) => {
    switch (name) {
      case 'Bronze':
        return (
          <Stack>
            <Box>
              <Image
                width={50}
                height={50}
                alt="image"
                src={'/' + '/images/bronze_benefit.png'}
              />
            </Box>

            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#FF7447',
              }}
            >
              {t(`${name.toLocaleUpperCase()}` as any)}
            </Typography>
          </Stack>
        )
      case 'Silver':
        return (
          <Stack>
            <Box>
              <Image
                width={50}
                height={50}
                alt="image"
                src={'/' + '/images/silver_benefit.png'}
              />
            </Box>

            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#BABABA',
              }}
            >
              {t(`${name.toLocaleUpperCase()}` as any)}
            </Typography>
          </Stack>
        )
      case 'Gold':
        return (
          <Stack>
            <Box>
              <Image
                width={50}
                height={50}
                alt="image"
                src={'/' + '/images/gold_benefit.png'}
              />
            </Box>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#FFDF6D',
              }}
            >
              {t(`${name.toLocaleUpperCase()}` as any)}
            </Typography>
          </Stack>
        )
      case 'Platinum':
        return (
          <Stack>
            <Box>
              <Image
                width={50}
                height={50}
                alt="image"
                src={'/' + '/images/platinum_benefit.png'}
              />
            </Box>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#75797C',
              }}
            >
              {t(`${name.toLocaleUpperCase()}` as any)}
            </Typography>
          </Stack>
        )
      case 'Diamond':
        return (
          <Stack>
            <Box>
              <Image
                width={50}
                height={50}
                alt="image"
                src={'/' + '/images/diamond_benefit.png'}
              />
            </Box>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#A2DEFF',
              }}
            >
              {t(`${name.toLocaleUpperCase()}` as any)}
            </Typography>
          </Stack>
        )
      default:
        return
    }
  }, [])

  return (
    <Box>
      <TabContext value={stateValueRank}>
        <TabsTws
          value={stateValueRank}
          onChange={handleChangeTab}
          TabIndicatorProps={{
            children: <span className="MuiTabs-indicatorSpan" />,
          }}
          sx={{ marginBottom: '15px' }}
        >
          {stateLoyaltyBenefit.map((item, index) => {
            return (
              <TabCustom
                key={index}
                // label={`${item.rank.name.toLocaleUpperCase()}`}
                label={renderTabCustom(item.rank.name)}
                // label={t(`${item.rank.name.toLocaleUpperCase()}` as any)}
                value={item.rank.name}
              />
            )
          })}
        </TabsTws>
        {stateLoyaltyBenefit.map((item, index) => {
          return (
            <TabPanel key={index} value={item.rank.name} sx={{ padding: 0 }}>
              <BenefitOfRankComponent
                benefitData={item}
                handleGetListBenefitOfRank={() => handleGetLoyaltyBenefit()}
              />
            </TabPanel>
          )
        })}
      </TabContext>
    </Box>
  )
}

export default LoyaltyBenefitComponent
