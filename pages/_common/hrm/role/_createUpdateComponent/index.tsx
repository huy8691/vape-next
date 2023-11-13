import { yupResolver } from '@hookform/resolvers/yup'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Box, FormControl, FormHelperText, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCancel,
  ButtonCustom,
  InputLabelCustom,
  MenuItemSelectCustom,
  PlaceholderSelect,
  SelectCustom,
  TextFieldCustom,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import RequiredLabel from 'src/components/requiredLabel'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { getListRoles } from './apiRole'
import { roleType, submitAddroleType, ValidateAddroleType } from './modelRole'
import { schema, schemaUpdate } from './validations'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { RenderTreeType, RoleListResponseType } from '../list/modelRoles'
import { useTranslation } from 'next-i18next'
interface Props {
  handleSubmit: (value: submitAddroleType) => void
  update?: boolean
  stateRoleDetail?: roleType
}
const CreateUpdateComponent: React.FC<Props> = (props) => {
  const { t } = useTranslation('role')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateRoleList, setStateRoleList] = useState<RoleListResponseType>({
    data: [],
  })
  const [stateOpenDropdownRole, setStateOpenDropdownRole] =
    useState<boolean>(false)
  const [stateListRoleFlatten, setStateListRoleFlatten] = useState<
    RenderTreeType[]
  >([])
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<ValidateAddroleType>({
    resolver: yupResolver(props.update ? schemaUpdate(t) : schema(t)),
    mode: 'all',
  })
  const handleSubmitForm = (value: ValidateAddroleType) => {
    // const valueSubmit: ValidateAddroleType = {
    //   name: value.name,
    //   parent_role: value.parent_role === '' ? null : value.parent_role,
    // }
    if (value.parent_role) {
      const valueSubmit: submitAddroleType = {
        name: value.name,
        parent_role: getValues('parent_role'),
      }
      props.handleSubmit(valueSubmit)
    } else {
      const valueSubmit: submitAddroleType = {
        name: value.name,
        parent_role: null,
      }
      props.handleSubmit(valueSubmit)
    }
  }
  const handleError = (error: any) => {
    console.log('error', error)
  }
  // data call api
  const handleTreeObjectFromApi = (node: any[], array: RenderTreeType[]) => {
    node.forEach((item) => {
      array.push(item)
      console.log('item that push from tree obj', item)
      if (item.child_role.length > 0) {
        handleTreeObjectFromApi(item.child_role, array)
      }
    })
  }
  const handleGetListParent = (param: object) => {
    dispatch(loadingActions.doLoading())
    getListRoles(param)
      .then((res) => {
        const { data } = res
        const temporaryArr: RenderTreeType[] = []
        handleTreeObjectFromApi(data.data, temporaryArr)
        setStateListRoleFlatten(temporaryArr)

        // if (props.update) {
        //   const tempArr = data.data.filter(
        //     (item: roleType) => item.id !== Number(router.query.id)
        //   )
        //   setStateCategoryList({ ...data, data: tempArr })
        //   dispatch(loadingActions.doLoadingSuccess())
        //   return
        // }
        setStateRoleList(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  useEffect(() => {
    // if (router.asPath.length !== router.pathname.length) {
    //   if (!isEmptyObject(router.query)) {
    //     handleGetListParent(router.query)
    //   }
    // } else {
    //   handleGetListParent({})
    // }
    if (!props.update) {
      handleGetListParent({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router?.query])
  useEffect(() => {
    if (props.update && props.stateRoleDetail) {
      console.log('props update role ', props.stateRoleDetail)
      setValue('name', props.stateRoleDetail.name)
    }
  }, [props.stateRoleDetail, props.update, setValue])

  const renderTreeViewPermissionList = (node: any, padding: number) => {
    // if (!padding) {
    //   padding = 15
    // }
    return node.map((item: RenderTreeType) => [
      <MenuItemSelectCustom
        value={item.id}
        key={item.id + Math.random()}
        onClick={() => {
          setValue('parent_role', node.id)
          // console.log(getValues('parent_role'))

          clearErrors('parent_role')
          setStateOpenDropdownRole(false)
        }}
        style={{ paddingLeft: `${padding}px` }}
      >
        {item.name}
      </MenuItemSelectCustom>,
      item.child_role?.length > 0 &&
        renderTreeViewPermissionList(item?.child_role, padding + 16),
    ])
  }
  return (
    <div>
      <form onSubmit={handleSubmit(handleSubmitForm, handleError)}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ maxWidth: '1000px', marginBottom: '35px' }}
        >
          <Controller
            control={control}
            name="name"
            defaultValue=""
            render={({ field }) => (
              <Box sx={{ minWidth: '300px' }}>
                <InputLabelCustom htmlFor="name" error={!!errors.name}>
                  <RequiredLabel />
                  {t('createUpdate.roleName')}
                </InputLabelCustom>
                <FormControl fullWidth>
                  <TextFieldCustom
                    id="name"
                    error={!!errors.name}
                    placeholder={t('createUpdate.enterRoleName')}
                    {...field}
                  />
                  <FormHelperText error={!!errors.name}>
                    {errors.name && `${errors.name.message}`}
                  </FormHelperText>
                </FormControl>
              </Box>
            )}
          />
          {!props.update && (
            <Controller
              control={control}
              name="parent_role"
              render={({ field }) => (
                <Box sx={{ minWidth: '300px' }}>
                  <InputLabelCustom
                    htmlFor="parent_role"
                    error={!!errors.parent_role}
                  >
                    {t('createUpdate.parentRole')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <SelectCustom
                      id="parent_role"
                      displayEmpty
                      IconComponent={() => <KeyboardArrowDownIcon />}
                      open={stateOpenDropdownRole}
                      onClick={() => {
                        setStateOpenDropdownRole(!stateOpenDropdownRole)
                      }}
                      renderValue={(value: any) => {
                        if (!value) {
                          return (
                            <PlaceholderSelect>
                              <div>{t('createUpdate.selectValue')}</div>
                            </PlaceholderSelect>
                          )
                        }

                        return stateListRoleFlatten.find(
                          (role) => role.id === value
                        )?.name
                      }}
                      {...field}
                      onChange={(event: any) => {
                        setValue('parent_role', Number(event.target.value))
                      }}
                    >
                      {/* <InfiniteScrollSelectForRole
                        propData={stateRoleList}
                        handleSearch={(value) => {
                          setStateRoleList({ data: [] })
                          handleGetListParent(value)
                        }}
                        fetchMore={(value) => {
                          console.log('!11')
                          fetchMoreDataCategory(value)
                        }}
                        onClickSelectItem={(item: RenderTreeType) => {
                          setValue('parent_role', `${item.id}-${item.name}`)
                          console.log(getValues('parent_role'))
                          clearErrors('parent_role')
                          setStateOpenDropdownRole(false)
                        }}
                        propsGetValue={getValues('parent_role')}
                      /> */}
                      {/* <TextFieldCustom
                        onChange={(e) => debounced(e)}
                        sx={{ width: '100%' }}
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <Search style={{ fontSize: '18px' }} />
                          ),
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                        }}
                      /> */}
                      <MenuItemSelectCustom
                        value={''}
                        key={Math.random()}
                        onClick={() => {
                          setValue('parent_role', null)
                          // console.log(getValues('parent_role'))

                          clearErrors('parent_role')
                          setStateOpenDropdownRole(false)
                        }}
                      >
                        {t('createUpdate.none')}
                      </MenuItemSelectCustom>
                      {renderTreeViewPermissionList(stateRoleList.data, 16)}
                    </SelectCustom>
                    <FormHelperText error={!!errors.parent_role}>
                      {errors.parent_role && `${errors.parent_role.message}`}
                    </FormHelperText>
                  </FormControl>
                </Box>
              )}
            />
          )}
        </Stack>

        <Stack direction="row" spacing={2}>
          <Link href={`/${platform().toLowerCase()}/hrm/role/list`}>
            <a>
              <ButtonCancel variant="outlined" size="large">
                {t('createUpdate.cancel')}
              </ButtonCancel>
            </a>
          </Link>
          <ButtonCustom variant="contained" type="submit" size="large">
            {t('createUpdate.submit')}
          </ButtonCustom>
        </Stack>
      </form>
    </div>
  )
}

export default CreateUpdateComponent
