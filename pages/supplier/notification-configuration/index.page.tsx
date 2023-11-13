import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  styled,
} from '@mui/material'
import Head from 'next/head'
import { ReactElement, useEffect, useState } from 'react'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
import { getListNotificationConfiguration } from './apiNotificationConfig'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { NotificationTypeItem } from './modelNotificationConfig'
import { Clock } from '@phosphor-icons/react'
import ConfigurationNotification from './configuration'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const GridProduct = styled(Grid)(() => ({
  ['@media (min-width:1536px) and (max-width:1700px)']: {
    flexBasis: '20%',
    maxWidth: '20%',
  },
}))

const CardCustom = styled(Card)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light' ? '#F8F9FC' : theme.palette.action.hover,
  boxShadow: 'none',
  height: '100%',
}))

const NotificationConfiguration = () => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const [itemNotification, setItemNotification] =
    useState<NotificationTypeItem>()
  const [stateNotification, setStateNotification] = useState<
    NotificationTypeItem[]
  >([])
  const [flagRefresh, setFlagRefresh] = useState('')
  const [pushMessage] = useEnqueueSnackbar()

  useEffect(() => {
    if (!openDrawer) {
      setItemNotification(undefined)
    }
  }, [openDrawer])

  useEffect(() => {
    getListNotificationConfiguration()
      .then((res) => {
        const { data } = res.data
        setStateNotification(data || [])
      })
      .catch((error) => {
        const { status, data } = error.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [flagRefresh])

  return (
    <Box
      sx={{
        background: '#F8F9FC',
        margin: '-24px',
        padding: '24px',
      }}
    >
      <Head>
        <title>Notification Configuration | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2}>Configuration</TypographyTitlePage>
      <Typography
        style={{
          fontSize: '1.6rem',
          fontWeight: 500,
          color: '#252626',
        }}
      >
        1. Automated Messages
      </Typography>
      <Typography
        style={{
          fontSize: '1.4rem',
          fontWeight: 400,
          color: '#595959',
        }}
      >
        Automated messaging services are presently not accessible.
      </Typography>
      <Typography
        mt={2}
        style={{
          fontSize: '1.6rem',
          fontWeight: 500,
          color: '#252626',
        }}
      >
        2. Triggered Messages
      </Typography>
      <Typography
        style={{
          fontSize: '1.4rem',
          fontWeight: 400,
          color: '#595959',
        }}
      >
        These notification will be sent whenever a specific action is performed.
      </Typography>
      <Box
        sx={{
          background: '#F8F9FC',
          margin: '-24px',
          padding: '24px',
        }}
      >
        <Grid container spacing={2}>
          {stateNotification.map(
            (item: NotificationTypeItem, index: number) => {
              return (
                <GridProduct
                  item
                  lg={3}
                  xl={3}
                  key={index}
                  onClick={() => {
                    setOpenDrawer(true)
                    setItemNotification(item)
                  }}
                  role="button"
                >
                  <CardCustom variant="outlined">
                    <CardContent
                      style={{ paddingBottom: '16px', height: '100%' }}
                    >
                      <Stack
                        direction="column"
                        justifyContent="space-around"
                        style={{
                          height: '100%',
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: '1.6rem',
                              textTransform: 'capitalize',
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 400,
                              fontSize: '1.4rem',
                              color: '#9098B1',
                            }}
                          >
                            {item.description}
                          </Typography>
                        </Box>
                        <Box>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                              }}
                            >
                              <Clock size={24} color="#000" />
                              <Typography
                                sx={{
                                  fontWeight: 400,
                                  fontSize: '1.4rem',
                                  color: '#9098B1',
                                }}
                              >
                                Instantly
                              </Typography>
                            </Box>

                            <Typography
                              sx={{
                                borderRadius: 40,
                                backgroundColor: item.enable
                                  ? '#53D1B6'
                                  : '#BABABA',
                                padding: '5px 20px',
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: '1.6rem',
                              }}
                            >
                              {item.enable ? 'ENABLED' : 'DISABLED'}
                            </Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </CardContent>
                  </CardCustom>
                </GridProduct>
              )
            }
          )}
        </Grid>
      </Box>
      <ConfigurationNotification
        open={openDrawer}
        onClose={setOpenDrawer}
        item={itemNotification}
        setFlagRefresh={setFlagRefresh}
      />
    </Box>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'notification-configuration',
        'account',
      ])),
    },
  }
}

NotificationConfiguration.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export default NotificationConfiguration
