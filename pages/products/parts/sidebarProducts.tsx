import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Radio,
  Space,
  Rate,
  Slider,
  Form,
  Row,
  Col,
  InputNumber,
  Button,
} from 'antd'
import type { RadioChangeEvent } from 'antd'
import type { SliderMarks } from 'antd/es/slider'
import { useAppDispatch } from 'src/store/hooks'
import { notificationActions } from 'src/store/notification/notificationSlice'
import { objToStringParam, isEmptyObject } from 'src/utils/global.utils'
import classes from '../styles.module.scss'

type queryUrlType = {
  minRating?: number
  minPrice?: string | null
  maxPrice?: string | null
}

// rate price
const ratePrice = [
  {
    label: 'Dưới 100.000',
    min: '',
    max: '100000',
    value: 0,
  },
  {
    label: 'Từ 100.000 đến 200.000',
    min: '100000',
    max: '200000',
    value: 1,
  },
  {
    label: 'Từ 200.000 đến 300.000',
    min: '200000',
    max: '300000',
    value: 2,
  },
  {
    label: 'Từ 300.000 đến 400.000',
    min: '300000',
    max: '400000',
    value: 3,
  },
  {
    label: 'Trên 500.000',
    min: '500000',
    max: '',
    value: 4,
  },
]

const marks: SliderMarks = {
  1000: '1000',
  5000000: '5.000.000',
  10000000: '1tr',
}

const SideBarProducts: React.FC = () => {
  const router = useRouter()
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()
  const [queryUrl, setQueryUrl] = useState<queryUrlType>({
    minRating: 0,
    minPrice: '',
    maxPrice: '',
  })
  const [valueDefaultRadioPrice, setValueDefaultRadioPrice] = useState<
    number | null
  >()

  // rating
  const handleChangeRating = (e: RadioChangeEvent) => {
    setQueryUrl({
      ...queryUrl,
      minRating: e.target.value,
    })
    let routerQuery = {
      ...router.query,
      minRating: e.target.value,
      page: 1,
    }
    router.replace({
      search: `${objToStringParam(routerQuery)}`,
    })
  }

  // price
  const handleChangePriceRadio = (e: RadioChangeEvent) => {
    setValueDefaultRadioPrice(e.target.value)
    setQueryUrl({
      ...queryUrl,
      minPrice: ratePrice[e.target.value].min,
      maxPrice: ratePrice[e.target.value].max,
    })
    let routerQuery = {
      ...router.query,
      minPrice: ratePrice[e.target.value].min,
      maxPrice: ratePrice[e.target.value].max,
      page: 1,
    }
    router.replace({
      search: `${objToStringParam(routerQuery)}`,
    })
    form.setFieldsValue({
      minPrice: e.target.value.min,
      maxPrice: e.target.value.max,
    })
  }
  const handleActivePriceRadio = (
    minPrice: string | null,
    maxPrice: string | null
  ) => {
    for (let i = 0; i < ratePrice.length; i++) {
      if (minPrice === ratePrice[i].min && maxPrice === ratePrice[i].max) {
        setValueDefaultRadioPrice(ratePrice[i].value)
      }
    }
  }
  const onChangePrice = (value: number | [number, number]) => {
    console.log('dsgfdfgfd', value)
  }

  const onAfterChangePrice = (value: number[]) => {
    form.setFieldsValue({
      minPrice: value[0],
      maxPrice: value[1],
    })
  }

  const handleFinishFormPrice = (values: any) => {
    if (values.maxPrice && values.maxPrice < values.minPrice) {
      dispatch(
        notificationActions.doNotification({
          type: 'error',
          message: 'Vui lòng nhập lại giá tiền',
        })
      )
      return
    }
    setQueryUrl({
      ...queryUrl,
      minPrice: values.minPrice,
      maxPrice: values.maxPrice,
    })
    setQueryUrl((prevState) => {
      let search = objToStringParam(prevState)
      router.replace({
        pathname: '/san-pham',
        search: `?${search}`,
      })
      return prevState
    })
  }
  // end price

  useEffect(() => {
    setQueryUrl({
      ...queryUrl,
      minRating: router.query.minRating
        ? parseInt(router.query.minRating[0])
        : 0,
    })
    form.setFieldsValue({
      minPrice: router.query.minPrice,
      maxPrice: router.query.maxPrice,
    })
    // set select radio price
    if (!isEmptyObject(router.query)) {
      handleActivePriceRadio(
        router.query.minPrice ? router.query.minPrice[0] : '',
        router.query.maxPrice ? router.query.maxPrice[0] : ''
      )
    }
  }, [router, form, queryUrl])

  return (
    <div>
      <div className={classes.itemSideBar}>
        <h4 className={classes.itemSideBarTitle}>Đánh giá</h4>
        <Radio.Group onChange={handleChangeRating} value={queryUrl.minRating}>
          <Space direction="vertical">
            <Radio value={5}>
              <Space>
                <Rate disabled defaultValue={5} />
                <span>5 sao</span>
              </Space>
            </Radio>
            <Radio value={4}>
              <Space>
                <Rate disabled defaultValue={4} />
                <span>Từ 4 sao</span>
              </Space>
            </Radio>
            <Radio value={3}>
              <Space>
                <Rate disabled defaultValue={3} />
                <span>Từ 3 sao</span>
              </Space>
            </Radio>
          </Space>
        </Radio.Group>
      </div>
      <div className={classes.itemSideBar}>
        <h4 className={classes.itemSideBarTitle}>Giá</h4>
        <Radio.Group
          buttonStyle="solid"
          onChange={(e) => handleChangePriceRadio(e)}
          value={valueDefaultRadioPrice}
        >
          <Space direction="vertical">
            {ratePrice.map((item, idx) => {
              return (
                <Radio.Button key={idx} value={item.value}>
                  {item.label}
                </Radio.Button>
              )
            })}
          </Space>
        </Radio.Group>
        <Slider
          range
          step={1000}
          defaultValue={[1000000, 2000000]}
          marks={marks}
          onChange={() => onChangePrice}
          onAfterChange={onAfterChangePrice}
          max={10000000}
          min={1000}
        />
        <Form form={form} onFinish={handleFinishFormPrice}>
          <Row gutter={10} wrap={false}>
            <Col>
              <Form.Item name="minPrice">
                <InputNumber min={1000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={1}>-</Col>
            <Col>
              <Form.Item name="maxPrice">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Áp dụng
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default SideBarProducts
