import { TabContext, TabPanel } from '@mui/lab'
import { Box } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { TabCustom, TabsTws, TypographyTitlePage } from 'src/components'
import { objToStringParam } from 'src/utils/global.utils'
import CarrierShippingComponent from './part/shipping-carrier'
import ShippingAddressComponent from './part/shipping-address'
import ShippingPriceComponent from './part/shipping-price'
import { useTranslation } from 'react-i18next'

const ShippingConfigurationComponent = () => {
  const { t } = useTranslation('shipping')

  const router = useRouter()
  const [stateValueTab, setStateValueTab] = useState('')
  const handleChangeTab = (event: React.SyntheticEvent, value: string) => {
    console.log(event)
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          tab: value,
        })}`,
      },
      undefined,
      { scroll: false }
    )

    setStateValueTab(value)
  }
  useEffect(() => {
    if (router.query.tab) {
      setStateValueTab(router.query.tab.toString())
      return
    }
    setStateValueTab('shipping-carrier')
  }, [router.query.tab])
  return (
    <Box>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage>{t('title')}</TypographyTitlePage>
      <TabContext value={stateValueTab}>
        <TabsTws
          value={stateValueTab}
          onChange={handleChangeTab}
          TabIndicatorProps={{
            children: <span className="MuiTabs-indicatorSpan" />,
          }}
        >
          <TabCustom
            label={t('shippingCarrierConfiguration')}
            value="shipping-carrier"
          />
          <TabCustom
            label={t('shippingFeeConfiguration')}
            value="shipping-fee"
          />
          <TabCustom
            label={t('shippingAddressConfiguration')}
            value="shipping-address"
          />
        </TabsTws>
        <TabPanel value="shipping-carrier">
          <CarrierShippingComponent />
        </TabPanel>

        <TabPanel value="shipping-fee">
          <ShippingPriceComponent />
        </TabPanel>

        <TabPanel value="shipping-address">
          <ShippingAddressComponent />
        </TabPanel>
      </TabContext>
    </Box>
  )
}

export default ShippingConfigurationComponent
