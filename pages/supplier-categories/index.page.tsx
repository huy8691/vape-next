import React, { ReactElement, useEffect, useState } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { styled } from '@mui/system'
import { NextPageWithLayout } from 'pages/_app.page'
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Table,
  Button,
  // Popover,
  // Box,
  // Stack,
  // Modal,
  // IconButton,
  // Collapse,
  Grid,
} from '@mui/material'

// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
// import Checkbox from '@mui/material/Checkbox'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { categoryListResponseType } from './modelProductCategories'
import { useRouter } from 'next/router'
import { getListCategories } from './apiCategories'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'

const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: theme.palette.mode === 'dark' ? '#ddd' : '##49516F',
}))
// const TableCellCustomeHeadingTextCustom = styled(TableCellCustome)(({ theme }) => ({
//   fontSize: '1.4rem',
//   fontWeight: 400,
//   color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
// }))
const TableRowCustom = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.mode === 'dark' ? '#212125' : '#F8F9FC',
  },
}))

const GridItem = styled(Grid)(() => ({
  '&.MuiGrid-grid-xs-2': {
    display: 'flex',
    justifyContent: 'center',
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
const DeleteIconCustome = styled(DeleteForeverIcon)(() => ({
  '&.MuiSvgIcon-root': {
    color: '#ff0000',
  },
}))
// let style = {
//   position: 'absolute' as 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   pt: 2,
//   px: 4,
//   pb: 3,
// }
const SupplierCategories: NextPageWithLayout = () => {
  // const [showModalChild, setShowModalChild] = useState(false)
  const [showModal, setShowModal] = useState(false)
  // state use for list cata
  const [dataCategory, setDataCategory] = useState<categoryListResponseType>()
  const router = useRouter()
  const dispatch = useAppDispatch()

  // const handleShowPopover = (event: any, item: any) => {
  //   setShowPopover(true)
  //   setSaveData(item)
  //   setAnchorEl(event.currentTarget)
  //   console.log(item)
  //   // data.splice(item, 1)
  //   // console.log(data)
  // }
  // const handleClosePopover = () => {
  //   setShowPopover(false)
  //   setAnchorEl(null)
  // }

  // const handleShowChild = (data: any) => {
  //   console.log('onclik', data)
  //   setIdCheck(data.id)
  //   setOpen(!open)
  //   // console.log(data)
  // }

  const handleShowModel = () => {
    setShowModal(!showModal)
  }

  // data call api
  useEffect(() => {
    getListCategories(router.query)
      .then((res) => {
        const data = res.data
        setDataCategory(data)
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
  }, [dispatch])

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <TypographyH2 variant="h2" mb={3}>
            List Product Categories
          </TypographyH2>
        </Grid>
        <GridItem item xs={2}>
          <Button onClick={handleShowModel}>Create</Button>
        </GridItem>
      </Grid>
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCellCustome align="left">Name</TableCellCustome>
              <TableCellCustome align="left">Is Displayed</TableCellCustome>
              <TableCellCustome align="left"></TableCellCustome>
            </TableRow>
          </TableHead>

          <TableBody>
            {dataCategory?.data.map((item) => {
              return (
                <>
                  <TableRowCustom key={item.id}>
                    {/* <TableCellCustome>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        key={item.id}
                        onClick={() => handleShowChild(item)}
                      >
                        {open && item.id === idCheck ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCellCustome> */}
                    <TableCellCustome align="left">
                      {item.name}
                    </TableCellCustome>
                    <TableCellCustome align="left">
                      {/* {item.is_displayed} */}
                      <Button
                        size="small"
                        variant="contained"
                        disabled={!item.is_displayed}
                      >
                        Displayed
                      </Button>
                    </TableCellCustome>
                    <TableCellCustome align="center">
                      {/* <Button onClick={(e) => handleShowPopover(e, item)}> */}
                      <Button>
                        <DeleteIconCustome />
                      </Button>
                    </TableCellCustome>
                  </TableRowCustom>
                  {item.child_category.length > 0 && (
                    <>
                      <TableRow>
                        <TableCellPadding colSpan={3}>
                          <Table size="small" aria-label="purchases">
                            <TableBody>
                              {item.child_category.map((dataChild) => {
                                console.log('dataChild: ', dataChild)
                                return (
                                  <>
                                    <TableRowCustom key={dataChild.id}>
                                      <TableCellCustomeChild align="left">
                                        {dataChild.name}
                                      </TableCellCustomeChild>
                                      <TableCellCustome align="left">
                                        {/* <Checkbox
                                          checked={dataChild.is_displayed}
                                        /> */}
                                        {/* {dataChild.is_displayed === true ? (
                                          <Button variant="contained"></Button>
                                        ) : (

                                        )} */}

                                        <Button
                                          size="small"
                                          variant="contained"
                                          disabled={!dataChild.is_displayed}
                                        >
                                          Displayed
                                        </Button>
                                      </TableCellCustome>
                                      <TableCellCustome align="center">
                                        <Button>
                                          <DeleteIconCustome />
                                        </Button>
                                      </TableCellCustome>
                                    </TableRowCustom>
                                  </>
                                )
                              })}
                              {/* ))} */}
                            </TableBody>
                          </Table>
                        </TableCellPadding>
                      </TableRow>
                    </>
                  )}
                </>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <>
        <Modal
          open={showModal}
          onClose={handleShowModel}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box sx={{ width: 400 }}>
            <h2 id="parent-modal-title">Text in a modal</h2>
            <p id="parent-modal-description">
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </p>
            <Button onClick={handleShowModalChild}>Show Child Category</Button>
          </Box>
        </Modal>
      </>
      <>
        <Modal
          hideBackdrop
          open={showModalChild}
          onClose={handleShowModalChild}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ width: 200 }}>
            <h2 id="child-modal-title">Text in a child modal</h2>
            <p id="child-modal-description">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            </p>
            <Button onClick={handleShowModalChild}>Close Child Modal</Button>
          </Box>
        </Modal>
      </> */}
    </>
  )
}

SupplierCategories.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export default SupplierCategories
