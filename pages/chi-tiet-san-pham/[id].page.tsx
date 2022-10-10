import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Head from 'next/head'
import { ShoppingCartOutlined, WalletOutlined } from '@ant-design/icons'
import { Alert, Col, Row, Breadcrumb, Rate, Space, Button } from 'antd'
import Slider from 'react-slick'
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share'
import RelatedProduct from './parts/relatedProduct'
import CommentProduct from './parts/commentProduct'
import { getProductDetail } from './apiProductDetail'
import { ProductDetailResponseType } from './modelProductDetail'
import { messageError } from 'src/constants/message.constant'
import { formatMoney } from 'src/utils/money.utils'
import classes from './styles.module.scss'

// layout
import type { ReactElement } from 'react'
import Layout from 'src/layout/layout'
import type { NextPageWithLayout } from 'pages/_app.page'

const ProductDetail: NextPageWithLayout = (
  dataProductDetail: ProductDetailResponseType
) => {
  const router = useRouter()
  const [nav1, setNav1] = useState()
  const [nav2, setNav2] = useState()
  if (dataProductDetail.errors) {
    return (
      <div className="container">
        <Alert message={messageError} type="error" />
      </div>
    )
  }
  const detailSlide1 = {
    dots: true,
    infinite:
      dataProductDetail.data?.images &&
      dataProductDetail.data?.images?.length > 5
        ? true
        : false,
    slidesToShow:
      dataProductDetail.data?.images &&
      dataProductDetail.data?.images?.length > 5
        ? 5
        : dataProductDetail.data?.images?.length,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    focusOnSelect: true,
    centerMode: true,
    centerPadding: '0px',
  }
  const detailSlide2 = {
    slidesToShow: 1,
    arrows: false,
    dots: false,
  }
  return (
    <>
      <Head>
        <title>{dataProductDetail.data?.name} | Vua Rau Sạch</title>
        <meta name="description" content="Chi tiết sản phẩm | Vua Rau Sạch" />
      </Head>
      <div className="container">
        <div className={classes.sectionProductDetail}>
          <h2 className={classes.titleSection}>Chi tiết sản phẩm</h2>
          <Row>
            <Col span={12}>
              <div className={classes.rowSlideShow}>
                <div className={classes.slideShowSmall}>
                  <Slider
                    {...detailSlide1}
                    asNavFor={nav2}
                    ref={(c: any) => setNav1(c)}
                  >
                    {dataProductDetail.data?.images?.map(
                      (item: any, idx: number) => {
                        return (
                          <div key={idx}>
                            <Image
                              alt={dataProductDetail.data?.name}
                              src={item.url}
                              objectFit="cover"
                              width="80"
                              height="80"
                              className={classes.slideShowSmallImg}
                            />
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
                    {dataProductDetail.data?.images?.map(
                      (item: any, idx: number) => {
                        return (
                          <div key={idx}>
                            <Image
                              alt={dataProductDetail.data?.name}
                              src={item.url}
                              objectFit="cover"
                              width="400"
                              height="420"
                              className={classes.slideShowBigImg}
                            />
                          </div>
                        )
                      }
                    )}
                  </Slider>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={classes.productInfo}>
                <Breadcrumb>
                  {dataProductDetail.data?.categories?.map(
                    (item: any, idx: number) => {
                      return (
                        <Breadcrumb.Item key={idx}>{item.name}</Breadcrumb.Item>
                      )
                    }
                  )}
                </Breadcrumb>
                <h1 className={classes.name}>{dataProductDetail.data?.name}</h1>
                <div className={classes.price}>
                  <span className={classes.retailPrice}>
                    {formatMoney(dataProductDetail.data?.retailPrice)}
                  </span>
                  /{dataProductDetail.data?.minQuantity}
                  {dataProductDetail.data?.unit}
                </div>
                <div className={classes.rating}>
                  <Rate
                    disabled
                    defaultValue={dataProductDetail.data?.rating}
                  />
                </div>
                <hr />
                <Row gutter={20}>
                  <Col span={12}>
                    <Space className={classes.itemInfo}>
                      <div className={classes.label}>Phương thức canh tác</div>
                      <div className={classes.value}></div>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space className={classes.itemInfo}>
                      <div className={classes.label}>Nông trại</div>
                      <div className={classes.value}>
                        {dataProductDetail.data?.supplier?.name}
                      </div>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space className={classes.itemInfo}>
                      <div className={classes.label}>Xuất xứ</div>
                      <div className={classes.value}></div>
                    </Space>
                  </Col>
                  <Col span={12}>
                    <Space className={classes.itemInfo}>
                      <div className={classes.label}>Phân loại</div>
                      <div className={classes.value}></div>
                    </Space>
                  </Col>
                </Row>
                <hr />
                <div className={classes.addToCart}>
                  <Space>
                    <Button icon={<WalletOutlined />} size="large">
                      MUA NGAY
                    </Button>
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      size="large"
                    >
                      THÊM GIỎ HÀNG
                    </Button>
                  </Space>
                </div>
                <hr />
                <div className={classes.shareSocial}>
                  Chia sẻ sản phẩm:
                  <Space>
                    <FacebookShareButton
                      url={`/chi-tiet-san-pham/${router.query.id}`}
                    >
                      <FacebookIcon size={32} />
                    </FacebookShareButton>
                    <TwitterShareButton
                      url={`/chi-tiet-san-pham/${router.query.id}`}
                    >
                      <TwitterIcon size={32} />
                    </TwitterShareButton>
                  </Space>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className={classes.sectionProductDescription}>
          <h2 className={classes.titleSection}>Mô tả sản phẩm</h2>
          {dataProductDetail.data?.description && (
            <div
              dangerouslySetInnerHTML={{
                __html: dataProductDetail.data?.description,
              }}
            />
          )}
        </div>
        <div className={classes.sectionProductComment}>
          <h2 className={classes.titleSection}>Bình luận/đánh giá</h2>
          <CommentProduct />
        </div>
        <div className={classes.sectionRelatedProducts}>
          <h2 className={classes.titleSection}>Sản phẩm liên quan</h2>
          <RelatedProduct />
        </div>
      </div>
    </>
  )
}
ProductDetail.getInitialProps = async ({ query }: any) => {
  const productId = query.id
  const dataProductDetail = await getProductDetail(productId)
    .then((res) => {
      const data = res.data
      return data
    })
    .catch((error) => {
      const errors = error.response ? error.response.data : true
      return errors
    })
  return dataProductDetail
}

ProductDetail.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
export default ProductDetail
