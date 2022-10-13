import React from 'react'
import Link from 'next/link'
import { Alert, Button, Row, Col } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import classes from '../styles.module.scss'
import { ItemProduct } from 'src/components'
import { messageError } from 'src/constants/message.constant'
import { ProductListDataResponseType, ProductDataType } from '../modelHomePage'

interface Props {
  dataNewProduct: ProductListDataResponseType
}
const SectionFlashSellProducts: React.FC<Props> = ({ dataNewProduct }) => {
  console.log('SectionSellingProducts', dataNewProduct)
  return (
    <section className={classes.sectionProducts}>
      <div className="container">
        <div className={classes.sectionProductsHead}>
          <div className={classes.sectionProductsTitle}>Flash Sell</div>
          <Link href="/products">
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
                  <Col
                    className={classes.item}
                    key={index + Math.random()}
                    span={4}
                  >
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

export default SectionFlashSellProducts
