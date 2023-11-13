import { Box, Divider, LinearProgress, Stack, Typography } from '@mui/material'
import moment from 'moment'
import { useEffect, useState } from 'react'
import {
  addToCart,
  doMarkAsReadNotifications,
  getListNotificationHistory,
} from '../apiNotificationHistory'
import { NotificationHistoryItem } from '../modelNotificationHistory'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Circle } from '@phosphor-icons/react'
import { useRouter } from 'next/router'
import { ButtonCustom } from 'src/components'
import Link from 'next/link'
import { useAppDispatch } from 'src/store/hooks'
import { notificationHistoryActions } from 'src/store/notificationHistory/notificationHistorySlice'
import { useTranslation } from 'next-i18next'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { cartActions } from 'src/store/cart/cartSlice'
import { platform } from 'src/utils/global.utils'
const NotificationUnread = () => {
  const [pushMessage] = useEnqueueSnackbar()
  const { i18n, t } = useTranslation('notification-history')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [listGroupNotification, setListGroupNotification] = useState<{
    [key: string]: NotificationHistoryItem[]
  }>({})
  const [listNotificationRoot, setListNotificationRoot] = useState<
    NotificationHistoryItem[]
  >([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(2)
  const [refresh, setRefresh] = useState('')

  useEffect(() => {
    if (router?.query?.tab === 'unread') {
      getListNotificationHistory('False', 1).then((res) => {
        const { data } = res.data
        if (data?.length === 0 || !res.data.nextPage) {
          setHasMore(false)
        }
        setListNotificationRoot(data)
        setListGroupNotification(groupNotificationsByDate(data))
      })
    }
  }, [router?.query?.tab, refresh])

  const groupNotificationsByDate = (
    notifications: NotificationHistoryItem[]
  ) => {
    const groupedNotifications: any = {}

    notifications.forEach((notification) => {
      const date = notification.payloadData?.utcDate
      const today = moment().format('YYYY-MM-DD')
      const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')

      let groupKey: any = ''

      if (moment(date).isSame(today)) {
        groupKey = 'Today'
      } else if (moment(date).isSame(yesterday)) {
        groupKey = 'Yesterday'
      } else {
        groupKey = date
      }

      if (!groupedNotifications[groupKey]) {
        groupedNotifications[groupKey] = []
      }

      groupedNotifications[groupKey].push(notification)
    })
    return groupedNotifications
  }

  const fetchMoreData = () => {
    if (!hasMore) return
    setPage((prev) => {
      getListNotificationHistory('False', prev).then((res) => {
        const { data } = res.data
        if (data?.length === 0 || !res.data.nextPage) {
          setHasMore(false)
        }
        setListGroupNotification(() =>
          groupNotificationsByDate([...listNotificationRoot, ...data])
        )
        setListNotificationRoot((prev) => [...prev, ...data])
      })
      return page + 1
    })
  }

  const replenish = (item: NotificationHistoryItem) => {
    if (item.payloadData?.value?.is_active) {
      addToCart({
        list_variants: [
          {
            product_variant: item.payloadData.value
              .product_variant_id as number,
            quantity: item.payloadData.value.quantity as number,
            distribution_channel: item?.payloadData?.value
              ?.distribution_channel as number,
          },
        ],
      }).then(() => {
        pushMessage(t('theProductHasBeenAddedToMarketplaceCart'), 'success')
        dispatch(cartActions.doCart())
      })
    } else {
      pushMessage(t('theProductIsNoLongerAvailableToOrder'), 'error')
    }
  }

  return (
    <InfiniteScroll
      dataLength={listNotificationRoot.length}
      next={fetchMoreData}
      hasMore={hasMore}
      height={'calc(100vh - 174px)'}
      loader={
        <LinearProgress
          style={{
            marginBottom: '20px',
            width: '100%',
          }}
        />
      }
      scrollableTarget="scrollableDiv"
    >
      {Object.keys(listGroupNotification).map((groupKey: string) => (
        <Box key={groupKey}>
          <Typography
            sx={{
              padding: '15px',
              backgroundColor: '#F6F6F6',
            }}
          >
            {t(groupKey.toLowerCase() as any)}
          </Typography>

          {listGroupNotification[groupKey].map((notification) => (
            <Box key={String(notification?.id)}>
              {notification.payloadData?.action === 'order' ||
              notification.payloadData?.action === 'product' ? (
                <Link
                  href={
                    notification.payloadData?.action === 'order'
                      ? `/${platform().toLowerCase()}/market-place/online-orders/detail/${
                          notification.payloadData?.value
                        }`
                      : `/${platform().toLowerCase()}/inventory/product/detail/${
                          notification.payloadData?.value?.product_variant_id
                        }`
                  }
                >
                  <a>
                    <Stack
                      onClick={() => {
                        doMarkAsReadNotifications(
                          notification.payloadData?.iat
                        ).then(() => {
                          dispatch(
                            notificationHistoryActions.doNotificationHistory()
                          )
                        })
                      }}
                      role="button"
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      style={{
                        cursor: 'pointer',
                      }}
                    >
                      <Box sx={{ padding: '20px' }}>
                        <Typography
                          sx={{
                            color: '#49516F',
                            fontSize: '14px',
                            fontWeight: 600,
                          }}
                        >
                          {notification.title![i18n.language]}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#49516F',
                            fontSize: '14px',
                            fontWeight: 400,
                          }}
                        >
                          {notification.message![i18n.language]}
                        </Typography>
                        {notification.payloadData?.action === 'product' &&
                          !notification.isRead &&
                          notification.payloadData.value?.replenish && (
                            <ButtonCustom
                              variant="outlined"
                              size="small"
                              onClick={() => replenish(notification)}
                              sx={{ mt: 1 }}
                            >
                              {t('restock')}
                            </ButtonCustom>
                          )}
                      </Box>
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap="10px"
                        style={{
                          padding: '20px',
                        }}
                      >
                        <Typography
                          sx={{
                            color: '#49516F',
                            fontSize: '14px',
                            fontWeight: 400,
                          }}
                        >
                          {moment(notification.created_at).format('hh:mm A')}
                        </Typography>
                        {!notification.isRead && (
                          <Circle size={14} weight="fill" color="#1DB46A" />
                        )}
                      </Stack>
                    </Stack>
                    <Divider />
                  </a>
                </Link>
              ) : (
                <>
                  <Stack
                    onClick={() => {
                      doMarkAsReadNotifications(
                        notification.payloadData?.iat
                      ).then(() => {
                        dispatch(
                          notificationHistoryActions.doNotificationHistory()
                        )
                        setRefresh('' + new Date().getTime())
                      })
                    }}
                    role="button"
                    key={String(notification?.id)}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <Box sx={{ padding: '20px' }}>
                      <Typography
                        sx={{
                          color: '#49516F',
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      >
                        {notification.title![i18n.language]}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#49516F',
                          fontSize: '14px',
                          fontWeight: 400,
                        }}
                      >
                        {notification.message![i18n.language]}
                      </Typography>
                      {notification.payloadData?.action === 'product' &&
                        !notification.isRead &&
                        notification.payloadData.value?.replenish && (
                          <ButtonCustom
                            variant="outlined"
                            size="large"
                            onClick={() => replenish(notification)}
                            sx={{ mt: 1 }}
                          >
                            {t('replenish')}
                          </ButtonCustom>
                        )}
                    </Box>
                    <Stack
                      direction="row"
                      alignItems="center"
                      gap="10px"
                      style={{
                        padding: '20px',
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#49516F',
                          fontSize: '14px',
                          fontWeight: 400,
                        }}
                      >
                        {moment(notification.created_at).format('hh:mm A')}
                      </Typography>
                      {!notification.isRead && (
                        <Circle size={14} weight="fill" color="#1DB46A" />
                      )}
                    </Stack>
                  </Stack>
                  <Divider />
                </>
              )}
            </Box>
          ))}
        </Box>
      ))}
    </InfiniteScroll>
  )
}

export default NotificationUnread
