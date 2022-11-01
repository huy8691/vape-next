import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Result, Row, Col, Typography, Space, Alert } from 'antd'
import { FileSyncOutlined } from '@ant-design/icons'
import { getRelatedProduct } from '../apiProductDetail'
import { ItemProduct } from 'src/components'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  ProductListDataResponseType,
  ProductDataType,
} from '../modelProductDetail'

const { Title } = Typography

const RelatedProduct: React.FC = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [dataProducts, setDataProducts] =
    useState<ProductListDataResponseType>()
  useEffect(() => {
    if (router.query.id) {
      getRelatedProduct(router.query.id)
        .then((res) => {
          const data = res.data
          setDataProducts(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((error) => {
          const errors = error.response ? error.response.data : true
          setDataProducts({
            errors: errors,
          })
          dispatch(loadingActions.doLoadingFailure())
        })
    }
  }, [router, dispatch])

  const renderResult = () => {
    if (dataProducts?.errors) {
      return <Alert message="Đã xảy ra lỗi" type="error" />
    }
    if (dataProducts?.data?.length === 0) {
      return (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Result
            icon={<FileSyncOutlined />}
            title={<Title level={5}>Không có sản phẩm</Title>}
          />
        </Space>
      )
    }
    return (
      <Row gutter={24}>
        {dataProducts?.data?.map((item: ProductDataType, index: number) => (
          <Col span={4} key={index + Math.random()}>
            <ItemProduct dataProduct={{ ...item, isShowRating: false }} />
          </Col>
        ))}
      </Row>
    )
  }

  return renderResult()
}

export default RelatedProduct
