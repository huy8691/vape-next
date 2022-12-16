//React/Next
import React, { ReactElement, useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from 'pages/_app.page'
import NestedLayout from 'src/layout/nestedLayout'

//styles
import { StyledTableRow, TableCellHeadingTextCustom } from './styled'
import {
  ButtonCustom,
  TextFieldSearchCustom,
  TypographyTitlePage,
  MenuItemSelectCustom,
  SelectPaginationCustom,
} from 'src/components'
import { objToStringParam, isEmptyObject } from 'src/utils/global.utils'

//material
import Grid from '@mui/material/Unstable_Grid2'
import {
  Stack,
  Typography,
  Pagination,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
} from '@mui/material'

import { Gear, MagnifyingGlass } from 'phosphor-react'

//Api
import { getListDistributionChannel } from './distributionChannelAPI'
import { useAppDispatch } from 'src/store/hooks'
import { notificationActions } from 'src/store/notification/notificationSlice'

//model
import {
  DistributionChannelType,
  DistributionChannelListResponseType,
} from './distributionChannelModel'

// react-hook-form
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'
import { loadingActions } from 'src/store/loading/loadingSlice'

const DistributionChannel: NextPageWithLayout = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  // state use for
  const [stateDistributionChannelList, setStateDistributionChannelList] =
    useState<DistributionChannelListResponseType>()

  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  // event submit
  const onSubmitSearch = (values: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        name: values.name,
      })}`,
    })
  }

  //pagination
  const handleChangePagination = (e: any, page: number) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
  }
  // change per page
  const handleChangeRowsPerPage = (event: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: Number(event.target.value),
        page: 1,
      })}`,
    })
  }

  // handle call api distribution channel list
  const handleGetListDistributionChannel = (query: any) => {
    dispatch(loadingActions.doLoading())
    getListDistributionChannel(query)
      .then((res) => {
        const data = res.data
        setStateDistributionChannelList(data)
        dispatch(loadingActions.doLoadingSuccess())
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

  useEffect(() => {
    dispatch(loadingActions.doLoading())
    if (router.asPath.length !== router.pathname.length) {
      if (router.query.name) {
        setValue('name', router.query.name)
      }
      if (!isEmptyObject(router.query)) {
        handleGetListDistributionChannel(router.query)
      }
    } else {
      handleGetListDistributionChannel({})
    }
  }, [dispatch, router])
  return (
    <>
      <Head>
        <title>Distribution Channel | VAPE</title>
      </Head>
      <TypographyTitlePage variant="h2" mb={3}>
        Distribution Channel
      </TypographyTitlePage>
      <Grid container spacing={2}>
        <Grid xs>
          <form onSubmit={handleSubmit(onSubmitSearch)} className="form-search">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextFieldSearchCustom
                    id="name"
                    error={!!errors.name}
                    placeholder="Search distribution channel..."
                    {...field}
                  />
                </FormControl>
              )}
            />
            <IconButton
              aria-label="Search"
              type="submit"
              className="form-search__button"
            >
              <MagnifyingGlass size={20} />
            </IconButton>
          </form>
        </Grid>
        <Grid xs style={{ maxWidth: '260px' }}>
          <ButtonCustom variant="contained" fullWidth>
            Add distribution channel
          </ButtonCustom>
        </Grid>
      </Grid>
      <TableContainer
        component={Paper}
        elevation={0}
        style={{
          border: '1px solid #E1E6EF',
          marginBottom: '15px',
          marginTop: '35px',
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCellHeadingTextCustom align="left" width={100}>
                No.
              </TableCellHeadingTextCustom>
              <TableCellHeadingTextCustom>Name</TableCellHeadingTextCustom>
              <TableCellHeadingTextCustom>Code</TableCellHeadingTextCustom>
              <TableCellHeadingTextCustom align="right" width={30}>
                Action
              </TableCellHeadingTextCustom>
            </TableRow>
          </TableHead>
          <TableBody>
            {stateDistributionChannelList?.data?.map(
              (row: DistributionChannelType, index: number) => {
                return (
                  <StyledTableRow key={index + Math.random()}>
                    <TableCell width={200} align="left">
                      {index + 1}
                    </TableCell>
                    <TableCell>{row?.name}</TableCell>
                    <TableCell>{row?.code}</TableCell>
                    <TableCell align="center" width={30}>
                      <IconButton>
                        <Gear size={32} />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                )
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={2}
      >
        <Typography>Rows per page</Typography>
        <FormControl sx={{ m: 1 }}>
          <SelectPaginationCustom
            value={Number(router.query.limit) ? Number(router.query.limit) : 10}
            onChange={handleChangeRowsPerPage}
          >
            <MenuItemSelectCustom value={10}>10</MenuItemSelectCustom>
            <MenuItemSelectCustom value={20}>20</MenuItemSelectCustom>
            <MenuItemSelectCustom value={30}>30</MenuItemSelectCustom>
          </SelectPaginationCustom>
        </FormControl>
        <Pagination
          color="primary"
          variant="outlined"
          shape="rounded"
          defaultPage={1}
          page={Number(router.query.page) ? Number(router.query.page) : 1}
          onChange={(e, page: number) => handleChangePagination(e, page)}
          count={
            stateDistributionChannelList
              ? stateDistributionChannelList?.totalPages
              : 0
          }
        />
      </Stack>
    </>
  )
}

DistributionChannel.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default DistributionChannel
