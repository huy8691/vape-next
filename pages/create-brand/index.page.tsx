import { NextPageWithLayout } from 'pages/_app.page'
import React, { ReactElement, useState } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import {
  Typography,
  Stack,
  Box,
  FormControl,
  FormHelperText,
} from '@mui/material'
import Link from 'next/link'
import Grid from '@mui/material/Grid/Grid'
import { Controller, useForm } from 'react-hook-form'
import { ButtonCustom, InputLabelCustom, TextFieldCustom } from 'src/components'
import UploadImage from 'src/components/uploadImage'
import { AddBrandType, brandTypeData } from 'pages/brand/brandModel'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { addBrand, getListBrand } from 'pages/brand/apiBrand'
import { notificationActions } from 'src/store/notification/notificationSlice'

const CreateBrand: NextPageWithLayout = () => {
  const [, setStateBrandList] = useState<brandTypeData[]>()
  // // state use for list cata
  const router = useRouter()
  const dispatch = useAppDispatch()

  const {
    control,
    reset,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<AddBrandType>({
    resolver: yupResolver(schema),
    mode: 'all',
  })
  //onSubmit create brand
  const OnSubmitCreate = (values: AddBrandType) => {
    console.log('dataCreated', values)
    const CreateBrand: AddBrandType = {
      name: values.name,
      logo: values.logo,
    }
    dispatch(loadingActions.doLoading())
    addBrand(CreateBrand)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        dispatch(
          notificationActions.doNotification({
            message: 'Success',
          })
        )
        reset()
        // console.log('dataAdd', addCategories)
        getListBrand(router.query)
          .then((res) => {
            const { data } = res.data
            setStateBrandList(data)
            dispatch(loadingActions.doLoadingSuccess())
            // console.log('data', data)
          })
          .catch((error: any) => {
            const data = error.response?.data
            console.log(data)
            dispatch(loadingActions.doLoadingFailure())
            dispatch(
              notificationActions.doNotification({
                message: 'Something went wrongs with the server',
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
    console.log(values)
  }
  return (
    <>
      <Typography variant="h4" mb={2}>
        Create New Product Brand
      </Typography>
      <Typography mb={4}>
        <Link href="/brand">Product Brands</Link>
        {'>'} Create New Brand
      </Typography>
      <>
        <form onSubmit={handleSubmit(OnSubmitCreate)}>
          <Grid container rowSpacing={1}>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Box mb={2} sx={{ width: '458px' }}>
                  <Stack
                    spacing={1}
                    sx={{
                      background: 'white',
                      borderRadius: '10px',
                    }}
                  >
                    <Typography sx={{ width: '165px', textAlign: 'left' }}>
                      Brand Logo
                    </Typography>
                    <Stack
                      spacing={1}
                      sx={{
                        padding: '15px',
                        background: 'white',
                        borderRadius: '10px',
                      }}
                    >
                      <UploadImage
                        fileList={undefined}
                        onFileSelectSuccess={(file: string) => {
                          setValue('logo', file)
                          trigger('logo')
                        }}
                        onFileSelectError={() => {
                          return
                        }}
                        onFileSelectDelete={() => {
                          setValue('logo', '')
                          trigger('logo')
                        }}
                      />
                    </Stack>
                    {/* <CustomImageBox></CustomImageBox> */}
                  </Stack>

                  <InputLabelCustom htmlFor="name" error={!!errors.name}>
                    Brand name
                  </InputLabelCustom>
                  <Stack sx={{ widows: '458px' }}>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="name"
                        error={!!errors.name}
                        placeholder="Input other average monthly sale volume..."
                        {...field}
                      />
                      <FormHelperText error={!!errors.name}>
                        {errors.name && `${errors.name.message}`}
                      </FormHelperText>
                    </FormControl>
                  </Stack>
                </Box>
              )}
            />

            <Grid item xs={12}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={2}>
                  <Link href="/brand">
                    <ButtonCustom
                      variant="contained"
                      size="large"
                      fullWidth
                      style={{ backgroundColor: ' #BABABA' }}
                    >
                      Cancel
                    </ButtonCustom>
                  </Link>
                </Grid>
                <Grid item xs={2}>
                  <ButtonCustom
                    variant="contained"
                    size="large"
                    type="submit"
                    fullWidth
                  >
                    Submit
                  </ButtonCustom>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </>
    </>
  )
}
CreateBrand.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default CreateBrand
