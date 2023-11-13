import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Chip,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  MenuItem,
  Modal,
  Pagination,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/material/styles'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  ArrowLeft,
  ArrowRight,
  Gear,
  MagnifyingGlass,
  X,
} from '@phosphor-icons/react'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCancel,
  ButtonCustom,
  InputLabelCustom,
  MenuAction,
  MenuItemSelectCustom,
  PlaceholderSelect,
  SelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldSearchCustom,
  TypographyH2,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  KEY_MODULE,
  PERMISSION_RULE,
  checkPermission,
  handlerGetErrMessage,
  isEmptyObject,
  objToStringParam,
  platform,
} from 'src/utils/global.utils'
import {
  AssignRoleForUser,
  changeCommission,
  getListRoles,
  getSellerList,
  resetPasswordForSeller,
} from './apiSeller'
import {
  AssignRoleForUserType,
  CommissionType,
  ListUserWithRoleType,
  RenderTreeType,
  RoleDetailFromListRoleType,
  RoleListResponseType,
  SellerDataResponseType,
  SellerDataType,
  researchSellerType,
} from './sellerModel'
import classes from './styles.module.scss'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useTheme } from '@mui/material/styles'
import { NumericFormat } from 'react-number-format'
import WithPermission from 'src/utils/permission.utils'
import DetailUser from '../detail'
import { schema, schemaAssignRole, schemaCommission } from './validations'

import { useTranslation } from 'next-i18next'

const CustomBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 460,

  padding: '50px',
  borderRadius: '8px',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
}))
const TypographyHeading = styled(Typography)(() => ({
  color: '#49516F',
  fontWeight: '700',
  fontSize: '2.4rem',
  textAlign: 'center',
  marginBottom: '27px',
}))
const TypographyBody = styled(Typography)(() => ({
  color: '#49516F',
  fontWeight: '500',
  textAlign: 'center',
  marginBottom: '27px',
}))
const BoxModalCustom = styled(Box)(() => ({
  background: 'white',
  width: `500px`,
  height: '100%',
  padding: '25px',
}))
const UserListComponent = () => {
  const { t } = useTranslation('user-management')
  const arrayPermission = useAppSelector((state) => state.permission.data)
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [stateSellerList, setStateSellerList] =
    useState<SellerDataResponseType>()
  const [stateSellerId, setStateSellerId] = useState<number | undefined>()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [stateListRole, setStateListRole] = useState<RoleListResponseType>({
    data: [],
  })
  const [stateCurrentArrayRoleObj, setStateCurrentArrayRoleObj] = useState<
    RenderTreeType[]
  >([])
  const [stateOpenModalReset, setStateOpenModalReset] = useState(false)
  const [stateDrawer, setStateDrawer] = useState<boolean>(false)
  const [stateDrawerCommission, setStateDrawerCommission] = useState(false)
  const [stateDrawerDetail, setStateDrawerDetail] = useState(false)
  const handleCloseModalReset = () => setStateOpenModalReset(false)

  //responsive
  const theme = useTheme()

  const [stateCurrentUser, setStateCurrentUser] =
    useState<ListUserWithRoleType>()
  /**
   * A function that gets the seller list from the backend.
   */
  const handleGetSellerList = (query: object) => {
    dispatch(loadingActions.doLoading())
    getSellerList(query)
      .then((res) => {
        const data = res.data
        setStateSellerList(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(() => {
        dispatch(loadingActions.doLoadingFailure())
      })
    getListRoles({})
      .then((response) => {
        const { data } = response
        setStateListRole(data)
        // array of role obj
        const temporaryArr: RenderTreeType[] = []
        handleTreeObjectFromApi(data.data, temporaryArr)
        console.log('temporarryArr', temporaryArr)
        setStateCurrentArrayRoleObj(temporaryArr)
        // const currentAssignRoleArr = temporaryArr.map((role) => role.id)
        // console.log('currentAssignRoleArr', currentAssignRoleArr)
        // console.log('get list roles from modal', data)
        // setValueAssignRole('roles', currentAssignRoleArr)
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  useEffect(() => {
    // if (
    //   !checkPermission(arrayPermission, KEY_MODULE.User, PERMISSION_RULE.Assign)
    // )
    //   return
    if (router.asPath.length !== router.pathname.length) {
      if (!isEmptyObject(router.query)) {
        handleGetSellerList(router.query)
      }
    } else {
      handleGetSellerList({})
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.query])

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<researchSellerType>({
    resolver: yupResolver(schema),
    mode: 'all',
  })
  const {
    handleSubmit: handleSubmitCommission,
    control: controlCommission,
    setValue: setValueCommission,
    formState: { errors: errorsCommission },
  } = useForm<CommissionType>({
    resolver: yupResolver(schemaCommission),
    mode: 'all',
  })

  /**
   * It takes the data from the form, and then it replaces the current URL with a new URL that has the
   * search query and the page number
   */
  const onSubmit = (data: researchSellerType) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        search: data.search,
        page: 1,
      })}`,
    })
  }

  //pagination
  const handleChangePagination = (
    event: ChangeEvent<unknown>,
    page: number
  ) => {
    console.log(event)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
  }

  /**
   * It takes the event from the select component, and then it replaces the current URL with a new URL
   * that has the new limit and page number
   */
  const handleChangeRowsPerPage = (event: SelectChangeEvent<unknown>) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: Number(event.target.value),
        page: 1,
      })}`,
    })
  }

  /**
   * It's a function that dispatches a loading action, then calls an API function to reset the password
   * of a seller, then dispatches a loading success action, then pushes a success message, then closes
   * the modal, then closes the menu
   */
  const handleConfirmResetPassword = () => {
    dispatch(loadingActions.doLoading())
    resetPasswordForSeller(Number(stateSellerId))
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage('Reset user password successfully', 'success')
        handleCloseModalReset()
        handleCloseMenu()
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  //Menu Delete and edit
  const open = Boolean(anchorEl)
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }
  const handleTreeObjectFromApi = (
    node: RenderTreeType[],
    array: RenderTreeType[]
  ) => {
    node.forEach((item) => {
      array.push(item)
      console.log('item that push from tree obj', item)
      if (item.child_role.length > 0) {
        handleTreeObjectFromApi(item.child_role, array)
      }
    })
  }
  const handleOpenDrawerAssignrole = () => {
    setAnchorEl(null)
    setStateDrawer(true)
  }
  const {
    handleSubmit: handleSubmitAssignRole,
    control: controlAssignRole,
    formState: { errors: errorsAssignRole },
    setValue: setValueAssignRole,
    getValues: getValuesAssignRole,
  } = useForm({
    resolver: yupResolver(schemaAssignRole),
    mode: 'all',
  })
  const handleClickGearAction = (e: any, item: SellerDataType) => {
    setStateSellerId(item.id)
    setStateCurrentUser(item)
    handleOpenMenu(e)
    const temporaryListRole = item.roles.map(
      (items: RoleDetailFromListRoleType) => {
        return items.id
      }
    )
    console.log('temporaryListRole', temporaryListRole)
    e.stopPropagation()

    // array of id roles
    setValueAssignRole('roles', temporaryListRole)
  }

  const handleCloseModalDetail = () => {
    setStateDrawerDetail(false)
  }

  const handleCloseModalAssignRole = () => {
    setStateDrawer(false)
    setValueAssignRole('roles', [])
    setAnchorEl(null)
  }
  const onSubmitAssignRole = () => {
    const assignRole: AssignRoleForUserType = {
      user: Number(stateCurrentUser?.id),
      roles: getValuesAssignRole('roles'),
    }
    AssignRoleForUser(assignRole)
      .then(() => {
        pushMessage(
          t('message.theUserHasBeenAssignedRolesSuccessfully'),
          'success'
        )
        setAnchorEl(null)
        dispatch(loadingActions.doLoadingSuccess())
        handleGetSellerList(router.query)
        handleCloseModalAssignRole()
      })
      .catch(({ response }) => {
        const { data, status } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleCheckGear = () => {
    if (
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Employee,
        PERMISSION_RULE.Update
      ) &&
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Employee,
        PERMISSION_RULE.Update
      ) &&
      !checkPermission(arrayPermission, KEY_MODULE.Role, PERMISSION_RULE.Assign)
    ) {
      return false
    }
    return true
  }

  const renderListItem = (node: any, padding: number) => {
    if (!node) return
    return node.map((item: RenderTreeType) => [
      <MenuItemSelectCustom
        key={item.id}
        value={item.id}
        sx={{ paddingLeft: `${padding}px` }}
        selected={
          getValuesAssignRole('roles').indexOf(item.id) !== -1
          // `${node.id}-${node.name}` ===
        }
        onClick={() => {
          // handleChange(`${item.id}-${item[props.propName]}`)
          console.log(`item.id ${item.id}`)
          console.log('getValuesAssignRole', getValuesAssignRole('roles'))
          const index = getValuesAssignRole('roles').indexOf(item.id)
          const tempArr: number[] = JSON.parse(
            JSON.stringify(getValuesAssignRole('roles'))
          )
          // const arr: number[] = getValuesAssignRole('roles')
          if (index !== -1) {
            const deletedArr = tempArr.splice(index, 1)
            console.log('temporary array after splice', deletedArr)
            setValueAssignRole('roles', tempArr)
          } else {
            setValueAssignRole('roles', [...tempArr, item.id])
            console.log('temporary array after push', tempArr)
          }
          console.log('arr', tempArr)
          console.log('huihu', getValuesAssignRole('roles'))
          // setStateReRender(!stateReRender)
        }}
      >
        {item.name}
      </MenuItemSelectCustom>,
      item.child_role.length > 0 &&
        renderListItem(item.child_role, padding + 16),
    ])
  }
  const handleOpenCommisionDrawer = () => {
    if (!stateCurrentUser) return
    handleCloseMenu()
    setValueCommission(
      'commission',
      Number((stateCurrentUser?.commission * 100).toFixed(2))
    )
    console.log('commission', stateCurrentUser?.commission)
    setStateDrawerCommission(true)
  }

  const handleOpenDetailDrawer = (value: boolean) => {
    setStateDrawerDetail(value)
    handleCloseMenu()
  }

  const handleChangeCommision = (value: CommissionType) => {
    if (!stateCurrentUser) return
    value.commission = Number(value.commission) / 100
    changeCommission(stateCurrentUser?.id, value)
      .then(() => {
        pushMessage(t('message.changeCommissionSuccessfully'), 'success')
        handleGetSellerList(router.query)

        setStateDrawerCommission(false)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  return (
    <>
      <Grid container columnSpacing={'28px'}>
        <Grid xs>
          <form onSubmit={handleSubmit(onSubmit)} className="form-search">
            <Controller
              control={control}
              name="search"
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextFieldSearchCustom
                    id="search"
                    error={!!errors.search}
                    placeholder={t('searchStaffByName')}
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
          <Grid xs style={{ maxWidth: '288px' }}>
            <Link
              href={`/${platform().toLowerCase()}/hrm/user-management/create`}
            >
              <ButtonCustom variant="contained" fullWidth size="large">
                {t('addNewUser')}
              </ButtonCustom>
            </Link>
          </Grid>,
          KEY_MODULE.Employee,
          PERMISSION_RULE.Create
        )}
      </Grid>
      {stateSellerList?.data.length === 0 ? (
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
                  {t('thereAreNoSellerToShow')}
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
                  <TableCellTws> {t('fullName')}</TableCellTws>
                  <TableCellTws> {t('email')}</TableCellTws>
                  <TableCellTws> {t('userType')}</TableCellTws>
                  <TableCellTws> {t('commission')}</TableCellTws>
                  <TableCellTws> {t('status')}</TableCellTws>
                  <TableCellTws> {t('createDate')}</TableCellTws>
                  <TableCellTws width={300}> {t('assignRole')}</TableCellTws>
                  {handleCheckGear() && (
                    <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                      {t('action')}
                    </TableCellTws>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {stateSellerList?.data?.map(
                  (item: SellerDataType, index: number) => (
                    <TableRowTws key={`item-${index}`}>
                      <TableCellTws>
                        {item.full_name ? item.full_name : 'N/A'}
                      </TableCellTws>
                      <TableCellTws>
                        {item.email ? item.email : 'N/A'}
                      </TableCellTws>
                      <TableCellTws sx={{ textTransform: 'capitalize' }}>
                        {item.user_type
                          ? t(`${item.user_type.toLowerCase()}` as any)
                          : 'N/A'}
                      </TableCellTws>
                      <TableCellTws>
                        {item.commission ? (
                          <>
                            {item.commission * 100}
                            {'%'}
                          </>
                        ) : (
                          'N/A'
                        )}
                      </TableCellTws>

                      {item.status ? (
                        item.status ? (
                          <TableCellTws
                            style={{ color: theme.palette.primary.main }}
                          >
                            {t('active')}
                          </TableCellTws>
                        ) : (
                          <TableCellTws style={{ color: '#E02D3C' }}>
                            {t('deactivated')}
                          </TableCellTws>
                        )
                      ) : (
                        <TableCellTws>N/A</TableCellTws>
                      )}

                      <TableCellTws>
                        {item.created_at
                          ? moment(item.created_at).format('MM/DD/YYYY hh:mm A')
                          : 'N/A'}
                      </TableCellTws>
                      <TableCellTws>
                        <div
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {item.roles.length > 0 ? (
                            <>
                              {item.roles
                                ?.map(
                                  (items: RoleDetailFromListRoleType) =>
                                    ' ' + items.name
                                )
                                .toString()}
                            </>
                          ) : (
                            'N/A'
                          )}
                        </div>
                      </TableCellTws>
                      {handleCheckGear() && (
                        <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                          <IconButton
                            onClick={(e) => {
                              handleClickGearAction(e, item)
                            }}
                          >
                            <Gear size={28} />
                          </IconButton>
                        </TableCellTws>
                      )}
                    </TableRowTws>
                  )
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
            <Typography>{t('rowsPerPage')}</Typography>
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
              count={stateSellerList ? stateSellerList.totalPages : 0}
            />
          </Stack>
          <MenuAction
            elevation={0}
            anchorEl={anchorEl}
            open={open}
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
                  href={`/${platform().toLowerCase()}/hrm/user-management/update/${stateSellerId}`}
                >
                  <a>Edit</a>
                </Link>
              </MenuItem>,
              KEY_MODULE.Employee,
              PERMISSION_RULE.Update
            )}
            {WithPermission(
              <MenuItem
                onClick={() => setStateOpenModalReset(true)}
                sx={{ width: '100%', textAlign: 'end' }}
              >
                {t('resetPassword')}
              </MenuItem>,
              KEY_MODULE.Employee,
              PERMISSION_RULE.ResetPassword
            )}
            {WithPermission(
              <MenuItem onClick={handleOpenDrawerAssignrole}>
                {t('assignRole')}
              </MenuItem>,
              KEY_MODULE.Role,
              PERMISSION_RULE.Assign
            )}
            <MenuItem onClick={() => handleOpenCommisionDrawer()}>
              {t('configCommission')}
            </MenuItem>

            <MenuItem onClick={() => handleOpenDetailDrawer(true)}>
              {t('details')}
            </MenuItem>
          </MenuAction>

          <Modal
            open={stateOpenModalReset}
            onClose={() => setStateOpenModalReset(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <CustomBox>
              <IconButton
                onClick={() => setStateOpenModalReset(false)}
                sx={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                }}
              >
                <X size={32} />
              </IconButton>
              <TypographyHeading> {t('resetStaffPassword')}</TypographyHeading>
              <TypographyBody>
                {t(
                  'theUserPasswordWillBeResetAndSendToTheirEmailAddressPleaseConfirmYourAction'
                )}
              </TypographyBody>
              <Stack direction="row" justifyContent="space-between">
                <ButtonCustom
                  variant="contained"
                  size="large"
                  onClick={() => setStateOpenModalReset(false)}
                  sx={{ backgroundColor: '#BABABA' }}
                >
                  {t('cancel')}
                </ButtonCustom>
                <ButtonCustom
                  variant="contained"
                  size="large"
                  onClick={handleConfirmResetPassword}
                >
                  {t('confirm')}
                </ButtonCustom>
              </Stack>
            </CustomBox>
          </Modal>

          <Drawer
            anchor="right"
            onClose={handleCloseModalAssignRole}
            open={stateDrawer}
            disableEnforceFocus
          >
            <BoxModalCustom>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton onClick={handleCloseModalAssignRole}>
                  <ArrowLeft size={24} />
                </IconButton>
                <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
                  {t('assignRole')}
                </TypographyH2>
              </Stack>

              <form onSubmit={handleSubmitAssignRole(onSubmitAssignRole)}>
                <Stack spacing={3}>
                  <Grid xs={6}>
                    <Controller
                      control={controlAssignRole}
                      name="roles"
                      defaultValue={[]}
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            htmlFor="roles"
                            error={!!errorsAssignRole.roles}
                          >
                            {t('selectRoles')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <SelectCustom
                              id="roles"
                              displayEmpty
                              multiple
                              placeholder={t('selectRoles')}
                              IconComponent={() => <KeyboardArrowDownIcon />}
                              {...field}
                              renderValue={(value: any) => {
                                console.log('valueeeee', value)
                                if (!value) {
                                  return (
                                    <PlaceholderSelect>
                                      <div> {t('selectRoles')}</div>
                                    </PlaceholderSelect>
                                  )
                                }
                                return (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      gap: 0.5,
                                    }}
                                  >
                                    {stateCurrentArrayRoleObj.map(
                                      (item: RenderTreeType) => {
                                        const foundRole = getValuesAssignRole(
                                          'roles'
                                        ).findIndex(
                                          (element: number) =>
                                            element === item.id
                                        )
                                        // console.log('found role', foundRole)
                                        if (foundRole < 0) return
                                        console.log('found role', foundRole)
                                        return (
                                          <Chip
                                            key={item.id + Math.random()}
                                            sx={{
                                              maxWidth: '150px',
                                            }}
                                            onMouseDown={(event) =>
                                              event.stopPropagation()
                                            }
                                            onDelete={() => {
                                              const temporaryRolesArr =
                                                getValuesAssignRole(
                                                  'roles'
                                                ).filter((x: number) => {
                                                  return x != item.id
                                                })

                                              setValueAssignRole(
                                                'roles',
                                                temporaryRolesArr
                                              )
                                            }}
                                            label={
                                              <Typography
                                                sx={{
                                                  maxWidth: '100px',
                                                  whiteSpace: 'nowrap',
                                                  overflow: 'hidden',
                                                  textOverflow: 'ellipsis',
                                                }}
                                              >
                                                {item.name}
                                              </Typography>
                                            }
                                          />
                                        )
                                      }
                                    )}
                                  </Box>
                                )
                              }}
                            >
                              {/* <InfiniteScrollSelectMultiple
                                propData={stateListRole}
                                handleSearch={(value) => {
                                  setStateListRole({ data: [] })
                                  handleGetRole(value)
                                }}
                                fetchMore={(value) => {
                                  fetchMoreDataRole(value)
                                }}
                                onClickSelectItem={(item: any) => {
                                  setValueAsssignRole('roles', item)
                                }}
                                propsGetValue={getValuesAssignRole('roles')}
                                propName={'name'}
                              /> */}
                              {renderListItem(stateListRole.data, 16)}
                              {/* {renderListItem(stateListRole.data[0])} */}
                            </SelectCustom>
                            <FormHelperText error={!!errorsAssignRole.roles}>
                              {errorsAssignRole.roles &&
                                `${errorsAssignRole.roles.message}`}
                            </FormHelperText>
                          </FormControl>
                        </>
                      )}
                    />
                  </Grid>
                  <Stack direction="row" spacing={2}>
                    <ButtonCancel
                      onClick={handleCloseModalAssignRole}
                      variant="outlined"
                      size="large"
                    >
                      {t('cancel')}
                    </ButtonCancel>
                    <ButtonCustom
                      variant="contained"
                      size="large"
                      type="submit"
                    >
                      {t('submit')}
                    </ButtonCustom>
                  </Stack>
                </Stack>
              </form>
            </BoxModalCustom>
          </Drawer>

          <Drawer
            anchor="right"
            open={stateDrawerCommission}
            onClose={() => setStateDrawerCommission(false)}
            disableEnforceFocus
          >
            <BoxModalCustom>
              <Stack direction="row" spacing={2} alignItems="center">
                <IconButton onClick={() => setStateDrawerCommission(false)}>
                  <ArrowLeft size={24} />
                </IconButton>{' '}
                <TypographyH2 sx={{ fontSize: '2.4rem' }}>
                  {t('configCommission')}
                </TypographyH2>
              </Stack>
              <Typography sx={{ fontStyle: 'italic' }}>
                {t(
                  'theCommissionAmountWillBeCalculatedBasedOnTheTotalPurchaseOrderAmount'
                )}
              </Typography>
              <form onSubmit={handleSubmitCommission(handleChangeCommision)}>
                <Box sx={{ marginBottom: '15px' }}>
                  <Controller
                    control={controlCommission}
                    name="commission"
                    render={() => (
                      <>
                        <InputLabelCustom> {t('commission')}</InputLabelCustom>
                        <div className={classes['input-number']}>
                          <NumericFormat
                            defaultValue={Number(
                              (
                                Number(stateCurrentUser?.commission) * 100
                              ).toFixed(2)
                            )}
                            placeholder="0"
                            allowNegative={false}
                            isAllowed={(values) => {
                              const { floatValue, formattedValue } = values
                              if (!floatValue) {
                                return formattedValue === ''
                              }
                              return floatValue <= 100
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  sx={{ textTransform: 'capitalize' }}
                                >
                                  %
                                </InputAdornment>
                              ),
                            }}
                            customInput={TextField}
                            error={!!errorsCommission.commission}
                            onValueChange={(value: any) => {
                              setValueCommission('commission', value.floatValue)
                              // trigger('quantity')
                            }}
                          />
                        </div>
                        <FormHelperText error>
                          {errorsCommission.commission &&
                            errorsCommission.commission.message}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Box>

                <ButtonCustom type="submit" variant="contained">
                  {t('submit')}
                </ButtonCustom>
              </form>
            </BoxModalCustom>
          </Drawer>

          <Drawer
            anchor={'right'}
            open={stateDrawerDetail}
            onClose={handleCloseModalDetail}
            disableEnforceFocus
          >
            <Box sx={{ padding: '20px', width: '425px' }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  marginBottom: '10px',
                }}
              >
                <IconButton onClick={handleCloseModalDetail}>
                  <ArrowRight size={24} />
                </IconButton>
                <Typography
                  sx={{
                    fontSize: '2.4rem',
                    fontWeight: 700,
                    color: '#49516F',
                  }}
                >
                  {t('userDetails')}
                </Typography>
              </Stack>
              <DetailUser
                open={stateDrawerDetail}
                stateSellerId={stateSellerId}
              />
            </Box>
          </Drawer>
        </>
      )}
    </>
  )
}

export default UserListComponent
