import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
// import Link from 'next/link'
// import {
//   Result,
//   Row,
//   Col,
//   Typography,
//   Tabs,
//   Pagination,
//   Space,
//   Button,
//   Alert,
// } from 'antd'
// import { FileSyncOutlined, ClearOutlined } from '@ant-design/icons'
import classes from './styles.module.scss'

import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import Stack from '@mui/material/Stack'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

import { ItemProduct } from 'src/components'
import { getProducts } from './apiProducts'
import { ProductDataType } from './modelProducts'
// import SideBarProducts from './parts/sidebarProducts'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
import { ProductListDataResponseType } from './modelProducts'
// import { objToStringParam, isEmptyObject } from 'src/utils/global.utils'
// layout
import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import type { NextPageWithLayout } from 'pages/_app.page'

const CardCustom = styled(Card)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light' ? '#F8F9FC' : theme.palette.action.hover,
}))

// const tabsData = [
//   {
//     label: 'Phổ biến',
//     sort: '',
//     order: '',
//     key: '0',
//   },
//   {
//     label: 'Bán chạy',
//     sort: 'soldQuantity',
//     order: '',
//     key: '1',
//   },
//   {
//     label: 'Hàng mới',
//     sort: 'approved_at',
//     order: '',
//     key: '2',
//   },
//   {
//     label: 'Giá thấp - cao',
//     key: '3',
//     sort: 'pr.price',
//     order: 'ASC',
//   },
//   {
//     label: 'Giá cao - thấp',
//     key: '4',
//     sort: 'pr.price',
//     order: 'DESC',
//   },
// ]

// const { Title } = Typography
// const { TabPane } = Tabs

const Products: NextPageWithLayout = () => {
  const [dataProducts, setDataProducts] =
    useState<ProductListDataResponseType>()
  // const [defaultActiveTabs, setDefaultActiveTabs] = useState<string>('0')
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [checked, setChecked] = React.useState([true, false])

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, event.target.checked])
  }

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, checked[1]])
  }

  const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([checked[0], event.target.checked])
  }

  const children = (
    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
      <FormControlLabel
        label="Category1"
        control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
      />
      <FormControlLabel
        label="Category2"
        control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
      />
    </Box>
  )

  // handle tabs
  // const handleChangeTabs = (key: string) => {
  //   let routerQuery = {
  //     ...router.query,
  //     sort: tabsData[parseInt(key)].sort,
  //     order: tabsData[parseInt(key)].order,
  //     page: 1,
  //   }
  //   let search = objToStringParam(routerQuery)
  //   router.replace({
  //     search: `${search}`,
  //   })
  // }

  // const handleActiveTabs = (sort: any, order: any) => {
  //   for (let i = 0; i < tabsData.length; i++) {
  //     if (sort === tabsData[i].sort && order === tabsData[i].order) {
  //       setDefaultActiveTabs(tabsData[i].key)
  //     }
  //   }
  // }

  // handleChangePagination
  // const handleChangePagination = (page: number) => {
  //   let routerQuery = {
  //     ...router.query,
  //     page: page,
  //   }
  //   let search = objToStringParam(routerQuery)
  //   router.replace({
  //     search: `${search}`,
  //   })
  // }

  useEffect(() => {
    // handleActiveTabs(
    //   router.query.sort ? router.query.sort : '',
    //   router.query.order ? router.query.order : ''
    // )
    // setDataProducts({})
    // if (!isEmptyObject(router.query)) {
    //   dispatch(loadingActions.doLoading())
    //   getProducts(router.query)
    //     .then((res) => {
    //       const data = res.data
    //       setDataProducts(data)
    //       dispatch(loadingActions.doLoadingSuccess())
    //     })
    //     .catch((error) => {
    //       const errors = error.response ? error.response.data : true
    //       setDataProducts({
    //         errors: errors,
    //       })
    //       dispatch(loadingActions.doLoadingFailure())
    //     })
    // }
    if (router.asPath === '/products') {
      dispatch(loadingActions.doLoading())
      getProducts(router.query)
        .then((res) => {
          const data = res.data
          setDataProducts(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((error) => {
          const data = error.response?.data

          dispatch(loadingActions.doLoadingFailure())
          dispatch(
            notificationActions.doNotification({
              message: data?.message ? data?.message : 'Error',
              type: 'error',
            })
          )
        })
    }
  }, [router, dispatch])

  const renderResult = () => {
    // if (dataProducts?.errors) {
    //   return <Alert message="Đã xảy ra lỗi" type="error" />
    // }
    if (dataProducts?.data?.length === 0) {
      return <div>Không tìm thấy sản phẩm</div>
    }
    return (
      <>
        <Stack direction="row" style={{ flexWrap: 'wrap' }} spacing={2}>
          {dataProducts?.data?.map((item: ProductDataType, index: number) => (
            <ItemProduct dataProduct={item} key={index} />
          ))}
        </Stack>
        {/* {dataProducts?.total && dataProducts?.total > 20 && (
          <Pagination
            defaultCurrent={1}
            current={router.query.page ? parseInt(router.query.page[0]) : 1}
            total={dataProducts?.total}
            pageSize={20}
            onChange={handleChangePagination}
            showSizeChanger={false}
          />
        )} */}
      </>
    )
  }
  return (
    <>
      {/* <Row gutter={30}>
        <Col span={6}>
          <SideBarProducts />
        </Col>
        <Col span={18}>
          <Tabs
            defaultActiveKey={defaultActiveTabs}
            activeKey={defaultActiveTabs}
            onChange={handleChangeTabs}
          >
            {tabsData.map((item) => {
              return <TabPane tab={item.label} key={item.key}></TabPane>
            })}
          </Tabs>
          {renderResult()}
        </Col>
      </Row> */}
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <CardCustom>
            <CardContent>
              <FormControl>
                <FormControlLabel
                  label="Category"
                  control={
                    <Checkbox
                      checked={checked[0] && checked[1]}
                      indeterminate={checked[0] !== checked[1]}
                      onChange={handleChange1}
                    />
                  }
                />
                {children}
              </FormControl>
              <Divider />
              <FormControl
                sx={{ mt: 2 }}
                component="fieldset"
                variant="standard"
              >
                <FormLabel component="legend">Brand</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox name="gilad" />}
                    label="Gilad Gray"
                  />
                  <FormControlLabel
                    control={<Checkbox name="jason" />}
                    label="Jason Killian"
                  />
                  <FormControlLabel
                    control={<Checkbox name="antoine" />}
                    label="Antoine Llorca"
                  />
                </FormGroup>
              </FormControl>
            </CardContent>
          </CardCustom>
        </Grid>
        <Grid item xs>
          <CardCustom>
            <CardContent>{renderResult()}</CardContent>
          </CardCustom>
        </Grid>
      </Grid>
    </>
  )
}

Products.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export default Products
