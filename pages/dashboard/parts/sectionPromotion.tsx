import React, { useState } from 'react'
import moment from 'moment'
import Image from 'next/image'
import { Alert, Space } from 'antd'
import Slider from 'react-slick'
import {
  PromotionDataType,
  PromotionListDataResponseType,
} from '../modelHomePage'
import { messageError } from 'src/constants/message.constant'
import classes from '../styles.module.scss'

interface Props {
  dataPromotion: PromotionListDataResponseType
}
const SectionPromotion: React.FC<Props> = ({ dataPromotion }) => {
  console.log('dataPromotion', dataPromotion)
  const [nav1, setNav1] = useState()
  const [nav2, setNav2] = useState()
  const detailSlide1 = {
    dots: true,
    infinite: dataPromotion?.data?.length > 5 ? true : false,
    slidesToShow:
      dataPromotion?.data?.length > 5 ? 5 : dataPromotion?.data?.length,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    focusOnSelect: true,
    centerMode: true,
    centerPadding: '0px',
    autoplay: true,
  }
  const detailSlide2 = {
    slidesToShow: 1,
    arrows: false,
    dots: true,
    autoplay: true,
    autoplaySpeed: 7000,
  }
  return (
    <div className={classes.rowSlideShow}>
      {dataPromotion.errors ? (
        <div className="container">
          <Alert message={messageError} type="error" />
        </div>
      ) : (
        <>
          <div className={classes.slideShowSmall}>
            <Slider
              {...detailSlide1}
              asNavFor={nav2}
              ref={(c: any) => setNav1(c)}
            >
              {dataPromotion?.data?.map(
                (item: PromotionDataType, idx: number) => {
                  return (
                    <div className={classes.item} key={idx}>
                      <h3 className={classes.name}>{item?.name}</h3>
                      <Space>
                        {moment(item?.from).format('DD/MM/YYYY')}
                        <span>đến</span>
                        {moment(item?.to).format('DD/MM/YYYY')}
                      </Space>
                    </div>
                  )
                }
              )}
            </Slider>
          </div>
          <div className={classes.slideShowBig}>
            <Slider
              {...detailSlide2}
              asNavFor={nav1}
              ref={(c: any) => setNav2(c)}
            >
              {dataPromotion?.data?.map(
                (item: PromotionDataType, idx: number) => {
                  return (
                    <div key={idx}>
                      <Image
                        alt={item?.name}
                        src={item.featureImage.url}
                        layout="fixed"
                        width="1920"
                        height="400"
                        objectFit="cover"
                      />
                    </div>
                  )
                }
              )}
            </Slider>
          </div>
        </>
      )}
    </div>
  )
}

export default SectionPromotion
