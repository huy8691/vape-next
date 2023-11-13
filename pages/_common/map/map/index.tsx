import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  FormControl,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'

import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
  MarkerClusterer,
} from '@react-google-maps/api'
import dayjs from 'dayjs'

import Image from 'next/image'

import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { io } from 'socket.io-client'
import { TextFieldSearchCustom, TypographyH2 } from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'

import { env } from 'src/constants/environment.constant'
import { googleMapAPIKey } from 'src/constants/googlemapapikey.constant'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage } from 'src/utils/global.utils'

import * as yup from 'yup'
import { getSellerList } from './mapApi'
import {
  ListSellerType,
  PositionType,
  SearchType,
  SellerFromSocketType,
  SellerOfflineType,
} from './modelMap'
import GoogleMapInforWindow from './parts/GoogleMapInfoWindow'
import SellerBox from './parts/SellerBox'
import classes from './styles.module.scss'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 114px)',
}

const CustomBox = styled(Stack)(() => ({
  position: 'absolute',
  background: '#F1F3F9',
  top: '20px',
  bottom: '20px',
  left: '20px',
  width: '400px',
  maxHeight: '946px',
  // height: '500px',\
  '@media (max-width:1440px)': {
    maxHeight: '100%',
    top: 0,
    bottom: 0,
    left: 0,
    width: '350px',
  },
  padding: '15px',
  borderRadius: '8px',
  zIndex: '100',
}))
const CustomChangeModeBox = styled(Box)(() => ({
  position: 'absolute',
  top: '20px',
  right: '10px',
  width: '50px',
  height: '50px',
  border: '3px solid #F8F9FC',
  borderRadius: '8px',
  zIndex: '100',
  cursor: 'pointer',
  '&:hover': {
    opacity: '0.8',
  },
}))

// const TypographyInformation = styled(Typography)(() => ({
//   fontWeight: '500',
// }))

// const StyledBadge = styled(Badge)(() => ({
//   '& .MuiBadge-badge': {
//     backgroundColor: '#1DB46A',
//     color: '#1DB46A',
//     boxShadow: '0 0 0 2px #F8F9FC',
//     '&::after': {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       width: '100%',
//       height: '100%',
//       borderRadius: '50%',
//       animation: 'ripple 1.2s infinite ease-in-out',
//       border: '1px solid currentColor',
//       content: '""',
//     },
//   },
//   '@keyframes ripple': {
//     '0%': {
//       transform: 'scale(.8)',
//       opacity: 1,
//     },
//     '100%': {
//       transform: 'scale(2.4)',
//       opacity: 0,
//     },
//   },
// }))
// generate key for marker and infowindow
const createKey = (location: PositionType, sellerID: number) => {
  return location.lat + location.lng + sellerID
}

