import { Box, Skeleton } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { getListBanner } from './bannerApi'
import { BannerType } from './bannerModel'
import Slider from 'react-slick'
// other
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import classes from './styles.module.scss'

const BannerComponent = () => {
  const [pushMessage] = useEnqueueSnackbar()
  const [stateListBanner, setStateListBanner] = useState<BannerType[]>([])
  useEffect(() => {
    getListBanner()
      .then((res) => {
        const { data } = res.data
        setStateListBanner(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [])
  const setting = {
    dots: true,
    infinite: true,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  }
  const renderSlide = () => {
    if (stateListBanner.length === 0) {
      return <Skeleton animation="wave" variant="rounded" height={250} />
    }
    return (
      <Slider {...setting} dotsClass={`slick-dots ${classes['dotsClass']}`}>
        {stateListBanner.map((item, index) => {
          return (
            <Box key={index}>
              <Link
                href={
                  '/retailer/market-place/browse-products?is_featured=true&'
                }
              >
                <a>
                  <Image
                    src={
                      item.image
                        ? item.image
                        : '/' + '/images/defaultProductImage.png'
                    }
                    alt="banner"
                    width={1700}
                    height={250}
                    objectFit="cover"
                    style={{ borderRadius: '5px', overflow: 'hidden' }}
                  />
                </a>
              </Link>
            </Box>
          )
        })}
      </Slider>
    )
  }
  return <Box>{renderSlide()}</Box>
}

export default BannerComponent
