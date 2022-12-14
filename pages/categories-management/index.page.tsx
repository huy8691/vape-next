import React, { ReactElement, useEffect, useState } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import classes from './styles.module.scss'
import { styled } from '@mui/system'
import { NextPageWithLayout } from 'pages/_app.page'
import {
  FormControl,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import { AddCategoryType, categoryTypeData } from './modelProductCategories'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
import { ButtonCustom, TextFieldCustom } from 'src/components'

import { MagnifyingGlass } from 'phosphor-react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, schemaSearch } from './validations'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { objToStringParam } from 'src/utils/global.utils'
import { getListCategories } from './apiCategories'
import Link from 'next/link'

const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: theme.palette.mode === 'dark' ? '#ddd' : '##49516F',
}))

const TableRowCustom = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.mode === 'dark' ? '#212125' : '#F8F9FC',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))
const TableCellCustome = styled(TableCell)(() => ({
  '&.MuiTableCell-body': {
    width: '33.3%',
  },
}))
const TableCellPadding = styled(TableCell)(() => ({
  '&.MuiTableCell-body': {
    padding: '0',
    width: '33.3%',
  },
}))
const TableCellCustomeChild = styled(TableCell)(() => ({
  '&.MuiTableCell-body': {
    padding: '0 0 0 64px',
    width: '33.3%',
  },
}))
const TableCellCustomeAction = styled(TableCell)(() => ({
  '&.MuiTableCell-body': {
    padding: '0 0 0 0',
    width: '10.3%',
  },
}))
const IconSetting = styled(SettingsIcon)(({ theme }) => ({
  '&.MuiSvgIcon-fontSizeMedium': {
    color: theme.palette.mode === 'dark' ? '#ddd' : '##49516F',
  },
}))
const TextFieldSearchCustom = styled(TextFieldCustom)(({ theme }) => ({
  '& .MuiInputBase-input': {
    padding: '10px 45px 10px 15px',
    textOverflow: 'ellipsis',
    backgroundColor:
      theme.palette.mode === 'light' ? '#ffffff' : theme.palette.action.hover,
  },
}))

const SupplierCategories: NextPageWithLayout = () => {
  // state use for list cata
  const [stateCategoryList, setStateCategoryList] =
    useState<categoryTypeData[]>()
  const router = useRouter()
  const dispatch = useAppDispatch()

  // data call api
  useEffect(() => {
    dispatch(loadingActions.doLoading())
    getListCategories(router.query)
      .then((res) => {
        const { data } = res.data
        setStateCategoryList(data)
        dispatch(loadingActions.doLoadingSuccess())
        console.log('data', data)
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
  }, [dispatch, router.query])

  const {
    formState: { errors },
  } = useForm<AddCategoryType>({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  const { handleSubmit: handleSubmitSearch, control: controlSearch } = useForm({
    resolver: yupResolver(schemaSearch),
    mode: 'all',
  })

  const onSubmitSearch = (values: any) => {
    router.replace({
      search: `${objToStringParam({ name: values.search })}`,
    })
    console.log('value', values)
  }

  return (
    <>
      <TypographyH2 sx={{ marginBottom: '15px' }}>
        Categories Management
      </TypographyH2>
      <Grid container spacing={2} sx={{ marginBottom: '15px' }}>
        <Grid xs={10}>
          <form
            onSubmit={handleSubmitSearch(onSubmitSearch)}
            className={classes[`form-search`]}
          >
            <Controller
              control={controlSearch}
              name="search"
              render={({ field }) => (
                <>
                  <FormControl fullWidth>
                    <TextFieldSearchCustom
                      id="search"
                      error={!!errors.name}
                      placeholder="Search Categories by name..."
                      {...field}
                    />
                  </FormControl>
                </>
              )}
            />
            <IconButton
              aria-label="Search"
              type="submit"
              className={classes[`form-search__button`]}
            >
              <MagnifyingGlass size={20} />
            </IconButton>
          </form>
        </Grid>
        <Grid xs={2}>
          <Link href="/create-categories">
            <ButtonCustom
              // onClick={handleOpenModal}
              variant="contained"
            >
              Add new categories
            </ButtonCustom>
          </Link>
        </Grid>
      </Grid>
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCellCustome align="left">Category Name</TableCellCustome>
              <TableCellCustomeAction align="center">
                Acction
              </TableCellCustomeAction>
            </TableRow>
          </TableHead>

          <TableBody>
            {stateCategoryList?.map((item) => {
              return (
                <React.Fragment key={item.id}>
                  <TableRowCustom>
                    <TableCellCustome align="left">
                      {item.name}
                    </TableCellCustome>
                    <TableCellCustomeAction align="center">
                      {/* <Button onClick={(e) => handleShowPopover(e, item)}> */}

                      <IconSetting />
                    </TableCellCustomeAction>
                  </TableRowCustom>
                  {item.child_category.length > 0 && (
                    <TableRow>
                      <TableCellPadding colSpan={2}>
                        <Table size="small" aria-label="purchases">
                          <TableBody>
                            {item.child_category.map((dataChild) => {
                              // console.log('dataChild: ', dataChild)
                              return (
                                <TableRowCustom key={dataChild.id}>
                                  <TableCellCustomeChild align="left">
                                    {dataChild.name}
                                  </TableCellCustomeChild>

                                  <TableCellCustomeAction align="center">
                                    <IconSetting />
                                  </TableCellCustomeAction>
                                </TableRowCustom>
                              )
                            })}
                            {/* ))} */}
                          </TableBody>
                        </Table>
                      </TableCellPadding>
                    </TableRow>
                  )}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

SupplierCategories.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export default SupplierCategories
