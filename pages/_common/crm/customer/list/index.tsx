import { Box, Tab, Tabs } from '@mui/material'
import { useRouter } from 'next/router'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import React, { useEffect, useState } from 'react'
import { styled } from '@mui/system'
import { objToStringParam, platform } from 'src/utils/global.utils'
import WalkinCustomerComponent from './part/walk-in-customer'
import OnlineCustomerComponent from './part/online-customer'
import { useTranslation } from 'next-i18next'

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

const TabCustom = styled(Tab)(() => ({
  fontSize: '1.4rem',
  fontWeight: '400',
  lineHeight: '2rem',
  textTransform: 'capitalize',
  color: '#1B1F27',
}))
// const arrayValueTab = ['walkin-customer', 'online-customer']
const ListCustomer = () => {
  const { t } = useTranslation('customer')
  const router = useRouter()
  const [stateValueTab, setStateValueTab] = useState<string>(
    platform() === 'SUPPLIER' ? 'online-customer' : 'walk-in-customer'
  )
  const handleChangeTab = (_event: React.SyntheticEvent, newValue: string) => {
    router.replace(
      {
        search: `${objToStringParam({
          tab: newValue,
        })}`,
      },
      undefined,
      { scroll: false }
    )
    console.log('newValue', newValue)
    setStateValueTab(newValue)
  }
  useEffect(() => {
    if (router.query.tab) {
      setStateValueTab(router.query.tab.toString())
    }
  }, [router.query.tab])
  return (
    <Box>
      <TabContext value={stateValueTab}>
        <TabsTws
          value={stateValueTab}
          onChange={handleChangeTab}
          TabIndicatorProps={{
            children: <span className="MuiTabs-indicatorSpan" />,
          }}
          sx={{ marginBottom: '15px' }}
        >
          <TabCustom label={t('walkInCustomer')} value="walk-in-customer" />
          <TabCustom label={t('onlineCustomer')} value="online-customer" />
        </TabsTws>
        <TabPanel value="walk-in-customer">
          <WalkinCustomerComponent />
        </TabPanel>

        <TabPanel value="online-customer">
          <OnlineCustomerComponent />
        </TabPanel>
      </TabContext>
    </Box>
  )
}

export default ListCustomer
