import { useState, useEffect } from 'react'

import { useRouter } from 'next/router'

//Api
import {
  getListMerchantDistribution,
  deleteMerchantDistribution,
} from './apiMerchantDistribution'

//Modal
import { ListMerchantDataResponseType } from './modalMerchantDistribution'

//MUI
import {
  Typography,
  TableRow,
  Table,
  TableBody,
  TableHead,
  IconButton,
  Grid,
  FormControl,
  Stack,
  Pagination,
  Dialog,
} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'

//Src and styled

import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { isEmptyObject, objToStringParam } from 'src/utils/global.utils'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import {
  ButtonCustom,
  SelectPaginationCustom,
  MenuItemSelectCustom,
  ButtonCancel,
  TableCellTws,
  TableRowTws,
  MenuAction,
  TableContainerTws,
  DialogTitleTws,
  TypographyH2,
  DialogContentTws,
  DialogContentTextTws,
  DialogActionsTws,
} from 'src/components'
import { TypographyHeadTable } from './styled'
import { Gear, X } from '@phosphor-icons/react'
import Image from 'next/image'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

const ListMerchantHasBelongToDC = () => {
  const { t } = useTranslation('dc')

  const [openDialog, setOpenDialog] = useState(false)
  const [stateIdMerchant, setStateIdMerchant] = useState<number | undefined>()
  const [nameMerchant, setNameMerchant] = useState<string | undefined>()
  const [pushMessage] = useEnqueueSnackbar()

  const [listMerchantDistributionList, setListMerchantDistributionList] =
    useState<ListMerchantDataResponseType>()

  // state use for

  const router = useRouter()
  const dispatch = useAppDispatch()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClickGear = (
    event: React.MouseEvent<HTMLElement>,
    id: number
  ) => {
    setStateIdMerchant(id)
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleGetListMerchant = (query: any) => {
    dispatch(loadingActions.doLoading())
    getListMerchantDistribution(query)
      .then((res) => {
        const data = res.data
        dispatch(loadingActions.doLoadingSuccess())
        setListMerchantDistributionList(data)
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  useEffect(() => {
    if (router.query.id) {
      if (router.asPath.length !== router.pathname.length) {
        if (!isEmptyObject(router.query)) handleGetListMerchant(router.query)
      } else {
        handleGetListMerchant({})
      }
    }
  }, [dispatch, router.query])

  // dialog
  const handleDialog = () => {
    setOpenDialog(!openDialog)
  }

  const handleDelete = () => {
    deleteMerchantDistribution(Number(stateIdMerchant), Number(router.query.id))
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(t('pushMessage.removeMerchantSuccess'), 'success')
        handleClose()
        handleDialog()
        router.replace({
          search: `${objToStringParam({
            ...router.query,
            page: 1,
          })}`,
        })
        handleGetListMerchant(router.query)
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  //pagination
  const handleChangePagination = (page: number) => {
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

  return (
    <>
      <TypographyHeadTable>{t('titleMerchantList')}</TypographyHeadTable>
      {listMerchantDistributionList?.data.length === 0 ? (
        <Grid container spacing={2} justifyContent="center">
          <Grid>
            <Stack
              p={5}
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Image
                src={'/' + '/images/not-found.svg'}
                alt="Logo"
                width="200"
                height="200"
              />
              <Typography variant="h6" sx={{ marginTop: '0' }}>
                {t('thisChannelDontHaveAnyRetailer')}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <>
          <TableContainerTws>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws sx={{ width: '80px', textAlign: 'center' }}>
                    {t('numericOrder')}
                  </TableCellTws>
                  <TableCellTws>{t('retailerName')}</TableCellTws>
                  <TableCellTws>{t('joinDate')}</TableCellTws>
                  <TableCellTws width={80}>{t('action')}</TableCellTws>
                </TableRow>
              </TableHead>
              <TableBody>
                {listMerchantDistributionList?.data?.map((item, index) => {
                  return (
                    <TableRowTws key={`item-${index}`}>
                      <TableCellTws sx={{ width: '80px', textAlign: 'center' }}>
                        {(router.query.limit
                          ? Number(router.query.limit)
                          : 10) *
                          (router.query.page ? Number(router.query.page) : 1) -
                          (router.query.limit
                            ? Number(router.query.limit)
                            : 10) +
                          index +
                          1}
                      </TableCellTws>
                      <TableCellTws>{item.organization}</TableCellTws>
                      <TableCellTws>
                        {moment(item.joined_date).format('MM/DD/YYYY - h:mm A')}
                      </TableCellTws>
                      <TableCellTws>
                        <IconButton
                          onClick={(e) => {
                            handleClickGear(e, item.organization_id)
                            setNameMerchant(item.organization)
                          }}
                        >
                          <Gear size={28} />
                        </IconButton>
                        <MenuAction
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          elevation={0}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                        >
                          <MenuItem onClick={handleDialog}>
                            {t('delete')}
                          </MenuItem>
                        </MenuAction>
                      </TableCellTws>
                    </TableRowTws>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainerTws>

          <Dialog open={openDialog} onClose={handleDialog}>
            <DialogTitleTws>
              <IconButton onClick={handleDialog}>
                <X size={20} />
              </IconButton>
            </DialogTitleTws>
            <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
              {t('deleteRetailer')}
            </TypographyH2>
            <DialogContentTws>
              <DialogContentTextTws>
                {`${t('areYouSureToRemove')} ${nameMerchant} ${t('outOfDC')}?`}
              </DialogContentTextTws>
            </DialogContentTws>
            <DialogActionsTws>
              <Stack spacing={2} direction="row">
                <ButtonCancel
                  onClick={handleDialog}
                  variant="outlined"
                  size="large"
                >
                  {t('cancel')}
                </ButtonCancel>
                <ButtonCustom
                  onClick={handleDelete}
                  variant="contained"
                  size="large"
                >
                  {t('confirm')}
                </ButtonCustom>
              </Stack>
            </DialogActionsTws>
          </Dialog>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={2}
          >
            <Typography>{t('rowsPerPage')}</Typography>
            <FormControl sx={{ m: 1 }}>
              <SelectPaginationCustom
                value={
                  Number(router.query.limit) ? Number(router.query.limit) : 10
                }
                onChange={handleChangeRowsPerPage}
              >
                <MenuItemSelectCustom value={10}>10</MenuItemSelectCustom>
                <MenuItemSelectCustom value={20}>20</MenuItemSelectCustom>
                <MenuItemSelectCustom value={50}>50</MenuItemSelectCustom>
                <MenuItemSelectCustom value={100}>100</MenuItemSelectCustom>
              </SelectPaginationCustom>
            </FormControl>
            <Pagination
              color="primary"
              variant="outlined"
              shape="rounded"
              defaultPage={1}
              page={Number(router.query.page) ? Number(router.query.page) : 1}
              onChange={(e, page) => {
                console.log(e)
                handleChangePagination(page)
              }}
              count={
                listMerchantDistributionList
                  ? listMerchantDistributionList?.totalPages
                  : 0
              }
            />
          </Stack>
        </>
      )}
    </>
  )
}

export default ListMerchantHasBelongToDC
