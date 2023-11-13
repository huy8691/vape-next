import { useState, useEffect } from 'react'

import { useRouter } from 'next/router'

//Api
import { getDetailDistributionChannel } from './apiMerchantDistribution'

//Modal
import { DetailMerchantChannelResponseType } from './modalMerchantDistribution'

//MUI
import { Grid, Tabs } from '@mui/material'
import TabPanel from '@mui/lab/TabPanel'

//Src and styled

import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  checkPermission,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
} from 'src/utils/global.utils'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { TabCustom } from 'src/components'
import {
  GridCustom1,
  TypographyCustom1,
  TypographyCustom2,
  TypographyHeadTable,
} from './styled'

import { styled } from '@mui/system'
import { TabContext } from '@mui/lab'
import ListProductComponent from './product-list'
import ListMerchantHasBelongToDC from './merchant-list/index'
import DiscountComponent from './part/discount-rule'
import { useTranslation } from 'react-i18next'

const TabsTws = styled(Tabs)(({ theme }) => ({
  color: '#1B1F27',
  marginBottom: theme.spacing(1),
  '& .Mui-selected': {
    textTransform: 'capitalize',
    fontWeight: '700',
    fontSize: '1.6rem',
  },
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: '3.5px',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 27.7,
    width: '100%',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '10px',
  },
}))

const DetailMerchantDistributionChannelComponent = () => {
  const { t } = useTranslation('dc')
  const arrayPermission = useAppSelector((state) => state.permission.data)
  const [pushMessage] = useEnqueueSnackbar()

  const [detailDistributionChannel, setDetailDistributionChannel] =
    useState<DetailMerchantChannelResponseType>()
  // state use for

  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleGetDetailDistributionChannel = (id: string | string[]) => {
    dispatch(loadingActions.doLoading())
    getDetailDistributionChannel(id)
      .then((res) => {
        const data = res.data
        setDetailDistributionChannel(data)
        dispatch(loadingActions.doLoadingSuccess())
      })

      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        if (status === 404) {
          router.push('/404')
        }
      })
  }

  useEffect(() => {
    if (router.query.id) {
      handleGetDetailDistributionChannel(router.query.id)
    }
  }, [dispatch, router.query])

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: string) => {
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          tab: newValue,
          page: 1,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }

  return (
    <>
      <TypographyHeadTable sx={{ margin: '34px 0 15px 0' }}>
        {t('dcInformation')}
      </TypographyHeadTable>
      <GridCustom1
        item
        container
        xs={6}
        sx={{
          borderRadius: '10px',
          padding: '15px',
          gap: '10px',
          marginBottom: '15px',
        }}
      >
        <Grid container>
          <Grid item xs={4}>
            <TypographyCustom2 sx={{ fontWeight: '400' }}>
              {t('channelName')}
            </TypographyCustom2>
          </Grid>
          <Grid item xs={8}>
            <TypographyCustom1 sx={{ fontWeight: '500', textAlign: 'right' }}>
              {detailDistributionChannel?.data?.name}
            </TypographyCustom1>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={4}>
            <TypographyCustom2 sx={{ fontWeight: '400' }}>
              {t('channelCode')}
            </TypographyCustom2>
          </Grid>
          <Grid item xs={8}>
            <TypographyCustom1 sx={{ fontWeight: '500', textAlign: 'right' }}>
              #{detailDistributionChannel?.data?.code}
            </TypographyCustom1>
          </Grid>
        </Grid>
      </GridCustom1>

      <TabContext
        value={router.query.tab ? `${router.query.tab}` : 'Retailers'}
      >
        <TabsTws
          onChange={handleChangeTab}
          value={router.query.tab ? router.query.tab : 'Retailers'}
          TabIndicatorProps={{
            children: <span className="MuiTabs-indicatorSpan" />,
          }}
          sx={{ marginBottom: '15px' }}
        >
          {checkPermission(
            arrayPermission,
            KEY_MODULE.DistributionChannel,
            PERMISSION_RULE.ViewListMerchantInDC
          ) && <TabCustom label={t('retailers')} value="Retailers" />}
          {checkPermission(
            arrayPermission,
            KEY_MODULE.DistributionChannel,
            PERMISSION_RULE.ViewListProductInDC
          ) && <TabCustom label={t('products')} value="Products" />}
          <TabCustom label={t('discountRules')} value="Discount" />
        </TabsTws>
        {checkPermission(
          arrayPermission,
          KEY_MODULE.DistributionChannel,
          PERMISSION_RULE.ViewListMerchantInDC
        ) && (
          <TabPanel value="Retailers">
            <ListMerchantHasBelongToDC />
          </TabPanel>
        )}
        {checkPermission(
          arrayPermission,
          KEY_MODULE.DistributionChannel,
          PERMISSION_RULE.ViewListProductInDC
        ) && (
          <TabPanel value="Products">
            <ListProductComponent />
          </TabPanel>
        )}
        <TabPanel value="Discount">
          <DiscountComponent />
        </TabPanel>
      </TabContext>
    </>
  )
}

export default DetailMerchantDistributionChannelComponent
