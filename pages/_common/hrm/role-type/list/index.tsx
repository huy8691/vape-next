import { yupResolver } from '@hookform/resolvers/yup'
import {
  FormControl,
  Grid,
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
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Gear, MagnifyingGlass } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCustom,
  MenuAction,
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldSearchCustom,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  handlerGetErrMessage,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
  platform,
} from 'src/utils/global.utils'
import WithPermission from 'src/utils/permission.utils'
import { getListRoleType } from './apiRoleType'
import { RoleTypeDataResponseType, RoleTypeDataType } from './modalRoleType'
import { schema } from './validations'
import { useTranslation } from 'next-i18next'

const ListRole = () => {
  const { t } = useTranslation('role-type')
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()

  const [stateListRoleType, setStateListRoleType] =
    useState<RoleTypeDataResponseType>()
  const [stateRoleGear, setStateRoleGear] = useState<RoleTypeDataType>()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const arrayPermission = useAppSelector((state) => state.permission.data)

  //MenuGear
  const openMenu = Boolean(anchorEl)
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const onSubmitSearch = (values: any) => {
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          search: values.search,
          page: 1,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }

  const handleChangeRowsPerPage = (event: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: Number(event.target.value),
        page: 1,
      })}`,
    })
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  useEffect(() => {
    getListRoleType(router.query)
      .then((res) => {
        const data = res.data
        setStateListRoleType(data)

        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })

    console.log(stateRoleGear)
  }, [router.query])

  const handleClickUpdate = () => {
    const urlUpdate =
      platform() == 'SUPPLIER'
        ? `/supplier/hrm/role-type/update/${stateRoleGear?.id}`
        : platform() == 'RETAILER' &&
          `/retailer/hrm/role-type/update/${stateRoleGear?.id}`

    router.push(`${urlUpdate}`)
  }

  const handleChangePagination = (e: any, page: number) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
    console.log(e)
  }

  const checkPermission = (moduleName: string, permissionRule: string) => {
    const foundModule = arrayPermission.findIndex(
      (item) => item.module === moduleName
    )

    if (foundModule < 0) return false
    const permissionObject = arrayPermission[foundModule].permissions
    if (Object.keys(permissionObject).includes(permissionRule)) {
      return true
    } else {
      return false
    }
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs>
          <form onSubmit={handleSubmit(onSubmitSearch)} className="form-search">
            <Controller
              control={control}
              name="search"
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextFieldSearchCustom
                    id="search"
                    error={!!errors.search}
                    placeholder={t('searchRoleType')}
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

        {WithPermission(
          <Grid item xs style={{ maxWidth: '288px' }}>
            <Link
              href={`${
                platform() == 'SUPPLIER'
                  ? '/supplier/hrm/role-type/create'
                  : platform() == 'RETAILER' && '/retailer/hrm/role-type/create'
              }`}
            >
              <ButtonCustom variant="contained" fullWidth size="large">
                {t('createRoleType')}
              </ButtonCustom>
            </Link>
          </Grid>,
          KEY_MODULE.Role,
          PERMISSION_RULE.CreateRoleType
        )}
      </Grid>

      {stateListRoleType?.data.length == 0 ? (
        <>
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
                  {t('thereAreNoRoleTypeToShow')}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <TableContainerTws>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws>{t('list.no.')}</TableCellTws>
                  <TableCellTws>{t('list.name')}</TableCellTws>
                  {/* <TableCellTws>Organization</TableCellTws> */}
                  {checkPermission(
                    KEY_MODULE.Role,
                    PERMISSION_RULE.UpdateRoleType
                  ) && (
                    <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                      {t('list.action')}
                    </TableCellTws>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {stateListRoleType?.data?.map(
                  (item: RoleTypeDataType, index: number) => {
                    return (
                      <TableRowTws key={`item-${index}`}>
                        <TableCellTws>{index + 1}</TableCellTws>
                        <TableCellTws>
                          {item.name ? item.name : 'N/A'}
                        </TableCellTws>
                        {/* <TableCellTws sx={{ textTransform: 'capitalize' }}>
                          {' '}
                          {item.organization}
                        </TableCellTws> */}

                        {checkPermission(
                          KEY_MODULE.Role,
                          PERMISSION_RULE.UpdateRoleType
                        ) && (
                          <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                            <IconButton
                              onClick={(e) => {
                                setStateRoleGear(item)
                                handleOpenMenu(e)
                                e.stopPropagation()
                              }}
                            >
                              <Gear size={28} />
                            </IconButton>
                          </TableCellTws>
                        )}
                      </TableRowTws>
                    )
                  }
                )}
              </TableBody>
            </Table>
          </TableContainerTws>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={2}
          >
            <Typography>{t('list.rowsPerPage')}</Typography>
            <FormControl sx={{ m: 1 }}>
              <SelectPaginationCustom
                value={
                  Number(router.query.limit) ? Number(router.query.limit) : 10
                }
                onChange={handleChangeRowsPerPage}
                displayEmpty
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
              onChange={(event, page: number) =>
                handleChangePagination(event, page)
              }
              count={stateListRoleType ? stateListRoleType.totalPages : 0}
            />
          </Stack>
        </>
      )}

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
        {WithPermission(
          <MenuItem onClick={handleClickUpdate}>{t('update')}</MenuItem>,
          KEY_MODULE.Role,
          PERMISSION_RULE.UpdateRoleType
        )}
      </MenuAction>
    </>
  )
}

export default ListRole
