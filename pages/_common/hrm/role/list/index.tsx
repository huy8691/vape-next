import {
  Box,
  Dialog,
  FormControl,
  IconButton,
  Stack,
  Typography,
  TableHead,
  Table,
  TableRow,
  TableBody,
  MenuItem,
} from '@mui/material'

import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  TextFieldSearchCustom,
  TypographyH2,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  MenuAction,
} from 'src/components'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { yupResolver } from '@hookform/resolvers/yup'
import Grid from '@mui/material/Unstable_Grid2'

import Link from 'next/link'
import { MagnifyingGlass, X, Gear } from '@phosphor-icons/react'
import { Controller, useForm } from 'react-hook-form'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import {
  checkPermission,
  handlerGetErrMessage,
  isEmptyObject,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
  platform,
} from 'src/utils/global.utils'
import WithPermission from 'src/utils/permission.utils'
import { deletePermission, getListRoles } from './apiRole'
import { RenderTreeType, RoleListResponseType } from './modelRoles'
import { schema } from './validations'
import classes from './styles.module.scss'
import { useTranslation } from 'next-i18next'

const ListRoleComponent: React.FC = () => {
  const { t } = useTranslation('role')
  const [pushMessage] = useEnqueueSnackbar()
  const [stateCurrentId, setStateCurrentId] = useState<RenderTreeType>()
  const [openDialog, setOpenDialog] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const openMenu = Boolean(anchorEl)
  // const [stateTemporaryProduct, setStateTemporaryProduct] =
  //   useState<RoleTypeData>()
  const arrayPermission = useAppSelector((state) => state.permission.data)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    console.log('event from open menu', event)
    console.log('event from open menu anchorel', event.currentTarget)
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }
  const handleDialog = () => {
    setOpenDialog(!openDialog)
    handleCloseMenu()
  }

  const router = useRouter()
  const dispatch = useAppDispatch()

  // const handleChangePagination = (e: any, page: number) => {
  //   router.replace({
  //     search: `${objToStringParam({
  //       ...router.query,
  //       page: page,
  //     })}`,
  //   })
  //   console.log(e)
  // }

  // state use for
  const [stateRoleList, setStateRoleList] = useState<RoleListResponseType>()

  // const handleChangeRowsPerPage = (event: any) => {
  //   router.replace({
  //     search: `${objToStringParam({
  //       ...router.query,
  //       limit: Number(event.target.value),
  //       page: 1,
  //     })}`,
  //   })
  // }
  // const open = Boolean(anchorEl)

  const handleGetListRole = (event: any) => {
    dispatch(loadingActions.doLoading())
    getListRoles(event)
      .then((res) => {
        const data = res.data

        setStateRoleList(data)
        dispatch(loadingActions.doLoadingSuccess())
      })

      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response

        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleSearch = (values: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        search: values.name,
        page: 1,
      })}`,
    })
  }
  console.log('anchorel', anchorEl)
  const handleDeleteCurrentRole = () => {
    if (!stateCurrentId) return
    dispatch(loadingActions.doLoading())
    deletePermission(stateCurrentId.id)
      .then(() => {
        handleGetListRole({})
        pushMessage(
          t('message.deleteRoleStateCurrentIdNameSuccessfully', {
            0: stateCurrentId.name,
          }),
          'success'
        )
        setOpenDialog(false)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())

        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const {
    handleSubmit: handleSubmitSearch,
    control: controlSearch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  useEffect(() => {
    if (router.asPath.length !== router.pathname.length) {
      if (!isEmptyObject(router.query)) {
        handleGetListRole(router.query)
      }
    } else {
      handleGetListRole({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.query])
  const handleCheckGear = () => {
    if (
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Role,
        PERMISSION_RULE.Update
      ) &&
      !checkPermission(arrayPermission, KEY_MODULE.Role, PERMISSION_RULE.Delete)
    ) {
      return false
    }
    return true
  }
  const renderTreeViewPermissionList = (node: any, padding: number) => {
    // if (!padding) {
    //   padding = 15
    // }
    return node.map((item: RenderTreeType) => (
      <>
        <TableRowTws>
          <TableCellTws style={{ paddingLeft: `${padding}px` }}>
            {padding && padding > 15 && <Box className={classes['children']} />}
            <Typography style={{ display: 'inline-block', fontWeight: '500' }}>
              {item.name}
            </Typography>
          </TableCellTws>
          {handleCheckGear() && (
            <TableCellTws width={80} sx={{ textAlign: 'center' }}>
              <IconButton
                onClick={(e) => {
                  setStateCurrentId(item)
                  handleOpenMenu(e)
                  e.stopPropagation()
                }}
              >
                <Gear size={28} />
              </IconButton>
            </TableCellTws>
          )}
        </TableRowTws>
        {item.child_role?.length > 0 &&
          renderTreeViewPermissionList(item?.child_role, padding + 15)}
      </>
    ))
  }
  // console.log(renderTreeViewPermissionList)
  return (
    <>
      <Grid container columnSpacing={'28px'}>
        <Grid xs>
          <form
            onSubmit={handleSubmitSearch(handleSearch)}
            className="form-search"
          >
            <Controller
              control={controlSearch}
              name="name"
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextFieldSearchCustom
                    id="search"
                    error={!!errors.name}
                    placeholder={t('searchRoleByName')}
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
          <Grid xs style={{ maxWidth: '330px' }}>
            <Link href={`/${platform().toLowerCase()}/hrm/role/create`}>
              <a>
                <ButtonCustom variant="contained" fullWidth size="large">
                  {t('addNewRole')}
                </ButtonCustom>
              </a>
            </Link>
          </Grid>,
          KEY_MODULE.Role,
          PERMISSION_RULE.Create
        )}
      </Grid>
      <Box>
        {stateRoleList && (
          <>
            <TableContainerTws>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCellTws>{t('role')}</TableCellTws>
                    {handleCheckGear() && (
                      <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                        {t('action')}
                      </TableCellTws>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderTreeViewPermissionList(stateRoleList?.data, 15)}
                </TableBody>
              </Table>
            </TableContainerTws>

            <MenuAction
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
                <MenuItem>
                  <Link
                    href={`/${platform().toLowerCase()}/hrm/role/update/${
                      stateCurrentId?.id
                    }`}
                  >
                    <a>{t('update')}</a>
                  </Link>
                </MenuItem>,
                KEY_MODULE.Role,
                PERMISSION_RULE.Update
              )}
              {WithPermission(
                <MenuItem onClick={() => handleDialog()}>
                  {t('delete')}
                </MenuItem>,
                KEY_MODULE.Role,
                PERMISSION_RULE.Delete
              )}
            </MenuAction>
          </>
        )}
      </Box>

      <Dialog open={openDialog} onClose={handleDialog}>
        <DialogTitleTws>
          <IconButton
            onClick={() => {
              setOpenDialog(false)
            }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {t('deleteRole')}
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>
            {t('areYouSureToRemoveStateCurrentIdNameOutOfList', {
              0: stateCurrentId?.name,
            })}
          </DialogContentTextTws>
        </DialogContentTws>
        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => {
                setOpenDialog(false)
              }}
              variant="outlined"
              size="large"
            >
              {t('no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              size="large"
              onClick={handleDeleteCurrentRole}
            >
              {t('yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
    </>
  )
}

export default ListRoleComponent
