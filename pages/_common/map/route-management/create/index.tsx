import React from 'react'
import { TypographyTitlePage } from 'src/components'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { createRoute } from './apiCreateRoute'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import CreateUpdateComponent from '../_createUpdateComponent'
import { useTranslation } from 'react-i18next'
// import { googleMapAPIKey } from 'src/constants/googlemapapikey.constant'
// import Script from 'next/script'
const CreateRouteComponent = () => {
  const { t } = useTranslation('map')

  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()

  const handleCreateRoute = (value: {
    seller_id: number
    name: string
    date_from: string
    origin: {
      address: string
      latitude: string
      longitude: string
    }
    destination: {
      address: string
      latitude: string
      longitude: string
    }
    optimize: boolean
    locations: {
      address: string
      latitude: string
      longitude: string
      contact: {
        business_name: string
        id: number | null
      } | null
    }[]
  }) => {
    createRoute({
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
        pushMessage(t('pushMessage.createRouteSuccessfully'), 'success')
        router.push(
          platform() === 'RETAILER'
            ? `/retailer/map/route-management/list/`
            : `/supplier/map/route-management/list/`
        )
      })
      .catch(({ res }) => {
        const { status, data } = res
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  return (
    <>
      <TypographyTitlePage>{t('createRoute')}</TypographyTitlePage>
      {/* <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${googleMapAPIKey}&libraries=places`}
      /> */}
      <CreateUpdateComponent
        handleSubmit={(values) => {
          handleCreateRoute(values)
        }}
      />
    </>
  )
}

export default CreateRouteComponent
