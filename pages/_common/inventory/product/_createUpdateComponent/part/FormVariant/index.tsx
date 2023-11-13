import { yupResolver } from '@hookform/resolvers/yup'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  MenuItem,
  Popover,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import { useTheme } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/system'
import { PlusCircle, Trash, TrashSimple, Warning } from '@phosphor-icons/react'
import React, { useEffect } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import {
  ButtonCancel,
  ButtonCustom,
  InputLabelCustom,
  SelectCustom,
  TextFieldCustom,
  UploadImage,
  UploadList,
} from 'src/components'
import { schema } from './validations'
// import { useAppDispatch } from 'src/store/hooks'
import { NumericFormat } from 'react-number-format'
import CurrencyNumberFormat from 'src/components/CurrencyNumberFormat'
import RequiredLabel from 'src/components/requiredLabel'
import classes from './styles.module.scss'
import { DistributionWithPriceType } from '../../addProductModel'
import WeightNumberFormat from '../WeightNumberFormat'
import { useTranslation } from 'react-i18next'

// import { loadingActions } from 'src/store/loading/loadingSlice'
interface DistributionChannelDetail {
  id: number
  price: number
}
interface Props {
  item: {
    options: { name: string; option: string }[]
    price: number | null
    warehouses?: {
      warehouse: number
      quantity: number
    }[]
    thumbnail: string
    images: string[]
    distribution_channel: DistributionWithPriceType[]
  }
  count: number
  listWarehouses: { id: number; name: string }[]
  listUOM: { id: number; name: string }[]
  listDistribution: { id: number; name: string }[]
  unitType: string
  indexVariant: number
  // brandDetail?: any
  propValue: (value: {
    price: number
    warehouses: {
      warehouse: number
      quantity: number
    }[]
    thumbnail: string
    images: string[]
    uom: number
    bar_code?: string
    weight: number
    on_market: boolean
    distribution_channel: DistributionWithPriceType[]
  }) => void
  // update?: boolean
  handleDeleteVariant: (value: number) => void
  variantLength: number
  default_on_market: boolean
  handleToggleOnMarket: () => void
}

const CustomStack = styled(Stack)(({ theme }) => ({
  // background: '#F8F9FC',
  padding: '15px',
  borderRadius: '10px',
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F8F9FC',
}))

