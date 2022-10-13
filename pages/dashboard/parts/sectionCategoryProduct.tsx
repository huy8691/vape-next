import React from 'react'
// import Link from 'next/link'
import Image from 'next/image'
import { Col, Row, Alert } from 'antd'
import { messageError } from 'src/constants/message.constant'
import classes from '../styles.module.scss'
import {
  CategoryProductListDataResponseType,
  CategoryProductDataType,
} from '../modelHomePage'
interface Props {
  dataCategoryProduct: CategoryProductListDataResponseType
}
const SectionCategoryProduct: React.FC<Props> = ({ dataCategoryProduct }) => {
  console.log('dataCategoryProduct', dataCategoryProduct?.data)
  return (
    <section className={classes.sectionCategory}>
      <div className="container">
        <h2 className={classes.sectionCategoryTitle}>Category</h2>
        <div className={classes.sectionCategoryContent}>
          Accusamus facilis quos vel saepe odit eleifend enim, blandit
          pellentesque iure repudiandae quisque nonummy. Accusantium dolore
          phasellus placeat minima cubilia rem consequatur! Lobortis habitant
          risus leo, qui. Fringilla, nisl id iste habitasse aut, et adipisci
          labore, consequat primis eos ullamcorper? Nemo cursus dolor facere
          recusandae ornare mollit provident doloremque, suscipit deleniti
          similique? Aliquam, commodo commodi primis, nobis nullam sequi nulla
          quaerat maxime deserunt. Nisl ullamcorper semper non integer facilisi,
          orci? Ratione nullam, justo aliquet laudantium debitis. Urna nemo
          suscipit porttitor, dis. Veritatis aliquip vero? Assumenda curae,
          nostrud aenean illo lorem! Eos adipiscing saepe quae sagittis
          quibusdam. Iusto! Repellat curae elit.
        </div>
        <div className={classes.listCategory}>
          {dataCategoryProduct?.errors ? (
            <Alert message={messageError} type="error" />
          ) : (
            <Row gutter={20}>
              {dataCategoryProduct?.data?.map(
                (item: CategoryProductDataType, index: number) => {
                  return index < 9 ? (
                    <Col sm={12} md={6} key={index + Math.random()}>
                      <div className={classes.item}>
                        <div className={classes.name}>{item.name}</div>
                        <Image
                          alt={item.name}
                          src={item.image}
                          width="270"
                          height="130"
                          objectFit="cover"
                        />
                      </div>
                    </Col>
                  ) : null
                }
              )}
            </Row>
          )}
        </div>
      </div>
    </section>
  )
}

export default SectionCategoryProduct
