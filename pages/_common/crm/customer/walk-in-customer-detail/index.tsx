import { Box, Tab } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { TypographyTitlePage } from 'src/components'

import { TabContext, TabList, TabPanel } from '@mui/lab'
import { objToStringParam } from 'src/utils/global.utils'
import PersonalProfile from './part/personal-profile'
import DiscountRules from './part/rules'
import { useTranslation } from 'next-i18next'

const CustomerDetail = () => {
  const { t } = useTranslation('customer')
  const router = useRouter()
  const [stateTabValue, setStateTabValue] = useState('personal-profile')

  const handleChangeTab = (event: React.SyntheticEvent, value: string) => {
    console.log('event', event)
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

    setStateTabValue(value)
  }
  useEffect(() => {
    if (router.query.tab) {
      setStateTabValue(router.query.tab.toString())
    }
  }, [router.query.tab])
  return (
    <Box>
      <TypographyTitlePage>{t('details.personalProfile')}</TypographyTitlePage>
      <TabContext value={stateTabValue}>
        <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
          <Tab label={t('details.personalProfile')} value="personal-profile" />
          <Tab label={t('details.discountRule')} value="discount-rule" />
        </TabList>
        <TabPanel value="personal-profile">
          <PersonalProfile />
        </TabPanel>
        <TabPanel value="discount-rule">
          <DiscountRules />
        </TabPanel>
      </TabContext>
    </Box>
  )
}

export default CustomerDetail
