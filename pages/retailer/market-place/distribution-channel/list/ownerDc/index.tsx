import {
  FormControl,
  IconButton,
  MenuItem,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { Gear } from '@phosphor-icons/react'
import { useState } from 'react'
import {
  MenuAction,
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
} from 'src/components'
import { useAppSelector } from 'src/store/hooks'
import {
  checkPermission,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
} from 'src/utils/global.utils'
import { OwnedDCDataType } from '../listDCMerchantModel'
import { useTranslation } from 'react-i18next'

interface Props {
  data: any
}

const OwnerDCMerchant: React.FC<Props> = (props) => {
  const { t } = useTranslation('dc')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)
  const [stateIdDC, setStateIdDC] = useState<number>()
  const arrayPermission = useAppSelector((state) => state.permission.data)

  const router = useRouter()

  console.log('jjjj', props)

  //Menu
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    console.log(event.currentTarget)
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

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

  const handleClickItem = (id: number) => {
    router.push(`/retailer/market-place/distribution-channel/update/${id}`)
  }

  return (
    <>
      <TableContainerTws sx={{ marginTop: '0' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                {t('numericOrder')}
              </TableCellTws>
              <TableCellTws>{t('channelName')}</TableCellTws>
              <TableCellTws>{t('channelCode')}</TableCellTws>
              {checkPermission(
                arrayPermission,
                KEY_MODULE.DistributionChannel,
                PERMISSION_RULE.Update
              ) && <TableCellTws width={20}>{t('action')}</TableCellTws>}
            </TableRow>
          </TableHead>
          <TableBody>
            {props?.data?.data?.map((item: OwnedDCDataType, index: number) => {
              return (
                <TableRowTws
                  key={`item-${index}`}
                  hover={checkPermission(
                    arrayPermission,
                    KEY_MODULE.DistributionChannel,
                    PERMISSION_RULE.ViewDetails
                  )}
                  sx={{
                    cursor: checkPermission(
                      arrayPermission,
                      KEY_MODULE.DistributionChannel,
                      PERMISSION_RULE.ViewDetails
                    )
                      ? 'pointer'
                      : '',
                  }}
                  onClick={() => {
                    if (
                      checkPermission(
                        arrayPermission,
                        KEY_MODULE.DistributionChannel,
                        PERMISSION_RULE.ViewDetails
                      )
                    ) {
                      router.push(
                        `/retailer/market-place/distribution-channel/detail/${item.id}`
                      )
                    }
                  }}
                >
                  <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                    {(router.query.limit ? Number(router.query.limit) : 10) *
                      (router.query.page ? Number(router.query.page) : 1) -
                      (router.query.limit ? Number(router.query.limit) : 10) +
                      index +
                      1}
                  </TableCellTws>
                  <TableCellTws>{item.name}</TableCellTws>
                  <TableCellTws>#{item.code}</TableCellTws>
                  {checkPermission(
                    arrayPermission,
                    KEY_MODULE.DistributionChannel,
                    PERMISSION_RULE.Update
                  ) && (
                    <TableCellTws>
                      <IconButton
                        onClick={(e) => {
                          handleOpenMenu(e)
                          setStateIdDC(item.id)
                          e.stopPropagation()
                        }}
                      >
                        <Gear size={28} />
                      </IconButton>
                    </TableCellTws>
                  )}
                </TableRowTws>
              )
            })}
          </TableBody>
        </Table>
      </TableContainerTws>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={2}
      >
        <Typography>{t('rowsPerPage')}</Typography>
        <FormControl sx={{ m: 1 }}>
          <SelectPaginationCustom
            value={Number(router.query.limit) ? Number(router.query.limit) : 10}
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
          count={props.data ? props?.data?.totalPages : 0}
        />
      </Stack>

      <MenuAction
        elevation={0}
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleClickItem(Number(stateIdDC))}>
          {t('update')}
        </MenuItem>
      </MenuAction>
    </>
  )
}

export default OwnerDCMerchant
