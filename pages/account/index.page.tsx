import React, { useEffect, useState } from 'react'

// next
import Head from 'next/head'

import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import type { NextPageWithLayout } from 'pages/_app.page'

import { useAppSelector } from 'src/store/hooks'
// dayjs
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

// mui
// import List from '@mui/material/List'
// import ListItem from '@mui/material/ListItem'
// import ListItemText from '@mui/material/ListItemText'
import {
  Box,
  FormControl,
  FormHelperText,
  Card,
  CardContent,
  Typography,
} from '@mui/material'
import {
  ButtonCustom,
  InputLabelCustom,
  MenuItemSelectCustom,
  PlaceholderSelect,
  SelectCustom,
  TextFieldCustom,
} from 'src/components'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import { AccountDataType } from './accountModel'
// mui
import { styled } from '@mui/material/styles'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'

// custom style
const CardPage = styled(Card)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F8F9FC',
  boxShadow: 'none',
}))
const CardContentCustom = styled(CardContent)(() => ({
  paddingBottom: '16px !important',
}))
const TypographyH1 = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: theme.palette.mode === 'dark' ? '#ddd' : '##49516F',
}))

const genderArray = [
  {
    id: 1,
    name: 'MALE',
  },
  {
    id: 2,
    name: 'FEMALE',
  },
  {
    id: 3,
    name: 'OTHER',
  },
]

const Account: NextPageWithLayout = () => {
  const userInfo = useAppSelector((state) => state.userInfo)
  // fix error when use next theme
  const [stateDate, setStateDate] = useState<Dayjs | null>(null)
  const {
    handleSubmit,
    control,
    setValue,
    // getValues,

    formState: { errors },
  } = useForm<AccountDataType>({
    resolver: yupResolver(schema),
    shouldUnregister: false,
    mode: 'all',
  })

  const onSubmit = (values: AccountDataType) => {
    console.log(values)
  }

  useEffect(() => {
    setValue('first_name', userInfo.data.first_name)
    setValue('last_name', userInfo.data.last_name)
    setValue('gender', userInfo.data.gender)
    setValue('dob', dayjs(`${userInfo.data.dob}`))
    setValue('address', userInfo.data.address)
  }, [userInfo, setValue])

  return (
    // <Box
    //   sx={{
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     minHeight: '100%',
    //   }}
    // >

    //   <Container maxWidth="md">
    //     <List>
    //       <ListItem>
    //         <ListItemText primary="First name" />
    //         <ListItemText primary={userInfo.data.first_name} />
    //       </ListItem>
    //       <ListItem>
    //         <ListItemText primary="Last name" />
    //         <ListItemText primary={userInfo.data.last_name} />
    //       </ListItem>
    //       <ListItem>
    //         <ListItemText primary="Email" />
    //         <ListItemText primary={userInfo.data.email} />
    //       </ListItem>
    //       <ListItem>
    //         <ListItemText primary="Address" />
    //         <ListItemText primary={userInfo.data.address} />
    //       </ListItem>
    //       <ListItem>
    //         <ListItemText primary="Gender" />
    //         <ListItemText primary={userInfo.data.gender} />
    //       </ListItem>
    //       <ListItem>
    //         <ListItemText primary="Dob" />
    //         <ListItemText primary={userInfo.data.dob} />
    //       </ListItem>
    //       <ListItem>
    //         <ListItemText primary="Phone number" />
    //         <ListItemText primary={userInfo.data.phone_number} />
    //       </ListItem>
    //       <ListItem>
    //         <ListItemText primary="Avatar" />
    //         <ListItemText primary={userInfo.data.avatar} />
    //       </ListItem>
    //     </List>
    //   </Container>
    // </Box>
    <>
      <Head>
        <title>User Information | Vape</title>
      </Head>
      <TypographyH1 variant="h1" mb={3}>
        User Information
      </TypographyH1>
      <CardPage>
        <CardContentCustom>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={2}>
              <Controller
                control={control}
                name="first_name"
                defaultValue="hehe"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="first_name"
                      error={!!errors.first_name}
                    >
                      First name
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="first_name"
                        error={!!errors.first_name}
                        {...field}
                      />
                      <FormHelperText error={!!errors.first_name}>
                        {errors.first_name && `${errors.first_name.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
            <Box mb={2}>
              <Controller
                control={control}
                name="last_name"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="last_name"
                      error={!!errors.last_name}
                    >
                      Last name
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="last_name"
                        error={!!errors.last_name}
                        {...field}
                      />
                      <FormHelperText error={!!errors.last_name}>
                        {errors.last_name && `${errors.last_name.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
            <Box mb={2}>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <>
                    <InputLabelCustom htmlFor="gender" error={!!errors.gender}>
                      Gender
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <SelectCustom
                        id="gender"
                        displayEmpty
                        IconComponent={() => <KeyboardArrowDownIcon />}
                        renderValue={(value: any) => {
                          if (value === '') {
                            return (
                              <PlaceholderSelect>
                                <div>Select gender</div>
                              </PlaceholderSelect>
                            )
                          }
                          return genderArray?.find((obj) => obj.name === value)
                            ?.name
                        }}
                        {...field}
                        onChange={(event: any) => {
                          setValue('gender', event.target.value)
                        }}
                      >
                        {genderArray?.map((item, index) => {
                          return (
                            <MenuItemSelectCustom
                              value={item.name}
                              key={index + Math.random()}
                            >
                              {item.name}
                            </MenuItemSelectCustom>
                          )
                        })}
                      </SelectCustom>
                      <FormHelperText error={!!errors.gender}>
                        {errors.gender && `${errors.gender.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
            <Box mb={2}>
              <Controller
                control={control}
                name="dob"
                render={({ field }) => (
                  <>
                    <InputLabelCustom htmlFor="dob" error={!!errors.dob}>
                      Dob
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          {...field}
                          onChange={(value: Dayjs) => {
                            console.log('value', value)
                            setValue('dob', new Date(value))
                          }}
                          renderInput={(params) => (
                            <TextFieldCustom {...params} error={!!errors.dob} />
                          )}
                        />
                      </LocalizationProvider>
                      <FormHelperText error={!!errors.dob}>
                        {errors.dob && `${errors.dob.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
            <Box mb={2}>
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="address"
                      error={!!errors.address}
                    >
                      Address
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="address"
                        error={!!errors.address}
                        {...field}
                      />
                      <FormHelperText error={!!errors.address}>
                        {errors.address && `${errors.address.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
            <ButtonCustom variant="contained" size="large" type="submit">
              Update Information
            </ButtonCustom>
          </form>
        </CardContentCustom>
      </CardPage>
    </>
  )
}

Account.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default Account
