import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Box,
  Checkbox,
  FormHelperText,
  SelectChangeEvent,
  Stack,
  Typography,
  Card,
  CardHeader,
  CardContent,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { useState } from 'react'
import {
  Control,
  Controller,
  FieldErrors,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form'
import {
  InfiniteScrollSelect,
  MenuItemSelectCustom,
  PlaceholderSelect,
  SelectCustom,
  TextFieldCustom,
} from 'src/components'
import { formatMoney } from 'src/utils/money.utils'
import {
  DetailProductByInvoiceDetailType,
  ProductBrandResponseType,
  ProductCategoryResponseType,
  ValidateCreateUpdateProductOCRType,
  WarehouseType,
} from '../../modelProduct'
import classes from '../../styles.module.scss'
import CurrencyNumberFormat from './part/CurrencyNumberFormat'
import { useTranslation } from 'react-i18next'

interface PropType {
  invoiceProduct: DetailProductByInvoiceDetailType
  index: number
  control: Control<ValidateCreateUpdateProductOCRType, any>
  isLastIndex: boolean
  setValue: UseFormSetValue<ValidateCreateUpdateProductOCRType>
  propsDataForCategory: ProductCategoryResponseType
  propsDataForBrand: ProductBrandResponseType
  setStateListCategory: () => void
  setStateListBrand: () => void
  handleGetBrandWithValue: (value: string | null) => void
  handleGetCategoryWithValue: (value: string | null) => void
  fetchMoreCategory: (value: { page: number; name: string }) => void
  fetchMoreBrand: (value: { page: number; name: string }) => void
  clearError: UseFormClearErrors<ValidateCreateUpdateProductOCRType>
  getValues: UseFormGetValues<ValidateCreateUpdateProductOCRType>
  register: UseFormRegister<ValidateCreateUpdateProductOCRType>
  listWarehouse: WarehouseType[]
  errors: FieldErrors<ValidateCreateUpdateProductOCRType>
  trigger: UseFormTrigger<ValidateCreateUpdateProductOCRType>
  watch: UseFormWatch<ValidateCreateUpdateProductOCRType>
}
const temporaryListUnitType = [
  { id: 1, name: 'unit' },
  { id: 2, name: 'package' },
]
const ProductInInvoiceComponent = (props: PropType) => {
  const { t } = useTranslation('product')
  const [stateCurrentProductUpdate, setStateCurrentProductUpdate] = useState(-1)

  const [stateOpenSelectCate, setStateOpenSelectCate] = useState(false)
  const [stateOpenSelectBrand, setStateOpenSelectBrand] = useState(false)
  const [stateChecked, setStateChecked] = useState(false)

  const handleCheckedCheckBox = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.checked) {
      props.clearError(`list_product.${props.index}`)
    }
    setStateChecked(event.target.checked)

    props.setValue(`list_product.${props.index}.checked`, event.target.checked)
  }
  const handleChangeSelectCurrentProductUpdate = (
    e: SelectChangeEvent<any>
  ) => {
    const foundIndex = props.invoiceProduct.products.findIndex(
      (item) => item.id === Number(e.target.value)
    )
    setStateCurrentProductUpdate(foundIndex)
    props.setValue(
      `list_product.${props.index}.product`,
      Number(e.target.value)
    )
  }
  console.log('stateSelectOpen', stateOpenSelectBrand)
  if (!props.invoiceProduct.Description) {
    return <></>
  }
  if (props.invoiceProduct.products.length > 0) {
    props.setValue(`list_product.${props.index}.isCreate`, false)
    // if
    // props.setValue(`list_product.${props.index}.checked`, true)
    return (
      <Card variant="outlined" sx={{ marginBottom: '20px' }}>
        <CardHeader
          sx={{
            padding: '0px 5px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
          }}
          subheader={
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ color: 'rgba(0, 0, 0, 0.87)' }}
            >
              <Checkbox
                checked={stateChecked}
                onChange={handleCheckedCheckBox}
              />
              <Typography variant="h6" sx={{ fontSize: '16px' }}>
                {props.invoiceProduct.Description}
              </Typography>
              <Typography>
                {t('price')}:{' '}
                <span style={{ fontWeight: '500' }}>
                  {formatMoney(
                    parseFloat(props.invoiceProduct.Price.replace(/[$ ]/g, ''))
                  )}
                </span>
              </Typography>
              <Typography>
                {t('quantity')}
                <span style={{ fontWeight: '500' }}>
                  {Number(props.invoiceProduct.Quantity)}
                </span>
              </Typography>
            </Stack>
          }
        />
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={6} sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)' }}>
              <Typography
                sx={{
                  fontStyle: 'italic',
                  color: '#1DB46A',
                  marginBottom: '15px',
                }}
              >
                {props.invoiceProduct.products.length}{' '}
                {t('similarProductFound')}
              </Typography>

              <Typography sx={{ marginBottom: '5px' }}>
                {t('selectProduct')}
              </Typography>
              <Controller
                control={props.control}
                name={`list_product.${props.index}.product`}
                render={({ field }) => (
                  <>
                    <SelectCustom
                      error={
                        props.errors &&
                        !!props.errors?.list_product?.[props.index]?.product
                      }
                      IconComponent={() => <KeyboardArrowDownIcon />}
                      {...field}
                      fullWidth
                      onChange={(e) =>
                        handleChangeSelectCurrentProductUpdate(e)
                      }
                    >
                      {props.invoiceProduct.products.map((item, idx) => {
                        return (
                          <MenuItemSelectCustom value={item.id} key={idx}>
                            {item.name}
                          </MenuItemSelectCustom>
                        )
                      })}
                    </SelectCustom>
                    <FormHelperText error>
                      {props.errors?.list_product?.[props.index]?.product &&
                        `${
                          props.errors?.list_product?.[props.index]?.product!
                            .message
                        }`}
                    </FormHelperText>
                  </>
                )}
              />
            </Grid>
            <Grid xs={6}>
              <Box>
                <Typography sx={{ fontWeight: '500' }} mb={2}>
                  {t('list.warehouse')}
                </Typography>
                {stateCurrentProductUpdate !== -1 && (
                  <Controller
                    control={props.control}
                    name={`list_product.${props.index}.warehouses`}
                    render={() => (
                      <>
                        {props.invoiceProduct.products[
                          stateCurrentProductUpdate
                        ].warehouses.map((obj, id) => {
                          props.setValue(
                            `list_product.${props.index}.warehouses.${id}.warehouse`,
                            obj.id
                          )
                          // if (id === 0) {
                          //   props.setValue(
                          //     `list_product.${props.index}.warehouses.${id}.quantity`,

                          //   )
                          // }

                          return (
                            <Stack
                              key={id}
                              spacing={1}
                              sx={{ marginBottom: 1 }}
                              direction="row"
                              alignItems="center"
                            >
                              <Typography
                                sx={{ width: '200px', fontSize: '12px' }}
                              >
                                {obj.name} ({obj.quantity}) {t('increaseWith')}
                              </Typography>
                              <Controller
                                control={props.control}
                                defaultValue={
                                  id === 0
                                    ? Number(props.invoiceProduct.Quantity)
                                    : 0
                                }
                                name={`list_product.${props.index}.warehouses.${id}.quantity`}
                                render={({ field }) => (
                                  <>
                                    <TextFieldCustom
                                      sx={{ maxWidth: '100px' }}
                                      {...field}
                                    />
                                  </>
                                )}
                              />
                              <Typography>{t('unit')}</Typography>
                            </Stack>
                          )
                        })}
                      </>
                    )}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }

  props.setValue(`list_product.${props.index}.isCreate`, true)
  props.setValue(
    `list_product.${props.index}.name`,
    props.invoiceProduct.Description
  )

  return (
    <Card variant="outlined" sx={{ marginBottom: '20px' }}>
      <CardHeader
        sx={{
          padding: '0px 5px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
        }}
        subheader={
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ color: 'rgba(0, 0, 0, 0.87)' }}
          >
            <Checkbox checked={stateChecked} onChange={handleCheckedCheckBox} />
            <Typography variant="h6" sx={{ fontSize: '16px' }}>
              {props.invoiceProduct.Description}
            </Typography>
            <Typography>
              {t('price')}:{' '}
              <span style={{ fontWeight: '500' }}>
                {formatMoney(
                  parseFloat(props.invoiceProduct.Price.replace(/[$ ]/g, ''))
                )}
              </span>
            </Typography>
            <Typography>
              {t('quantity')}
              <span style={{ fontWeight: '500' }}>
                {Number(props.invoiceProduct.Quantity)}
              </span>
            </Typography>
          </Stack>
        }
      />
      <CardContent>
        <Box>
          <Typography
            sx={{
              fontStyle: 'italic',
              color: '#1DB46A',
              marginBottom: '15px',
            }}
          >
            {t('noProductFound')}
          </Typography>
          <Grid container spacing={3}>
            <Grid xs={6} sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)' }}>
              <Stack spacing={1}>
                <Box>
                  <Typography>{t('productName')}</Typography>
                  <Controller
                    control={props.control}
                    name={`list_product.${props.index}.name`}
                    // defaultValue={props.invoiceProduct.Description}
                    render={({ field }) => (
                      <>
                        <TextFieldCustom
                          sx={{ paddingTop: '5px' }}
                          fullWidth
                          error={
                            props.errors &&
                            !!props.errors?.list_product?.[props.index]?.price
                          }
                          // defaultValue={props.invoiceProduct.Description}
                          {...field}
                        />
                        <FormHelperText error>
                          {props.errors?.list_product?.[props.index]?.name &&
                            `${
                              props.errors?.list_product?.[props.index]?.name!
                                .message
                            }`}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Box>
                <Box>
                  <Typography>{t('category')}</Typography>
                  <Controller
                    control={props.control}
                    name={`list_product.${props.index}.category`}
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <SelectCustom
                          {...field}
                          fullWidth
                          error={
                            props.errors &&
                            !!props.errors?.list_product?.[props.index]
                              ?.category
                          }
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          open={stateOpenSelectCate}
                          onClick={() => {
                            setStateOpenSelectCate(!stateOpenSelectCate)
                          }}
                          renderValue={(value: any) => {
                            console.log('valueeee', value)
                            console.log(
                              'value slice',
                              value.slice(value.indexOf('-') + 1, value.length)
                            )
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  {t('selectCategory')}
                                </PlaceholderSelect>
                              )
                            }
                            return value.slice(
                              value.indexOf('-') + 1,
                              value.length
                            )
                          }}
                        >
                          <InfiniteScrollSelect
                            propData={props.propsDataForCategory}
                            handleSearch={(value) => {
                              props.setStateListCategory()
                              props.handleGetCategoryWithValue(value)
                            }}
                            fetchMore={(value) => {
                              props.fetchMoreCategory(value)
                            }}
                            onClickSelectItem={(item: any) => {
                              console.log('itemmmm', item)
                              props.setValue(
                                `list_product.${props.index}.category`,
                                `${item.id}-${item.name}`
                              )
                              console.log(
                                'getValues',
                                props.getValues(
                                  `list_product.${props.index}.category`
                                )
                              )
                              props.clearError(
                                `list_product.${props.index}.category`
                              )
                              setStateOpenSelectCate(!stateOpenSelectCate)
                            }}
                            propsGetValue={props.getValues(
                              `list_product.${props.index}.category`
                            )}
                          />
                        </SelectCustom>
                        <FormHelperText error>
                          {props.errors?.list_product?.[props.index]
                            ?.category &&
                            `${
                              props.errors?.list_product?.[props.index]
                                ?.category!.message
                            }`}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Box>
                <Box>
                  <Typography>{t('brand')}</Typography>
                  <Controller
                    control={props.control}
                    name={`list_product.${props.index}.brand`}
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <SelectCustom
                          error={
                            props.errors &&
                            !!props.errors?.list_product?.[props.index]?.brand
                          }
                          fullWidth
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          open={stateOpenSelectBrand}
                          onClick={() => {
                            setStateOpenSelectBrand(!stateOpenSelectBrand)
                          }}
                          {...field}
                          renderValue={(value: any) => {
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  {t('brand')}
                                </PlaceholderSelect>
                              )
                            }
                            return value.slice(
                              value.indexOf('-') + 1,
                              value.length
                            )
                          }}
                        >
                          <InfiniteScrollSelect
                            propData={props.propsDataForBrand}
                            handleSearch={(value) => {
                              props.setStateListBrand()
                              props.handleGetBrandWithValue(value)
                            }}
                            fetchMore={(value) => {
                              props.fetchMoreBrand(value)
                            }}
                            onClickSelectItem={(item: any) => {
                              props.setValue(
                                `list_product.${props.index}.brand`,
                                `${item.id}-${item.name}`
                              )
                              props.clearError(
                                `list_product.${props.index}.brand`
                              )
                              setStateOpenSelectBrand(!stateOpenSelectBrand)
                            }}
                            propsGetValue={props.getValues(
                              `list_product.${props.index}.brand`
                            )}
                          />
                        </SelectCustom>
                        <FormHelperText error>
                          {props.errors?.list_product?.[props.index]?.brand &&
                            `${
                              props.errors?.list_product?.[props.index]?.brand!
                                .message
                            }`}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Box>
                <Box>
                  <Typography>{t('basePrice')}</Typography>
                  <div
                    className={classes[`input-number`]}
                    style={{ maxWidth: '100%' }}
                  >
                    <CurrencyNumberFormat
                      error={
                        props.errors &&
                        !!props.errors?.list_product?.[props.index]?.price
                      }
                      defaultPrice={parseFloat(
                        props.invoiceProduct.Price.replace(/[$ ]/g, '')
                      ).toFixed(2)}
                      propValue={(value) => {
                        props.setValue(
                          `list_product.${props.index}.price`,
                          value ? value : 0
                        )
                        props.trigger(`list_product.${props.index}.price`)
                      }}
                    />
                  </div>
                  <FormHelperText error>
                    {props.errors?.list_product?.[props.index]?.price &&
                      `${
                        props.errors?.list_product?.[props.index]?.price!
                          .message
                      }`}
                  </FormHelperText>
                </Box>
                <Box>
                  <Typography>{t('unitType')}</Typography>
                  <Controller
                    control={props.control}
                    name={`list_product.${props.index}.unit_type`}
                    defaultValue=""
                    render={({ field }) => (
                      <SelectCustom
                        sx={{ minWidth: '150px' }}
                        error={
                          props.errors &&
                          !!props.errors?.list_product?.[props.index]?.unit_type
                        }
                        IconComponent={() => <KeyboardArrowDownIcon />}
                        {...field}
                        onChange={(e) => {
                          props.setValue(
                            `list_product.${props.index}.unit_type`,
                            String(e.target.value)
                          )
                          props.trigger(`list_product.${props.index}.unit_type`)
                        }}
                        fullWidth
                      >
                        {temporaryListUnitType.map((item) => {
                          return (
                            <MenuItemSelectCustom
                              value={item.name}
                              key={item.id}
                            >
                              {item.name}
                            </MenuItemSelectCustom>
                          )
                        })}
                      </SelectCustom>
                    )}
                  />
                  <FormHelperText error>
                    {props.errors?.list_product?.[props.index]?.unit_type &&
                      `${
                        props.errors?.list_product?.[props.index]?.unit_type!
                          .message
                      }`}
                  </FormHelperText>
                </Box>
              </Stack>
            </Grid>
            <Grid xs={6}>
              <Box>
                <Typography sx={{ fontWeight: '500' }} mb={2}>
                  {t('list.warehouse')}
                </Typography>
                <Controller
                  control={props.control}
                  name={`list_product.${props.index}.warehouses`}
                  render={() => (
                    <>
                      {props.listWarehouse.map((obj, id) => {
                        props.setValue(
                          `list_product.${props.index}.warehouses.${id}.warehouse`,
                          obj.id
                        )
                        // if (id === 0) {
                        //   props.setValue(
                        //     `list_product.${props.index}.warehouses.${id}.quantity`,
                        //     Number(props.invoiceProduct.Quantity)
                        //   )
                        // }
                        return (
                          <Stack
                            key={id}
                            spacing={1}
                            sx={{ marginBottom: 1 }}
                            direction="row"
                            alignItems="center"
                          >
                            <Typography
                              sx={{ width: '200px', fontSize: '12px' }}
                            >
                              {obj.name} {t('increaseWith')}
                            </Typography>
                            <Controller
                              control={props.control}
                              name={`list_product.${props.index}.warehouses.${id}.quantity`}
                              defaultValue={
                                id === 0
                                  ? Number(props.invoiceProduct.Quantity)
                                  : 0
                              }
                              render={({ field }) => (
                                <>
                                  <TextFieldCustom
                                    {...field}
                                    sx={{ maxWidth: '100px' }}
                                  />
                                </>
                              )}
                            />
                            <Typography>
                              {props.watch(
                                `list_product.${props.index}.unit_type`
                              )
                                ? props.watch(
                                    `list_product.${props.index}.unit_type`
                                  )
                                : 'unit'}
                            </Typography>
                          </Stack>
                        )
                      })}
                    </>
                  )}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProductInInvoiceComponent
