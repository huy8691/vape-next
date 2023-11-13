import { TabContext, TabPanel } from '@mui/lab'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { TabCustom, TabsTws } from 'src/components'
import { objToStringParam } from 'src/utils/global.utils'
import AgingDetailReportComponent from './part/agingDetailReport'
import AgingSummaryReportComponent from './part/agingSummaryReport'
import AgingTransactionComponent from './part/agingTransaction'
import { useTranslation } from 'react-i18next'

const AccountPayableAndAccountReceivableComponent: React.FC = () => {
  const { t } = useTranslation(['account'])
  const [stateValueTab, setStateValueTab] = useState('aging_detail_report')
  const router = useRouter()
  // Handle change tab log type
  const handleChangeTab = (event: React.SyntheticEvent, value: string) => {
    console.log('🚀 ~  event:', event, value)
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          page: 1,
          limit: 10,
          log_type__name: value,
        })}`,
      },
      undefined,
      { scroll: false }
    )

    setStateValueTab(value)
  }
  return (
    <>
      <TabContext value={stateValueTab}>
        <TabsTws
          value={stateValueTab}
          defaultValue="aging_detail_report"
          onChange={handleChangeTab}
          TabIndicatorProps={{
            children: <span className="MuiTabs-indicatorSpan" />,
          }}
        >
          <TabCustom
            label={t('agingDetailReport')}
            value="aging_detail_report"
            sx={{ pl: 0 }}
          />
          <TabCustom
            label={t('agingSummaryReport')}
            value="aging_summary_report"
          />
          <TabCustom
            label={t('transactionReport')}
            value="aging_transaction_report"
          />
        </TabsTws>
        <TabPanel value="aging_detail_report" sx={{ p: 0 }}>
          <AgingDetailReportComponent />
        </TabPanel>
        <TabPanel value="aging_summary_report" sx={{ p: 0 }}>
          <AgingSummaryReportComponent />
        </TabPanel>
        <TabPanel value="aging_transaction_report" sx={{ p: 0 }}>
          <AgingTransactionComponent />
        </TabPanel>
      </TabContext>
    </>
  )
}

export default AccountPayableAndAccountReceivableComponent
