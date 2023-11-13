import {
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  Typography,
  FormControl,
  FormHelperText,
  Divider,
  Stack,
  Drawer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Pagination,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getGeocode, getLatLng } from 'use-places-autocomplete'
import {
  ButtonCustom,
  InputLabelCustom,
  TextFieldCustom,
  ButtonCancel,
  TableContainerTws,
  TableCellTws,
  SelectPaginationCustom,
  MenuItemSelectCustom,
  TableRowTws,
} from 'src/components'
import MenuIcon from '@mui/icons-material/Menu'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Grid from '@mui/material/Unstable_Grid2'
import { useRouter } from 'next/router'
import {
  FormRouterType,
  SellerDataResponseType,
  ContactDataResponseType,
} from './modelCreateRoute'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { getSellerList, getContactList } from './apiCreateRoute'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import RequiredLabel from 'src/components/requiredLabel'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'
import { PlusCircle, Trash, Book, ArrowRight, X } from '@phosphor-icons/react'
import dayjs from 'dayjs'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import GoogleAutoComplete from './part/GoogleAutoCompleteMui'
import { useTranslation } from 'react-i18next'

interface Props {
  handleSubmit: (value: FormRouterType) => void
  routeDetail?: {
    user: {
      id: number
      full_name: string
    }
    date_from: string
    origin: string
    origin_location: {
      latitude: string
      longitude: string
    }
    destination: string
    destination_location: {
      latitude: string
      longitude: string
    }
    optimize: boolean
    locations: {
      address: string
      latitude: string
      longitude: string
      contact: {
        business_name: string
        id: number | null
      } | null
    }[]
  }
}

