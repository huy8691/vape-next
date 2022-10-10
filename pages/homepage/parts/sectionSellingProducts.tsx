import React from 'react'
import Link from 'next/link'
import { Alert, Button, Row, Col } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import classes from '../styles.module.scss'
import { ItemProduct } from 'src/components'
import { messageError } from 'src/constants/message.constant'
import { ProductDataType, ProductListDataResponseType } from '../modelHomePage'

interface Props {
  dataSellingProduct: ProductListDataResponseType
}
const SectionSellingProducts: React.FC<Props> = ({ dataSellingProduct }) => {
  return (
    <section className={classes.sectionProducts}>
      <div className="container">
        <div className={classes.sectionProductsHead}>
          <div className={classes.sectionProductsTitle}>Sản phẩm bán chạy</div>
          <Link href="/products?sort=soldQuantity">
            <a>
              <Button type="primary">
                Xem thêm <RightOutlined style={{ fontSize: '9px' }} />
              </Button>
            </a>
          </Link>
        </div>
        {dataSellingProduct.errors ? (
          <Alert message={messageError} type="error" />
        ) : (
          <Row gutter={20}>
            {dataSellingProduct?.data?.map(
              (item: ProductDataType, index: number) => {
                return index < 6 ? (
                  <Col key={index + Math.random()} span={4}>
                    <ItemProduct dataProduct={item} />
                  </Col>
                ) : null
              }
            )}
          </Row>
        )}
      </div>
    </section>
  )
}

export default SectionSellingProducts
