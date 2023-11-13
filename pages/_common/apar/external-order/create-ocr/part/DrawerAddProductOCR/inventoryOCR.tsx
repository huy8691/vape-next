import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormHelperText,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import {
  ProductBrandResponseType,
  WarehouseType,
} from 'pages/_common/inventory/product/list/modelProduct'
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
import classes from '../../styles.module.scss'
import CurrencyNumberFormat from '../CurrencyNumberFormat'
import {
  FormType,
  ProductCategoryResponseType,
  ProductType,
  TableType,
} from './addProductOCRModel'
import { useTranslation } from 'react-i18next'

const temporaryListUnitType = [
  { name: 'unit', value: 'UNIT' },
  { name: 'package', value: 'PACKAGE' },
]

const InventoryOCR: React.FC<{
  item: TableType
  setValue: UseFormSetValue<{
    items: FormType[]
  }>
  control: Control<
    {
      items: FormType[]
    },
    any
  >
  trigger: UseFormTrigger<{
    items: FormType[]
  }>
  clearErrors: UseFormClearErrors<{
    items: FormType[]
  }>
  watch: UseFormWatch<{
    items: FormType[]
  }>
  index: number
  getValues: UseFormGetValues<{
    items: FormType[]
  }>
  register: UseFormRegister<{
    items: FormType[]
  }>
  errors: FieldErrors<{
    items: FormType[]
  }>
  handleGetBrand: (value: string | null) => void
  handleGetCategory: (value: string | null) => void
  fetchMoreCategory: (value: { page: number; name: string }) => void
  fetchMoreBrand: (value: { page: number; name: string }) => void
  setStateListBrand: React.Dispatch<
    React.SetStateAction<ProductBrandResponseType>
  >
  setStateListCategory: React.Dispatch<
    React.SetStateAction<ProductCategoryResponseType>
  >
  category: ProductCategoryResponseType
  brand: ProductBrandResponseType
  listWarehouse: WarehouseType[]
}> = (props) => {
  const { t } = useTranslation('external-order')
  const [stateOpenSelectCate, setStateOpenSelectCate] = useState(false)
  const [stateOpenSelectBrand, setStateOpenSelectBrand] = useState(false)
  const [warehouseSelect, setWarehouseSelect] = useState<ProductType>()

  return (
    <>
      {props.item.products.length > 0 && (
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
                <Typography variant="h6" sx={{ fontSize: '16px' }}>
                  {props.item.name || 'N/A'}
                </Typography>
                <Typography>
                  {t('price')}:{' '}
                  <span style={{ fontWeight: '500' }}>
                    {formatMoney(
                      parseFloat(props.item.price.replace(/[$ ]/g, ''))
                    )}
                  </span>
                </Typography>
                <Typography>
                  {t('quantity')}:{' '}
                  <span style={{ fontWeight: '500' }}>
                    {Number(props.item.quantity)}
                  </span>
                </Typography>
              </Stack>
            }
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid
                xs={6}
                sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)' }}
              >
                <Typography
                  sx={{
                    fontStyle: 'italic',
                    color: '#1DB46A',
                    marginBottom: '15px',
                  }}
                >
                  {props.item.products?.length} {t('similarProductsFound')}
                </Typography>
                <Typography sx={{ marginBottom: '5px' }}>
                  {t('selectedProducts')}
                </Typography>
                <Controller
                  control={props.control}
                  name={`items.${props.index}.product_variant`}
                  render={({ field }) => (
                    <>
                      <SelectCustom
                        error={
                          props.errors &&
                          !!props.errors?.items?.[props.index]?.product_variant
                        }
                        IconComponent={() => <KeyboardArrowDownIcon />}
                        {...field}
                        fullWidth
                        onChange={(event: SelectChangeEvent<any>) => {
                          setWarehouseSelect(() => {
                            const findWarehouse = props.item.products.filter(
                              (filtered: ProductType) => {
                                return (
                                  filtered.id === Number(event.target.value)
                                )
                              }
                            )

                            return findWarehouse[0]
                          })
                          props.setValue(
                            `items.${props.index}.product_variant`,
                            event.target.value
                          )
                        }}
                      >
                        {props.item.products?.map(
                          (item: ProductType, idx: number) => {
                            return (
                              <MenuItemSelectCustom value={item.id} key={idx}>
                                {item.name}
                              </MenuItemSelectCustom>
                            )
                          }
                        )}
                      </SelectCustom>
                      <FormHelperText
                        error={
                          !!props.errors?.items?.[props.index]?.product_variant
                        }
                      >
                        {props.errors?.items?.[props.index]?.product_variant &&
                          `${
                            props.errors?.items?.[props.index]?.product_variant
                              ?.message
                          }`}
                      </FormHelperText>
                    </>
                  )}
                />
              </Grid>

              <Grid xs={6}>
                <Box>
                  <Typography sx={{ fontWeight: '500' }} mb={2}>
                    {t('warehouse')}
                  </Typography>
                  <>
                    <Controller
                      control={props.control}
                      name={`items.${props.index}.products`}
                      render={() => (
                        <>
                          {warehouseSelect?.warehouses.map((_warehouse, id) => {
                            props.setValue(
                              `items.${props.index}.products.${id}.warehouse`,
                              _warehouse.id
                            )

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
                                >{`${props.item.name} (${_warehouse.quantity}) increase`}</Typography>
                                <Controller
                                  control={props.control}
                                  name={`items.${props.index}.products.${id}.quantity`}
                                  defaultValue={0}
                                  render={({ field }) => {
                                    return (
                                      <TextFieldCustom
                                        sx={{ maxWidth: '100px' }}
                                        {...field}
                                      />
                                    )
                                  }}
                                />
                                <Typography> {t('unit')}</Typography>
                              </Stack>
                            )
                          })}
                        </>
                      )}
                    />
                  </>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {props.item.products.length === 0 && (
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
                <Typography variant="h6" sx={{ fontSize: '16px' }}>
                  {props.item.name || 'N/A'}
                </Typography>
                <Typography>
                  {t('price')}:{' '}
                  <span style={{ fontWeight: '500' }}>
                    {formatMoney(
                      parseFloat(props.item.price.replace(/[$ ]/g, ''))
                    )}
                  </span>
                </Typography>
                <Typography>
                  {t('quantity')}:
                  <span style={{ fontWeight: '500' }}>
                    {Number(props.item.quantity)}
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
                {t('noProduct')}
              </Typography>
              <Grid container spacing={3}>
                <Grid
                  xs={6}
                  sx={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)' }}
                >
                  <Stack spacing={1}>
                    <Box>
                      <Typography>{t('product')}</Typography>
                      <Controller
                        control={props.control}
                        name={`items.${props.index}.name`}
                        render={({ field }) => (
                          <>
                            <TextFieldCustom
                              sx={{ paddingTop: '5px' }}
                              fullWidth
                              error={
                                props.errors &&
                                !!props.errors?.items?.[props.index]?.price
                              }
                              {...field}
                            />
                            <FormHelperText error>
                              {props.errors?.items?.[props.index]?.name &&
                                `${
                                  props.errors?.items?.[props.index]?.name!
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
                        name={`items.${props.index}.category`}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <SelectCustom
                              {...field}
                              fullWidth
                              error={
                                props.errors &&
                                !!props.errors?.items?.[props.index]?.category
                              }
                              IconComponent={() => <KeyboardArrowDownIcon />}
                              open={stateOpenSelectCate}
                              onClick={() => {
                                setStateOpenSelectCate(!stateOpenSelectCate)
                              }}
                              renderValue={(value: any) => {
                                if (value === '') {
                                  return (
                                    <PlaceholderSelect>
                                      Select Category
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
                                propData={props.category}
                                handleSearch={(value) => {
                                  props.handleGetCategory(value)
                                  props.setStateListCategory({ data: [] })
                                }}
                                fetchMore={(value) => {
                                  props.fetchMoreCategory(value)
                                }}
                                onClickSelectItem={(item: any) => {
                                  props.setValue(
                                    `items.${props.index}.category`,
                                    `${item.id}-${item.name}`
                                  )
                                  console.log(
                                    'getValues',
                                    props.getValues(
                                      `items.${props.index}.category`
                                    )
                                  )
                                  props.clearErrors(
                                    `items.${props.index}.category`
                                  )
                                  setStateOpenSelectCate(!stateOpenSelectCate)
                                }}
                                propsGetValue={
                                  props.getValues(
                                    `items.${props.index}.category`
                                  ) as string
                                }
                              />
                            </SelectCustom>
                            <FormHelperText error>
                              {props.errors?.items?.[props.index]?.category &&
                                `${
                                  props.errors?.items?.[props.index]?.category!
                                    .message
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
                        name={`items.${props.index}.brand`}
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <SelectCustom
                              error={
                                props.errors &&
                                !!props.errors?.items?.[props.index]?.brand
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
                                      {t('selectBrand')}
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
                                propData={props.brand}
                                handleSearch={(value) => {
                                  props.setStateListBrand({
                                    data: [],
                                  })
                                  props.handleGetBrand(value)
                                }}
                                fetchMore={(value) => {
                                  props.fetchMoreBrand(value)
                                }}
                                onClickSelectItem={(item: any) => {
                                  props.setValue(
                                    `items.${props.index}.brand`,
                                    `${item.id}-${item.name}`
                                  )
                                  props.clearErrors(
                                    `items.${props.index}.brand`
                                  )
                                  setStateOpenSelectBrand(!stateOpenSelectBrand)
                                }}
                                propsGetValue={
                                  props.getValues(
                                    `items.${props.index}.brand`
                                  ) as string
                                }
                              />
                            </SelectCustom>
                            <FormHelperText error>
                              {props.errors?.items?.[props.index]?.brand &&
                                `${
                                  props.errors?.items?.[props.index]?.brand!
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
                            !!props.errors?.items?.[props.index]?.base_price
                          }
                          defaultPrice={parseFloat(
                            props.item.price.replace(/[$ ]/g, '')
                          ).toFixed(2)}
                          propValue={(value) => {
                            props.setValue(
                              `items.${props.index}.base_price`,
                              value ? value : 0
                            )
                            props.trigger(`items.${props.index}.base_price`)
                          }}
                        />
                      </div>
                      <FormHelperText error>
                        {props.errors?.items?.[props.index]?.base_price &&
                          `${
                            props.errors?.items?.[props.index]?.base_price!
                              .message
                          }`}
                      </FormHelperText>
                    </Box>
                    <Box>
                      <Typography>{t('unitType')}</Typography>
                      <Controller
                        control={props.control}
                        name={`items.${props.index}.unit_type`}
                        defaultValue=""
                        render={({ field }) => (
                          <SelectCustom
                            sx={{ minWidth: '150px' }}
                            error={
                              props.errors &&
                              !!props.errors?.items?.[props.index]?.unit_type
                            }
                            IconComponent={() => <KeyboardArrowDownIcon />}
                            {...field}
                            onChange={(e) => {
                              props.setValue(
                                `items.${props.index}.unit_type`,
                                String(e.target.value)
                              )
                              props.trigger(`items.${props.index}.unit_type`)
                            }}
                            fullWidth
                          >
                            {temporaryListUnitType.map((item) => {
                              return (
                                <MenuItemSelectCustom
                                  value={item.name}
                                  key={item.value}
                                >
                                  {item.name}
                                </MenuItemSelectCustom>
                              )
                            })}
                          </SelectCustom>
                        )}
                      />
                      <FormHelperText error>
                        {props.errors?.items?.[props.index]?.unit_type &&
                          `${
                            props.errors?.items?.[props.index]?.unit_type!
                              .message
                          }`}
                      </FormHelperText>
                    </Box>
                  </Stack>
                </Grid>
                <Grid xs={6}>
                  <Box>
                    <Typography sx={{ fontWeight: '500' }} mb={2}>
                      {t('warehouse')}
                    </Typography>
                    <Controller
                      control={props.control}
                      name={`items.${props.index}.products`}
                      render={() => (
                        <>
                          {props.listWarehouse.map((obj, id) => {
                            props.setValue(
                              `items.${props.index}.products.${id}.warehouse`,
                              obj.id
                            )
                            if (id === 0) {
                              props.setValue(
                                `items.${props.index}.products.${id}.quantity`,
                                Number(props.item.quantity)
                              )
                            }
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
                                  name={`items.${props.index}.products.${id}.quantity`}
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
                                  {props.watch(`items.${props.index}.unit_type`)
                                    ? props.watch(
                                        `items.${props.index}.unit_type`
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
      )}
    </>
  )
}

export default InventoryOCR
