import {
  Box,
  FormControl,
  FormHelperText,
  Modal,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import React from 'react'

import { ButtonCustom, InputLabelCustom, TextFieldCustom } from 'src/components'

// form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { brandSchema } from '../validations'
import {
  AddManufacturerType,
  ProductManufacturerType,
} from '../addProductModel'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { createManufacturer, getProductManufacturer } from '../apiAddProduct'
import { notificationActions } from 'src/store/notification/notificationSlice'

const CustomModalBox = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: '#FFF',
  border: '1px solid #000',
  padding: '15px',
}))
interface ChildPropsType {
  openManufacturer: boolean
  handleClose: () => void
  handleSetStateManufacturer: React.Dispatch<
    React.SetStateAction<ProductManufacturerType[] | undefined>
  >
}

const ModalAddManufacturer = ({
  openManufacturer,
  handleClose,
  handleSetStateManufacturer,
}: ChildPropsType) => {
  const dispatch = useAppDispatch()
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddManufacturerType>({
    resolver: yupResolver(brandSchema),
    mode: 'all',
  })

  const onSubmit = (values: AddManufacturerType) => {
    console.log(values)
    const addManufacturer: AddManufacturerType = {
      name: values.name,
      logo: 'https://vape-test.s3.ap-southeast-1.amazonaws.com/images/2022/9/23/767445.png',
    }
    console.log(addManufacturer)
    dispatch(loadingActions.doLoading())

    createManufacturer(addManufacturer)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        dispatch(
          notificationActions.doNotification({
            message: 'Successfully',
          })
        )
        getProductManufacturer()
          .then((res) => {
            const { data } = res.data
            handleSetStateManufacturer(data)
          })
          .catch((error) => {
            console.log(error)
            dispatch(
              notificationActions.doNotification({
                message: 'Error',
                type: 'error',
              })
            )
          })
      })
      .catch(() => {
        dispatch(loadingActions.doLoadingFailure())
        dispatch(
          notificationActions.doNotification({
            message: 'Error',
            type: 'error',
          })
        )
      })
  }
  return (
    <Modal
      open={openManufacturer}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <CustomModalBox>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add new Manufacturer
            </Typography>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <>
                  <InputLabelCustom htmlFor="name" error={!!errors.name}>
                    Manufacturer name
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <TextFieldCustom
                      id="name"
                      placeholder="Enter manufacturer name"
                      error={!!errors.name}
                      {...field}
                    />
                    <FormHelperText error={!!errors.name}>
                      {errors.name && `${errors.name.message}`}
                    </FormHelperText>
                  </FormControl>
                </>
              )}
            />
            <ButtonCustom variant="contained" size="large" type="submit">
              Submit
            </ButtonCustom>
          </Stack>
        </form>
      </CustomModalBox>
    </Modal>
  )
}
export default ModalAddManufacturer
