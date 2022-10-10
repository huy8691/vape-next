import React from 'react'
import Link from 'next/link'
import { Alert, Button, Row, Col } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import classes from '../styles.module.scss'
import { ItemProduct } from 'src/components'
import { messageError } from 'src/constants/message.constant'
import { ProductDataType, ProductListDataResponseType } from '../modelHomePage'
interface Props {
  dataNewProduct: ProductListDataResponseType
}
const SectionNewProducts: React.FC<Props> = ({ dataNewProduct }) => {
  return (
    <section className={classes.sectionProducts}>
      <div className="container">
        <div className={classes.sectionProductsHead}>
          <div className={classes.sectionProductsTitle}>Sản phẩm mới</div>
          <Link href="/products?sort=approved_at">
            <a>
              <Button type="primary">
                Xem thêm <RightOutlined style={{ fontSize: '9px' }} />
              </Button>
            </a>
          </Link>
        </div>
        {dataNewProduct?.errors ? (
          <Alert message={messageError} type="error" />
        ) : (
          <Row gutter={20}>
            {dataNewProduct?.data?.map(
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

export default SectionNewProducts