let socket = io('https://cms.dev.twssolutions.us/')
if (env === 'prod') {
  socket = io('https://cms.twssolutions.us/')
}
const SellerMapComponent: React.FC = () => {
  const { t } = useTranslation('map')

  const [pushMessage] = useEnqueueSnackbar()
  const dispatch = useAppDispatch()
  const [stateSellerList, setStateSellerList] = useState<ListSellerType[]>([])
  const [stateSellerListForSearch, setStateSellerListForSearch] = useState<
    ListSellerType[]
  >([])
  // lat lng for USA
  const [stateDirection, setStateDirection] = useState<any>({
    lat: 37.6,
    lng: -95.665,
  })
  const [stateMap, setStateMap] = useState<any>(null)
  const [stateZoom, setStateZoom] = useState<number>(2)
  const [activeMarker, setActiveMarker] = useState<number | null>(null)
  const [stateChangeMapMode, setStateChangeMapMode] = useState<boolean>(false)
  const handleActiveMarker = (marker: number, position: PositionType) => {
    if (marker === activeMarker) {
      // handleClearInterval()
      setActiveMarker(null)
      return
    }
    // handleStartInterval()
    dispatch(loadingActions.doLoading())
    setTimeout(() => {
      setActiveMarker(marker)
      setStateZoom(22)
      setStateDirection(position)
      dispatch(loadingActions.doLoadingSuccess())
    }, 500)
  }
  // custom option for map
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
  const OptionForDarkMode = {
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
      {
        elementType: 'geometry',
        stylers: [
          {
            color: '#1d2c4d',
          },
        ],
      },
      {
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#8ec3b9',
          },
        ],
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#1a3646',
          },
        ],
      },
      {
        featureType: 'administrative.country',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#4b6878',
          },
        ],
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#64779e',
          },
        ],
      },
      {
        featureType: 'administrative.province',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#4b6878',
          },
        ],
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#334e87',
          },
        ],
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [
          {
            color: '#023e58',
          },
        ],
      },

      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#304a7d',
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#98a5be',
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#1d2c4d',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#2c6675',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#255763',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#b0d5ce',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#023e58',
          },
        ],
      },

      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          {
            color: '#0e1626',
          },
        ],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#4e6d70',
          },
        ],
      },
    ],
  }

  useEffect(() => {
    const array: ListSellerType[] = []
    // getSellerList()
    //   .then((res) => {
    //     const { data } = res.data
    //     if (res.data.nextPage) {
    //       array.push(...data)
    //       handleGetSellerListTheFirstTime(res.data.nextPage, array)
    //     }
    //   })
    //   .catch()
    dispatch(loadingActions.doLoading())
    handleGetSellerListTheFirstTime(1, array)
  }, [])

  // call api get seller list and join room for each one
  const handleGetSellerListTheFirstTime = useCallback(
    (page: number, array: any[]) => {
      getSellerList({ page })
        .then((res) => {
          const { data } = res.data
          if (res.data.nextPage > 0) {
            array.push(...data)
            handleGetSellerListTheFirstTime(res.data.nextPage, array)
          } else {
            array.push(...data)
            array.sort((a, b) => Number(b.active) - Number(a.active))
            array.forEach((item: ListSellerType) => {
              socket.emit('join_room', `room_${item.id}`)
            })
            setStateSellerList(array)
            setStateSellerListForSearch(array)
            dispatch(loadingActions.doLoadingSuccess())
          }
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    },
    []
  )

  // const handleGetSellerList = useCallback(() => {
  //   dispatch(loadingActions.doLoading())
  //   getSellerList()
  //     .then((res) => {
  //       const { data } = res
  //       setStateSellerList(data)
  //       setStateSellerListForSearch(data.data)
  //       dispatch(loadingActions.doLoadingSuccess())
  //     })
  //     .catch((response) => {
  //       dispatch(loadingActions.doLoadingFailure())
  //       const { status, data } = response
  //       pushMessage(handlerGetErrMessage(status, data), 'error')
  //     })
  // }, [dispatch, pushMessage])
  // add event listenner - if there is any new location from seller  -> call api get seller

  const handleListenEventFromSocket = useCallback(
    (data: SellerFromSocketType) => {
      if (!stateSellerList) return
      const newListSeller: ListSellerType[] = JSON.parse(
        JSON.stringify(stateSellerList)
      )
      const findIdSeller = newListSeller.findIndex((item) => {
        return item.id === data.user
      })

      const distanceBetweenTwoPoint =
        google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(
            newListSeller[findIdSeller].latitude,
            newListSeller[findIdSeller].longitude
          ),
          new google.maps.LatLng(data.latitude, data.longitude)
        )

      newListSeller[findIdSeller] = {
        ...newListSeller[findIdSeller],
        address: data.address,
        active: true,
        latitude: data.latitude,
        longitude: data.longitude,
        time_at_location:
          distanceBetweenTwoPoint > 10
            ? String(new Date(dayjs().format()))
            : newListSeller[findIdSeller].time_at_location,
      }
      const sortedListSeller = [...newListSeller]
      sortedListSeller.sort((a, b) => Number(b.active) - Number(a.active))

      setStateSellerListForSearch(sortedListSeller)
      setStateSellerList(sortedListSeller)
    },
    [stateSellerList]
  )

  useEffect(() => {
    socket.on('new_location', (data: SellerFromSocketType) => {
      handleListenEventFromSocket(data)
    })
    return () => {
      socket.off('new_location')
    }
  }, [handleListenEventFromSocket])

  useEffect(() => {
    socket.on('offline', (data: SellerOfflineType) => {
      // handleGetSellerListTheFirstTime(1, [])
      handleEventSellerOffline(data.user_id)
    })
    return () => {
      socket.off('offline')
    }
  }, [])
  // clean up function for socket
  useEffect(() => {
    return () => {
      socket.disconnect()
    }
  }, [])
  // fire when map is loaded
  const onLoad = useCallback(
    (map: any) => {
      const bounds = new window.google.maps.LatLngBounds()
      if (stateSellerList) {
        const temporarySeller = stateSellerList.filter(
          (item) => item.latitude !== null || item.longitude !== null
        )
        if (temporarySeller.length === 0) {
          setStateDirection({ lat: 37.6, lng: -95.665 })
          return
        }
        temporarySeller.forEach((marker) => {
          const { latitude, longitude } = marker
          bounds.extend(new google.maps.LatLng(latitude, longitude))
        })
        map.fitBounds(bounds)
        setStateDirection({ bounds: bounds })
      }
    },
    [stateSellerList]
  )
  //fire when component unmounted
  const onUnmount = React.useCallback(() => {
    setStateDirection(null)
  }, [])
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SearchType>({
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().max(255),
      })
    ),
  })
  const handleSearch = (value: SearchType) => {
    if (!stateSellerList) return
    const shalowCopyArray = [...stateSellerList]
    if (!value.search) {
      value.search = ''
    }
    console.log('value from search', value.search)
    console.log('shalow copy', shalowCopyArray)
    const temporaryArraySeller = shalowCopyArray.filter((item) => {
      if (
        item.full_name.includes(value.search) ||
        item.phone_number.includes(value.search) ||
        item.email.includes(value.search)
      )
        return (
          item.full_name.includes(value.search) ||
          item.phone_number.includes(value.search) ||
          item.email.includes(value.search)
        )
    })
    console.log('temporaryArraySeller', temporaryArraySeller)
    setStateSellerListForSearch(temporaryArraySeller)
  }

  // const calculator = (markers, numStyles) => {
  //   let index = 0
  //   const count = markers.length
  //   let dv = count
  //   while (dv !== 0) {
  //     dv = dv / 10
  //     index++
  //   }

  //   index = Math.min(index, numStyles)

  //   return {
  //     text: '50' + '/' + count,
  //     index: index,
  //     title: 's',
  //   }
  // }
  // const clusterStyles = [
  //   {
  //     height: 50,
  //     textColor: '#ffffff',
  //     width: 50,
  //     url: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" height="50" width="100"%3E%3Ccircle cx="25" cy="25" r="20" stroke="black" stroke-width="3" fill="green" /%3E%3C/svg%3E',
  //   },
  //   {
  //     height: 50,
  //     textColor: '#ffffff',
  //     width: 50,
  //     url: 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" height="50" width="100"%3E%3Ccircle cx="25" cy="25" r="20" stroke="black" stroke-width="3" fill="red" /%3E%3C/svg%3E',
  //   },
  // ]
  // const clusterStyles = [
  //   {
  //     width: 30,
  //     height: 30,
  //     color: '#00a2d3',
  //   },
  //   {
  //     width: 40,
  //     height: 40,
  //     color: '#ff9b00',
  //   },
  //   {
  //     width: 50,
  //     height: 50,
  //     color: '#ff6969',
  //   },
  // ]
  const handleEventSellerOffline = (id: number) => {
    const cloneSellerList: ListSellerType[] = JSON.parse(
      JSON.stringify(stateSellerList)
    )
    const foundIndex = cloneSellerList.findIndex((seller) => seller.id === id)
    if (foundIndex < 0) return
    cloneSellerList[foundIndex].active = false
    cloneSellerList.sort((a, b) => Number(b.active) - Number(a.active))
    setStateSellerList(cloneSellerList)
    setStateSellerListForSearch(cloneSellerList)
  }
  return (
    <Box sx={{ position: 'relative' }} className={classes['custom-google-map']}>
      <Tooltip title="Change map mode">
        <CustomChangeModeBox
          onClick={() => setStateChangeMapMode((prev) => !prev)}
        >
          <Image
            style={{ borderRadius: '5px' }}
            src={
              stateChangeMapMode
                ? '/' + '/images/thumbnailggmapDefaultMode.png'
                : '/' + '/images/thumbnailggmapDarkMode.png'
            }
            alt={''}
            width={'100%'}
            height={'100%'}
          />
        </CustomChangeModeBox>
      </Tooltip>

      <CustomBox spacing={2}>
        <TypographyH2 alignSelf="center">{t('listSeller')}</TypographyH2>
        <form onSubmit={handleSubmit(handleSearch)} className="form-search">
          <Controller
            control={control}
            name="search"
            render={({ field }) => (
              <>
                <FormControl fullWidth>
                  <TextFieldSearchCustom
                    size="small"
                    defaultValue=""
                    error={!!errors.search}
                    placeholder={t('search')}
                    {...field}
                  />
                </FormControl>
              </>
            )}
          />
          <IconButton
            aria-label="Search"
            type="submit"
            className="form-search__button"
          >
            <MagnifyingGlass size={20} />
          </IconButton>
        </form>
        <Box className={classes['custom-scroll']}>
          {stateSellerListForSearch.length > 0 ? (
            stateSellerListForSearch.map((item: ListSellerType) => {
              return (
                <SellerBox
                  key={item.id + 'id'}
                  SellerDetail={item}
                  stateMarker={activeMarker}
                  handleSetActiveMarker={handleActiveMarker}
                  handleCreateKey={createKey}
                />
              )
            })
          ) : (
            <>
              <Stack
                p={5}
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src={'/' + '/images/not-found.svg'}
                  alt="Logo"
                  width="200"
                  height="200"
                />
                <Typography sx={{ marginTop: '0', fontSize: '16px' }}>
                  {t('noSellerToShow')}
                </Typography>
              </Stack>
            </>
          )}
        </Box>
      </CustomBox>

      <Box
        sx={{
          '@media (max-width:1440px)': {
            width: 'calc(100% - 350px)',
            marginLeft: 'auto',
          },
        }}
        className={classes['custom-google-map-box']}
      >
        <LoadScript
          googleMapsApiKey={googleMapAPIKey}
          language="en"
          libraries={['geometry']}
        >
          <GoogleMap
            key={stateSellerList?.length}
            options={stateChangeMapMode ? OptionForDarkMode : OPTIONS}
            id="marker-example"
            mapContainerStyle={containerStyle}
            zoom={stateZoom}
            center={
              stateDirection
                ? stateDirection
                : {
                    lat: 37.6,
                    lng: -95.665,
                  }
            }
            onLoad={(map) => {
              setStateMap(map)
              onLoad(map)
            }}
            onClick={() => setActiveMarker(null)}
            onUnmount={onUnmount}
            onDragStart={() => {
              if (stateMap && stateMap.center) {
                console.log('position change', stateMap.center)
                setStateDirection(stateMap.center)
              }
            }}
            onZoomChanged={() => {
              if (stateMap && stateMap.zoom) {
                setStateZoom(stateMap.zoom)
              }
            }}
          >
            <MarkerClusterer
              options={{
                zoomOnClick: true,
              }}
            >
              {(clusterer) => (
                <div>
                  {stateSellerList?.map((item) => {
                    if (item.latitude && item.longitude) {
                      return (
                        <Marker
                          // animation={
                          //   item.isOnline ? google.maps.Animation.BOUNCE : undefined
                          // }
                          icon={{
                            url: item.active
                              ? '/images/marker-online.svg'
                              : '/images/marker-offline.svg',
                          }}
                          key={createKey(
                            {
                              lat: item.latitude,
                              lng: item.longitude,
                            },
                            item.id
                          )}
                          position={{ lat: item.latitude, lng: item.longitude }}
                          clusterer={clusterer}
                          onClick={() =>
                            handleActiveMarker(
                              createKey(
                                {
                                  lat: item.latitude,
                                  lng: item.longitude,
                                },
                                item.id
                              ),
                              { lat: item.latitude, lng: item.longitude }
                            )
                          }
                        >
                          {activeMarker ===
                            createKey(
                              {
                                lat: item.latitude,
                                lng: item.longitude,
                              },
                              item.id
                            ) && (
                            <InfoWindow
                              onCloseClick={() => setActiveMarker(null)}
                              position={{
                                lat: item.latitude,
                                lng: item.longitude,
                              }}
                            >
                              <GoogleMapInforWindow SellerDetail={item} />
                            </InfoWindow>
                          )}
                        </Marker>
                      )
                    }
                  })}
                </div>
              )}
            </MarkerClusterer>
            {/* <InfoWindow position={stateDirection}>
              <div style={divStyle}>
                <h1>InfoWindow</h1>
              </div>
            </InfoWindow> */}
          </GoogleMap>
        </LoadScript>
      </Box>
    </Box>
  )
}

export default SellerMapComponent
