import React, { useEffect } from 'react'
import classes from './styles.module.scss'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { Button, Form, Input, DatePicker, Select } from 'antd'
import moment from 'moment'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { UserDataType } from './modelCreateUser'
import { createUser } from './apiCreateUser'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
import { userInfoActions } from 'src/store/userInfo/userInfoSlice'
import { schema } from './validations'

// layout
import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import type { NextPageWithLayout } from 'pages/_app.page'

const { Option } = Select
const CreateUser: NextPageWithLayout = () => {
  const dispatch = useAppDispatch()
  // state
  // reducer
  const userInfoReducer = useAppSelector((state) => state.userInfo)
  // funtion
  const handleUpdateInfoAccount = (values: UserDataType) => {
    dispatch(loadingActions.doLoading())
    createUser(values)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        dispatch(
          notificationActions.doNotification({
            message: 'success',
          })
        )
        dispatch(userInfoActions.doUserInfo())
      })
      .catch((error) => {
        dispatch(loadingActions.doLoadingFailure())
        dispatch(
          notificationActions.doNotification({
            message: error.response.data.message,
            type: 'error',
          })
        )
      })
  }

  //Disable Date of Birth
  const disabledDate = (current: any) => {
    return current && current > moment().endOf('day')
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<UserDataType>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  })
  const onSubmit = (values: UserDataType) => {
    let newValue = {
      ...values,
      dob: moment(values.dob).format('DD/MM/YYYY'),
    }
    handleUpdateInfoAccount(newValue)
  }

  // set values default
  useEffect(() => {
    if (userInfoReducer.isSuccess) {
      reset({
        fullName: userInfoReducer.data?.fullName,
        email: userInfoReducer.data?.email,
        gender: userInfoReducer.data?.gender,
        dob: moment(userInfoReducer.data?.dob).format('DD/MM/YYYY'),
      })
    }
  }, [userInfoReducer, reset])

  return (
    <>
      <div className={classes.panel}>
        <div className={classes.panelTitle}>Create User</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="fullName"
            render={({ field }) => (
              <Form.Item
                validateStatus={errors.fullName && 'error'}
                help={errors.fullName && `${errors.fullName.message}`}
              >
                <Input {...field} placeholder="Full name" />
              </Form.Item>
            )}
          />
          <Controller
            control={control}
            name="dob"
            render={({ field }) => (
              <Form.Item
                validateStatus={errors.dob && 'error'}
                help={errors.dob && `${errors.dob.message}`}
              >
                <DatePicker
                  {...field}
                  status={errors.dob && 'error'}
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  placeholder="Ngày sinh"
                  value={moment(field.value)}
                  disabledDate={disabledDate}
                  showToday={false}
                />
              </Form.Item>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Form.Item
                validateStatus={errors.email && 'error'}
                help={errors.email && `${errors.email.message}`}
              >
                <Input {...field} placeholder="Email" />
              </Form.Item>
            )}
          />
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Form.Item
                validateStatus={errors.gender && 'error'}
                help={errors.gender && `${errors.gender.message}`}
              >
                <Select placeholder="Giới tính" {...field}>
                  <Option value="MALE">Nam</Option>
                  <Option value="FEMALE">Nữ</Option>
                  <Option value="OTHER">Khác</Option>
                </Select>
              </Form.Item>
            )}
          />
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </form>
      </div>
    </>
  )
}

CreateUser.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export default CreateUser
