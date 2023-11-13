import {
  TextField,
  Box,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  LinearProgress,
  Pagination,
  Skeleton,
  Tabs,
  Tab,
  Tooltip,
  Typography,
  // CardActionArea,
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ItemProduct, TextFieldSearchCustom } from 'src/components'
import { formatMoney } from 'src/utils/money.utils'
import { NumericFormat } from 'react-number-format'

import {
  getProductBrand,
  // getProductCategory,
  getProductCategoryOnMarketPlace,
  getProductManufacturer,
  getProducts,
  getSupplier,
} from './apiProducts'
import {
  ProductDataType,
  SupplierResponseType,
  SupplierType,
} from './modelProducts'
// import SideBarProducts from './parts/sidebarProducts'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  handlerGetErrMessage,
  isEmptyObject,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
} from 'src/utils/global.utils'
import {
  ProductBrandResponseType,
  ProductBrandType,
  ProductCategoryResponseType,
  // ProductCategoryType,
  ProductListDataResponseType,
  ProductManufacturerResponseType,
  ProductManufacturerType,
} from './modelProducts'
// layout
import type { NextPageWithLayout } from 'pages/_app.page'
import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

// form
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { schema } from './validations'

// custom style
import { ButtonCustom, InputLabelCustom } from 'src/components'

// other
import { Chip, FormHelperText, Stack } from '@mui/material'
import { Eraser, MagnifyingGlass, X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const CardCustom = styled(Card)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light' ? '#F8F9FC' : theme.palette.action.hover,
  boxShadow: 'none',
  height: '100%',
}))
const NameSupplier = styled('span')(() => ({
  fontSize: '1.1rem',
  color: '#D1D1D1',
  marginLeft: '10px',
}))

const FormControlLabelCustom = styled(FormControlLabel)(() => ({
  marginRight: '0px',
  fontSize: '1.4rem',
  '& .MuiTypography-root': {
    fontSize: '1.4rem',
  },
}))

const FormLabelCustom = styled(FormLabel)(() => ({
  fontWeight: '600',
}))
const TabsCustom = styled(Tabs)(() => ({
  '& .MuiTabs-indicator': {
    display: 'none',
  },
}))

const GridProduct = styled(Grid)(() => ({
  ['@media (min-width:1536px) and (max-width:1700px)']: {
    flexBasis: '20%',
    maxWidth: '20%',
  },
}))
// const BoxCustom = styled(Box)(() => ({
//   position: 'relative',
// }))
// const BoxSort = styled(Box)(() => ({
//   position: 'absolute',
//   top: '50%',
//   left: '10px',
//   transform: 'translateY(-50%)',
//   lineHeight: '1',
// }))

// const SelectCustomSort = styled(Select)({
//   '& .MuiOutlinedInput-notchedOutline': {
//     borderRadius: '8px',
//     fontSize: '1.4rem',
//     borderWidth: '1px !important',
//   },
//   '& .MuiOutlinedInput-input': {
//     padding: '14px 15px 14px 40px',
//     fontSize: '1.4rem',
//     '&[aria-expanded="true"]': {
//       '& ~ .MuiSvgIcon-root': {
//         transform: 'rotate(180deg)',
//         width: '1.5em',
//       },
//     },
//   },
//   '& .MuiSvgIcon-root': {
//     width: '1.5em',
//   },
// })

// type Props = {
//   dataProductCategory: any
// }

