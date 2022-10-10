import React, { useEffect } from 'react'
import classes from './styles.module.scss'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { Button, Row, Col, Form, Input, DatePicker, Select } from 'antd'
import moment from 'moment'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { UserDataType, PassWordDataType } from './modelAccount'
import { updateInfoUser, updatePasswordUser } from './apiAccount'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
import { userInfoActions } from 'src/store/userInfo/userInfoSlice'
import { schema, schemaPassword } from './validations'

// layout
// import type { ReactElement } from 'react'
// import NestedLayout from 'src/layout/nestedLayout'
import type { NextPageWithLayout } from 'pages/_app.page'

const { Option } = Select
const Account: NextPageWithLayout = () => {
  const dispatch = useAppDispatch()
  // state
  // reducer
  const userInfoReducer = useAppSelector((state) => state.userInfo)
  // funtion
  const handleUpdateInfoAccount = (values: UserDataType) => {
    dispatch(loadingActions.doLoading())
    updateInfoUser(values)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        dispatch(
          notificationActions.doNotification({
            message: 'Cập nhật thông tin thành công',
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

  const handleUpdatePasswordUser = (values: PassWordDataType) => {
    dispatch(loadingActions.doLoading())
    updatePasswordUser(values)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        dispatch(
          notificationActions.doNotification({
            message: 'Cập nhật thông tin thành công',
          })
        )
        resetPassword({
          currentPassword: '',
          newPassword: '',
          passwordConfirmation: '',
        })
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
  const onSubmitInfoUser = (values: UserDataType) => {
    console.log('onSubmitInfoUser', values)
    let newValue = {
      ...values,
      dob: moment(values.dob).format('DD/MM/YYYY'),
    }
    handleUpdateInfoAccount(newValue)
  }

  // form password
  const {
    handleSubmit: handleSubmitPassword,
    control: controlPassword,
    formState: { errors: errorsPassword },
    reset: resetPassword,
  } = useForm<PassWordDataType>({
    resolver: yupResolver(schemaPassword),
    mode: 'onBlur',
  })
  const onSubmitPassword = (values: PassWordDataType) => {
    console.log('onSubmitPassword', values)
    handleUpdatePasswordUser(values)
  }

  // set values default
  useEffect(() => {
    if (userInfoReducer.isSuccess) {
      // [
      //   { name: "fullName", value: userInfoReducer.data?.fullName },
      //   { name: "email", value: userInfoReducer.data?.email },
      //   { name: "gender", value: userInfoReducer.data?.gender },
      // ].forEach(({ name, value }: any) => setValue(name, value));
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
        <div className={classes.panelTitle}>Thông tin cá nhân</div>
        <form onSubmit={handleSubmit(onSubmitInfoUser)}>
          <Row gutter={20}>
            <Col md={12}>
              <Controller
                control={control}
                name="fullName"
                render={({ field }) => (
                  <Form.Item
                    validateStatus={errors.fullName && 'error'}
                    help={errors.fullName && `${errors.fullName.message}`}
                  >
                    <Input {...field} placeholder="Họ và tên" />
                  </Form.Item>
                )}
              />
            </Col>
            <Col md={12}>
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
            </Col>
            <Col md={12}>
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
            </Col>
            <Col md={12}>
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
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </form>
      </div>
      <div className={classes.panel}>
        <div className={classes.panelTitle}>Cài đặt mật khẩu</div>
        <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
          <Row gutter={20}>
            <Col md={12}>
              <Controller
                control={controlPassword}
                name="currentPassword"
                render={({ field }) => (
                  <Form.Item
                    validateStatus={errorsPassword.currentPassword && 'error'}
                    help={
                      errorsPassword.currentPassword &&
                      `${errorsPassword.currentPassword.message}`
                    }
                  >
                    <Input.Password {...field} placeholder="Mật khẩu cũ" />
                  </Form.Item>
                )}
              />
            </Col>
            <Col md={12}></Col>
            <Col md={12}>
              <Controller
                control={controlPassword}
                name="newPassword"
                render={({ field }) => (
                  <Form.Item
                    validateStatus={errorsPassword.newPassword && 'error'}
                    help={
                      errorsPassword.newPassword &&
                      `${errorsPassword.newPassword.message}`
                    }
                  >
                    <Input.Password {...field} placeholder="Mật khẩu mới" />
                  </Form.Item>
                )}
              />
            </Col>
            <Col md={12}></Col>
            <Col md={12}>
              <Controller
                control={controlPassword}
                name="passwordConfirmation"
                render={({ field }) => (
                  <Form.Item
                    validateStatus={
                      errorsPassword.passwordConfirmation && 'error'
                    }
                    help={
                      errorsPassword.passwordConfirmation &&
                      `${errorsPassword.passwordConfirmation.message}`
                    }
                  >
                    <Input.Password {...field} placeholder="Mật khẩu mới" />
                  </Form.Item>
                )}
              />
            </Col>
            <Col md={12}></Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </form>
      </div>
    </>
  )
}

// Account.getLayout = function getLayout(page: ReactElement) {
//   return <NestedLayout>{page}</NestedLayout>
// }
export default Account
