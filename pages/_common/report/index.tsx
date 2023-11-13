import React from 'react'
import { Box, Tab, Divider, Button } from '@mui/material'
import { TabPanel, TabList, TabContext } from '@mui/lab'
import { styled } from '@mui/material/styles'
import Dashboard from './dashboard'
import { useRouter } from 'next/router'
import { objToStringParam, platform } from 'src/utils/global.utils'
import SettlementReport from './settlementReport'
import dayjs from 'dayjs'
import SellersReport from './sellersReport'
import SalesByEmployeeClient from './salesByEmployeeClient'
import InventoryReport from './inventoryReport'
import { useTranslation } from 'next-i18next'
const TabTws = styled(Tab)({
  padding: '0px',
  border: 'none',
  // background: 'red',
  '& .MuiButtonBase-root': {
    textTransform: 'none',
  },
  '&:not(.Mui-selected)': {
    '& .MuiButtonBase-root': {
      color: '#3F444D',
      border: '1px solid #ffffff',
      background: '#ffffff',
      '&:hover': {
        border: '1px solid #3F444D',
      },
    },
  },
})

const TabListTws = styled(TabList)({
  marginBottom: '20px',
  '& .MuiTabs-indicator': {
    display: 'none',
  },
})
const TabPanelTws = styled(TabPanel)({
  padding: '0px',
})

const ReportComponent = () => {
  const router = useRouter()
  const { t } = useTranslation('report')
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    console.log('event', event)
    router.replace({
      search: `${objToStringParam({
        tab: newValue,
        ...(newValue === 'settlementReport' && {
          type: 'ALL',
        }),
        ...(newValue !== 'dashboard' && {
          time: 'day',
          fromDate: dayjs().startOf('day').format('YYYY-MM-DD'),
          toDate: dayjs().endOf('day').format('YYYY-MM-DD'),
        }),
        ...(platform() == 'RETAILER' &&
          newValue === 'dashboard' && {
            type: 'ALL',
          }),
      })}`,
    })
  }

  return (
    <Box
      sx={{
        background: '#F8F9FC',
        margin: '-24px',
        padding: '24px',
        // height: '100%',
      }}
    >
      <TabContext
        value={router?.query?.tab ? `${router?.query?.tab}` : 'dashboard'}
      >
        <TabListTws onChange={handleChange}>
          {/* <TabTws
            disableRipple
            label={
              <Button size="large" variant="outlined">
                {t('dashboard.title')}
              </Button>
            }
            value="dashboard"
          /> */}
          {/* <Divider
            orientation="vertical"
            flexItem
            sx={{ margin: '15px 10px' }}
          /> */}
          <TabTws
            label={
              <Button size="large" variant="outlined">
                {t('settlementReport.title')}
              </Button>
            }
            value="settlementReport"
          />
          <Divider
            orientation="vertical"
            flexItem
            sx={{ margin: '15px 10px' }}
          />
          {platform() === 'RETAILER' && (
            <TabTws
              label={
                <Button size="large" variant="outlined">
                  {t('salesByEmployee.title')}
                </Button>
              }
              value="salesByEmployee"
            />
          )}
          {platform() === 'RETAILER' && (
            <Divider
              orientation="vertical"
              flexItem
              sx={{ margin: '15px 10px' }}
            />
          )}
          {platform() === 'RETAILER' && (
            <TabTws
              label={
                <Button size="large" variant="outlined">
                  {t('salesByCustomers.title')}
                </Button>
              }
              value="salesByClients"
            />
          )}
          {platform() === 'RETAILER' && (
            <Divider
              orientation="vertical"
              flexItem
              sx={{ margin: '15px 10px' }}
            />
          )}
          <TabTws
            label={
              <Button size="large" variant="outlined">
                {t('fieldSales.title')}
              </Button>
            }
            value="sellerReport"
          />
          <Divider
            orientation="vertical"
            flexItem
            sx={{ margin: '15px 10px' }}
          />
          <TabTws
            label={
              <Button size="large" variant="outlined">
                {t('inventoryReport.title')}
              </Button>
            }
            value="inventoryReport"
          />
        </TabListTws>
        <TabPanelTws value="dashboard">
          <Dashboard />
        </TabPanelTws>
        <TabPanelTws value="settlementReport">
          <SettlementReport />
        </TabPanelTws>
        {platform() === 'RETAILER' && (
          <>
            <TabPanelTws value="salesByEmployee">
              <SalesByEmployeeClient />
            </TabPanelTws>
            <TabPanelTws value="salesByClients">
              <SalesByEmployeeClient />
            </TabPanelTws>
          </>
        )}
        <TabPanelTws value="sellerReport">
          <SellersReport />
        </TabPanelTws>
        <TabPanelTws value="inventoryReport">
          <InventoryReport />
        </TabPanelTws>
      </TabContext>
    </Box>
  )
}

export default ReportComponent
