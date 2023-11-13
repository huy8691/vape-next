import { yupResolver } from '@hookform/resolvers/yup'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import Image from 'next/image'
import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCustom,
  MenuItemSelectCustom,
  PlaceholderSelect,
  SelectCustom,
  TextFieldSearchCustom,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import {
  assignRolePermission,
  getDetailRoleTypes,
  getListBoundaryRole,
  getListPermissionOfRole,
  getListRole,
  getListRoleTypeOfRole,
} from './apiRole'

import { ArrowLeft } from '@phosphor-icons/react'
import * as yup from 'yup'
import {
  AssignPermissionType,
  listRoleResponseType,
  ListRoleTypesResponseType,
  PermissionOfRoleType,
  PermissionType,
  RenderTreeType,
  RoleType,
  RoleTypeDetailType,
  SearchType,
} from './roleModel'
import classes from './styles.module.scss'
import { useTranslation } from 'next-i18next'

const Permission: FC = () => {
  const { t } = useTranslation('permission')
  const [pushMessage] = useEnqueueSnackbar()
  const dispatch = useAppDispatch()
  // state store list role to configure from api
  const [stateListRole, setStateListRole] = useState<listRoleResponseType>({
    data: [],
  })
  const [stateListRoleFlatten, setStateListRoleFlatten] = useState<
    RenderTreeType[]
  >([])
  // state store list permission of role ( list permission from current role)
  const [stateListPermissionOfRole, setStateListPermissionOfRole] = useState<
    PermissionType[]
  >([])
  // state store list boundary permission of role ( list boundary permission from current role)
  const [stateListBoundaryPermission, setStateListBoundaryPermission] =
    useState<PermissionOfRoleType[]>([])
  // state store list boundary permission of role when search ( will rerender when search )
  const [stateListBoundaryForSearch, setStateListBoundaryForSearch] = useState<
    PermissionOfRoleType[]
  >([])
  // array store current permission of role assigned ( type number[]) use for interact and compare when configure permission (check/uncheck, ..... this array is used for submit data )
  const arrayPermissionOfRoleAssigned: number[] = useMemo(() => [], [])
  // array boundary permission ( type number[]) use for interact and compare when configure permission
  const arrayBoundaryPermission: number[] = useMemo(() => [], [])
  // state use for enable/disable apply/replace role type , select all button and configure permission function
  const [stateIsActiveConfigurate, setStateIsActiveConfigurate] =
    useState<boolean>(false)
  // state store current role selected
  const [stateCurrentRoleId, setStateCurrentRoleId] = useState<number>()
  // state use for enable/disable drawer
  const [stateDrawer, setStateDrawer] = useState<boolean>(false)
  // state use for trigger rerender when interact with checkbox and array
  const [stateRerender, setStateRerender] = useState(false)
  // state store current role type selected
  const [stateCurrentRoleType, setStateCurrentRoleType] =
    useState<RoleTypeDetailType>()
  // state store list role type
  const [stateListRoleType, setStateListRoleType] =
    useState<ListRoleTypesResponseType>()
  // handle submit assign role ( submit the configure permission )
  const handleSubmitAssignRole = (e: any) => {
    // avoid if there is none of role is selected
    if (!stateCurrentRoleId) return
    dispatch(loadingActions.doLoading())
    // deleteArr number[] will store the deleted permission id from previous and current list permission of role
    const previousPermissionOfRoleArr: number[] = []
    // convert list permission of role ( from previous ) from [key:string] [] to number[] then push to delete array
    stateListPermissionOfRole.forEach((item) =>
      Object.keys(item.permissions).forEach((permission) => {
        previousPermissionOfRoleArr.push(item.permissions[permission])
      })
    )
    console.log('arrayPermissionOfRoleAssigned', arrayPermissionOfRoleAssigned)
    // create new array that store the different between current list permission of role ( type number[]) and previous. This will be the deleted permission id array
    const differenceArr = previousPermissionOfRoleArr.filter(
      (item) => !arrayPermissionOfRoleAssigned.includes(item)
    )
    // deep copy current list permission of role to avoid issue when interact with array
    let cloneArrayPermissionRoleAssigned: number[] = JSON.parse(
      JSON.stringify(arrayPermissionOfRoleAssigned)
    )
    // remove duplicates ID permission ( for sure )
    cloneArrayPermissionRoleAssigned = cloneArrayPermissionRoleAssigned.filter(
      (item, index) => {
        return (
          index ===
          cloneArrayPermissionRoleAssigned.findIndex((x) => item === x)
        )
      }
    )
    // create new object with 2 properties : current list permission of role and deleted permission of role ( both are type number [])
    const submitRolePermissionList: AssignPermissionType = {
      permissions: cloneArrayPermissionRoleAssigned,
      deleted_permissions: differenceArr,
    }

    console.log(
      'arrayPermissionOfRoleAssigned after submit',
      arrayPermissionOfRoleAssigned
    )
    // submit api
    assignRolePermission(Number(stateCurrentRoleId), submitRolePermissionList)
      .then(() => {
        pushMessage(t('message.assignPermissionSuccessfully'), 'success')
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
    // avoid form refresh page
    e.preventDefault()
  }
  // this function receive id of permission and will return true/false to render check/uncheck when render list permission
  const checkPermissionAssigned = (id: number) => {
    return arrayPermissionOfRoleAssigned.includes(id)
  }
  // call api get list boundary and set state, this function will receive page ( identity page ), array permission to store data from all page, id of role assiged
  const handleGetListBoundary = (
    page: number,
    array: PermissionOfRoleType[],
    index: number
  ) => {
    // api get list boundary of role
    getListBoundaryRole(index, { page: page })
      .then((res) => {
        const { data } = res.data
        // push data from api to permanent array from each call api
        array.push(...data)
        // convert data from api to number[] and avoid duplicates
        data.forEach((item) =>
          Object.keys(item.permissions).forEach((permission) => {
            if (
              !arrayBoundaryPermission.includes(item.permissions[permission].id)
            ) {
              arrayBoundaryPermission.push(item.permissions[permission].id)
            }
          })
        )
        if (res.data.nextPage && res.data.nextPage > 0) {
          // if there is next page, recursive time ! but with next page as props
          handleGetListBoundary(res.data.nextPage, array, index)
        } else {
          // if there is last page, set array that we store data for each call api to state
          console.log('array handle get list boundary', array)
          setStateListBoundaryPermission(array)
          setStateListBoundaryForSearch(array)
          // testing when choosing role

          console.log(
            'arrayBoundaryPermission when call api',
            arrayBoundaryPermission
          )
          // create new array to store list permission of role permanent
          const permissionOfRoleArray: PermissionType[] = []
          // this function is same logic with above function
          handleGetListPermissionOfRole(1, permissionOfRoleArray, index)
        }
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  // this function is same logic with above function
  const handleGetListPermissionOfRole = (
    page: number,
    array: PermissionType[],
    index: number
  ) => {
    getListPermissionOfRole(index, { page: page })
      .then((res) => {
        const { data } = res.data
        console.log(
          'arrayPermissionOfRoleAssigned',
          arrayPermissionOfRoleAssigned
        )

        data.forEach((element) => {
          Object.keys(element.permissions).forEach((permission) => {
            arrayPermissionOfRoleAssigned.push(element.permissions[permission])
          })
        })
        array.push(...data)

        if (res.data.nextPage && res.data.nextPage > 0) {
          handleGetListPermissionOfRole(res.data.nextPage, array, index)
        } else {
          setStateListPermissionOfRole(array)
          // setStateListPermissionOfRoleToCompare(array)
        }
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  // handle select role to configure permision
  const handleOnClickRole = (index: number) => {
    // set state current permission role
    setStateCurrentRoleId(index)
    dispatch(loadingActions.doLoading())
    // empty array permission of role
    arrayPermissionOfRoleAssigned.length = 0
    console.log(
      'arrayPermissionOfRoleAssigned after reset to 0',
      arrayPermissionOfRoleAssigned
    )
    arrayBoundaryPermission.length = 0
    const boundaryArray: PermissionOfRoleType[] = []
    handleGetListBoundary(1, boundaryArray, index)
  }
  // call api get list once when load page
  const handleTreeObjectFromApi = (node: any[], array: RenderTreeType[]) => {
    node.forEach((item) => {
      array.push(item)
      console.log('item that push from tree obj', item)
      if (item.child_role.length > 0) {
        handleTreeObjectFromApi(item.child_role, array)
      }
    })
  }
  useEffect(() => {
    dispatch(loadingActions.doLoading())
    getListRole()
      .then((res) => {
        const data = res.data
        const temporaryArr: RenderTreeType[] = []
        handleTreeObjectFromApi(data.data, temporaryArr)
        setStateListRoleFlatten(temporaryArr)
        setStateListRole(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [])

  // handle check/uncheck checkbox
  const handleOnChangeCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    // if target is check => push target permission id to current array list permisison of role
    if (event.target.checked) {
      arrayPermissionOfRoleAssigned.push(Number(event.target.value))
      console.log(
        'arrayPermissionOfRoleAssigned after check',
        arrayPermissionOfRoleAssigned
      )
      // trigger state rerender
      setStateRerender(!stateRerender)
    } else {
      // if target is uncheck => remove target permission from current array list permission of role
      const removedIndex = arrayPermissionOfRoleAssigned.findIndex(
        (id) => id === Number(event.target.value)
      )
      arrayPermissionOfRoleAssigned.splice(removedIndex, 1)
      // trigger state rerender
      setStateRerender(!stateRerender)

      console.log(
        'arrayPermissionOfRoleAssigned after uncheck',
        arrayPermissionOfRoleAssigned
      )
      // console.log(
      //   'after delete array permission',
      //   arrayPermissionOfRoleAssigned
      // )
    }
  }
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<SearchType>({
    resolver: yupResolver(
      yup.object().shape({
        search: yup.string().max(255),
      })
    ),
    mode: 'all',
  })

  // handle search key module in client side ( not call api)
  const handleOnChangeSearch = (value: string) => {
    // deep copy list boundary permission to avoid issue
    const cloneArray: PermissionOfRoleType[] = JSON.parse(
      JSON.stringify(stateListBoundaryPermission)
    )
    // if value search is null => reset to current list permission of role
    if (value === '') {
      setStateListBoundaryForSearch(stateListBoundaryPermission)
    } else {
      // if not => render by key
      // filter list permission of role to get list of found module
      const foundItem = cloneArray.filter((item) => {
        return item.module.toLowerCase().includes(value.toLowerCase())
      })
      console.log('foundItem from search', foundItem)
      // empty array
      cloneArray.length = 0
      // if have found item => push it it array then render it
      if (foundItem) {
        cloneArray.push(...foundItem)
        setStateListBoundaryForSearch(cloneArray)
      }
    }
  }
  // check if current role type is match condition to replace/apply list permission of role
  const checkEnableApplyReplace = () => {
    // prevent if none of role type is select
    if (!stateCurrentRoleType) return
    const arrayFromRoleType: number[] = []
    // coonvert [key:string] [] to number[] then push to arrayFromRoleTyp
    stateCurrentRoleType.permissions.forEach((item) =>
      Object.keys(item.permissions).forEach((permission) => {
        console.log('permission', item.permissions[permission].id)
        arrayFromRoleType.push(item.permissions[permission].id)
      })
    )
    // if there is at least one permission id from current list permission of role => return true ----- else return false
    return arrayFromRoleType.some((item) =>
      arrayBoundaryPermission.includes(item)
    )
    // return arrayFromRoleType.every((item) =>
    //   arrayBoundaryPermission.includes(item)
    // )
  }
  // handle get detail role type based on role type id
  const handleOnClickApplyReplaceRoleType = (id: number) => {
    getDetailRoleTypes(id)
      .then((res) => {
        const { data } = res.data
        // checkEnableApplyReplace(data)
        setStateCurrentRoleType(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  // handle replace role type with current list permission of role
  const handleReplaceRoleType = () => {
    // prevent user not select role type before replace role
    if (!stateCurrentRoleType) {
      pushMessage(t('message.pleaseSelectRoleType'), 'error')
      return
    }
    // prevent if none of checkEnableApplyReplace return false
    if (!checkEnableApplyReplace()) {
      console.log('check enable replace')
      pushMessage(
        t('message.thisRoleTypeIsNotAppropriateWithCurrentRole'),
        'error'
      )
      return
    }
    // convert array role type [key:string] to array number[]
    let arrayFromRoleType: number[] = []
    stateCurrentRoleType.permissions.forEach((item) =>
      Object.keys(item.permissions).forEach((permission) => {
        if (!arrayFromRoleType.includes(item.permissions[permission].id)) {
          arrayFromRoleType.push(item.permissions[permission].id)
        }
      })
    )
    // filter array from role type that only have permission id compare with boundary
    arrayFromRoleType = arrayFromRoleType.filter((item1) => {
      return arrayBoundaryPermission.some((item2) => {
        return item1 === item2
      })
    })
    // empty current list permission of role
    arrayPermissionOfRoleAssigned.length = 0
    // push filtered array from role type to current list permission of role
    arrayPermissionOfRoleAssigned.push(...arrayFromRoleType)
    // trigger state rerender
    setStateRerender(!stateRerender)
    setStateDrawer(false)
    pushMessage(
      t('message.replaceRoleTypeStateCurrentRoleTypeNameSuccessfully', {
        0: String(stateCurrentRoleType.name),
      }),
      'success'
    )
  }
  // same logic with above function
  const handleApplyRoleType = () => {
    if (!stateCurrentRoleType) {
      pushMessage(t('message.pleaseSelectRoleType'), 'error')
      return
    }
    if (!checkEnableApplyReplace()) {
      pushMessage(
        t('message.thisRoleTypeIsNotAppropriateWithCurrentRole'),
        'error'
      )
      return
    }

    let arrayFromRoleType: number[] = []
    // const cloneListRoleOfPermission: PermissionType[] = JSON.parse(
    //   JSON.stringify(stateListPermissionOfRoleToCompare)
    // )
    // console.log(
    //   'cloneListRoleOfPermission from handle apply role',
    //   cloneListRoleOfPermission
    // )

    // cloneListRoleOfPermission.forEach((item) =>
    //   Object.keys(item.permissions).forEach((permission) => {
    //     arrayFromRoleType.push(item.permissions[permission])
    //   })
    // )

    // issue push
    stateCurrentRoleType.permissions.forEach((item) =>
      Object.keys(item.permissions).forEach((permission) => {
        if (!arrayFromRoleType.includes(item.permissions[permission].id)) {
          arrayFromRoleType.push(item.permissions[permission].id)
        }
      })
    )
    console.log('array when map from role type', arrayFromRoleType)

    arrayFromRoleType = arrayFromRoleType.filter((item1) => {
      return arrayBoundaryPermission.some((item2) => {
        return item1 === item2
      })
    })
    console.log('array when filter from boundary', arrayFromRoleType)
    // find different from array assigned and array role type
    const differentBetWeenRoleTypeAndAssigned = arrayFromRoleType.filter(
      (item) => !arrayPermissionOfRoleAssigned.includes(item)
    )
    console.log(
      'arrayFromRoleType after filter',
      differentBetWeenRoleTypeAndAssigned
    )

    console.log(
      'arrayPermissionOfRoleAssigned before push',
      arrayPermissionOfRoleAssigned
    )
    arrayPermissionOfRoleAssigned.push(...differentBetWeenRoleTypeAndAssigned)
    console.log(
      'arrayPermissionOfRoleAssigned after push ',
      arrayPermissionOfRoleAssigned
    )
    setStateRerender(!stateRerender)
    setStateDrawer(false)
    pushMessage(
      t('message.applyRoleTypeStateCurrentRoleTypeNameSuccessfully', {
        0: String(stateCurrentRoleType.name),
      }),
      'success'
    )
  }
  // trigger userEffect everytime current role id is change
  useEffect(() => {
    if (!stateCurrentRoleId) return
    getListRoleTypeOfRole(stateCurrentRoleId)
      .then((res) => {
        const data = res.data
        setStateListRoleType(data)
        console.log('data', data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [stateCurrentRoleId])

  const handleCloseDrawer = () => {
    setStateDrawer(false)
  }
  // handle check all / uncheck all permission
  const handleSelectAllPermission = () => {
    // if all checkbox is checked -> uncheck all
    if (
      arrayBoundaryPermission.every((element) =>
        arrayPermissionOfRoleAssigned.includes(element)
      )
    ) {
      console.log('handleSelectAll if true')
      arrayPermissionOfRoleAssigned.length = 0
      setStateRerender(!stateRerender)
    } else {
      // empty all checkbox status then check all
      console.log('handleSelectAll if false')
      arrayPermissionOfRoleAssigned.length = 0
      arrayPermissionOfRoleAssigned.push(...arrayBoundaryPermission)
      setStateRerender(!stateRerender)
    }
  }

  // handle check all / uncheck all permission on each module, this function receive module name
  const handleSelectAllFromModule = (module: string) => {
    // deep copy array boundary permission
    const temporaryBoundaryPermissionArray: PermissionOfRoleType[] = JSON.parse(
      JSON.stringify(stateListBoundaryPermission)
    )
    // found module that contain in boundary
    const foundModule = temporaryBoundaryPermissionArray.findIndex(
      (item) => item.module === module
    )
    // generate array of found module
    const temporaryModuleArray: number[] = []
    Object.keys(
      temporaryBoundaryPermissionArray[foundModule].permissions
    ).forEach((permission) => {
      temporaryModuleArray.push(
        temporaryBoundaryPermissionArray[foundModule].permissions[permission].id
      )
    })
    // if all checkbox of this module is checked -> uncheck all
    if (
      temporaryModuleArray.every((element) =>
        arrayPermissionOfRoleAssigned.includes(element)
      )
    ) {
      const filteredArray = arrayPermissionOfRoleAssigned.filter(
        (item) => !temporaryModuleArray.includes(item)
      )
      arrayPermissionOfRoleAssigned.length = 0
      arrayPermissionOfRoleAssigned.push(...filteredArray)
    } else {
      // if at least one checkbox of this module is unchecked => check all
      temporaryModuleArray.forEach((item) => {
        if (!arrayPermissionOfRoleAssigned.includes(item)) {
          arrayPermissionOfRoleAssigned.push(item)
        }
      })
    }

    setStateRerender(!stateRerender)
  }

  // check if all checkbox from this module is checked or not -> checked/uncheck at select all checkbox
  const handleCheckSelectAllFromModule = (module: string) => {
    const temporaryBoundaryPermissionArray: PermissionOfRoleType[] = JSON.parse(
      JSON.stringify(stateListBoundaryPermission)
    )
    const foundModule = temporaryBoundaryPermissionArray.findIndex(
      (item) => item.module === module
    )
    const temporaryModuleArray: number[] = []

    Object.keys(
      temporaryBoundaryPermissionArray[foundModule].permissions
    ).forEach((permission) => {
      temporaryModuleArray.push(
        temporaryBoundaryPermissionArray[foundModule].permissions[permission].id
      )
    })
    return temporaryModuleArray.every((element) =>
      arrayPermissionOfRoleAssigned.includes(element)
    )
  }

  const renderTreeViewPermissionList = (node: any, padding: number) => {
    // if (!padding) {
    //   padding = 15
    // }
    return node.map((item: RoleType) => [
      <MenuItemSelectCustom
        value={item.id}
        key={item.id + Math.random()}
        onClick={() => handleOnClickRole(item.id)}
        style={{ paddingLeft: `${padding}px` }}
      >
        {item.name}
      </MenuItemSelectCustom>,
      item.child_role?.length > 0 &&
        renderTreeViewPermissionList(item?.child_role, padding + 16),
    ])
  }
  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          marginBottom: '15px',
        }}
      >
        <SelectCustom
          id="parent_role"
          displayEmpty
          IconComponent={() => <KeyboardArrowDownIcon />}
          // onChange={(e) => handleChangeRole(Number(e.target.value))}
          style={{ minWidth: '200px' }}
          renderValue={(value: any) => {
            console.log('typeof value', value, stateListRole.data)
            if (!value) {
              setStateIsActiveConfigurate(false)
              return (
                <PlaceholderSelect>
                  <div>{t('selectRole')}</div>
                </PlaceholderSelect>
              )
            }

            setStateIsActiveConfigurate(true)
            return stateListRoleFlatten.find((obj) => {
              return obj.id === value
            })?.name
          }}
        >
          {/* {stateListRole.data.map((item, index) => {
            return (
              <MenuItemSelectCustom
                value={item.id}
                key={index + Math.random()}
                onClick={() => handleOnClickRole(item.id)}
              >
                {item.name}
              </MenuItemSelectCustom>
            )
          })} */}
          {renderTreeViewPermissionList(stateListRole.data, 16)}
        </SelectCustom>

        <Box>
          <Controller
            control={control}
            name="search"
            render={({ field }) => (
              <>
                <FormControl fullWidth>
                  <TextFieldSearchCustom
                    sx={{}}
                    disabled={!stateIsActiveConfigurate}
                    error={!!errors.search}
                    placeholder={t('searchByModule')}
                    {...field}
                    onChange={(e) => handleOnChangeSearch(e.target.value)}
                  />
                </FormControl>
              </>
            )}
          />
        </Box>
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          marginBottom: '15px',
        }}
      >
        <ButtonCustom
          disabled={!stateIsActiveConfigurate}
          variant="contained"
          onClick={handleSelectAllPermission}
        >
          {t('selectAll')}
        </ButtonCustom>
        {/* <FormControlLabel
          control={
            <Checkbox
              disabled={!stateIsActiveConfigurate}
              onClick={handleSelectAllPermission}
            />
          }
          label="Label"
        /> */}
        <ButtonCustom
          disabled={!stateIsActiveConfigurate}
          variant="contained"
          onClick={() => setStateDrawer(true)}
        >
          {t('applyReplaceRolesType')}
        </ButtonCustom>

        {stateListBoundaryForSearch.length > 0 && (
          <ButtonCustom
            variant="contained"
            type="submit"
            sx={{ marginTop: '15px' }}
            onClick={handleSubmitAssignRole}
            style={{ marginLeft: 'auto' }}
          >
            {t('submit')}
          </ButtonCustom>
        )}
      </Stack>

      <div className={stateIsActiveConfigurate ? '' : classes['overlay']}>
        {stateListBoundaryForSearch.length ? (
          <form onSubmit={handleSubmit(handleSubmitAssignRole)}>
            {stateListBoundaryForSearch.map((item, index) => {
              return (
                <Card
                  key={index + Math.random()}
                  variant="outlined"
                  sx={{ marginBottom: '20px' }}
                >
                  <CardHeader
                    sx={{
                      padding: '0px 5px',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    }}
                    subheader={
                      <FormControlLabel
                        sx={{ marginLeft: '0 !important' }}
                        label={
                          <Typography sx={{ fontWeight: '600' }}>
                            {item.module}
                          </Typography>
                        }
                        control={
                          <Checkbox
                            key={index + Math.random()}
                            onChange={() =>
                              handleSelectAllFromModule(item.module)
                            }
                            checked={handleCheckSelectAllFromModule(
                              item.module
                            )}
                          />
                        }
                      />
                    }
                  />
                  <CardContent>
                    <FormGroup row>
                      {Object.keys(item.permissions)
                        .sort(
                          (a, b) =>
                            Number(new Date(item.permissions[a].created_at)) -
                            Number(new Date(item.permissions[b].created_at))
                        )
                        .map((key, _index) => {
                          return (
                            <FormControlLabel
                              key={_index + Math.random()}
                              sx={{ width: '250px' }}
                              control={
                                <Checkbox
                                  id={item.permissions[key].id.toString()}
                                  key={_index + Math.random()}
                                  value={item.permissions[key].id}
                                  onChange={handleOnChangeCheckBox}
                                  // checked={checkPermissionAssigned(
                                  //   item.module,
                                  //   item.permissions[key].id
                                  // )}
                                  // defaultChecked={checkPermissionAssigned(
                                  //   item.module,
                                  //   item.permissions[key].id
                                  // )}
                                  defaultChecked={checkPermissionAssigned(
                                    item.permissions[key].id
                                  )}
                                />
                              }
                              label={item.permissions[key].name}
                            />
                          )
                        })}
                    </FormGroup>
                  </CardContent>
                </Card>
              )
            })}
            <ButtonCustom
              variant="contained"
              type="submit"
              sx={{ marginTop: '15px' }}
            >
              {t('submit')}
            </ButtonCustom>
          </form>
        ) : (
          <Stack
            p={5}
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{
              background: '#F6F8FA',
              padding: '10px',
            }}
          >
            <Image
              src={'/' + '/images/not-found.svg'}
              alt="Logo"
              width="200"
              height="200"
            />
            <Typography variant="h6" sx={{ marginTop: '0' }}>
              {t('thereAreNoRoleToShow')}
            </Typography>
          </Stack>
        )}
      </div>
      <Drawer
        anchor={'right'}
        onClose={handleCloseDrawer}
        open={stateDrawer}
        disableEnforceFocus
      >
        <Box
          sx={{
            background: 'white',
            width: `450px`,
            height: '100%',
            padding: '25px',
          }}
        >
          <Stack direction="row" spacing={1} sx={{ marginBottom: '15px' }}>
            <IconButton onClick={() => setStateDrawer(false)}>
              <ArrowLeft size={24} />
            </IconButton>
            <Typography sx={{ fontSize: '2.4rem', fontWeight: 700 }}>
              {t('applyReplaceRolesType')}
            </Typography>
          </Stack>
          <SelectCustom
            id="role_type"
            displayEmpty
            sx={{ marginBottom: '15px' }}
            IconComponent={() => <KeyboardArrowDownIcon />}
            // onChange={(e) => handleChangeRole(Number(e.target.value))}
            renderValue={(value: any) => {
              if (!value) {
                return (
                  <PlaceholderSelect>
                    <div>{t('selectRoleType')}</div>
                  </PlaceholderSelect>
                )
              }

              return stateListRoleType?.data.find((obj) => obj.id === value)
                ?.name
            }}
          >
            {stateListRoleType?.data.map((item, index) => {
              return (
                <MenuItemSelectCustom
                  value={item.id}
                  key={index + Math.random()}
                  onClick={() => {
                    handleOnClickApplyReplaceRoleType(item.id)
                    // setStateCurrentRoleType(item)
                    // checkEnableApplyReplace(item)
                  }}
                >
                  {item.name}
                </MenuItemSelectCustom>
              )
            })}
          </SelectCustom>

          <Stack direction="row" spacing={1}>
            <ButtonCustom variant="contained" onClick={handleReplaceRoleType}>
              {t('replace')}
            </ButtonCustom>
            <ButtonCustom variant="contained" onClick={handleApplyRoleType}>
              {t('apply')}
            </ButtonCustom>
          </Stack>
        </Box>
      </Drawer>
    </>
  )
}

export default Permission
