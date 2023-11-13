import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import { Card, styled } from '@mui/material'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { TabCustom, TabsTws } from 'src/components'
import { objToStringParam } from 'src/utils/global.utils'
import NotificationAll from './notificationAll'
import NotificationRead from './notificationRead'
import NotificationUnread from './notificationUnread'
import { useTranslation } from 'next-i18next'
const CardCustom = styled(Card)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light' ? '#FFF' : theme.palette.action.hover,
  boxShadow: 'none',
  height: '100%',
}))

const NotificationHistoryComponent: React.FC = () => {
  const { t } = useTranslation('notification-history')
  const [valueTab, setValueTab] = useState<string>('all')

  const router = useRouter()

  const handleChangeTab = (_event: React.SyntheticEvent, value: string) => {
    setValueTab(value)
    router.replace({
      search: `${objToStringParam({
        tab: value,
      })}`,
    })
  }
  useEffect(() => {
    setValueTab('all')
    router.replace({
      search: `${objToStringParam({
        tab: 'all',
      })}`,
    })
  }, [])
  return (
    <CardCustom variant="outlined">
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TabContext value={valueTab}>
        <TabsTws value={valueTab} onChange={handleChangeTab} defaultValue="all">
          <TabCustom label={t('all')} value="all" />
          <TabCustom label={t('read')} value="read" />
          <TabCustom label={t('unRead')} value="unread" />
        </TabsTws>
        <TabPanel
          value="all"
          sx={{ padding: 0, height: 'calc(100vh - 238px)' }}
        >
          <NotificationAll />
        </TabPanel>
        <TabPanel
          value="read"
          sx={{ padding: 0, height: 'calc(100vh - 238px)' }}
        >
          <NotificationRead />
        </TabPanel>
        <TabPanel
          value="unread"
          sx={{ padding: 0, height: 'calc(100vh - 238px)' }}
        >
          <NotificationUnread />
        </TabPanel>
      </TabContext>
    </CardCustom>
  )
}

export default NotificationHistoryComponent
