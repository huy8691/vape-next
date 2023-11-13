import { Box, Drawer, IconButton, Stack, Typography } from '@mui/material'
import { ArrowRight } from '@phosphor-icons/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import {
  getProductBrand,
  getProductCategory,
  getWareHouse,
} from 'pages/_common/inventory/product/list/apiProduct'
import {
  ProductBrandResponseType,
  WarehouseType,
} from 'pages/_common/inventory/product/list/modelProduct'
import { ButtonCustom, ButtonCancel } from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { createProductWithORC } from '../../externalOrderCreateOCRAPI'
import { schemaOCR } from '../../validations'
import {
  FormType,
  ProductCategoryResponseType,
  TableType,
} from './addProductOCRModel'
import InventoryOCR from './inventoryOCR'
import { useTranslation } from 'react-i18next'

const DrawerAddProductInventory: React.FC<{
  open: boolean
  onClose: React.Dispatch<React.SetStateAction<boolean>>
  dataOCR: any
}> = (props) => {
  const { t } = useTranslation('external-order')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [stateListBrand, setStateListBrand] =
    useState<ProductBrandResponseType>({
      data: [],
    })
  const [stateListCategory, setStateListCategory] =
    useState<ProductCategoryResponseType>({ data: [] })

  const [stateListWarehouse, setStateListWarehouse] = useState<WarehouseType[]>(
    []
  )

  const [pushMessage] = useEnqueueSnackbar()
  const {
    setValue,
    control,
    handleSubmit,
    watch,
    trigger,
    getValues,
    register,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<{
    items: FormType[]
  }>({
    resolver: yupResolver(schemaOCR),
    mode: 'all',
    reValidateMode: 'onSubmit',
    defaultValues: {
      items: [],
    },
  })

  console.log('errors', errors)

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'items',
  })

  console.log('fields', fields)

  const fetchMoreDataCategory = useCallback(
    (value: { page: number; name: string }) => {
      getProductCategory(value.page, { name: value.name })
        .then((res) => {
          const { data } = res
          setStateListCategory((prev: any) => {
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
    },
    []
  )

  const fetchMoreDataBrand = useCallback(
    (value: { page: number; name: string }) => {
      getProductBrand(value.page, { name: value.name })
        .then((res) => {
          const { data } = res
          setStateListBrand((prev: any) => {
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
    },
    []
  )

  const handleGetBrand = (value: string | null) => {
    getProductBrand(1, {
      name: value ? value : null,
    })
      .then((res) => {
        const { data } = res
        setStateListBrand(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetCategory = (value: string | null) => {
    getProductCategory(1, {
      name: value ? value : null,
    })
      .then((res) => {
        const { data } = res
        setStateListCategory(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  useEffect(() => {
    handleGetBrand('')
    handleGetCategory('')
    getWareHouse()
      .then((res) => {
        const { data } = res.data
        setStateListWarehouse(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [])

  useEffect(() => {
    if (!props.dataOCR || !props.open) {
      clearErrors()
      reset()
      return
    }

    const arrOCRTable = [...props.dataOCR.table]
    remove()
    arrOCRTable.forEach((item) => {
      const warehouseArr: any[] = []
      if (item.products.length > 0) {
        item.products.forEach((_: any, idx: number) => {
          warehouseArr.push({
            warehouse: 0,
            quantity: idx === 0 ? item.quantity : 0,
          })
        })
        append({
          product_variant: null,
          quantity: item.quantity,
          price: item.price,
          products: warehouseArr,
          base_price: 0,
        })
      } else {
        append({
          name: item.name || '',
          unit_type: '',
          base_price: 0,
          category: null,
          quantity: item.quantity || 0,
          price: item.price || 0,
          brand: null,
          products: warehouseArr,
          product_variant: null,
        })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dataOCR, props.open])

  const handleCheckKeyValueObjectValid = (value: any) => {
    const filteredValues: any = Object.fromEntries(
      Object.entries(value).filter(([, value]) => !!value)
    )

    return filteredValues
  }

  const onSubmitValue = (values: any) => {
    console.log('🚀 ~ onSubmitValue ~ values:', values)

    // dispatch(loadingActions.doLoading())

    try {
      const itemsArr: any[] = []
      values.items.forEach((item: FormType) => {
        if (item.name) {
          itemsArr.push({
            quantity: item.quantity,
            price: item.price,
            create_info: {
              name: item.name,
              unit_type: item.unit_type?.toUpperCase(),
              price: item.base_price,
              category: Number(
                item!.category!.slice(0, item!.category!.indexOf('-'))
              ),
              brand: Number(item!.brand!.slice(0, item!.brand!.indexOf('-'))),
              warehouses: item.products
                .filter((_item) => Number(_item.quantity) > 0)
                .map((item) => item),
            },
          })
        } else {
          itemsArr.push({
            product_variant: item.product_variant,
            quantity: item.quantity,
            price: item.price,
            update_info: item.products
              .filter((_item) => Number(_item.quantity) > 0)
              .map((item) => item),
          })
        }
      })

      const finalData = {
        recipient_name: props.dataOCR.recipient_name,
        code: props.dataOCR.code,
        address: props.dataOCR.address,
        address_name: props.dataOCR.address_name,
        phone_number: props.dataOCR.phone_number,
        external_supplier: props.dataOCR.external_supplier,
        tax_amount: props.dataOCR.tax_amount,
        discount_amount: props.dataOCR.discount_amount,
        order_date: props.dataOCR.order_date,
        notes: props.dataOCR.notes,
        city: props.dataOCR.city,
        state: props.dataOCR.state,
        postal_zipcode: props.dataOCR.postal_zipcode,
        items: itemsArr,
      }

      createProductWithORC(handleCheckKeyValueObjectValid(finalData))
        .then(() => {
          pushMessage(t('createUpdateByOcrSuccessfully'), 'success')
          props.onClose(false)
          router.push(
            `/${platform().toLowerCase()}/account-payable/external-order/list`
          )
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
          dispatch(loadingActions.doLoadingFailure())
        })
        .finally(() => {
          dispatch(loadingActions.doLoadingSuccess())
        })
    } catch (error) {
      dispatch(loadingActions.doLoadingFailure())
    }
  }

  return (
    <Drawer
      anchor="right"
      open={props.open}
      onClose={() => props.onClose(false)}
    >
      <Box sx={{ padding: '25px', width: '1000px' }}>
        <form onSubmit={handleSubmit(onSubmitValue)}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              marginBottom: '10px',
            }}
          >
            <IconButton onClick={() => props.onClose(false)}>
              <ArrowRight size={24} />
            </IconButton>
            <Typography
              sx={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: '#49516F',
              }}
            >
              {t('addProductToInventory')}
            </Typography>
          </Stack>
          <Box sx={{ marginBottom: '15px' }}>
            {props.dataOCR?.table?.map((item: TableType, index: number) => {
              return (
                <>
                  <InventoryOCR
                    key={index}
                    item={item}
                    control={control}
                    index={index}
                    setValue={setValue}
                    getValues={getValues}
                    watch={watch}
                    register={register}
                    trigger={trigger}
                    clearErrors={clearErrors}
                    brand={stateListBrand}
                    category={stateListCategory}
                    setStateListBrand={setStateListBrand}
                    setStateListCategory={setStateListCategory}
                    handleGetCategory={handleGetCategory}
                    handleGetBrand={handleGetBrand}
                    errors={errors}
                    fetchMoreBrand={(value: { page: number; name: string }) =>
                      fetchMoreDataBrand(value)
                    }
                    fetchMoreCategory={(value: {
                      page: number
                      name: string
                    }) => fetchMoreDataCategory(value)}
                    listWarehouse={stateListWarehouse}
                  />
                </>
              )
            })}
          </Box>

          <Stack
            direction="row"
            spacing={2}
            alignItems={'center'}
            justifyContent={'flex-end'}
          >
            <ButtonCancel
              variant="outlined"
              size="large"
              onClick={() => props.onClose(false)}
            >
              {t('cancel')}
            </ButtonCancel>
            <ButtonCustom variant="contained" type="submit" size="large">
              {t('submit')}
            </ButtonCustom>
          </Stack>
        </form>
      </Box>
    </Drawer>
  )
}

export default DrawerAddProductInventory