const BrowseProducts: NextPageWithLayout = () => {
  const { t } = useTranslation('browse-product')

  const theme = useTheme()
  const limit = useMediaQuery('(max-width:1400px)')
  const [dataProducts, setDataProducts] =
    useState<ProductListDataResponseType>()
  // const [stateProductCategory, setStateProductCategory] =
  //   useState<ProductCategoryResponseType>({
  //     data: [],
  //   })
  // const [stateProductCategoryFlatten, setStateProductCategoryFlatten] =
  //   useState<ProductCategoryType[]>([])
  const [
    stateProductCategoryOnMarketPlace,
    setStateProductCategoryOnMarketPlace,
  ] = useState<ProductCategoryResponseType>({
    data: [],
  })
  const [stateProductBrand, setStateProductBrand] =
    useState<ProductBrandResponseType>({
      data: [],
    })
  const [stateProductManufacturer, setStateProductManufacturer] =
    useState<ProductManufacturerResponseType>({
      data: [],
    })
  // const [statePageCategory, setStatePageCategory] = useState<number>(2)
  const [statePageManufacturer, setStatePageManufacturer] = useState<number>(2)
  const [statePageBrand, setStatePageBrand] = useState<number>(2)
  // const [stateHasMoreCategory, setStateHasMoreCategory] =
  //   useState<boolean>(true)
  const [stateHasMoreBrand, setStateHasMoreBrand] = useState<boolean>(true)
  const [stateHasMoreManufacturer, setStateHasMoreManufacturer] =
    useState<boolean>(true)
  const [stateSupplier, setStateSupplier] = useState<SupplierResponseType>()
  const [stateDisableFilter, setStateDisableFilter] = useState<boolean>(false)

  const router = useRouter()
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()

  // const [stateMaxPrice, setStateMaxPrice] = React.useState<number>(0)

  // console.log('dataProductCategory', dataProductCategory)

  // const resultCategoryFlatten: ProductCategoryType[] = []
  // const handleGetFlatten = (arr: ProductCategoryType[]) => {
  //   arr.forEach((item) => {
  //     if (item.child_category.length > 0) {
  //       resultCategoryFlatten.push(item)
  //       handleGetFlatten(item.child_category)
  //     } else {
  //       resultCategoryFlatten.push(item)
  //     }
  //   })
  //   return resultCategoryFlatten
  // }

  // const CategoryItem = ({ list }: any) => {
  //   return list?.map((item: ProductCategoryType, index: number) => {
  //     return (
  //       <Box key={index}>
  //         <Stack direction="row" alignItems="center">
  //           <FormControlLabelCustom
  //             label={
  //               <Box>
  //                 {`${item.name}`}
  //                 <NameSupplier>{item.organization_info?.name}</NameSupplier>
  //               </Box>
  //             }
  //             control={
  //               <Checkbox
  //                 // checked={item.checked ? true : false}
  //                 indeterminate={handleIndeterminateCategory(item)}
  //                 name={`category-${item.id}${
  //                   item.parent_category
  //                     ? `-parentId${item.parent_category?.id}`
  //                     : '-parentId'
  //                 }-org${item.organization_info?.id}-name${item.name}`}
  //                 onChange={(e) => handleChangeFilterCategory(item, e)}
  //                 checked={handleChecked(
  //                   'category',
  //                   `category-${item.id}${
  //                     item.parent_category
  //                       ? `-parentId${item.parent_category?.id}`
  //                       : '-parentId'
  //                   }-org${item.organization_info?.id}-name${item.name}`
  //                 )}
  //               />
  //             }
  //           />
  //         </Stack>
  //         <Box
  //           sx={{
  //             display: 'flex',
  //             flexDirection: 'column',
  //             ml: 3,
  //           }}
  //         >
  //           <CategoryItem list={item?.child_category} />
  //         </Box>
  //       </Box>
  //     )
  //   })
  // }

  // handle loai bo organization when call api
  const handleRemoveOrganizationInParamQuery = (type: string) => {
    const handleId = (obj: string) => {
      switch (type) {
        case 'category':
          return obj.indexOf('-parentId')
          break
        case 'organization':
          return obj.indexOf('-name')
          break
        default:
          return obj.indexOf('-org')
      }
    }
    if (!router.query[type]) return
    const arrayQuery = `${router.query[type]}`?.split(',')
    const arrayConvertString = arrayQuery
      .map((obj) => obj.slice(obj.indexOf('-') + 1, handleId(obj)))
      .toString()
    return arrayConvertString
  }

  // handle loai bo brand, manufacture khi tick bo organization
  const handleRemoveObjNotOrganization = (
    type: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!router.query[type]) return
    const arrayQuery = `${router.query[type]}`?.split(',')
    // chon organization lần 1
    if (event.target.checked === true && !router.query.organization) {
      const newArray = arrayQuery
        .filter((obj) => {
          console.log(
            '444444',
            `9999${obj.slice(obj.indexOf('-org') + 4, obj.indexOf('-name'))}`,
            event.target.name?.slice(
              event.target.name.indexOf('org-') + 4,
              event.target.name.indexOf('-name')
            )
          )
          return (
            obj.slice(obj.indexOf('-org') + 4, obj.indexOf('-name')) ===
            event.target.name?.slice(
              event.target.name.indexOf('org-') + 4,
              event.target.name.indexOf('-name')
            )
          )
        })
        .toString()
      console.log('nre', newArray)
      return newArray
    }
    if (
      event.target.checked === false &&
      `${router.query.organization}`.split(',').length > 1
    ) {
      const newArray = arrayQuery
        .filter((obj) => {
          console.log(
            '55555',
            event.target.name?.slice(
              event.target.name.indexOf('org-') + 4,
              event.target.name.indexOf('-name')
            ),
            obj.slice(obj.indexOf('-org') + 4, obj.indexOf('-name'))
          )
          return (
            obj.slice(obj.indexOf('-org') + 4, obj.indexOf('-name')) !==
            event.target.name?.slice(
              event.target.name.indexOf('org-') + 4,
              event.target.name.indexOf('-name')
            )
          )
        })
        .toString()
      return newArray
    }
    return router.query[type]
  }

  // handle checked
  const handleChecked = (type: string, id: string) => {
    let index = -1
    if (router.query?.[type]) {
      const arrayChecked = `${router.query?.[type]}`?.split(',')
      index = arrayChecked?.indexOf(id)
    }
    if (index > -1) {
      return true
    } else {
      return false
    }
  }

  // handle checked
  // const handleIndeterminateCategory = (item: ProductCategoryType) => {
  //   if (item.child_category.length === 0) return false
  //   const arrayQuery = `${router.query.category}`?.split(',')
  //   if (item.child_category.length > 0) {
  //     const newArr = arrayQuery.filter((obj) => {
  //       return (
  //         obj.slice(obj.indexOf('-parentId'), obj.indexOf('-org')) ===
  //         `-parentId${item.id}`
  //       )
  //     }).length
  //     if (newArr === item.child_category.length) {
  //       return false
  //     }
  //     if (newArr > 0) {
  //       return true
  //     }
  //   }
  // }

  // handle filter
  const handleChangeFilter = (
    type: string,
    item: string,
    event: React.ChangeEvent<HTMLInputElement> | undefined
  ) => {
    setStateDisableFilter(true)
    let query = router.query[type]
    console.log('item', item)
    if (!query) {
      query = `${item}`
    } else {
      const arrayQuery = `${query}`?.split(',')
      const index = arrayQuery.indexOf(item)
      if (index > -1) {
        arrayQuery.splice(index, 1)
        query = arrayQuery.join(',')
      } else {
        arrayQuery.push(item)
        query = arrayQuery.join(',')
      }
    }

    if (type === 'organization' && event) {
      console.log('event', event)
      router.replace(
        {
          search: `${objToStringParam({
            ...router.query,
            page: 1,
            [type]: query,
            category: handleRemoveObjNotOrganization('category', event),
            manufacturer: handleRemoveObjNotOrganization('manufacturer', event),
            brand: handleRemoveObjNotOrganization('brand', event),
          })}`,
        },
        undefined,
        { scroll: false }
      )
    } else {
      router.replace(
        {
          search: `${objToStringParam({
            ...router.query,
            page: 1,
            [type]: query,
          })}`,
        },
        undefined,
        { scroll: false }
      )
    }
  }

  // const handleChangeFilterCategory = (
  //   item: ProductCategoryType,
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setStateDisableFilter(true)
  //   let query: string[] = []
  //   const arrayQuery = `${router.query.category}`?.split(',')
  //   console.log('event', event.target.checked)
  //   //
  //   const queryParent: string[] =
  //     event.target.checked === false ? [] : arrayQuery
  //   const handleGetFlattenParent = (value: ProductCategoryType) => {
  //     if (!value.parent_category) return queryParent
  //     const obj = stateProductCategoryFlatten.find(
  //       (obj) => obj.id === value.parent_category?.id
  //     )
  //     const newArr = queryParent.filter((obj) => {
  //       return (
  //         obj.slice(obj.indexOf('-parentId'), obj.indexOf('-org')) ===
  //         `-parentId${value.parent_category?.id}`
  //       )
  //     })
  //     if (event.target.checked === false) {
  //       queryParent.push(
  //         `category-${obj?.id}${
  //           obj?.parent_category
  //             ? `-parentId${obj?.parent_category?.id}`
  //             : '-parentId'
  //         }-org${obj?.organization_info.id}-name${obj?.name}`
  //       )
  //     } else {
  //       console.log('22222', obj, newArr, arrayQuery)
  //       if (
  //         obj?.child_category.length === newArr.length + 1 ||
  //         obj?.child_category.length === newArr.length
  //       ) {
  //         console.log('111', obj)
  //         queryParent.push(
  //           `category-${obj?.id}${
  //             obj?.parent_category
  //               ? `-parentId${obj?.parent_category?.id}`
  //               : '-parentId'
  //           }-org${obj?.organization_info.id}-name${obj?.name}`
  //         )
  //       }
  //     }

  //     if (obj?.parent_category) {
  //       handleGetFlattenParent(obj)
  //     }

  //     return queryParent
  //   }

  //   //
  //   const resultChildren: string[] = []
  //   const handleGetFlattenChild = (arr: ProductCategoryType[]) => {
  //     if (arr.length === 0) return resultChildren
  //     arr.forEach((itemChild) => {
  //       if (itemChild.child_category.length > 0) {
  //         resultChildren.push(
  //           `category-${itemChild.id}-parentId${itemChild.parent_category?.id}-org${itemChild.organization_info.id}-name${itemChild.name}`
  //         )
  //         handleGetFlattenChild(itemChild.child_category)
  //       } else {
  //         resultChildren.push(
  //           `category-${itemChild.id}-parentId${itemChild.parent_category?.id}-org${itemChild.organization_info.id}-name${itemChild.name}`
  //         )
  //       }
  //     })

  //     return resultChildren
  //   }
  //   const valuesChildren = handleGetFlattenChild(item.child_category)
  //   const valuesParent = handleGetFlattenParent(item)

  //   console.log('valuesParent', valuesParent, valuesChildren)

  //   //
  //   if (!router.query.category) {
  //     query = [
  //       ...valuesChildren,
  //       ...valuesParent,
  //       `category-${item.id}${
  //         item.parent_category
  //           ? `-parentId${item.parent_category?.id}`
  //           : '-parentId'
  //       }-org${item.organization_info.id}-name${item.name}`,
  //     ]
  //   } else {
  //     const index = arrayQuery.indexOf(
  //       `category-${item.id}${
  //         item.parent_category
  //           ? `-parentId${item.parent_category?.id}`
  //           : '-parentId'
  //       }-org${item.organization_info.id}-name${item.name}`
  //     )
  //     if (index > -1) {
  //       const filteredItems = arrayQuery.filter(
  //         (i) =>
  //           ![
  //             ...valuesChildren,
  //             ...valuesParent,
  //             `category-${item.id}${
  //               item.parent_category
  //                 ? `-parentId${item.parent_category?.id}`
  //                 : '-parentId'
  //             }-org${item.organization_info.id}-name${item.name}`,
  //           ].includes(i)
  //       )
  //       query = filteredItems
  //     } else {
  //       query = [
  //         ...arrayQuery,
  //         ...valuesChildren,
  //         ...valuesParent,
  //         `category-${item.id}${
  //           item.parent_category
  //             ? `-parentId${item.parent_category?.id}`
  //             : '-parentId'
  //         }-org${item.organization_info.id}-name${item.name}`,
  //       ]
  //     }
  //   }

  //   // xoa cac phan tu trung nhau
  //   const unique = (arr: string[]) => {
  //     arr = arr.filter(function (item) {
  //       return item !== 'undefined'
  //     })
  //     return Array.from(new Set(arr))
  //   }
  //   router.replace(
  //     {
  //       search: `${objToStringParam({
  //         ...router.query,
  //         page: 1,
  //         category: unique(query),
  //       })}`,
  //     },
  //     undefined,
  //     { scroll: false }
  //   )
  // }

  // form search
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  // check Price
  const {
    setValue: setValuePrice,
    handleSubmit: handleSubmitPrice,
    control: controlPrice,
    reset: resetPrice,
    // reset: resetCheckMail,
    // formState: { errors: errorsPrice },
  } = useForm({
    // resolver: yupResolver(schemaPrice),
    // reValidateMode: 'onChange',
    mode: 'all',
  })

  const onSubmitSearch = (values: any) => {
    // if (values.key.length) {
    //   if (values.key.length === 1) {
    //     return pushMessage('Key search must be at least 2 characters', 'error')
    //   }
    //   if (values.key.length > 50) {
    //     return pushMessage('Key search must be at most 50 characters', 'error')
    //   }
    // }

    handleClearFilterPrice()
    handleClearFilterBrand()
    handleClearFilterManufacturer()
    router.replace({
      search: `${objToStringParam({ key: values.key, page: 1 })}`,
    })
  }

  const onSubmitPrice = (values: { from?: string; to?: string }) => {
    console.log('66666', values)
    if (
      values.to &&
      values.from &&
      parseFloat(`${values.to}`.replaceAll(',', '')) <
        parseFloat(`${values.from}`.replaceAll(',', ''))
    ) {
      pushMessage('Min price must less than Max price', 'error')
      return
    }
    setStateDisableFilter(true)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: 1,
        price_gte: values.from
          ? parseFloat(`${values.from}`.replaceAll(',', ''))
          : null,
        price_lte: values.to
          ? parseFloat(`${values.to}`.replaceAll(',', ''))
          : null,
      })}`,
    })
  }

  // handleChangePagination
  const handleChangePagination = (e: any, page: number) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
    console.log(e)
  }

  // handle clear price
  const handleClearFilterPrice = () => {
    resetPrice()
    if (router.query.price_lte || router.query.price_gte) {
      router.replace({
        search: `${objToStringParam({
          ...router.query,
          page: 1,
          price_lte: null,
          price_gte: null,
        })}`,
      })
    }
  }
  // handle clear category
  // const handleClearFilterCategory = () => {
  //   if (router.query.category) {
  //     router.replace({
  //       search: `${objToStringParam({
  //         ...router.query,
  //         page: 1,
  //         category: null,
  //       })}`,
  //     })
  //   }
  // }
  // handle clear brand
  const handleClearFilterBrand = () => {
    if (router.query.brand) {
      router.replace({
        search: `${objToStringParam({
          ...router.query,
          page: 1,
          brand: null,
        })}`,
      })
    }
  }
  // handle clear manufacturer
  const handleClearFilterManufacturer = () => {
    if (router.query.manufacturer) {
      router.replace({
        search: `${objToStringParam({
          ...router.query,
          page: 1,
          manufacturer: null,
        })}`,
      })
    }
  }
  //handle clear supplier
  const handleClearFilterSupplier = () => {
    if (router.query.organization) {
      router.replace({
        search: `${objToStringParam({
          ...router.query,
          page: 1,
          organization: null,
        })}`,
      })
    }
  }

  // handle organization

  const handleOrganization = (query: string) => {
    console.log('handleOrganization', query)
    if (!router.query.organization) return ''
    const arrayQuery = query?.split(',')
    const arrayConvertString = arrayQuery
      .map((obj) => obj.slice(obj.indexOf('-') + 1, obj.indexOf('-name')))
      .toString()
    return arrayConvertString
  }

  //handle get list filter category
  // const handleGetProductCategory = (query: string) => {
  //   getProductCategory(handleOrganization(query), 1)
  //     .then((res) => {
  //       const data = res.data
  //       setStateProductCategory(data)
  //       if (data?.data?.length === 0 || !res.data.nextPage) {
  //         setStateHasMoreCategory(false)
  //       }
  //     })
  //     .catch((error) => {
  //       const { status, data } = error.response
  //       pushMessage(handlerGetErrMessage(status, data), 'error')
  //     })
  // }

  // const fetchMoreDataCategory = useCallback(() => {
  //   if (!stateHasMoreCategory) return
  //   setStatePageCategory((prev) => {
  //     getProductCategory(
  //       handleOrganization(`${router.query.organization}`),
  //       prev
  //     )
  //       .then((res) => {
  //         const { data } = res
  //         setStateProductCategory((prev: ProductCategoryResponseType) => {
  //           return {
  //             ...prev,
  //             data: [...prev.data, ...res.data.data],
  //           }
  //         })

  //         if (data?.data?.length === 0 || !res.data.nextPage) {
  //           setStateHasMoreCategory(false)
  //           return
  //         } else {
  //           setStateHasMoreCategory(true)
  //         }
  //       })
  //       .catch((error) => {
  //         const { status, data } = error.response
  //         pushMessage(handlerGetErrMessage(status, data), 'error')
  //       })
  //     console.log(statePageCategory)
  //     return prev + 1
  //   })

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [stateHasMoreCategory, router.query.organization])

  //handle get list filter category on market place
  const handleGetProductCategoryOnMarketPlace = (query?: string) => {
    getProductCategoryOnMarketPlace(query)
      .then((res) => {
        const data = res.data
        setStateProductCategoryOnMarketPlace(data)
      })
      .catch((error) => {
        const { status, data } = error.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  //handle get list filter brand
  const handleGetProductBrand = (query: string) => {
    getProductBrand(handleOrganization(query), 1)
      .then((res) => {
        const data = res.data
        setStateProductBrand(data)
        if (data?.data?.length === 0 || !res.data.nextPage) {
          setStateHasMoreBrand(false)
        }
      })
      .catch((error) => {
        const { status, data } = error.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const fetchMoreDataBrand = useCallback(() => {
    if (!stateHasMoreBrand) return
    setStatePageBrand((prev) => {
      getProductBrand(handleOrganization(`${router.query.organization}`), prev)
        .then((res) => {
          const { data } = res
          setStateProductBrand((prev: ProductBrandResponseType) => {
            return {
              ...prev,
              data: [...prev.data, ...res.data.data],
            }
          })
          if (data?.data?.length === 0 || !res.data.nextPage) {
            setStateHasMoreBrand(false)
            return
          } else {
            setStateHasMoreBrand(true)
          }
        })
        .catch((error) => {
          const { status, data } = error.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
      console.log(statePageBrand)
      return prev + 1
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateHasMoreBrand, router.query.organization])

  //handle get list filter manufacturer
  const handleGetProductManufacturer = (query: string) => {
    getProductManufacturer(handleOrganization(query), 1)
      .then((res) => {
        const data = res.data
        setStateProductManufacturer(data)
        if (data?.data?.length === 0 || !res.data.nextPage) {
          setStateHasMoreManufacturer(false)
        }
      })
      .catch((error) => {
        const { status, data } = error.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const fetchMoreDataManufacturer = useCallback(() => {
    if (!stateHasMoreManufacturer) return
    setStatePageManufacturer((prev) => {
      getProductManufacturer(
        handleOrganization(`${router.query.organization}`),
        prev
      )
        .then((res) => {
          const { data } = res
          setStateProductManufacturer(
            (prev: ProductManufacturerResponseType) => {
              return {
                ...prev,
                data: [...prev.data, ...res.data.data],
              }
            }
          )
          if (data?.data?.length === 0 || !res.data.nextPage) {
            setStateHasMoreManufacturer(false)
            return
          } else {
            setStateHasMoreManufacturer(true)
          }
        })
        .catch((error) => {
          const { status, data } = error.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
      console.log(statePageManufacturer)
      return prev + 1
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateHasMoreManufacturer, router.query.organization])

  // useEffect

  const handleDelete = (values: {
    name: string
    value: string | undefined
  }) => {
    // const query =
    //   router.asPath.replace(values?.value, '') ||
    //   router.asPath.replace(`,${values?.value}`, '')
    // console.log('valye', query)
    // router.replace(query, undefined, { scroll: false })
    if (values.name === 'price_gte') {
      setValuePrice('from', '')
    }

    if (values.name === 'price_lte') {
      setValuePrice('to', '')
    }
    const arr = `${router.query[values.name]}`.split(',')
    const newArr = arr.filter((item: string) => {
      return (
        item !== '' &&
        item !== values.value &&
        values.value?.slice(
          values.value?.indexOf('-parentId') + 9,
          values.value?.indexOf('-org')
        ) !==
          item.slice(
            item.indexOf('category-') + 9,
            item.indexOf('-parentId')
          ) &&
        values.value?.slice(
          values.value?.indexOf('-parentId') + 9,
          values.value?.indexOf('-org')
        ) !==
          item.slice(
            item.indexOf('category-') + 9,
            item.indexOf('-parentId')
          ) &&
        item.slice(item.indexOf('-parentId') + 9, item.indexOf('-org')) !==
          values.value?.slice(
            values.value?.indexOf('category-') + 9,
            values.value?.indexOf('-parentId')
          )
      )
    })
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        [values.name]: newArr.toString(),
      })}`,
    })
  }

  const handleNameFilter = () => {
    if (!router.query) return null
    const values: {
      price_gte?: string
      price_lte?: string
      brand?: string
      category?: string
      manufacturer?: string
      organization?: string
    } = router.query
    let arrayTag: { name: string; value: string | undefined }[] = []
    for (const key of Object.keys(values)) {
      if (key === 'price_gte' || key === 'price_lte') {
        arrayTag = [...arrayTag, { name: key, value: values[key] }]
        console.log('arrayTag', arrayTag)
      }
      if (
        key === 'brand' ||
        key === 'category' ||
        key === 'manufacturer' ||
        key === 'organization'
      ) {
        const arrayTagChild = values[key]?.split(',')
        const newArrayTagChild: { name: string; value: string }[] = []
        arrayTagChild?.forEach((item) => {
          if (item) {
            newArrayTagChild.push({
              name: key,
              value: item,
            })
          }
        })

        arrayTag = arrayTag.concat(newArrayTagChild)
        console.log('arrayTagChild', arrayTag)
      }
    }
    const handleLabel = (values: {
      name: string
      value: string | undefined
    }) => {
      switch (values.name) {
        case 'price_gte':
          return `Min price ${formatMoney(values.value)}`
        case 'price_lte':
          return `Max price ${formatMoney(values.value)}`
        default:
          return `${values.value?.slice(
            values.value?.indexOf('-name') + 5,
            values.value?.length
          )}`
      }
    }
    return (
      arrayTag.length > 0 && (
        <TabsCustom
          variant="scrollable"
          value={0}
          scrollButtons="auto"
          style={{
            minHeight: 'auto',
          }}
        >
          {arrayTag?.map((item, idx) => {
            return (
              <Tab
                key={idx}
                style={{
                  padding: '0px 6px',
                  minWidth: 'auto',
                  textTransform: 'none',
                  minHeight: 'auto',
                }}
                label={
                  item.name !== 'price_gte' && item.name !== 'price_lte' ? (
                    <Tooltip
                      title={
                        <span style={{ textTransform: 'capitalize' }}>
                          {item.name}
                        </span>
                      }
                    >
                      <Chip
                        label={handleLabel(item)}
                        onDelete={() => handleDelete(item)}
                        deleteIcon={
                          <X size={16} color={theme.palette.primary.main} />
                        }
                        style={{
                          fontWeight: 700,
                          background:
                            'linear-gradient(to right, #1CB25B26, #20B59826)',
                          color: theme.palette.primary.main,
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <Chip
                      label={handleLabel(item)}
                      onDelete={() => handleDelete(item)}
                      deleteIcon={
                        <X size={16} color={theme.palette.primary.main} />
                      }
                      style={{
                        fontWeight: 700,
                        background:
                          'linear-gradient(to right, #1CB25B26, #20B59826)',
                        color: theme.palette.primary.main,
                      }}
                    />
                  )
                }
              ></Tab>
            )
          })}
        </TabsCustom>
      )
    )
  }

  useEffect(() => {
    getSupplier()
      .then((res) => {
        const data = res.data
        setStateSupplier(data)
      })
      .catch((error) => {
        const { status, data } = error.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [])

  // handle Get Flatten Category
  // useEffect(() => {
  //   setStateProductCategoryFlatten(handleGetFlatten(stateProductCategory.data))
  // }, [stateProductCategory])

  useEffect(() => {
    // setStateHasMoreCategory(true)
    // setStatePageCategory(2)
    setStateHasMoreManufacturer(true)
    setStatePageManufacturer(2)
    setStateHasMoreBrand(true)
    setStatePageBrand(2)

    if (router.asPath.indexOf('&organization') > -1) {
      if (router.query.organization) {
        // handleGetProductCategory(`${router.query.organization}`)
        handleGetProductManufacturer(`${router.query.organization}`)
        handleGetProductBrand(`${router.query.organization}`)
      }
    } else {
      // handleGetProductCategory('')
      handleGetProductManufacturer('')
      handleGetProductBrand('')
    }

    console.log('quêt', router, router.query.organization)
  }, [router.query.organization])

  // const handleClick = () => {
  //   console.info('You clicked the Chip.')
  // }

  useEffect(() => {
    if (router.query.key) {
      setValue('key', router.query.key)
    }

    if (router.query.price_gte) {
      if (typeof Number(router.query.price_gte) === 'number') {
        setValuePrice('from', router.query.price_gte)
      }
    }
    if (router.query.price_lte) {
      if (typeof Number(router.query.price_lte) === 'number') {
        setValuePrice('to', router.query.price_lte)
      }
    }

    if (!isEmptyObject(router.query)) {
      dispatch(loadingActions.doLoading())
      getProducts(
        {
          ...router.query,
          organization: handleRemoveOrganizationInParamQuery('organization'),
          brand: handleRemoveOrganizationInParamQuery('brand'),
          manufacturer: handleRemoveOrganizationInParamQuery('manufacturer'),
          category: handleRemoveOrganizationInParamQuery('category'),
        },
        limit ? 16 : 18
      )
        .then((res) => {
          setDataProducts({})
          const data = res.data
          setDataProducts(data)
          dispatch(loadingActions.doLoadingSuccess())
          setStateDisableFilter(false)
        })
        .catch((error) => {
          const { status, data } = error.response
          dispatch(loadingActions.doLoadingFailure())
          pushMessage(handlerGetErrMessage(status, data), 'error')
          setDataProducts({
            ...stateSupplier,
            data: [],
          })
          setStateDisableFilter(false)
        })
    }
    if (router.asPath === '/retailer/market-place/browse-products') {
      setStateDisableFilter(false)
      dispatch(loadingActions.doLoading())
      getProducts({}, limit ? 16 : 18)
        .then((res) => {
          setDataProducts({})
          const data = res.data
          setDataProducts(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((error) => {
          const { status, data } = error.response
          dispatch(loadingActions.doLoadingFailure())
          pushMessage(handlerGetErrMessage(status, data), 'error')
          setDataProducts({
            ...stateSupplier,
            data: [],
          })
        })
      setValue('key', '')
      setValuePrice('from', '')
      setValuePrice('to', '')
    }
  }, [router, dispatch])

  useEffect(() => {
    handleGetProductCategoryOnMarketPlace()
  }, [])

  const renderResult = () => {
    if (!dataProducts?.data) {
      return (
        <Box mb={4}>
          <Grid container spacing={2}>
            {Array.from(Array(limit ? 18 : 16).keys()).map((index: number) => (
              <GridProduct item lg={3} xl={2} key={index}>
                <CardCustom variant="outlined">
                  <Box mb={1}>
                    <Skeleton animation="wave" variant="rounded" height={204} />
                  </Box>
                  <CardContent style={{ paddingBottom: '16px' }}>
                    <Skeleton variant="text" sx={{ fontSize: '1.4rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1.6rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1.6rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} />
                  </CardContent>
                </CardCustom>
              </GridProduct>
            ))}
          </Grid>
        </Box>
      )
    }
    if (dataProducts?.data?.length === 0) {
      return (
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          <Image
            src={'/' + '/images/not-found.svg'}
            alt="Logo"
            width="300"
            height="300"
          />
          <Typography variant="h6" style={{ textAlign: 'center' }}>
            {t('notFoundProductList')}
          </Typography>
        </Grid>
      )
    }
    return (
      <>
        <Box mb={4}>
          <Grid container spacing={2}>
            {dataProducts?.data.map((item: ProductDataType, index: number) => (
              <GridProduct item lg={3} xl={2} key={index}>
                <ItemProduct dataProduct={item} />
              </GridProduct>
            ))}
          </Grid>
        </Box>
        {Number(dataProducts?.totalPages) > 1 && (
          <Pagination
            color="primary"
            count={dataProducts?.totalPages}
            variant="outlined"
            shape="rounded"
            defaultPage={1}
            page={Number(router.query.page) ? Number(router.query.page) : 1}
            onChange={(e, page: number) => handleChangePagination(e, page)}
          />
        )}
      </>
    )
  }
  return (
    <>
      <Head>
        <title>{t('products')} | TWSS</title>
      </Head>

      <Grid container spacing={2} wrap="nowrap">
        <Grid item xs={2} style={{ minWidth: '270px' }}>
          <CardCustom>
            <CardContent>
              <FormControl
                component="fieldset"
                variant="standard"
                fullWidth
                sx={{ mt: 2 }}
              >
                <FormLabelCustom>
                  {t('price')}{' '}
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleClearFilterPrice()}
                  >
                    <Eraser size={20} />
                  </IconButton>
                </FormLabelCustom>
              </FormControl>
              <form onSubmit={handleSubmitPrice(onSubmitPrice)}>
                <Grid container spacing={1} mb={2}>
                  <Grid item xs>
                    <Controller
                      control={controlPrice}
                      defaultValue=""
                      name="from"
                      render={({ field }) => (
                        <Box>
                          <InputLabelCustom htmlFor="from">
                            {t('from')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <div className="input-number">
                              <NumericFormat
                                isAllowed={(values) => {
                                  const { formattedValue, floatValue } = values
                                  if (floatValue == null) {
                                    return formattedValue === ''
                                  } else {
                                    return floatValue <= 1000000
                                  }
                                }}
                                id="from"
                                thousandSeparator=","
                                valueIsNumericString={true}
                                decimalScale={2}
                                allowNegative={false}
                                customInput={TextField}
                                {...field}
                              />
                            </div>
                          </FormControl>
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid item xs>
                    <Controller
                      control={controlPrice}
                      defaultValue=""
                      name="to"
                      render={({ field }) => (
                        <Box>
                          <InputLabelCustom htmlFor="to">
                            {t('to')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <div className="input-number">
                              <NumericFormat
                                isAllowed={(values) => {
                                  const { formattedValue, floatValue } = values
                                  if (floatValue == null) {
                                    return formattedValue === ''
                                  } else {
                                    return floatValue <= 1000000
                                  }
                                }}
                                id="to"
                                thousandSeparator=","
                                valueIsNumericString={true}
                                decimalScale={2}
                                allowNegative={false}
                                customInput={TextField}
                                {...field}
                              />
                            </div>
                          </FormControl>
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid item xs={24}>
                    <ButtonCustom
                      variant="contained"
                      type="submit"
                      size="small"
                      fullWidth
                      disabled={stateDisableFilter}
                    >
                      {t('submit')}
                    </ButtonCustom>
                  </Grid>
                </Grid>
              </form>
              <Divider />
              <FormControl
                sx={{ mb: 2, mt: 2 }}
                disabled={stateDisableFilter}
                style={{ width: '100%' }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <FormGroup>
                    <FormControlLabelCustom
                      control={
                        <Checkbox
                          name={`is_featured`}
                          onChange={(e) => {
                            console.log('3', e?.target?.value)
                            router.replace({
                              search: `${objToStringParam({
                                ...router.query,
                                is_featured: router?.query?.is_featured
                                  ? false
                                  : true,
                              })}`,
                            })
                          }}
                          checked={router?.query?.is_featured ? true : false}
                        />
                      }
                      label={
                        <Typography
                          sx={{
                            fontWeight: '600',
                            color: 'rgba(0, 0, 0, 0.6)',
                          }}
                        >
                          {t('featured')}
                        </Typography>
                      }
                    />
                  </FormGroup>
                </Stack>
              </FormControl>
              <Divider />

              <FormControl
                sx={{ mt: 2 }}
                disabled={stateDisableFilter}
                style={{ width: '100%' }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <FormLabelCustom>{t('supplier')}</FormLabelCustom>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleClearFilterSupplier()}
                  >
                    <Eraser size={20} />
                  </IconButton>
                </Stack>
                <FormGroup>
                  {stateSupplier?.data?.map(
                    (item: SupplierType, index: number) => {
                      return (
                        <FormControlLabelCustom
                          control={
                            <Checkbox
                              name={`org-${item.id}-name${item.name}`}
                              onChange={(e) =>
                                handleChangeFilter(
                                  'organization',
                                  `org-${item.id}-name${item.name}`,
                                  e
                                )
                              }
                              checked={handleChecked(
                                'organization',
                                `org-${item.id}-name${item.name}`
                              )}
                            />
                          }
                          label={
                            <Box>
                              {item.name}
                              {item?.is_manufacturer && (
                                <NameSupplier>
                                  {' '}
                                  ({t('manufacturer')})
                                </NameSupplier>
                              )}
                            </Box>
                          }
                          key={index}
                        />
                      )
                    }
                  )}
                </FormGroup>
              </FormControl>
              <Divider />
              <FormControl
                sx={{ mt: 2 }}
                disabled={stateDisableFilter}
                style={{ width: '100%' }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <FormLabelCustom>{t('category')}</FormLabelCustom>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() =>
                      router.replace(
                        {
                          search: `${objToStringParam({
                            ...router.query,
                            category_marketplace: null,
                            page: 1,
                          })}`,
                        },
                        undefined,
                        { scroll: false }
                      )
                    }
                  >
                    <Eraser size={20} />
                  </IconButton>
                </Stack>
                <FormGroup>
                  {stateProductCategoryOnMarketPlace?.data?.map(
                    (item, index: number) => {
                      const arr =
                        `${router?.query?.category_marketplace}`?.split(',')
                      return (
                        <FormControlLabelCustom
                          control={
                            <Checkbox
                              name={item.name}
                              onChange={() => {
                                if (arr.includes(`${item.id}`)) {
                                  const someArray = arr.filter(
                                    (i) => i != item.id.toString()
                                  )
                                  router.replace(
                                    {
                                      search: `${objToStringParam({
                                        ...router.query,
                                        category_marketplace:
                                          someArray.toString(),
                                        page: 1,
                                      })}`,
                                    },
                                    undefined,
                                    { scroll: false }
                                  )
                                } else {
                                  router.replace(
                                    {
                                      search: `${objToStringParam({
                                        ...router.query,
                                        category_marketplace: `${
                                          router?.query
                                            ?.category_marketplace === undefined
                                            ? ''
                                            : `${router?.query?.category_marketplace},`
                                        }${item.id}`,
                                        page: 1,
                                      })}`,
                                    },
                                    undefined,
                                    { scroll: false }
                                  )
                                }
                              }}
                              checked={
                                arr.includes(`${item.id}`) ? true : false
                              }
                            />
                          }
                          label={<Box>{item.name}</Box>}
                          key={index}
                        />
                      )
                    }
                  )}
                </FormGroup>
              </FormControl>
              {/* <Divider />
              <FormControl
                sx={{ mt: 2 }}
                disabled={stateDisableFilter}
                style={{ width: '100%' }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <FormLabelCustom>Category</FormLabelCustom>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleClearFilterCategory()}
                  >
                    <Eraser size={20} />
                  </IconButton>
                </Stack>

                <InfiniteScroll
                  dataLength={stateProductCategory.data?.length}
                  height={300}
                  next={fetchMoreDataCategory}
                  hasMore={stateHasMoreCategory}
                  loader={
                    <LinearProgress
                      style={{
                        marginBottom: '20px',
                        width: 'calc(100% - 16px)',
                      }}
                    />
                  }
                >
                  <CategoryItem list={stateProductCategory?.data} />
                </InfiniteScroll>
              </FormControl> */}
              <Divider />
              <FormControl
                sx={{ mt: 2 }}
                disabled={stateDisableFilter}
                style={{ width: '100%' }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <FormLabelCustom>{t('brand')}</FormLabelCustom>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleClearFilterBrand()}
                  >
                    <Eraser size={20} />
                  </IconButton>
                </Stack>
                <FormGroup>
                  <InfiniteScroll
                    dataLength={stateProductBrand.data?.length} //This is important field to render the next data
                    height={300}
                    next={fetchMoreDataBrand}
                    hasMore={stateHasMoreBrand}
                    loader={
                      <LinearProgress
                        style={{
                          marginBottom: '20px',
                          width: 'calc(100% - 16px)',
                        }}
                      />
                    }
                    // endMessage={
                    //   <p style={{ textAlign: 'center' }}>
                    //     Yay! You have seen it all
                    //   </p>
                    // }
                  >
                    {stateProductBrand?.data?.map(
                      (item: ProductBrandType, index: number) => {
                        return (
                          <FormControlLabelCustom
                            style={{ width: '100%' }}
                            control={
                              <Checkbox
                                name={`brand-${item.id}-org${item.organization_info?.id}-name${item.name}`}
                                onChange={() =>
                                  handleChangeFilter(
                                    'brand',
                                    `brand-${item.id}-org${item.organization_info?.id}-name${item.name}`,
                                    undefined
                                  )
                                }
                                checked={handleChecked(
                                  'brand',
                                  `brand-${item.id}-org${item.organization_info?.id}-name${item.name}`
                                )}
                              />
                            }
                            label={
                              <Box>
                                {item.name}
                                <NameSupplier>
                                  {item.organization_info.name}
                                </NameSupplier>
                              </Box>
                            }
                            key={index}
                          />
                        )
                      }
                    )}
                  </InfiniteScroll>
                </FormGroup>
              </FormControl>
              <Divider />

              <FormControl
                sx={{ mt: 2 }}
                disabled={stateDisableFilter}
                style={{ width: '100%' }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                >
                  <FormLabelCustom>{t('manufacturer')}</FormLabelCustom>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleClearFilterManufacturer()}
                  >
                    <Eraser size={20} />
                  </IconButton>
                </Stack>
                <FormGroup>
                  <InfiniteScroll
                    dataLength={stateProductManufacturer.data?.length} //This is important field to render the next data
                    height={300}
                    next={fetchMoreDataManufacturer}
                    hasMore={stateHasMoreManufacturer}
                    loader={
                      <LinearProgress
                        style={{
                          marginBottom: '20px',
                          width: 'calc(100% - 16px)',
                        }}
                      />
                    }
                    // endMessage={
                    //   <p style={{ textAlign: 'center' }}>
                    //     Yay! You have seen it all
                    //   </p>
                    // }
                  >
                    {stateProductManufacturer?.data?.map(
                      (item: ProductManufacturerType, index: number) => {
                        return (
                          <FormControlLabelCustom
                            style={{ width: '100%' }}
                            control={
                              <Checkbox
                                name={`manufacturer-${item.id}-org${item.organization_info?.id}-name${item.name}`}
                                onChange={() =>
                                  handleChangeFilter(
                                    'manufacturer',
                                    `manufacturer-${item.id}-org${item.organization_info?.id}-name${item.name}`,
                                    undefined
                                  )
                                }
                                checked={handleChecked(
                                  'manufacturer',
                                  `manufacturer-${item.id}-org${item.organization_info?.id}-name${item.name}`
                                )}
                              />
                            }
                            label={
                              <Box>
                                {item.name}
                                <NameSupplier>
                                  {item.organization_info.name}
                                </NameSupplier>
                              </Box>
                            }
                            key={index}
                          />
                        )
                      }
                    )}
                  </InfiniteScroll>
                </FormGroup>
              </FormControl>
            </CardContent>
          </CardCustom>
        </Grid>
        <Grid item xs={10} style={{ maxWidth: 'calc(100% - 270px)' }}>
          <CardCustom>
            <CardContent>
              <Grid container spacing={2} mb={2}>
                <Grid item xs>
                  <form
                    onSubmit={handleSubmit(onSubmitSearch)}
                    className="form-search"
                  >
                    <Controller
                      control={control}
                      name="key"
                      render={({ field }) => (
                        <>
                          <FormControl fullWidth>
                            <TextFieldSearchCustom
                              id="key"
                              error={!!errors.key}
                              placeholder="Search product by code, name..."
                              {...field}
                            />
                            <FormHelperText error={!!errors.key}>
                              {errors.key && `${errors.key.message}`}
                            </FormHelperText>
                          </FormControl>
                        </>
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
                {/* <Grid item xs={2}>
                  <BoxCustom>
                    <BoxSort>
                      <FunnelSimple size={16} />
                    </BoxSort>
                    <SelectCustomSort
                      fullWidth
                      IconComponent={() => <KeyboardArrowDownIcon />}
                      // renderValue={(value: any) => {
                      //   if (value === '') {
                      //     return (
                      //       <PlaceholderSelect>
                      //         <div>Select value</div>
                      //       </PlaceholderSelect>
                      //     )
                      //   }
                      //   return stateSelectMonthlySale.find(
                      //     (obj) => obj.id === value
                      //   )?.monthly_sale
                      // }}
                      defaultValue="0"
                    >
                      <MenuItem value="0">Newest</MenuItem>
                      <MenuItem value="1">Oldest</MenuItem>
                    </SelectCustomSort>
                  </BoxCustom>
                </Grid> */}
                <Grid item xs={2}>
                  <Link href="/retailer/market-place/browse-products">
                    <a>
                      <ButtonCustom
                        variant="contained"
                        fullWidth
                        startIcon={<Eraser />}
                        sx={{
                          padding: '14px 0',
                          lineHeight: '20px',
                        }}
                      >
                        {t('clearFilter')}
                      </ButtonCustom>
                    </a>
                  </Link>
                </Grid>
                {/* <Grid item xs={12}>
                  <Stack direction="row" useFlexGap flexWrap="wrap" spacing={2}>
                    <Box>
                      <Card
                        variant="outlined"
                        sx={{
                          border: `1px solid ${
                            !router?.query?.category_marketplace
                              ? theme.palette.primary.main
                              : '#E1E6EF'
                          }`,
                          borderRadius: '10px',
                        }}
                      >
                        <CardActionArea
                          sx={{
                            p: 2,
                            width: '110px',
                            aspectRatio: 1,
                            alignItems: 'center',
                            borderRadius: '10px',
                            justifyItems: 'center',
                            textAlign: 'center',
                          }}
                          onClick={() => {
                            // if (arr.includes(`${item.id}`)) {
                            //   const someArray = arr.filter(
                            //     (i) => i != item.id.toString()
                            //   )
                            //   router.replace(
                            //     {
                            //       search: `${objToStringParam({
                            //         ...router.query,
                            //         category_marketplace: someArray.toString(),
                            //       })}`,
                            //     },
                            //     undefined,
                            //     { scroll: false }
                            //   )
                            // } else {
                            router.replace(
                              {
                                search: `${objToStringParam({
                                  ...router.query,
                                  category_marketplace: null,
                                })}`,
                              },
                              undefined,
                              { scroll: false }
                            )
                          }}
                        >
                          <Box mb={0.5}>
                            <SquaresFour size={35} />
                          </Box>
                          <Typography
                            // color={
                            //   arr.includes(`${item.id}`)
                            //     ? theme.palette.primary.main
                            //     : '#0A0D14'
                            // }
                            sx={{ fontSize: '12px' }}
                          >
                            All products
                          </Typography>
                        </CardActionArea>
                      </Card>
                    </Box>
                    {stateProductCategoryOnMarketPlace?.data?.map(
                      (item, index) => {
                        const arr =
                          `${router?.query?.category_marketplace}`?.split(',')
                        return (
                          <Box key={index}>
                            <Card
                              key={index}
                              variant="outlined"
                              sx={{
                                border: `1px solid ${
                                  arr.includes(`${item.id}`)
                                    ? theme.palette.primary.main
                                    : '#E1E6EF'
                                }`,
                                borderRadius: '10px',
                              }}
                            >
                              <CardActionArea
                                sx={{
                                  p: 2,
                                  width: '110px',
                                  aspectRatio: 1,
                                  alignItems: 'center',
                                  borderRadius: '10px',
                                  justifyItems: 'center',
                                  textAlign: 'center',
                                }}
                                onClick={() => {
                                  if (arr.includes(`${item.id}`)) {
                                    const someArray = arr.filter(
                                      (i) => i != item.id.toString()
                                    )
                                    router.replace(
                                      {
                                        search: `${objToStringParam({
                                          ...router.query,
                                          category_marketplace:
                                            someArray.toString(),
                                          page: 1,
                                        })}`,
                                      },
                                      undefined,
                                      { scroll: false }
                                    )
                                  } else {
                                    router.replace(
                                      {
                                        search: `${objToStringParam({
                                          ...router.query,
                                          category_marketplace: `${
                                            router?.query
                                              ?.category_marketplace ===
                                            undefined
                                              ? ''
                                              : `${router?.query?.category_marketplace},`
                                          }${item.id}`,
                                          page: 1,
                                        })}`,
                                      },
                                      undefined,
                                      { scroll: false }
                                    )
                                  }
                                }}
                              >
                                <Box mb={0.5}>
                                  <Image
                                    src={item?.thumbnail}
                                    alt=""
                                    width={35}
                                    height={35}
                                  />
                                </Box>
                                <Typography
                                  color={
                                    arr.includes(`${item.id}`)
                                      ? theme.palette.primary.main
                                      : '#0A0D14'
                                  }
                                  sx={{ fontSize: '12px' }}
                                >
                                  {item.name}
                                </Typography>
                              </CardActionArea>
                            </Card>
                          </Box>
                        )
                      }
                    )}
                  </Stack>
                </Grid> */}
                <Grid item xs={12}>
                  <Stack
                    direction="row"
                    spacing="2px"
                    sx={{ flexWrap: 'wrap', gap: 1 }}
                  >
                    {handleNameFilter()}
                  </Stack>
                </Grid>
              </Grid>

              {renderResult()}
            </CardContent>
          </CardCustom>
        </Grid>
      </Grid>
    </>
  )
}

BrowseProducts.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
BrowseProducts.permissionPage = {
  key_module: KEY_MODULE.Product,
  permission_rule: PERMISSION_RULE.ViewList,
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'browse-product',
      ])),
    },
  }
}
export default BrowseProducts
