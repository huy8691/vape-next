import React, { useEffect, useState } from 'react'

import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import type { NextPageWithLayout } from 'pages/_app.page'

// import { useAppSelector } from 'src/store/hooks'
// dayjs
import { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

// mui
// import List from '@mui/material/List'
// import ListItem from '@mui/material/ListItem'
// import ListItemText from '@mui/material/ListItemText'
import { Box, FormControl, FormHelperText } from '@mui/material'
import {
  ButtonCustom,
  InputLabelCustom,
  MenuItemSelectCustom,
  // PlaceholderSelect,
  SelectCustom,
  TextFieldCustom,
} from 'src/components'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import { AccountDataType } from './accountModel'
// mui

import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'

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
  // const userInfo = useAppSelector((state) => state.userInfo)
  // fix error when use next theme
  const [stateDate, setStateDate] = useState<Dayjs | null>(null)
  const [mounted, setMounted] = useState(false)
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
    setMounted(true)
  }, [])
  if (!mounted) {
    return null
  }

  // fix error when use next theme

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
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
      <Box>
        <Controller
          control={control}
          name="last_name"
          render={({ field }) => (
            <>
              <InputLabelCustom htmlFor="last_name" error={!!errors.last_name}>
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
      <Box>
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
                  defaultValue=""
                  IconComponent={() => <KeyboardArrowDownIcon />}
                  // renderValue={(value: any) => {
                  //   if (value === '') {
                  //     return (
                  //       <PlaceholderSelect>
                  //         <div>Select gender</div>
                  //       </PlaceholderSelect>
                  //     )
                  //   }
                  //   return genderArray?.find((obj) => obj.name === value)?.name
                  // }}
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
      <Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={stateDate}
            onChange={(newStateDate) => {
              setStateDate(newStateDate)
              console.log(newStateDate)
            }}
            renderInput={(params) => <TextFieldCustom {...params} />}
          />
        </LocalizationProvider>
      </Box>
      <Box>
        <Controller
          control={control}
          name="address"
          render={({ field }) => (
            <>
              <InputLabelCustom htmlFor="address" error={!!errors.address}>
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
  )
}

Account.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default Account
