import { yupResolver } from '@hookform/resolvers/yup'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Box, FormControl, FormHelperText, Grid, Stack } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCancel,
  ButtonCustom,
  InputLabelCustom,
  PlaceholderSelect,
  SelectCustom,
  TextFieldCustom,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'

import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { schema } from './validations'
import {
  AddCategoryType,
  categoryListResponseType,
  categoryTypeData,
  ValidateAddCategoryType,
} from './modelProductCategories'
import { getListCategories } from './apiCategories'
import RequiredLabel from 'src/components/requiredLabel'
import InfiniteScrollSelectForCategory from './part/InfiniteScrollSelect'
import { useTranslation } from 'next-i18next'
interface Props {
  handleSubmit: (value: AddCategoryType) => void
  update?: boolean
  stateCateId?: categoryTypeData
  stateCateTextField?: boolean
}
const CreateUpdateComponent: React.FC<Props> = (props) => {
  const { t } = useTranslation('category')
  const [pushMessage] = useEnqueueSnackbar()
  // state use for list cata
  const [stateCategoryList, setStateCategoryList] =
    useState<categoryListResponseType>({ data: [] })
  const [stateOpenDropdownCategory, setStateOpenDropdownCategory] =
    useState<boolean>(false)
  const [stateEnableParentCategory, setStateEnableParentCategory] =
    useState<boolean>(true)
  const router = useRouter()
  const dispatch = useAppDispatch()

  // data call api
  const handleGetListParent = (value: string | null) => {
    dispatch(loadingActions.doLoading())
    getListCategories(1, { name: value ? value : null })
      .then((res) => {
        const { data } = res

        if (props.update) {
          const tempArr = data.data.filter(
            (item: categoryTypeData) => item.id !== Number(router.query.id)
          )
          setStateCategoryList({ ...data, data: tempArr })
          dispatch(loadingActions.doLoadingSuccess())
          return
        }
        setStateCategoryList({ ...data, data: data.data })
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  //
  useEffect(() => {
    // if (router.asPath.length !== router.pathname.length) {
    //   if (!isEmptyObject(router.query)) {
    //     handleGetListParent(router.query)
    //   }
    // } else {
    //   handleGetListParent({})
    // }
    handleGetListParent(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router?.query])
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<ValidateAddCategoryType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })
  useEffect(() => {
    if (props.stateCateId) {
      setValue('name', props.stateCateId.name)
      if (props.stateCateId.child_category.length > 0) {
        setStateEnableParentCategory(false)
      }
      if (props.stateCateId.parent_category) {
        setValue(
          'parent_category',
          `${props.stateCateId.parent_category.id}-${props.stateCateId.parent_category.name}`
        )
      }
    }
  }, [props.stateCateId, setValue, getValues])

  //
  const OnSubmit = (values: ValidateAddCategoryType) => {
    const createCategory: AddCategoryType = {
      name: values.name,
      parent_category: values.parent_category
        ? Number(
            values.parent_category.slice(0, values.parent_category.indexOf('-'))
          )
        : undefined,
    }
    props.handleSubmit(createCategory)
  }
  const fetchMoreDataCategory = useCallback(
    (value: { page: number; name: string }) => {
      getListCategories(value.page, { name: value.name })
        .then((res) => {
          const { data } = res
          setStateCategoryList((prev: categoryListResponseType) => {
            return {
              ...data,
              data: [...prev.data, ...res.data.data],
            }
          })
        })
        .catch((error) => {
          const { status, data } = error.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [setStateCategoryList, pushMessage]
  )
  return (
    <>
      <form onSubmit={handleSubmit(OnSubmit)}>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{ maxWidth: '1000px' }}
          mb={'35px'}
        >
          <Grid item xs={4.5}>
            <Controller
              control={control}
              name="name"
              defaultValue=""
              render={({ field }) => (
                <Box>
                  <InputLabelCustom htmlFor="name" error={!!errors.name}>
                    <RequiredLabel />
                    {t('createUpdate.categoryName')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <TextFieldCustom
                      id="name"
                      error={!!errors.name}
                      placeholder={t('createUpdate.enterCategoryName')}
                      {...field}
                    />
                    <FormHelperText error={!!errors.name}>
                      {errors.name && `${errors.name.message}`}
                    </FormHelperText>
                  </FormControl>
                </Box>
              )}
            />
          </Grid>
          {stateEnableParentCategory && (
            <Grid item xs={4.5}>
              <Controller
                control={control}
                name="parent_category"
                defaultValue=""
                render={({ field }) => (
                  <Box>
                    <InputLabelCustom
                      htmlFor="parent_category"
                      error={!!errors.parent_category}
                    >
                      {t('createUpdate.parentCategoryIfHave')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <SelectCustom
                        id="parent_category"
                        displayEmpty
                        IconComponent={() => <KeyboardArrowDownIcon />}
                        open={stateOpenDropdownCategory}
                        onClick={() => {
                          setStateOpenDropdownCategory(
                            !stateOpenDropdownCategory
                          )
                        }}
                        renderValue={(value: any) => {
                          console.log('value', value)
                          if (!value) {
                            return (
                              <PlaceholderSelect>
                                <div> {t('createUpdate.selectValue')}</div>
                              </PlaceholderSelect>
                            )
                          }
                          return value.slice(
                            value.indexOf('-') + 1,
                            value.length
                          )
                        }}
                        {...field}
                        onChange={(event: any) => {
                          console.log('onChange', event)
                        }}
                      >
                        <InfiniteScrollSelectForCategory
                          propData={stateCategoryList}
                          handleSearch={(value) => {
                            setStateCategoryList({ data: [] })
                            handleGetListParent(value)
                          }}
                          fetchMore={(value) => {
                            console.log('!11')
                            fetchMoreDataCategory(value)
                          }}
                          onClickSelectItem={(item: categoryTypeData) => {
                            setValue(
                              'parent_category',
                              `${item.id}-${item.name}`
                            )
                            console.log(getValues('parent_category'))
                            clearErrors('parent_category')
                            setStateOpenDropdownCategory(false)
                          }}
                          propsGetValue={getValues('parent_category')}
                        />
                      </SelectCustom>
                      <FormHelperText error={!!errors.parent_category}>
                        {errors.parent_category &&
                          `${errors.parent_category.message}`}
                      </FormHelperText>
                    </FormControl>
                  </Box>
                )}
              />
            </Grid>
          )}
        </Grid>
        <Stack direction="row" spacing={2}>
          <Link
            href={
              platform() === 'SUPPLIER'
                ? '/supplier/inventory/category/list'
                : '/retailer/inventory/category/list'
            }
          >
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
      {/* <Grid item xs={6}>

      </Grid>
      <Grid item xs={6}>
        <Item>4</Item>
      </Grid> */}
    </>
  )
}

export default CreateUpdateComponent
