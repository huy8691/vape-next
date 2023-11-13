import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import {
  getListPermOfRoleType,
  getListPermsBoundary,
} from './apiCreateRoleType'
import {
  // ListRoleDataResponseType,
  permissionsForCreate,
  RoleTypeDataType,
} from './modalCreateRoleType'
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Stack,
  Typography,
} from '@mui/material'

import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCustom,
  InputLabelCustom,
  // MenuItemSelectCustom,
  // SelectCustom,
  TextFieldCustom,
} from 'src/components'
import RequiredLabel from 'src/components/requiredLabel'
import { schema } from './validation'
import { useTranslation } from 'next-i18next'

interface TypeSubmit {
  id: number
  is_checked: boolean
}
interface Props {
  handleSubmit: (value: any) => void
  update?: boolean
}
const CreateUpdateComponent: React.FC<Props> = (props) => {
  const { t } = useTranslation('role-type')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateRerender, setStateRerender] = useState(false)

  // const [stateRoleList, setStateRoleList] = useState<ListRoleDataResponseType>()
  const arrayBoundaryPermission: number[] = useMemo(() => [], [])
  const arrayPermissionOfRoleAssigned: number[] = useMemo(() => [], [])
  const arrListRoleSubmit: TypeSubmit[] = useMemo(() => [], [])

  const [filteredPerms, setFilteredPerm] = useState<RoleTypeDataType[]>()
  const [stateFilteredPermission, setStateFilteredPermission] = useState<
    RoleTypeDataType[]
  >([])
  const handleListRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const item = {
        id: Number(event.target.id),
        is_checked: event.target.checked,
      }
      arrListRoleSubmit.push(item)
      arrayPermissionOfRoleAssigned.push(Number(event.target.id))
    }
    if (!event.target.checked) {
      const index = arrListRoleSubmit.findIndex(
        (value) => value.id == Number(event.target.id)
      )
      arrListRoleSubmit.splice(index, 1)
      console.log('gg', index)
      // test
      const foundIndex = arrayPermissionOfRoleAssigned.findIndex(
        (value) => value === Number(event.target.id)
      )
      arrayPermissionOfRoleAssigned.splice(foundIndex, 1)
    }
    //test
    console.log('arrarPermissionOfRoleAssigned', arrayPermissionOfRoleAssigned)
    setStateRerender(!stateRerender)
    console.log(arrListRoleSubmit)
  }

  const handleSelectAllFromModule = (module: string) => {
    const cloneBoundaryPermission: RoleTypeDataType[] = JSON.parse(
      JSON.stringify(filteredPerms)
    )
    const foundModule = cloneBoundaryPermission.findIndex(
      (item) => item.module === module
    )
    if (
      Object.keys(cloneBoundaryPermission[foundModule].permissions).every(
        (item) =>
          arrayPermissionOfRoleAssigned.some(
            (element) =>
              element ===
              cloneBoundaryPermission[foundModule].permissions[item].id
          )
      )
    ) {
      const filterNotInclude = arrayPermissionOfRoleAssigned.filter(
        (item) =>
          !Object.keys(cloneBoundaryPermission[foundModule].permissions).some(
            (element) =>
              cloneBoundaryPermission[foundModule].permissions[element].id ===
              item
          )
      )

      arrayPermissionOfRoleAssigned.length = 0

      arrayPermissionOfRoleAssigned.push(...filterNotInclude)
      console.log('arrListRoleSubmit after push', arrayPermissionOfRoleAssigned)
      setStateRerender(!stateRerender)
      return
    }

    Object.keys(cloneBoundaryPermission[foundModule].permissions).forEach(
      (permission) => {
        if (
          arrayPermissionOfRoleAssigned.some(
            (element) =>
              element ===
              cloneBoundaryPermission[foundModule].permissions[permission].id
          )
        )
          return
        arrayPermissionOfRoleAssigned.push(
          Number(
            cloneBoundaryPermission[foundModule].permissions[permission].id
          )
        )
      }
    )
    setStateRerender(!stateRerender)
  }
  const handleCheckSelectAllFromModule = (module: string) => {
    const cloneBoundaryPermission: RoleTypeDataType[] = JSON.parse(
      JSON.stringify(filteredPerms)
    )
    const foundModule = cloneBoundaryPermission.findIndex(
      (item) => item.module === module
    )

    return Object.keys(cloneBoundaryPermission[foundModule].permissions).every(
      (item) =>
        arrayPermissionOfRoleAssigned.some(
          (element) =>
            element ===
            cloneBoundaryPermission[foundModule].permissions[item].id
        )
    )
  }

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })

  const onSubmit = (data: any) => {
    if (arrayPermissionOfRoleAssigned.length === 0) {
      pushMessage('Please select at least one permission', 'error')
      return
    }

    const submitArr: permissionsForCreate[] = []
    arrayPermissionOfRoleAssigned.forEach((item) => {
      const newItem: permissionsForCreate = {
        id: item,
        is_checked: true,
      }

      submitArr.push(newItem)
    })

    const dataForSubmit = {
      name: data.name,
      permissions: submitArr,
    }
    props.handleSubmit(dataForSubmit)
  }
  const handleGetListBoundary = (page: number, array: RoleTypeDataType[]) => {
    getListPermsBoundary({ page: page })
      .then((res) => {
        const data = res.data
        array.push(...data.data)
        data.data.forEach((item) => {
          Object.keys(item.permissions).forEach((permission) => {
            if (
              !arrayBoundaryPermission.includes(item.permissions[permission].id)
            ) {
              arrayBoundaryPermission.push(item.permissions[permission].id)
            }
          })
        })

        if (res.data.nextPage && res.data.nextPage > 0) {
          handleGetListBoundary(res.data.nextPage, array)
        } else {
          dispatch(loadingActions.doLoadingSuccess())

          setFilteredPerm(array)
          setStateFilteredPermission(array)
        }
      })
      .catch((response) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  useEffect(() => {
    const boundaryArr: RoleTypeDataType[] = []
    handleGetListBoundary(1, boundaryArr)

    // getListRole()
  }, [router.query])
  useEffect(() => {
    if (props.update) {
      handleGetListPermissionOfRoleType()
    }
  }, [])
  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value.toLowerCase()

    const filteredList = stateFilteredPermission?.filter((module) => {
      return module.module.toLowerCase().indexOf(keyword) > -1
    })

    setFilteredPerm(filteredList)
  }
  const handleSelectAllPermission = () => {
    const cloneBoundaryPermission: RoleTypeDataType[] = JSON.parse(
      JSON.stringify(filteredPerms)
    )
    if (
      cloneBoundaryPermission.every((item) =>
        Object.keys(item.permissions).every((element) =>
          arrayPermissionOfRoleAssigned.some(
            (obj) => obj === item.permissions[element].id
          )
        )
      )
    ) {
      arrListRoleSubmit.length = 0
      arrayPermissionOfRoleAssigned.length = 0

      setStateRerender(!stateRerender)
      return
    }
    arrListRoleSubmit.length = 0
    arrayPermissionOfRoleAssigned.length = 0
    cloneBoundaryPermission.forEach((element) =>
      Object.keys(element.permissions).forEach((item) => {
        const newItem: TypeSubmit = {
          id: Number(element.permissions[item].id),
          is_checked: true,
        }
        arrListRoleSubmit.push(newItem)
        arrayPermissionOfRoleAssigned.push(Number(element.permissions[item].id))
      })
    )

    setStateRerender(!stateRerender)
  }
  // this function receive id of permission and will return true/false to render check/uncheck when render list permission
  const checkPermissionAssigned = (id: number) => {
    return arrayPermissionOfRoleAssigned.includes(id)
  }
  const handleGetListPermissionOfRoleType = () => {
    if (!router.query.id) return
    getListPermOfRoleType(Number(router.query.id))
      .then((res) => {
        const data = res.data
        // setStateListRoleTypeOfRole(data)
        const tempArray: any[] = []
        console.log('>>>>>>>>>>>>>>>')
        if (!data.data.permissions) return
        data?.data.permissions.forEach((item) => {
          Object.keys(item.permissions).map((element) => {
            tempArray.push(Number(item.permissions[element].id))
          })
        })
        setValue('name', data.data.name)
        // setValueSearch('name', data.data.name)
        arrayPermissionOfRoleAssigned.push(...tempArray)

        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        console.log('??', response)
        const { status, data } = response

        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <>
      <Stack direction="row" spacing={2} mb={2}>
        <ButtonCustom
          variant="contained"
          size="small"
          onClick={handleSelectAllPermission}
        >
          {t('createUpdate.selectAll')}
        </ButtonCustom>
        <TextFieldCustom
          placeholder="Search"
          onChange={handleFilter}
          style={{ minWidth: '300px' }}
        />
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="row" spacing={2} alignItems="flex-end" mb={2}>
          <Box flex={1}>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <>
                  <InputLabelCustom htmlFor="code" error={!!errors.name}>
                    <RequiredLabel />
                    {t('createUpdate.name')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <TextFieldCustom
                      id="name"
                      placeholder={t('createUpdate.enterNameRoleType')}
                      error={!!errors.name}
                      {...field}
                      style={{ minWidth: '300px' }}
                    />
                    {errors.name && `${errors.name.message}` && (
                      <FormHelperText error={!!errors.name}>
                        {errors.name && `${errors.name.message}`}
                      </FormHelperText>
                    )}
                  </FormControl>
                </>
              )}
            />
          </Box>
          <ButtonCustom variant="contained" size="small" type="submit">
            {t('createUpdate.submit')}
          </ButtonCustom>
        </Stack>
      </form>

      {filteredPerms?.map((item, index) => {
        return (
          <>
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
                        onChange={() => handleSelectAllFromModule(item.module)}
                        checked={handleCheckSelectAllFromModule(item.module)}
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
                    .map((element, _index) => {
                      return (
                        <>
                          <FormControlLabel
                            key={_index + Math.random()}
                            sx={{ width: '250px' }}
                            control={
                              <Checkbox
                                id={item.permissions[element].id.toString()}
                                defaultChecked={checkPermissionAssigned(
                                  item.permissions[element].id
                                )}
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  handleListRole(event)
                                }}
                              />
                            }
                            label={item.permissions[element].name}
                          />
                        </>
                      )
                    })}
                </FormGroup>
              </CardContent>
            </Card>
          </>
        )
      })}
    </>
  )
}

export default CreateUpdateComponent
