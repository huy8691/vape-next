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
import { AddBrandType, ProductBrandType } from '../addProductModel'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { createBrand, getProductBrand } from '../apiAddProduct'
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
  openBrandModal: boolean
  handleClose: () => void
  handleSetStateBrand: React.Dispatch<
    React.SetStateAction<ProductBrandType[] | undefined>
  >
}

const ModalAddNewBrand = ({
  openBrandModal,
  handleClose,
  handleSetStateBrand,
}: ChildPropsType) => {
  const dispatch = useAppDispatch()
  const {
    handleSubmit: handleSubmitBrand,
    control: brandControl,
    formState: { errors: errorsBrand },
  } = useForm<AddBrandType>({
    resolver: yupResolver(brandSchema),
    mode: 'all',
  })

  const onSubmitBrand = (values: AddBrandType) => {
    console.log(values)
    const addBrand: AddBrandType = {
      name: values.name,
      logo: 'https://vape-test.s3.ap-southeast-1.amazonaws.com/images/2022/9/23/767445.png',
    }
    dispatch(loadingActions.doLoading())

    createBrand(addBrand)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        dispatch(
          notificationActions.doNotification({
            message: 'Successfully',
          })
        )
        getProductBrand()
          .then((res) => {
            const { data } = res.data
            handleSetStateBrand(data)
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
      open={openBrandModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <CustomModalBox>
        <form onSubmit={handleSubmitBrand(onSubmitBrand)}>
          <Stack>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add new brand
            </Typography>
            <Controller
              control={brandControl}
              name="name"
              render={({ field }) => (
                <>
                  <InputLabelCustom htmlFor="name" error={!!errorsBrand.name}>
                    Brand name
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <TextFieldCustom
                      id="name"
                      placeholder="Enter brand name"
                      error={!!errorsBrand.name}
                      {...field}
                    />
                    <FormHelperText error={!!errorsBrand.name}>
                      {errorsBrand.name && `${errorsBrand.name.message}`}
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

export default ModalAddNewBrand