const CreateUpdateComponent: React.FC<Props> = (props) => {
  const { t } = useTranslation('map')

  // const openDrawer = Boolean(anchorFilter)
  const [stateOpenDrawer, setStateOpenDrawer] = useState(false)
  // const handleOpenDrawer = useCallback(() => {}, [])
  const router = useRouter()
  const [statePaginationContact, setStatePaginationContact] = useState<{
    page: number
    limit: number
  }>({ page: 1, limit: 10 })
  const [stateContactSelect, setStateContactSelect] = useState<number>(-1)
  const [stateSellerList, setStateSellerList] =
    useState<SellerDataResponseType>({ data: [] })
  const [stateContactList, setStateContactList] =
    useState<ContactDataResponseType>({ data: [] })
  const [stateSeller, setStateSeller] = React.useState<{
    id: number | null
    full_name: string
  }>({
    id: props.routeDetail?.user?.id || null,
    full_name: props.routeDetail?.user?.full_name || '',
  })
  const [pushMessage] = useEnqueueSnackbar()
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    trigger,
    watch,
    // register,
    formState: { errors },
  } = useForm<FormRouterType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: {
      locations: [{ address: '' }],
    },
  })
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'locations',
  })
  const handleGetListSeller = () => {
    getSellerList()
      .then((res) => {
        const { data } = res
        setStateSellerList(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleGetContactList = (value: { page: number; limit: number }) => {
    getContactList(value)
      .then((res) => {
        const { data } = res
        setStateContactList(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const onSubmitRoute = (value: FormRouterType) => {
    console.log('value888', value)
    props.handleSubmit(value)
  }

  const handleDrag = ({ source, destination }: any) => {
    if (destination) {
      move(source.index, destination.index)
      // setCount((current) => current + 1)
    }
  }
  useEffect(() => {
    handleGetListSeller()
    handleGetContactList({
      page: 1,
      limit: 10,
    })
    setValue('date_from', dayjs().format('MM/DD/YYYY'))
  }, [])
  const onError = (error: any) => {
    console.log('error', error)
  }

  useEffect(() => {
    if (props.routeDetail) {
      console.log('mko', props.routeDetail)
      setValue('seller_id', props.routeDetail?.user?.id)
      setValue('name', props.routeDetail?.user?.full_name)
      setValue('locations', props.routeDetail?.locations)
      setValue('date_from', props.routeDetail?.date_from)
      setValue('origin', {
        ...props.routeDetail.origin_location,
        address: props.routeDetail?.origin,
      })
      setValue('optimize', props.routeDetail?.optimize)
      setValue('destination', {
        ...props.routeDetail.destination_location,
        address: props.routeDetail?.destination,
        // destination: props.routeDetail?.destination,
      })
      setStateSeller({
        id: props.routeDetail?.user?.id,
        full_name: props.routeDetail?.user?.full_name,
      })
    }
  }, [props.routeDetail])

  return (
    <Box mt={2}>
      <form onSubmit={handleSubmit(onSubmitRoute, onError)}>
        <Typography sx={{ fontSize: '1.6rem', fontWeight: 600 }} mb={1}>
          {t('details')}
        </Typography>
        <Box sx={{ marginBottom: '15px' }}>
          <Grid container spacing={2} sx={{ marginBottom: '15px' }}>
            <Grid xs={6}>
              <InputLabelCustom>
                {t('seller')}
                <RequiredLabel />
              </InputLabelCustom>
              <Controller
                control={control}
                name="seller_id"
                render={() => (
                  <>
                    <Autocomplete
                      value={stateSeller}
                      options={stateSellerList?.data}
                      getOptionLabel={(item) =>
                        item?.full_name ? item.full_name : ''
                      }
                      onChange={(event, newValue: any) => {
                        console.log('evemt seller', event)
                        console.log('seller', newValue)
                        if (newValue) {
                          setValue('seller_id', newValue.id)
                          setValue('name', newValue.full_name)
                        }
                        setStateSeller({
                          id: newValue?.id ? newValue?.id : null,
                          full_name: newValue?.full_name
                            ? newValue?.full_name
                            : '',
                        })
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
                          padding: '1px 5px',
                        },
                      }}
                      renderInput={(params) => (
                        <TextFieldCustom {...(params as any)} />
                      )}
                    />
                  </>
                )}
              />
            </Grid>
            <Grid xs={6}>
              <InputLabelCustom>
                {t('date')}
                <RequiredLabel />
              </InputLabelCustom>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={getValues('date_from')}
                  onChange={(newValue: dayjs.Dayjs | null) => {
                    console.log(
                      'newValue',
                      dayjs(newValue).format('MM/DD/YYYY')
                    )
                    setValue('date_from', dayjs(newValue).format('MM/DD/YYYY'))
                    trigger('date_from')
                  }}
                  renderInput={(params: any) => {
                    // params?.inputProps?.value = field.value
                    // const value = params
                    return (
                      <TextFieldCustom
                        {...params}
                        error={!!errors.date_from}
                        fullWidth
                      />
                    )
                  }}
                  minDate={dayjs()}
                />
              </LocalizationProvider>
            </Grid>
            <Grid xs={6}>
              <Controller
                control={control}
                name="origin"
                render={() => (
                  <>
                    <InputLabelCustom error={!!errors.origin?.address}>
                      {t('startLocation')}
                      <RequiredLabel />
                    </InputLabelCustom>

                    <FormControl fullWidth>
                      <GoogleAutoComplete
                        onChangeValue={(value) => {
                          setValue('origin', value)
                          trigger('origin')
                          console.log('34543534545435', value)
                        }}
                        value={getValues('origin')}
                        error={!!errors.origin?.address}
                      />
                      <FormHelperText error={!!errors.origin?.address}>
                        {errors.origin?.address &&
                          `${errors.origin?.address.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Grid>
            <Grid xs={6}>
              <Controller
                control={control}
                name="destination"
                render={() => (
                  <>
                    <InputLabelCustom error={!!errors.destination?.address}>
                      {t('endLocation')}
                      <RequiredLabel />
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <GoogleAutoComplete
                        onChangeValue={(value) => {
                          console.log('value', value)
                          setValue('destination', value)
                          trigger('destination')
                        }}
                        value={getValues('destination')}
                        error={!!errors.destination?.address}
                      />
                      <FormHelperText error={!!errors.destination?.address}>
                        {errors.destination?.address &&
                          `${errors.destination?.address?.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Grid>
          </Grid>
        </Box>
        <Typography sx={{ fontSize: '1.6rem', fontWeight: 600 }} mb={1}>
          {t('stops')}
        </Typography>
        <Box sx={{ marginBottom: '15px' }}>
          <DragDropContext onDragEnd={handleDrag}>
            <Droppable droppableId="location-item">
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{
                    border: fields.length > 0 ? '1px solid #E1E6EF' : 'none',
                    borderRadius: '6px',
                  }}
                  mb={2}
                >
                  {fields.map((item, index) => {
                    return (
                      <Draggable
                        key={`location-item[${index}]`}
                        draggableId={`location-item-${index}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            key={item.id}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <>
                              <Paper
                                sx={{
                                  p: '6px 4px 2px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  margin: '10px 0px',
                                  boxShadow: 'none',
                                  // border: '1px solid #E1E6EF',
                                }}
                              >
                                <div {...provided.dragHandleProps}>
                                  <IconButton
                                    sx={{ p: '10px' }}
                                    aria-label="menu"
                                  >
                                    <MenuIcon />
                                  </IconButton>
                                </div>
                                <Typography
                                  mr={3}
                                  sx={{ whiteSpace: 'nowrap' }}
                                >
                                  {t('stop')} {index + 1}
                                </Typography>
                                <Box sx={{ width: '100%' }}>
                                  <Controller
                                    control={control}
                                    name={`locations.${index}`}
                                    render={() => (
                                      <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                      >
                                        <FormControl fullWidth>
                                          <GoogleAutoComplete
                                            onChangeValue={(value) => {
                                              console.log('value3333', value)
                                              setValue(`locations.${index}`, {
                                                ...getValues(
                                                  `locations.${index}`
                                                ),
                                                ...value,
                                              })
                                              trigger(`locations.${index}`)
                                            }}
                                            value={getValues(
                                              `locations.${index}`
                                            )}
                                            error={
                                              !!errors?.locations?.[index]
                                                ?.address?.message
                                            }
                                          />
                                          {errors?.locations?.[index]
                                            ?.address && (
                                            <FormHelperText
                                              error={
                                                !!errors?.locations?.[index]
                                                  ?.address?.message
                                              }
                                            >
                                              {`${errors?.locations?.[index]?.address?.message}`}
                                            </FormHelperText>
                                          )}
                                        </FormControl>

                                        <Stack
                                          direction="row"
                                          alignItems="center"
                                          spacing={1}
                                          justifyContent="space-between"
                                          sx={{
                                            border: '1px solid #E1E6EF',
                                            borderRadius: '8px',
                                            padding: '4px 5px 4px 15px',
                                            minWidth: '250px',
                                          }}
                                        >
                                          <Typography
                                            sx={{ whiteSpace: 'nowrap' }}
                                          >
                                            {watch(`locations.${index}.contact`)
                                              ? watch(
                                                  `locations.${index}.contact.business_name`
                                                )
                                              : ''}
                                          </Typography>
                                          <IconButton
                                            type="button"
                                            sx={{
                                              height: '30px',
                                              width: '30px',
                                            }}
                                          >
                                            <X
                                              onClick={() => {
                                                // alert(
                                                //   getValues(
                                                //     `locations.${index}.contact`
                                                //   )
                                                // )
                                                // setValue(
                                                //   `locations.${stateContactSelect}.contact`,
                                                //   {
                                                //     business_name: item.business_name,
                                                //     id: item.id,
                                                //   }
                                                // )
                                                setValue(
                                                  `locations.${index}.contact`,
                                                  null
                                                )
                                                console.log(
                                                  '33333',
                                                  getValues(
                                                    `locations.${index}.contact`
                                                  )
                                                )
                                              }}
                                            />
                                          </IconButton>
                                        </Stack>
                                      </Stack>
                                    )}
                                  />
                                </Box>
                                <Divider
                                  sx={{ height: 28, m: 1 }}
                                  orientation="vertical"
                                />
                                <IconButton
                                  type="button"
                                  sx={{ p: '10px' }}
                                  onClick={() => {
                                    setStateOpenDrawer(true)
                                    setStateContactSelect(index)
                                  }}
                                >
                                  <Book />
                                </IconButton>
                                <Divider
                                  sx={{ height: 28, m: 0.5 }}
                                  orientation="vertical"
                                />
                                <Box sx={{ minWidth: '40px' }}>
                                  {index > 0 && (
                                    <IconButton
                                      color="primary"
                                      sx={{ p: '10px' }}
                                      onClick={() => remove(index)}
                                    >
                                      <Trash color="#F5222D" />
                                    </IconButton>
                                  )}
                                </Box>
                              </Paper>
                            </>
                          </div>
                        )}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
          <FormHelperText error={!!errors?.locations?.message} sx={{ mb: 2 }}>
            {errors?.locations?.message && `${errors?.locations?.message}`}
          </FormHelperText>
          <ButtonCustom
            size="small"
            variant="outlined"
            startIcon={<PlusCircle size={24} />}
            onClick={() => {
              append({
                address: '',
                latitude: '0',
                longitude: '0',
                contact: {
                  business_name: '',
                  id: null,
                },
              })
            }}
          >
            {t('addStop')}
          </ButtonCustom>
        </Box>
        <Box mb={2}>
          {/* <FormControlLabel
            label={
              'Auto optimize routes (On checked, the route will be automatically optimized)'
            }
            control={
              <Checkbox
                checked={stateCheckBox}
                onChange={() => setStateCheckBox(!stateCheckBox)}
              />
            }
          /> */}
          <Controller
            control={control}
            defaultValue={false}
            name="optimize"
            render={({ field: { value, ...field } }) => (
              <Box>
                <FormControlLabel
                  control={<Checkbox {...field} checked={value} />}
                  label={t(
                    'autoOptimizeRoutesOnCheckedTheRouteWillBeAutomaticallyOptimized'
                  )}
                />
              </Box>
            )}
          />
        </Box>
        <Stack direction="row" spacing={2}>
          <ButtonCancel
            onClick={() => {
              router.push(
                platform() === 'RETAILER'
                  ? `/retailer/map/route-management/list/`
                  : `/supplier/map/route-management/list/`
              )
            }}
            sx={{ color: '#49516F' }}
          >
            {t('cancel')}
          </ButtonCancel>
          <ButtonCustom type="submit" size="large" variant="contained">
            {t('submit')}
          </ButtonCustom>
        </Stack>
      </form>
      <Drawer
        anchor={'right'}
        open={stateOpenDrawer}
        onClose={() => {
          setStateOpenDrawer(!stateOpenDrawer)
          setTimeout(function () {
            setStateContactSelect(-1)
          }, 1000)
        }}
      >
        <Box sx={{ padding: '30px', maxWidth: '800px', width: '100%' }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ marginBottom: '15px' }}
            alignItems="center"
          >
            <IconButton
              onClick={() => {
                setStateOpenDrawer(!stateOpenDrawer)
              }}
            >
              <ArrowRight size={24} />
            </IconButton>
            <Typography>{t('leadList')}</Typography>
          </Stack>
          <TableContainerTws sx={{ marginTop: '0 !important' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws>{t('leadName')}</TableCellTws>
                  <TableCellTws>{t('businessName')}</TableCellTws>
                  <TableCellTws>{t('address')}</TableCellTws>
                  <TableCellTws>{t('phoneNumber')}</TableCellTws>
                  <TableCellTws>{t('federalTaxID')}</TableCellTws>
                  <TableCellTws></TableCellTws>
                </TableRow>
              </TableHead>
              <TableBody>
                {stateContactList?.data?.map((item, index) => {
                  return (
                    <TableRowTws key={index}>
                      <TableCellTws>
                        {item.first_name} {item.last_name}
                      </TableCellTws>
                      <TableCellTws>{item.business_name}</TableCellTws>
                      <TableCellTws>{item.address}</TableCellTws>
                      <TableCellTws>{item.phone_number}</TableCellTws>
                      <TableCellTws>{item.federal_tax_id}</TableCellTws>
                      <TableCellTws>
                        <ButtonCustom
                          variant="contained"
                          onClick={() => {
                            // setValue(
                            //   `locations.${stateContactSelect}.contact`,
                            //   {
                            //     business_name: item.business_name,
                            //     id: item.id,
                            //   }
                            // )
                            console.log('2222', item.address)
                            getGeocode({ address: item?.address })
                              .then((results) => {
                                const { lat, lng } = getLatLng(results[0])
                                console.log(
                                  'Coordinates: ',
                                  { lat, lng },
                                  results[0]
                                )
                                // let info = {
                                //   address: results?.[0]?.formatted_address,
                                //   latitude: lat,
                                //   longitude: lng,
                                //   contact: {
                                //     business_name: item.business_name,
                                //     id: item.id,
                                //   },
                                // }
                                // console.log('info', info)
                                setValue(`locations.${stateContactSelect}`, {
                                  address: results?.[0]?.formatted_address,
                                  latitude: lat.toString(),
                                  longitude: lng.toString(),
                                  contact: {
                                    business_name: item.business_name,
                                    id: item.id,
                                  },
                                })
                              })
                              .catch((error) => {
                                console.log('Error: ', error)
                                setValue(`locations.${stateContactSelect}`, {
                                  address: '',
                                  latitude: '',
                                  longitude: '',
                                  contact: {
                                    business_name: item.business_name,
                                    id: item.id,
                                  },
                                })
                                pushMessage(
                                  t('pushMessage.addressNotFound'),
                                  'error'
                                )
                              })
                            setStateOpenDrawer(!stateOpenDrawer)
                          }}
                        >
                          {t('select')}
                        </ButtonCustom>
                      </TableCellTws>
                    </TableRowTws>
                  )
                })}
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
                value={statePaginationContact?.limit}
                onChange={(e) => {
                  console.log('33333', e.target.value)
                  setStatePaginationContact({
                    page: 1,
                    limit: Number(e.target.value),
                  })
                  handleGetContactList({
                    page: 1,
                    limit: Number(e.target.value),
                  })
                }}
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
              page={statePaginationContact?.page}
              onChange={(e, page: number) => {
                console.log('e', e)
                setStatePaginationContact({
                  ...statePaginationContact,
                  page: page,
                })
                handleGetContactList({
                  ...statePaginationContact,
                  page: page,
                })
              }}
              count={stateContactList?.totalPages}
            />
          </Stack>
        </Box>
      </Drawer>
    </Box>
  )
}

export default CreateUpdateComponent
