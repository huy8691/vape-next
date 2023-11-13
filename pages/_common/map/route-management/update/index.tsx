import React, { useEffect, useState } from 'react'
import { TypographyTitlePage } from 'src/components'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { RouteDetailResponseType, FormRouterType } from './modelUpdateRoute'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { updateRoute, getDetailRoute } from './apiUpdateRoute'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import CreateUpdateComponent from '../_createUpdateComponent'
import { useTranslation } from 'react-i18next'
// import Script from 'next/script'
// import { googleMapAPIKey } from 'src/constants/googlemapapikey.constant'
const UpdateRouteComponent = () => {
  const { t } = useTranslation('map')
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [stateRouteDetail, setStateRouteDetail] =
    useState<RouteDetailResponseType['data']>()
  const idRouter = router.query.id
  const handleUpdateRoute = (value: FormRouterType) => {
    console.log('value', value)
    dispatch(loadingActions.doLoading())
    updateRoute(Number(idRouter), {
      ...value,
      date_from: dayjs(value.date_from).format('YYYY-MM-DD'),
      date_to: dayjs(value.date_from).format('YYYY-MM-DD'),
      origin: value.origin?.address,
      origin_location: {
        latitude: value.origin?.latitude,
        longitude: value.origin?.longitude,
      },
      destination: value.destination?.address,
      destination_location: {
        latitude: value.destination?.latitude,
        longitude: value.destination?.longitude,
      },
      desc: 'Lorem ipsum',
      locations: value.locations.map((item) => ({
        ...item,
        contact: item.contact?.id ? item.contact?.id : null,
      })),
    })
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(t('updateRouteSuccessFully'), 'success')
        router.push(
          platform() === 'RETAILER'
            ? `/retailer/map/route-management/list/`
            : `/supplier/map/route-management/list/`
        )
      })
      .catch(({ response }: any) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  useEffect(() => {
    if (idRouter) {
      dispatch(loadingActions.doLoading())
      getDetailRoute(Number(idRouter))
        .then((res) => {
          const { data } = res.data
          dispatch(loadingActions.doLoadingSuccess())
          setStateRouteDetail(data)
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
          if (status === 404) {
            router.push('/404')
          }
          dispatch(loadingActions.doLoadingFailure())
        })
    }
  }, [router])

  return (
    <>
      <TypographyTitlePage>{t('updateRoute')}</TypographyTitlePage>
      {/* <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${googleMapAPIKey}&libraries=places`}
      /> */}
      <CreateUpdateComponent
        handleSubmit={(values: any) => {
          handleUpdateRoute(values)
        }}
        routeDetail={stateRouteDetail}
      />
    </>
  )
}

export default UpdateRouteComponent
