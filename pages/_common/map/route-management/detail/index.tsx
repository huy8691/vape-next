import { Box } from '@mui/system'
import {
  GoogleMap,
  Marker,
  Polyline,
  InfoWindow,
  useJsApiLoader,
} from '@react-google-maps/api'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { ButtonCustom, TypographyTitlePage } from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { googleMapAPIKey } from 'src/constants/googlemapapikey.constant'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { getDetailRoute } from './detailRouteAPI'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  LocationDetailType,
  RouteDetailType,
  StartEndLocation,
} from './detailRouteModel'
import { styled } from '@mui/system'
import { MapPin, Circle } from '@phosphor-icons/react'
import {
  Stack,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Divider,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

// import { Circle } from '@phosphor-icons/react'

const TypographyRoute = styled(Typography)(() => ({
  '&:hover': {
    color: '#222222',
  },
}))

const OPTIONS = {
  minZoom: 4,
  mapTypeControl: false,
  fullscreenControl: false,
  streetViewControl: false,
  styles: [
    {
      featureType: 'poi',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      stylers: [{ visibility: 'off' }],
    },
    // {
    //   featureType: 'poi.business',
    //   stylers: [{ visibility: 'off' }],
    // },
    // {
    //   featureType: 'poi.business',
    //   elementType: 'labels',
    //   stylers: [{ visibility: 'off' }],
    // },
  ],
}
const iconMarker = (index: number, length: number) => {
  if (index === 0) return '/images/marker-online.svg'
  if (index === length - 1) return '/images/marker-end.svg'
  return '/images/marker.svg'
}
function decodePolyline(encoded: string) {
  const points = []
  let index = 0
  const len = encoded.length
  let lat = 0
  let lng = 0
  while (index < len) {
    let b = 0
    let shift = 0,
      result = 0
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63 //finds ascii                                                                                    //and substract it by 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)

    const dlat = (result & 1) != 0 ? ~(result >> 1) : result >> 1
    lat += dlat
    shift = 0
    result = 0

    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    const dlng = (result & 1) != 0 ? ~(result >> 1) : result >> 1
    lng += dlng

    points.push({
      latitude: lat / 1e6,
      longitude: lng / 1e6,
    })
  }
  return points
}

const RouteDetailComponent = () => {
  const { t } = useTranslation('map')

  const router = useRouter()
  // const mapRef = useRef(null)
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateDetailRoute, setDetailRoute] = useState<RouteDetailType>()
  const [stateCenter, setStateCenter] = useState<{
    lat: number
    lng: number
  }>({
    lat: 42.1794806,
    lng: -97.8891866,
  })

  const [activeMarker, setActiveMarker] = useState(null)

  const handleActiveMarker = (marker: any) => {
    if (marker === activeMarker) {
      return
    }
    setActiveMarker(marker)
  }
  const [stateLocation, setStateLocation] = useState<
    {
      address: string
      lat: number
      lng: number
    }[]
  >([])
  const [stateLocationPolyline, setStateLocationPolyline] = useState<
    {
      lat: number
      lng: number
    }[]
  >([])
  useEffect(() => {
    if (router.query.id) {
      dispatch(loadingActions.doLoading())
      getDetailRoute(Number(router.query.id))
        .then((res) => {
          dispatch(loadingActions.doLoadingSuccess())
          const { data } = res.data
          const newLocations = data?.routes?.[0]?.waypoint_order?.map(
            (item) => {
              return {
                address: data?.locations[item].address,
                lat: data?.locations[item].latitude,
                lng: data?.locations[item].longitude,
              }
            }
          )
          setDetailRoute(data)
          setStateLocation([
            {
              address: data?.origin,
              lat: data?.origin_location?.latitude,
              lng: data?.origin_location?.longitude,
              // order: -1,
            },
            ...newLocations,
            {
              address: data?.destination,
              lat: data?.destination_location?.latitude,
              lng: data?.destination_location?.longitude,
              // order: newLocations.length,
            },
          ])
          console.log('data', newLocations)

          const locationArray: LocationDetailType[] = decodePolyline(
            data.routes[0].overview_polyline.points
          )
          const formattedArray: StartEndLocation[] = locationArray.map(
            (item) => ({ lat: item.latitude * 10, lng: item.longitude * 10 })
          )
          setStateLocationPolyline(formattedArray)
          console.log('formattedArray', formattedArray)
          // if (data.destination_location && data.origin_location) {
          //   setDetailRoute(data)
          //   const markerArray: StartEndLocation[] = []
          //   const pinArray: LocationDetailType[] = []
          //   data.locations.forEach((item) =>
          //     pinArray.push({
          //       latitude: Number(item.latitude),
          //       longitude: Number(item.longitude),
          //     })
          //   )
          //   console.log('pinarray', pinArray)
          //   setStateListPin(pinArray)
          //   markerArray.push({
          //     lat: Number(data.origin_location.latitude),
          //     lng: Number(data.origin_location.longitude),
          //   })
          //   markerArray.push({
          //     lat: Number(data.destination_location.latitude),
          //     lng: Number(data.destination_location.longitude),
          //   })

          //   setStateMarker(markerArray)
          //   const locationArray: LocationDetailType[] = decodePolyline(
          //     data.routes[0].overview_polyline.points
          //   )
          //   const formattedArray: StartEndLocation[] = locationArray.map(
          //     (item) => ({ lat: item.latitude * 10, lng: item.longitude * 10 })
          //   )

          //   setStateLocation(formattedArray)
          // }
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }, [router.query.id])

  // fire when map is loaded

  // const onLoad = useCallback(
  //   (map: any) => {
  //     // const bounds = new window.google.maps.LatLngBounds()

  //     console.log('909')

  //     const bounds = new window.google.maps.LatLngBounds()
  //     stateLocation.forEach((marker) => {
  //       bounds.extend(new window.google.maps.LatLng(marker.lat, marker.lng))
  //     })

  //     // Get the map instance and use fitBounds
  //     // const map = mapRef.current.getMap()
  //     map.fitBounds(bounds)
  //   },
  //   [stateLocation]
  // )

  const onLoad = useCallback(
    (map: any) => {
      const bounds = new window.google.maps.LatLngBounds()
      stateLocation.forEach((item) => {
        const { lat, lng } = item
        bounds.extend(new google.maps.LatLng(Number(lat), Number(lng)))
      })
      map.fitBounds(bounds)
    },
    [stateLocation]
  )

  // const onLoad = (map: any) => {
  //   const bounds = new google.maps.LatLngBounds()
  //   stateLocation.forEach((item) => {
  //     const { lat, lng } = item
  //     bounds.extend(new google.maps.LatLng(Number(lat), Number(lng)))
  //   })
  //   map.fitBounds(bounds)
  // }

  useEffect(() => {
    console.log('4444', stateLocation)
  }, [stateLocation])

  const StepIcon = (props: any) => {
    return (
      <Box
        sx={{
          minWidth: '22px',
          minHeight: '22px',
          border: '1px dashed #49516F',
          borderRadius: '50%',
          lineHeight: '1',
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          paddingRight: '0px',
          justifyContent: 'center',
          color: '#49516F',
        }}
      >
        {props.icon - 1}
      </Box>
    )
  }
  const StepIconStart = () => {
    return <Circle size={24} color="#1DB46A" />
  }
  const StepIconEnd = () => {
    return <MapPin size={24} color="#E02D3C" />
  }

  useEffect(() => {
    console.log('stateLocation', stateLocation)
  }, [stateLocation])

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapAPIKey,
    libraries: ['geometry', 'drawing'],
  })
  return (
    <>
      <Head>
        <title>{t('titleMap')} | TWSS</title>
      </Head>
      <Grid container spacing={2}>
        <Grid xs={3}>
          <Box
            sx={{
              height: '100%',
              p: 2,
              background: '#F8F9FC',
            }}
          >
            <Stack spacing={1}>
              <TypographyTitlePage>{t('routeDetail')}</TypographyTitlePage>
              <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>
                {stateDetailRoute?.user.nick_name
                  ? stateDetailRoute.user.nick_name
                  : stateDetailRoute?.user.full_name}
              </Typography>
              <Typography>
                {moment(stateDetailRoute?.date_from).format('MM/DD/YYYY')}
              </Typography>
              <Stack spacing={1} direction="row">
                {stateDetailRoute?.start_at && (
                  <Typography>
                    {t('start')}{' '}
                    {moment(stateDetailRoute?.start_at).format('MM/DD/YYYY')}
                  </Typography>
                )}
                {stateDetailRoute?.end_at && (
                  <Typography>
                    - {t('end')}{' '}
                    {moment(stateDetailRoute?.end_at).format('MM/DD/YYYY')}
                  </Typography>
                )}
              </Stack>
              <Divider sx={{ margin: '10px 0 !important' }} />
              {stateDetailRoute?.optimize && (
                <ButtonCustom
                  disableRipple
                  sx={{
                    background: '#EDFDF8',
                    marginBottom: '16px !important',
                    cursor: 'unset',
                    '&:hover': {
                      background: '#EDFDF8',
                    },
                  }}
                >
                  {t('routeHasBeenOptimize')}
                </ButtonCustom>
              )}
              <Stepper orientation="vertical">
                <Step>
                  <StepLabel
                    StepIconComponent={StepIconStart}
                    onClick={() => {
                      handleActiveMarker(0)
                      setStateCenter({
                        lat: stateLocation?.[0]?.lat,
                        lng: stateLocation?.[0]?.lng,
                      })
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Typography color="#1DB46A" fontWeight={500}>
                      {t('startLocation')}
                    </Typography>
                    <TypographyRoute>
                      {stateLocation?.[0]?.address}
                    </TypographyRoute>
                  </StepLabel>
                </Step>
                {stateLocation?.map((item, index) => {
                  if (index > 0 && index < stateLocation.length - 1) {
                    return (
                      <Step key={index}>
                        <StepLabel
                          StepIconComponent={StepIcon}
                          onClick={() => {
                            handleActiveMarker(index)
                            setStateCenter({
                              lat: item.lat,
                              lng: item.lng,
                            })
                          }}
                          sx={{ cursor: 'pointer !important' }}
                        >
                          <TypographyRoute>{item.address}</TypographyRoute>
                        </StepLabel>
                      </Step>
                    )
                  }
                })}
                <Step>
                  <StepLabel
                    StepIconComponent={StepIconEnd}
                    onClick={() => {
                      handleActiveMarker(stateLocation.length - 1)
                      setStateCenter({
                        lat: stateLocation?.[stateLocation.length - 1]?.lat,
                        lng: stateLocation?.[stateLocation.length - 1]?.lng,
                      })
                    }}
                    sx={{ cursor: 'pointer !important' }}
                  >
                    <Typography color="#E02D3C" fontWeight={500}>
                      {t('endLocation')}
                    </Typography>
                    <TypographyRoute>
                      {stateLocation?.[stateLocation.length - 1]?.address}
                    </TypographyRoute>
                  </StepLabel>
                </Step>
              </Stepper>
            </Stack>
          </Box>
        </Grid>
        <Grid xs={9}>
          {isLoaded && stateLocation.length > 0 && (
            <GoogleMap
              key={stateLocation.length}
              id="marker"
              options={OPTIONS}
              mapContainerStyle={{
                width: '100%',
                minHeight: 'calc(100vh - 110px)',
              }}
              // ref={mapRef}
              // zoom={10}
              center={stateCenter}
              onLoad={onLoad}
              // onUnmount={onUnmount}
              // onDragStart={() => {
              //   if (stateMap && stateMap.center) {
              //     console.log('position change', stateMap.center)
              //     setStateDirection(stateMap.center)
              //   }
              // }}
              // onZoomChanged={() => {
              //   if (stateMap && stateMap.zoom) {
              //     setStateZoom(stateMap.zoom)
              //   }
              // }}
            >
              {stateLocation?.map((item, index) => {
                return (
                  <Marker
                    label={`${
                      index > 0 && index < stateLocation.length - 1 ? index : ''
                    }`}
                    key={index}
                    position={{
                      lat: Number(item.lat),
                      lng: Number(item.lng),
                    }}
                    onClick={() => handleActiveMarker(index)}
                    icon={iconMarker(index, stateLocation.length)}
                  >
                    {activeMarker === index ? (
                      <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                        <div>{item.address}</div>
                      </InfoWindow>
                    ) : null}
                  </Marker>
                )
              })}
              <Polyline
                path={stateLocationPolyline.map((item) => ({
                  lat: item.lat,
                  lng: item.lng,
                }))}
                options={{
                  strokeColor: '#2F6FED',
                  strokeOpacity: 1,
                  geodesic: true,
                }}
              />
            </GoogleMap>
          )}
          {/* <LoadScript
            googleMapsApiKey={googleMapAPIKey}
            language="en"
            libraries={['geometry']}
          ></LoadScript> */}
        </Grid>
      </Grid>
    </>
  )
}

export default RouteDetailComponent