const FormVariant = (props: Props) => {
  // const dispatch = useAppDispatch()
  const { t } = useTranslation('product')
  const theme = useTheme()
  const [expanded, setExpanded] = React.useState<boolean>(false)
  const [stateRender, setStateRender] = React.useState<boolean>(false)
  const [stateOnMarketPlace, setStateOnMarketPlace] = React.useState(false)
  // popup delete

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClickPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClosePopover = () => {
    setAnchorEl(null)
  }

  const openDelete = Boolean(anchorEl)
  const id = openDelete ? 'simple-popover' : undefined
  //
  useEffect(() => {
    setValue('distribution_channel.0.id', props.listDistribution[0].id)
  }, [props.listDistribution])
  useEffect(() => {
    setStateOnMarketPlace(props.default_on_market)
  }, [props.default_on_market])

  useEffect(() => {
    // 👇️ don't run on the initial render
    console.log('count', props.indexVariant)

    if (props.count !== 0) {
      handleSubmit(OnSubmit)()
    }
    // if (!stateRender) {
    //   setError('root.random', {
    //     type: 'random',
    //   })
    // }
  }, [props.count])

  const {
    control,
    setValue,
    trigger,
    watch,
    // setError,
    clearErrors,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    price: number
    uom: number
    weight: number
    images: string[]
    thumbnail: string
    bar_code?: string | null
    distribution_channel: DistributionChannelDetail[]
    warehouses: { warehouse: number; quantity?: number }[]
  }>({
    resolver: yupResolver(schema(t, stateOnMarketPlace)),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      images: [],
      distribution_channel: [
        {
          id: 0,
          price: 0,
        },
      ],
      thumbnail: '',
    },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'distribution_channel',
  })
  // const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
  //   {
  //     control, // control props comes from useForm (optional: if you are using FormContext)
  //     name: 'warehouses', // unique name for your Field Array
  //   }
  // )
  // {
  //   const fieldsLength = fields.length
  //   useEffect(() => {
  //     if (dirtyFields['warehouses'] && fieldsLength === 0) {
  //       console.log('1')
  //       setError('warehouses', { message: 'At least 1 entry is required' })
  //     } else {
  //       console.log('2')
  //       clearErrors('warehouses')
  //     }
  //   }, [clearErrors, dirtyFields, fieldsLength, name, setError])
  // }
  // useEffect(() => {
  //   reset({
  //     warehouses: props.listWarehouses.map((item) => ({
  //       warehouse: item.id,
  //       name: item.name,
  //       quantity: null,
  //     })),
  //   })
  // }, [])
  console.log('1111', props.indexVariant)
  const OnSubmit = (values: any) => {
    // const submitBrand: AddBrandType = {
    //   name: values.name,
    //   logo: values.logo,
    // }
    // props.handleSubmit(submitBrand)

    const result = values.distribution_channel.every(
      (item: any) => item.price === 0
    )
    console.log('stateOnMarketPlace', stateOnMarketPlace)

    console.log('result', result)
    console.log(
      '(!stateOnMarketPlace && !result)',
      !stateOnMarketPlace && !result
    )
    console.log('final', stateOnMarketPlace || (!stateOnMarketPlace && !result))
    console.log('fsadfsdf', {
      price: values.price,
      images: values.images,
      on_market: stateOnMarketPlace,
      ...((stateOnMarketPlace || (!stateOnMarketPlace && values.barcode)) && {
        bar_code: values.barcode,
      }),
      ...((stateOnMarketPlace || (!stateOnMarketPlace && values.uom)) && {
        uom: values.uom,
      }),
      ...((stateOnMarketPlace || (!stateOnMarketPlace && values.weight)) && {
        weight: values.weight,
      }),
      ...((stateOnMarketPlace || (!stateOnMarketPlace && !result)) && {
        distribution_channel: values.distribution_channel,
      }),
      thumbnail: values.thumbnail ? values.thumbnail : null,
      warehouses: values.warehouses.map(
        (item: { warehouse: number; quantity?: number }) => ({
          ...item,
          quantity: item.quantity ? item.quantity : 0,
        })
      ),
    })
    console.log('values dc', values)
    props.propValue({
      price: values.price,
      images: values.images,
      on_market: stateOnMarketPlace,
      ...((stateOnMarketPlace || (!stateOnMarketPlace && values.barcode)) && {
        bar_code: values.barcode,
      }),
      ...((stateOnMarketPlace || (!stateOnMarketPlace && values.uom)) && {
        uom: values.uom,
      }),
      ...((stateOnMarketPlace || (!stateOnMarketPlace && values.weight)) && {
        weight: values.weight,
      }),
      ...((stateOnMarketPlace || (!stateOnMarketPlace && !result)) && {
        distribution_channel: values.distribution_channel,
      }),
      thumbnail: values.thumbnail ? values.thumbnail : null,
      warehouses: values.warehouses.map(
        (item: { warehouse: number; quantity?: number }) => ({
          ...item,
          quantity: item.quantity ? item.quantity : 0,
        })
      ),
    })

    console.log('5555', errors, values)
  }
  console.log('props', props)
  const onError = (err: any) => {
    console.log('errorChild', err)
  }

  useEffect(() => {
    // console.log('reder', props.indexVariant)
    // setTimeout(() => {
    //   clearErrors()
    // }, 0)

    return () => {
      console.log('Child unmounted')
      setAnchorEl(null)
    }
  }, [])
  return (
    <Box mb={2}>
      <Accordion
        expanded={expanded}
        onChange={() => {
          setExpanded(!expanded)
          setStateRender(true)
        }}
        style={{
          border: `1px solid ${
            Object.keys(errors).length > 0
              ? theme.palette.error.main
              : 'transparent'
          }`,
          background: '#F8F9FC',
          boxShadow: openDelete
            ? `0px 0px 2px 0px ${theme.palette.error.main}`
            : 'none',
          borderRadius: '10px',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ color: '#BABABA', fontWeight: 500 }}>
                {t('createUpdate.formVariant.productVariant')}{' '}
                {props.indexVariant + 1}
              </Typography>
              {props.item?.options?.map((i, idx: number) => (
                <span key={idx}>
                  <b>{i.name}</b>: {i.option}
                </span>
              ))}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              {/* {stateRender &&
                (Object.keys(errors).length === 0 ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontWeight: 500, color: '#1DB46A' }}>
                      Valid
                    </Typography>
                    <CheckCircle size={24} color="#1DB46A" weight="fill" />
                  </Stack>
                ) : (

                ))} */}
              {Object.keys(errors).length > 0 && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography sx={{ fontWeight: 500, color: '#E02D3C' }}>
                    {t('createUpdate.formVariant.invalid')}
                  </Typography>
                  <Warning size={24} weight="fill" color="#E02D3C" />
                </Stack>
              )}
              <Popover
                id={id}
                open={openDelete}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <Box p={2}>
                  <Typography alignSelf="center" mb={2}>
                    {t('createUpdate.formVariant.areYouSureToDelete')}
                  </Typography>
                  <Stack spacing={2} direction="row">
                    <ButtonCancel
                      onClick={handleClosePopover}
                      variant="outlined"
                      size="small"
                    >
                      {t('createUpdate.formVariant.no')}
                    </ButtonCancel>
                    <ButtonCustom
                      variant="contained"
                      onClick={() => {
                        props.handleDeleteVariant(props.indexVariant)
                        handleClosePopover()
                      }}
                      size="small"
                    >
                      {t('createUpdate.formVariant.yes')}
                    </ButtonCustom>
                  </Stack>
                </Box>
              </Popover>
              <ButtonCustom
                variant="outlined"
                size="small"
                aria-describedby={id}
                sx={{
                  marginRight: '15px !important',
                  paddingLeft: '10px',
                  paddingRight: '10px',
                }}
                onClick={(e: React.MouseEvent<any>) => {
                  e.stopPropagation()
                  e.preventDefault()
                  handleClickPopover(e)
                }}
                startIcon={<TrashSimple size={18} />}
              >
                {t('createUpdate.formVariant.delete')}
              </ButtonCustom>
            </Stack>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          {stateRender && (
            <form onSubmit={handleSubmit(OnSubmit, onError)}>
              <Stack direction="row" mb={2}>
                <CustomStack>
                  <Typography mb={1}>
                    {t('createUpdate.productThumbnail')}
                  </Typography>
                  <Box
                    p={'15px'}
                    mb={'25px'}
                    maxWidth={'193px'}
                    borderRadius={'10px'}
                    sx={{
                      backgroundColor: 'white',
                    }}
                  >
                    <input {...register('thumbnail')} hidden />
                    <UploadImage
                      file={watch('thumbnail')}
                      onFileSelectSuccess={(file: string) => {
                        setValue('thumbnail', file)
                        trigger('thumbnail')
                      }}
                      onFileSelectError={() => {
                        return
                      }}
                      onFileSelectDelete={() => {
                        setValue('thumbnail', '')
                        trigger('thumbnail')
                      }}
                    />
                    <FormHelperText error={!!errors.thumbnail}>
                      {errors.thumbnail && `${errors.thumbnail.message}`}
                    </FormHelperText>
                  </Box>
                </CustomStack>
                <CustomStack
                  sx={{
                    width: '100%',
                    whiteSpace: 'no-wrap',
                    overflowX: 'auto',
                  }}
                >
                  <Stack direction="row" mb={1}>
                    <Typography>{t('createUpdate.productImages')}</Typography>
                    <Typography sx={{ color: '#757C91', fontWeight: 300 }}>
                      {t('createUpdate.maximum_10Images')}
                    </Typography>
                  </Stack>
                  <input {...register('images')} hidden />
                  <UploadList
                    files={watch('images') as string[]}
                    onFileSelectSuccess={(file: string[]) => {
                      setValue('images', file)
                      trigger('images')
                    }}
                    onFileSelectError={() => {
                      return
                    }}
                    onFileSelectDelete={(file) => {
                      setValue('images', file)
                      trigger('images')
                    }}
                  />
                </CustomStack>
              </Stack>
              <Grid container spacing={2}>
                <Grid xs={6}>
                  <Box
                    sx={{
                      marginBottom: '15px',
                      background: '#fff',
                      borderRadius: '10px',
                    }}
                    p={2}
                  >
                    <Controller
                      control={control}
                      name="bar_code"
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            error={!!errors.bar_code}
                            htmlFor="bar_code"
                          >
                            Barcode
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              sx={{ background: 'white' }}
                              placeholder="Enter barcode"
                              error={!!errors.bar_code}
                              {...field}
                            />
                          </FormControl>
                          <FormHelperText error={!!errors.bar_code}>
                            {errors.bar_code && `${errors.bar_code.message}`}
                          </FormHelperText>
                        </>
                      )}
                    />
                  </Box>
                </Grid>
                <Grid xs={6}>
                  <Box
                    sx={{
                      marginBottom: '15px',
                      background: '#fff',
                      borderRadius: '10px',
                    }}
                    p={2}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography style={{ fontWeight: 600, color: '#1DB469' }}>
                        Put product on market place
                      </Typography>
                      <Switch
                        checked={stateOnMarketPlace}
                        onChange={() => {
                          if (stateOnMarketPlace) {
                            clearErrors()
                          } else {
                            props.handleToggleOnMarket()
                          }

                          setStateOnMarketPlace((prev) => !prev)
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Stack>
                  </Box>
                </Grid>
                <Grid xs={6}>
                  <Typography
                    sx={{
                      color: '#49516F',
                      fontWeight: 500,
                      marginBottom: '10px',
                    }}
                  >
                    {t('createUpdate.basePrice')}
                  </Typography>
                  <Box sx={{ background: '#fff', borderRadius: '10px' }} p={2}>
                    <Controller
                      control={control}
                      name="price"
                      render={() => (
                        <>
                          <InputLabelCustom htmlFor="price">
                            <RequiredLabel />
                            {t('createUpdate.basePrice')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <div className={classes['input-number']}>
                              <CurrencyNumberFormat
                                propValue={(value) => {
                                  setValue(`price`, Number(value))
                                  trigger(`price`)
                                }}
                                error={!!errors.price}
                              />
                            </div>
                            <FormHelperText error={!!errors.price}>
                              {errors.price && `${errors.price.message}`}
                            </FormHelperText>
                          </FormControl>
                        </>
                      )}
                    />
                  </Box>
                </Grid>
                <Grid xs={6}>
                  <Typography
                    sx={{
                      color: '#49516F',
                      fontWeight: 500,
                      marginBottom: '10px',
                    }}
                  >
                    {t('createUpdate.formVariant.weight')}
                  </Typography>
                  <Box sx={{ background: '#fff', borderRadius: '10px' }} p={2}>
                    <Stack direction="row" spacing={2}>
                      <Box sx={{ width: '100%' }}>
                        <Controller
                          control={control}
                          name="weight"
                          render={() => (
                            <>
                              <InputLabelCustom htmlFor="weight">
                                {stateOnMarketPlace && <RequiredLabel />}

                                {t('createUpdate.formVariant.weight')}
                              </InputLabelCustom>
                              <FormControl fullWidth>
                                <div className={classes['input-number']}>
                                  <WeightNumberFormat
                                    propValue={(value) => {
                                      setValue(`weight`, Number(value))
                                      trigger(`weight`)
                                    }}
                                    error={!!errors.weight}
                                  />
                                </div>
                                <FormHelperText error={!!errors.weight}>
                                  {errors.weight && `${errors.weight.message}`}
                                </FormHelperText>
                              </FormControl>
                            </>
                          )}
                        />
                      </Box>
                      <Box sx={{ width: '100%' }}>
                        <Controller
                          control={control}
                          name="uom"
                          render={({ field }) => (
                            <>
                              <InputLabelCustom
                                htmlFor="uom"
                                error={!!errors.uom}
                              >
                                {stateOnMarketPlace && <RequiredLabel />}

                                {t('createUpdate.uom')}
                              </InputLabelCustom>
                              <SelectCustom
                                sx={{ width: '100%' }}
                                {...field}
                                onChange={(event: any) => {
                                  console.log('event', event.target.value)
                                  setValue(`uom`, event.target.value)
                                }}
                              >
                                {props.listUOM?.map((obj, index) => {
                                  return (
                                    <MenuItem key={index} value={obj.id}>
                                      {obj.name}
                                    </MenuItem>
                                  )
                                })}
                              </SelectCustom>
                              <FormHelperText error={!!errors.uom}>
                                {errors.uom && `${errors.uom.message}`}
                              </FormHelperText>
                            </>
                          )}
                        />
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
                <Grid xs={6}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ marginBottom: '15px' }}
                  >
                    <Typography sx={{ color: '#49516F', fontWeight: 500 }}>
                      {t('createUpdate.warehouse')}
                    </Typography>
                    <FormHelperText error={!!errors.warehouses}>
                      {errors?.warehouses && errors.warehouses?.message}
                    </FormHelperText>
                  </Stack>
                  <Box sx={{ background: '#fff', borderRadius: '10px' }} p={2}>
                    {[...Array(props.listWarehouses.length)].map(
                      (item, idx) => {
                        console.log('item', item)
                        return (
                          <Stack key={idx} spacing={2} direction="row">
                            <Box sx={{ width: '50%' }}>
                              <Controller
                                control={control}
                                name={`warehouses.${idx}.warehouse`}
                                defaultValue={props.listWarehouses[idx].id}
                                render={({ field }) => (
                                  <>
                                    <InputLabelCustom
                                      htmlFor={`warehouses.${idx}.warehouse`}
                                    >
                                      <RequiredLabel />{' '}
                                      {t('createUpdate.warehouse')} {idx + 1}
                                    </InputLabelCustom>
                                    <FormControl fullWidth>
                                      {/* <TextFieldCustom
                                    {...field}
                                    disabled
                                    placeholder="Enter warehouse"
                                  /> */}
                                      <SelectCustom
                                        {...field}
                                        disabled
                                        sx={{ paddingRight: '15px' }}
                                        IconComponent={() => (
                                          <KeyboardArrowDownIcon
                                            sx={{
                                              color: 'transparent',
                                              display: 'none',
                                            }}
                                          />
                                        )}
                                        onChange={(
                                          event: SelectChangeEvent<unknown>
                                        ) => {
                                          console.log('event', event)
                                        }}
                                      >
                                        <MenuItem
                                          value={props.listWarehouses[idx].id}
                                        >
                                          {props.listWarehouses[idx].name}
                                        </MenuItem>
                                      </SelectCustom>
                                    </FormControl>
                                  </>
                                )}
                              />
                            </Box>
                            <Box sx={{ width: '50%' }}>
                              <Controller
                                control={control}
                                name={`warehouses.${idx}.quantity`}
                                render={() => (
                                  <>
                                    <InputLabelCustom
                                      htmlFor={`warehouses.${idx}.quantity`}
                                      error={
                                        !!errors?.['warehouses']?.[idx]?.[
                                          'quantity'
                                        ]
                                      }
                                    >
                                      <RequiredLabel />{' '}
                                      {t('createUpdate.quantity')}
                                    </InputLabelCustom>
                                    <FormControl fullWidth>
                                      <NumericFormat
                                        allowNegative={false}
                                        customInput={TextField}
                                        style={{ width: '100%' }}
                                        thousandSeparator
                                        isAllowed={(values) => {
                                          const { floatValue, formattedValue } =
                                            values
                                          if (!floatValue) {
                                            return formattedValue === ''
                                          }
                                          return floatValue <= 10000000
                                        }}
                                        className={classes['input-number']}
                                        InputProps={{
                                          endAdornment: (
                                            <InputAdornment position="end">
                                              {props.unitType.toLowerCase()}
                                            </InputAdornment>
                                          ),
                                        }}
                                        error={
                                          !!errors?.['warehouses']?.[idx]?.[
                                            'quantity'
                                          ]
                                        }
                                        placeholder="0"
                                        onValueChange={(value) => {
                                          setValue(
                                            `warehouses.${idx}.quantity`,
                                            value.floatValue
                                          )
                                          trigger(`warehouses.${idx}.quantity`)
                                          trigger('warehouses')
                                        }}
                                      />

                                      <FormHelperText
                                        error={
                                          !!errors?.['warehouses']?.[idx]?.[
                                            'quantity'
                                          ]
                                        }
                                      >
                                        {errors?.['warehouses']?.[idx]?.[
                                          'quantity'
                                        ] &&
                                          `${errors?.['warehouses']?.[idx]?.['quantity']?.message}`}
                                      </FormHelperText>
                                    </FormControl>
                                  </>
                                )}
                              />
                            </Box>
                          </Stack>
                        )
                      }
                    )}
                  </Box>
                </Grid>
                <Grid xs={6}>
                  <Typography sx={{ color: '#49516F', fontWeight: 500 }} mb={1}>
                    {t('createUpdate.formVariant.distributionPricing')}
                  </Typography>
                  <Box
                    sx={{
                      background: '#fff',
                      borderRadius: '10px',
                    }}
                    p={2}
                  >
                    <Controller
                      control={control}
                      name="distribution_channel"
                      render={() => {
                        return (
                          <Stack spacing={2}>
                            {fields.map((item, index) => {
                              return (
                                <Stack
                                  direction="row"
                                  key={item.id}
                                  spacing={2}
                                >
                                  <Box sx={{ width: '100%' }}>
                                    <Controller
                                      control={control}
                                      name={`distribution_channel.${index}.id`}
                                      render={({ field }) => (
                                        <>
                                          <InputLabelCustom
                                            htmlFor={`distribution_channel.${index}.id`}
                                            error={
                                              !!errors.distribution_channel?.[
                                                index
                                              ]?.id
                                            }
                                          >
                                            {t(
                                              'createUpdate.distributionChannel'
                                            )}
                                          </InputLabelCustom>
                                          <FormControl
                                            fullWidth
                                            disabled={index === 0}
                                          >
                                            <SelectCustom
                                              {...field}
                                              sx={{
                                                background:
                                                  index === 0 ? '#F6F6F6' : '',
                                                paddingRight: '15px',
                                              }}
                                              IconComponent={() => (
                                                <KeyboardArrowDownIcon
                                                  sx={{
                                                    color: 'transparent',
                                                    display: 'none',
                                                  }}
                                                />
                                              )}
                                              onChange={(event: any) => {
                                                setValue(
                                                  `distribution_channel.${index}.id`,
                                                  event.target.value
                                                )
                                              }}
                                            >
                                              {props.listDistribution.map(
                                                (obj, idx) => {
                                                  return (
                                                    <MenuItem
                                                      key={idx}
                                                      disabled={idx === 0}
                                                      value={obj.id}
                                                    >
                                                      {obj.name}
                                                    </MenuItem>
                                                  )
                                                }
                                              )}
                                            </SelectCustom>
                                            <FormHelperText
                                              error={
                                                !!errors.distribution_channel?.[
                                                  index
                                                ]?.id
                                              }
                                            >
                                              {errors.distribution_channel?.[
                                                index
                                              ]?.id &&
                                                `${errors.distribution_channel?.[index]?.id?.message}`}
                                            </FormHelperText>
                                          </FormControl>
                                        </>
                                      )}
                                    />
                                  </Box>
                                  <Box sx={{ width: '100%' }}>
                                    {' '}
                                    <Controller
                                      control={control}
                                      name={`distribution_channel.${index}.price`}
                                      render={() => (
                                        <Box mb={1}>
                                          <InputLabelCustom
                                            htmlFor={`distribution_channel.${index}.price`}
                                            error={
                                              !!errors.distribution_channel?.[
                                                index
                                              ]?.price
                                            }
                                          >
                                            {stateOnMarketPlace && (
                                              <RequiredLabel />
                                            )}{' '}
                                            {t(
                                              'createUpdate.formVariant.price'
                                            )}
                                          </InputLabelCustom>
                                          <FormControl fullWidth>
                                            <div className={'input-number'}>
                                              <CurrencyNumberFormat
                                                propValue={(value) => {
                                                  console.log('Setting', value)
                                                  setValue(
                                                    `distribution_channel.${index}.price`,
                                                    Number(value)
                                                  )
                                                  trigger(
                                                    `distribution_channel.${index}.price`
                                                  )
                                                }}
                                                error={
                                                  !!errors
                                                    .distribution_channel?.[
                                                    index
                                                  ]?.price
                                                }
                                              />
                                            </div>
                                            <FormHelperText
                                              error={
                                                !!errors.distribution_channel?.[
                                                  index
                                                ]?.price
                                              }
                                            >
                                              {!!errors.distribution_channel?.[
                                                index
                                              ]?.price &&
                                                `${!!errors
                                                  .distribution_channel?.[index]
                                                  ?.price?.message}`}
                                            </FormHelperText>
                                          </FormControl>
                                        </Box>
                                      )}
                                    />
                                  </Box>
                                  {fields.length > 1 && (
                                    <IconButton onClick={() => remove(index)}>
                                      <Trash color="#F5222D" size={20} />
                                    </IconButton>
                                  )}
                                </Stack>
                              )
                            })}
                          </Stack>
                        )
                      }}
                    />
                    <ButtonCustom
                      size="large"
                      variant="outlined"
                      startIcon={<PlusCircle size={24} />}
                      onClick={() => {
                        append({
                          id: 0,
                          price: 0,
                        })
                      }}
                    >
                      {t('createUpdate.formVariant.addDistributionChannel')}
                    </ButtonCustom>
                  </Box>
                </Grid>
              </Grid>
            </form>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default FormVariant
