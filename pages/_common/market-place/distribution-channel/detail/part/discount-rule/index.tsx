import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Collapse,
  Dialog,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  MenuItem,
  Pagination,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  ArrowRight,
  Gear,
  MagnifyingGlass,
  Plus,
  WarningCircle,
  X,
} from '@phosphor-icons/react'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  InputLabelCustom,
  MenuAction,
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldSearchCustom,
  TypographyH2,
} from 'src/components'
import {
  CurrentProductType,
  ListDiscountOfDCType,
  ListDiscountSpecificProductForChannelType,
  ListProductForAppplyDCResponseType,
  SearchType,
  SubmitDiscountForChannelType,
  SubmitDiscountForSpecificProductType,
  SubmitUpdateDiscountForSpecificProductType,
  VariantDetailType,
} from './discountRuleModel'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { schema, schemaSearch } from './validations'
import classes from './styles.module.scss'
import RequiredLabel from 'src/components/requiredLabel'

import { useRouter } from 'next/router'
import {
  createDiscountForChannel,
  createDiscountForSpecificProduct,
  deleteDiscountOfDC,
  getDetailDiscountForChannel,
  getDetailVariant,
  getListDiscountOfDC,
  getListDiscountSpecificProductInDc,
  getListProductApplyOnDC,
  updateDiscountForChannel,
} from './discountRuleApi'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage, isEmpty } from 'src/utils/global.utils'
import * as Yup from 'yup'
import CurrencyNumberFormat from './CurrencyNumberFormat'
import { formatMoney } from 'src/utils/money.utils'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import Image from 'next/image'

const DiscountComponent = () => {
  const [stateDiscountChannelDrawer, setStateDiscountChannelDrawer] =
    useState(false)
  const [
    stateAddDiscountSpecificProductDrawer,
    setStateAddDiscountSpecificProductDrawer,
  ] = useState(false)
  const [stateSelectProductDrawer, setStateSelectProductDrawer] =
    useState(false)
  const [stateProductForApply, setStateProductForApply] =
    useState<ListProductForAppplyDCResponseType>()
  const [
    stateListDiscountSpecificProductInDc,
    setStateListDiscountSpecificProductInDc,
  ] = useState<ListDiscountSpecificProductForChannelType>()
  const handleOpenAddDiscountChannelDrawer = () => {
    setStateDiscountChannelDrawer(true)
  }
  const dispatch = useAppDispatch()
  const loadingState = useAppSelector((state) => state.loading.isLoading)
  const [stateRadioGroup, setStateRadioGroup] = useState(1)
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()
  const [stateCurrentDetailVariant, setStateCurrentDetailVariant] = useState<
    VariantDetailType[]
  >([])
  const [stateIndexCollapse, setStateIndexCollapse] = useState(-1)
  const [stateRowPerPage, setStateRowPerPage] = useState(10)
  const [statePage, setStatePage] = useState(1)
  const [stateSearch, setStateSearch] = useState('')
  const [stateCurrentDiscountIndex, setStateCurrentDiscountIndex] = useState(-1)
  const [stateCurrentProduct, setStateCurrentProduct] =
    useState<CurrentProductType>()
  const [stateCurrentListDiscountOfDC, setStateCurrentListDiscountOfDC] =
    useState<ListDiscountOfDCType[]>([])
  const [stateDialogDelete, setStateDialogDelete] = useState(false)
  const [stateDrawerUpdate, setStateDrawerUpdate] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [
    stateCurrentDiscountForSpecificProduct,
    setStateCurrentDiscountForSpecificProduct,
  ] = useState<ListDiscountSpecificProductForChannelType>()
  const [
    stateDrawerUpdateSpecificProduct,
    setStateDrawerUpdateSpecificProduct,
  ] = useState(false)
  const [stateDialogDeleteSpecificProduct, setStateDeleteSpecificProduct] =
    useState(false)

  const open = Boolean(anchorEl)
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleGetListProductApplyOnDC = (query: object) => {
    dispatch(loadingActions.doLoading())
    getListProductApplyOnDC(Number(router.query.id), {
      ...query,
      page: statePage,
      limit: stateRowPerPage,
      key: stateSearch,
    })
      .then((res) => {
        const { data } = res

        setStateProductForApply(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }
  useEffect(() => {
    if (router.query.id) {
      getListDiscountOfDC(Number(router.query.id))
        .then((res) => {
          const { data } = res.data
          console.log('dat', data)
          setStateCurrentListDiscountOfDC(data)
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
      getListDiscountSpecificProductInDc(Number(router.query.id))
        .then((res) => {
          const { data } = res
          setStateListDiscountSpecificProductInDc(data)
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }, [router.query.id])
  useEffect(() => {
    handleGetListProductApplyOnDC({})
  }, [router.query.id, statePage, stateRowPerPage, stateSearch])
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueSpecificValue('discount_amount', '')
    setValueSpecificValue('max_discount_amount', 0)
    trigger('discount_amount')

    setStateRadioGroup(Number((event.target as HTMLInputElement).value))
  }
  const {
    setValue,
    trigger,
    formState: { errors },
    control,
    handleSubmit,
    reset,
    clearErrors,
  } = useForm<SubmitDiscountForChannelType>({
    resolver: yupResolver(schema),
    mode: 'all',
  })
  const {
    setValue: setValueUpdate,
    trigger: triggerUpdate,
    formState: { errors: errorsUpdate },
    control: controlUpdate,
    getValues: getValuesUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
    clearErrors: clearErrorsUpdate,
  } = useForm<SubmitDiscountForChannelType>({
    resolver: yupResolver(schema),
    mode: 'all',
  })
  const { control: controlSearch, handleSubmit: handleSubmitSearch } =
    useForm<SearchType>({
      resolver: yupResolver(schemaSearch),
      mode: 'all',
    })
  const {
    setValue: setValueSpecificValue,
    trigger: triggerSpecificValue,
    formState: { errors: errosSpecificValue },
    getValues: getValuesSpecificValue,
    reset: resetSpecificValue,
    clearErrors: clearErrorsSpecificValue,
    handleSubmit: handleSubmitSpecificValue,
  } = useForm<SubmitDiscountForSpecificProductType>({
    resolver: yupResolver(
      Yup.object().shape(
        {
          ...(stateRadioGroup === 1 && {
            discount_amount: Yup.number()
              .typeError('Discount amount is required')
              .required('Discount amount is required')
              .min(5 / 10, 'Discount amount must be between 0.5% and 100%')
              .max(100, 'Discount amount must be between 0.5% and 100%'),
            max_discount_amount: Yup.number()
              .notRequired()
              .nullable(true)
              .transform((_, val) => (val === Number(val) ? val : null))
              .when('max_discount_amount', {
                is: (value: any) => {
                  return value || value === 0
                },
                then: (rule) => {
                  return rule
                    .positive('Max discount amount must be a positive number')
                    .typeError('Max discount amount must be a number')
                    .min(
                      1 / 100,
                      'Max discount amount must be between 0.01$ and 1,000,000$'
                    )
                    .max(
                      1000000,
                      'Max discount amount must be between 0.01$ and 1,000,000$'
                    )
                },
              }),
          }),
          ...(stateRadioGroup === 2 && {
            discount_amount: Yup.number()
              .typeError('Discount amount is required')
              .required('Discount amount is required')
              .min(
                1 / 100,
                'Discount amount must be between 0.01$ and 1,000,000$'
              )
              .max(
                10000000,
                'Discount amount must be between 0.01$ and 1,000,000$'
              ),
          }),
        },
        [['max_discount_amount', 'max_discount_amount']]
      )
    ),
    mode: 'all',
  })
  const {
    setValue: setValueUpdateSpecificValue,
    trigger: triggerUpdateSpecificValue,
    formState: { errors: errosUpdateSpecificValue },
    getValues: getValuesUpdateSpecificValue,
    reset: resetUpdateSpecificValue,
    handleSubmit: handleUpdateSpecificValue,
    clearErrors: clearErrosUpdateSpecificValue,
  } = useForm<SubmitUpdateDiscountForSpecificProductType>({
    resolver: yupResolver(
      Yup.object().shape(
        {
          ...(stateRadioGroup === 1 && {
            discount_amount: Yup.number()
              .typeError('Discount amount is required')
              .required('Discount amount is required')
              .min(5 / 10, 'Discount amount must be between 0.5% and 100%')
              .max(100, 'Discount amount must be between 0.5% and 100%'),
            max_discount_amount: Yup.number()

              .notRequired()
              .nullable(true)
              .transform((_, val) => (val === Number(val) ? val : null))
              .when('max_discount_amount', {
                is: (value: any) => {
                  return value || value === 0
                },
                then: (rule) => {
                  return rule
                    .positive('Max discount amount must be a positive number')
                    .typeError('Max discount amount must be a number')
                    .min(
                      1 / 100,
                      'Max discount amount must be between 0.01$ and 1,000,000$'
                    )
                    .max(
                      1000000,
                      'Max discount amount must be between 0.01$ and 1,000,000$'
                    )
                },
              }),
          }),
          ...(stateRadioGroup === 2 && {
            discount_amount: Yup.number()
              .typeError('Discount amount is required')
              .required('Discount amount is required')
              .min(
                1 / 100,
                'Discount amount must be between 0.01$ and 10,000,000$'
              )
              .max(
                10000000,
                'Discount amount must be between 0.01$ and 10,000,000$'
              ),
          }),
        },
        [['max_discount_amount', 'max_discount_amount']]
      )
    ),
    mode: 'all',
  })
  const onSubmitUpdateDiscountChannel = (
    value: SubmitDiscountForChannelType
  ) => {
    dispatch(loadingActions.doLoading())
    const submitValue: SubmitDiscountForChannelType = {
      type: 'PERCENTAGE',
      max_discount_amount: value.max_discount_amount,
      discount_amount: value.discount_amount,
    }
    if (isEmpty(value.max_discount_amount)) {
      delete submitValue.max_discount_amount
    }
    updateDiscountForChannel(stateCurrentDiscountIndex, submitValue)
      .then(() => {
        pushMessage('Update discount for channel successfully', 'success')
        resetUpdate()

        getListDiscountOfDC(Number(router.query.id))
          .then((res) => {
            const { data } = res.data
            console.log('dat', data)
            setStateCurrentListDiscountOfDC(data)
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
        dispatch(loadingActions.doLoadingSuccess())
        setStateDrawerUpdate(false)
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const onSubmitAddDiscountChannel = (value: SubmitDiscountForChannelType) => {
    dispatch(loadingActions.doLoading())
    const submitValue: SubmitDiscountForChannelType = {
      type: 'PERCENTAGE',
      max_discount_amount: value.max_discount_amount,
      discount_amount: value.discount_amount,
      distribution_channels: Number(router.query.id),
    }
    if (isEmpty(value.max_discount_amount)) {
      delete submitValue.max_discount_amount
    }
    createDiscountForChannel(submitValue)
      .then(() => {
        pushMessage('Add discount for channel successfully', 'success')
        reset()

        getListDiscountOfDC(Number(router.query.id))
          .then((res) => {
            const { data } = res.data
            console.log('dat', data)
            setStateCurrentListDiscountOfDC(data)
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
        dispatch(loadingActions.doLoadingSuccess())

        setStateDiscountChannelDrawer(false)
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())

        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const onSubmitAddDiscountForSpecificProduct = (
    value: SubmitDiscountForSpecificProductType
  ) => {
    if (
      getValuesSpecificValue('products')?.length === 0 ||
      !getValuesSpecificValue('products')
    ) {
      pushMessage('Please select a product to add discount', 'error')
      return
    }
    dispatch(loadingActions.doLoading())
    const submitValue: SubmitDiscountForSpecificProductType = {
      type: stateRadioGroup === 1 ? 'PERCENTAGE' : 'FIXEDAMOUNT',
      discount_amount: value.discount_amount,
      max_discount_amount: value.max_discount_amount,

      products: getValuesSpecificValue('products'),
    }
    if (isEmpty(value.max_discount_amount)) {
      delete submitValue.max_discount_amount
    }
    createDiscountForSpecificProduct(Number(router.query.id), submitValue)
      .then(() => {
        resetSpecificValue()
        setValueSpecificValue('max_discount_amount', null)
        pushMessage('Add discount product successfully', 'success')
        handleCloseDrawerSpecificProduct()
        if (router.query.id) {
          getListDiscountSpecificProductInDc(Number(router.query.id))
            .then((res) => {
              const { data } = res
              setStateListDiscountSpecificProductInDc(data)
            })
            .catch(({ response }) => {
              const { status, data } = response
              pushMessage(handlerGetErrMessage(status, data), 'error')
            })
        }
        setStateAddDiscountSpecificProductDrawer(false)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())

        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleCloseAddChannelDiscount = () => {
    reset()
    clearErrors()
    setStateDiscountChannelDrawer(false)
  }
  const handleCloseUpdateChannelDiscount = () => {
    clearErrorsUpdate()
    setStateDrawerUpdate(false)
  }
  const handleCloseDrawerSpecificProduct = () => {
    clearErrorsSpecificValue()
    setStateAddDiscountSpecificProductDrawer(false)
    setStatePage(1)
    setStateRowPerPage(10)
    setStateIndexCollapse(-1)
    setStateCurrentProduct(undefined)
    resetSpecificValue()
    setValueSpecificValue('discount_amount', '')
    setValueSpecificValue('max_discount_amount', null)
  }
  const handleClickCollapseProductVariant = (index: number) => {
    dispatch(loadingActions.doLoading())
    if (index && router.query) {
      getDetailVariant(index, Number(router.query.id))
        .then((res) => {
          const { data } = res.data
          setStateCurrentDetailVariant(data)
          console.log('data', data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((response) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }

  const handleChangePagination = (e: any, page: number) => {
    console.log(e)
    setStateIndexCollapse(-1)

    setStatePage(page)
  }
  const handleChangeRowsPerPage = (event: any) => {
    setStateIndexCollapse(-1)
    setStatePage(1)
    setStateRowPerPage(Number(event.target.value))
  }
  const onSubmitSearch = (value: SearchType) => {
    setStateSearch(value.key)
    setStateIndexCollapse(-1)
    setStatePage(1)
    setStateRowPerPage(10)
  }

  const handleSelectCurrentProduct = (item: CurrentProductType) => {
    if (item.variants_count && router.query.id) {
      getDetailVariant(item.id, Number(router.query.id))
        .then((res) => {
          const { data } = res.data
          const arrayIndex: number[] = []
          data.forEach((item) => arrayIndex.push(item.id))
          setValueSpecificValue('products', arrayIndex)
          dispatch(loadingActions.doLoadingSuccess())
          setStateCurrentProduct(item)
          setStateSelectProductDrawer(false)
        })
        .catch((response) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    } else {
      setValueSpecificValue('products', [item.id])
      console.log('array value', getValuesSpecificValue('products'))
      setStateCurrentProduct(item)
      setStateSelectProductDrawer(false)
    }
  }
  const handleDeleteRemoveChannelDiscount = () => {
    deleteDiscountOfDC(Number(stateCurrentDiscountIndex))
      .then(() => {
        setValueUpdate('discount_amount', '')
        setValueUpdate('max_discount_amount', '')
        setValue('discount_amount', '')
        setValue('max_discount_amount', null)
        reset()
        resetUpdate()
        pushMessage('Delete discount successfully', 'success')
        setStateDialogDelete(false)
        if (router.query.id) {
          getListDiscountOfDC(Number(router.query.id))
            .then((res) => {
              const { data } = res.data
              console.log('dat', data)
              setStateCurrentListDiscountOfDC(data)
            })
            .catch(({ response }) => {
              const { status, data } = response
              pushMessage(handlerGetErrMessage(status, data), 'error')
            })
        }
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetDetailDiscount = (index: number) => {
    dispatch(loadingActions.doLoading())
    getDetailDiscountForChannel(index)
      .then((res) => {
        const { data } = res.data
        dispatch(loadingActions.doLoadingSuccess())

        setValueUpdate('discount_amount', data.discount_amount)
        setValueUpdate('max_discount_amount', data.max_discount_amount)
        setStateDrawerUpdate(true)
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())

        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetDetailDiscountFromSpecificProduct = (
    item: ListDiscountSpecificProductForChannelType
  ) => {
    setStateCurrentDiscountForSpecificProduct(item)
  }
  const handleCloseUpdateSpecificProduct = () => {
    clearErrosUpdateSpecificValue()
    resetUpdateSpecificValue()
    setStateDrawerUpdateSpecificProduct(false)
    setStateCurrentDiscountForSpecificProduct(undefined)
    setValueUpdateSpecificValue('discount_amount', '')
    setValueSpecificValue('max_discount_amount', null)
    setStateRadioGroup(1)
  }
  const handleOpenUpdateDrawerForSpecificProduct = () => {
    if (!stateCurrentDiscountForSpecificProduct) return

    handleClose()
    setStateRadioGroup(
      stateCurrentDiscountForSpecificProduct.type === 'PERCENTAGE' ? 1 : 2
    )
    if (stateCurrentDiscountForSpecificProduct.type === 'FIXEDAMOUNT') {
      setValueUpdateSpecificValue(
        'discount_amount',
        stateCurrentDiscountForSpecificProduct?.discount_amount.toFixed(2)
      )
    } else {
      setValueUpdateSpecificValue(
        'discount_amount',
        stateCurrentDiscountForSpecificProduct?.discount_amount
      )
    }

    setValueUpdateSpecificValue(
      'max_discount_amount',
      stateCurrentDiscountForSpecificProduct.max_discount_amount
        ? Number(
            stateCurrentDiscountForSpecificProduct.max_discount_amount
          ).toFixed(2)
        : null
    )

    triggerUpdateSpecificValue()
    setStateDrawerUpdateSpecificProduct(true)
  }
  const handleChangeRadioGroupInSpecificProduct = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValueUpdateSpecificValue('discount_amount', '')
    setValueUpdateSpecificValue('max_discount_amount', null)
    triggerUpdateSpecificValue('discount_amount')

    setStateRadioGroup(Number((event.target as HTMLInputElement).value))
  }
  const handleUpdateSpecificProduct = (
    value: SubmitUpdateDiscountForSpecificProductType
  ) => {
    if (!stateCurrentDiscountForSpecificProduct) return
    dispatch(loadingActions.doLoading())
    const submitValue: SubmitUpdateDiscountForSpecificProductType = {
      type: stateRadioGroup === 1 ? 'PERCENTAGE' : 'FIXEDAMOUNT',
      max_discount_amount: value.max_discount_amount,
      discount_amount: value.discount_amount,
    }
    if (isEmpty(value.max_discount_amount)) {
      delete submitValue.max_discount_amount
    }
    updateDiscountForChannel(
      stateCurrentDiscountForSpecificProduct.id,
      submitValue
    )
      .then(() => {
        pushMessage(
          'Update discount for specific product successfully',
          'success'
        )
        resetUpdateSpecificValue()

        getListDiscountOfDC(Number(router.query.id))
          .then((res) => {
            const { data } = res.data
            console.log('dat', data)
            setStateCurrentListDiscountOfDC(data)
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
        getListDiscountSpecificProductInDc(Number(router.query.id))
          .then((res) => {
            const { data } = res
            setStateListDiscountSpecificProductInDc(data)
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
        dispatch(loadingActions.doLoadingSuccess())
        handleCloseUpdateSpecificProduct()
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())

        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleDeleteSpecificProduct = () => {
    deleteDiscountOfDC(Number(stateCurrentDiscountForSpecificProduct?.id))
      .then(() => {
        pushMessage('Delete discount successfully', 'success')
        getListDiscountSpecificProductInDc(Number(router.query.id))
          .then((res) => {
            const { data } = res
            setStateListDiscountSpecificProductInDc(data)
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
        setStateDeleteSpecificProduct(false)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ marginBottom: '15px' }}
      >
        <Typography
          sx={{ fontWeight: 700, fontSize: '1.8rem', color: '#1B1F27' }}
        >
          Channel Discount
        </Typography>
        <Typography>
          The discount will apply to all customers who joined this channel
        </Typography>
      </Stack>
      <Box sx={{ marginBottom: '15px' }}>
        {stateCurrentListDiscountOfDC &&
        stateCurrentListDiscountOfDC.length > 0 ? (
          <>
            {stateCurrentListDiscountOfDC.map((item, index) => {
              return (
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  key={index}
                >
                  <Stack direction="row" spacing={1}>
                    <Typography sx={{ fontWeight: 600 }}>Discount</Typography>
                    <Typography>{item.discount_amount}%</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Typography sx={{ fontWeight: 600 }}>
                      Maximum discount amount
                    </Typography>
                    <Typography>
                      {item.max_discount_amount
                        ? formatMoney(item.max_discount_amount)
                        : 'N/A'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <ButtonCustom
                      variant="outlined"
                      onClick={() => {
                        handleGetDetailDiscount(item.id)
                        setStateCurrentDiscountIndex(item.id)
                      }}
                    >
                      Edit
                    </ButtonCustom>
                    <ButtonCustom
                      variant="outlined"
                      onClick={() => {
                        setStateCurrentDiscountIndex(item.id)
                        setStateDialogDelete(true)
                      }}
                    >
                      Remove
                    </ButtonCustom>
                  </Stack>
                </Stack>
              )
            })}
          </>
        ) : (
          <ButtonCustom
            variant="outlined"
            onClick={() => handleOpenAddDiscountChannelDrawer()}
          >
            Add Discount
          </ButtonCustom>
        )}
      </Box>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginBottom: '15px' }}
      >
        <Typography
          sx={{ fontWeight: 700, fontSize: '1.8rem', color: '#1B1F27' }}
        >
          Product discount
        </Typography>
        <ButtonCustom
          onClick={() => setStateAddDiscountSpecificProductDrawer(true)}
          startIcon={<Plus size={18} />}
          variant="outlined"
        >
          Add new discount
        </ButtonCustom>
      </Stack>
      <TableContainerTws sx={{ marginTop: '0 !important' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCellTws>Product</TableCellTws>
              <TableCellTws align="right">Discount rate / amount</TableCellTws>
              <TableCellTws align="right">
                Maximum discount amount{' '}
              </TableCellTws>
              <TableCellTws width={80}>Action</TableCellTws>
            </TableRow>
          </TableHead>
          <TableBody>
            {stateListDiscountSpecificProductInDc?.data.map((item, index) => {
              return (
                <TableRowTws key={index}>
                  <TableCellTws>{item.product.name}</TableCellTws>
                  <TableCellTws align="right">
                    {item.type === 'PERCENTAGE' && (
                      <>
                        {item.discount_amount}
                        {'%'}
                      </>
                    )}
                    {item.type === 'FIXEDAMOUNT' &&
                      formatMoney(item.discount_amount)}
                  </TableCellTws>
                  <TableCellTws align="right">
                    {item.max_discount_amount
                      ? formatMoney(item.max_discount_amount)
                      : 'N/A'}
                  </TableCellTws>
                  <TableCellTws>
                    <IconButton
                      onClick={(e) => {
                        handleOpenMenu(e)
                        handleGetDetailDiscountFromSpecificProduct(item)
                      }}
                    >
                      <Gear />
                    </IconButton>
                  </TableCellTws>
                </TableRowTws>
              )
            })}
          </TableBody>
        </Table>
      </TableContainerTws>
      <MenuAction
        elevation={0}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleOpenUpdateDrawerForSpecificProduct()}>
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose()

            setStateDeleteSpecificProduct(true)
          }}
          sx={{ justifyContent: 'end' }}
        >
          Delete
        </MenuItem>
      </MenuAction>
      <Drawer
        anchor="right"
        open={stateDiscountChannelDrawer}
        onClose={() => handleCloseAddChannelDiscount()}
      >
        <Box sx={{ background: 'white', width: '500px', padding: '20px' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={() => handleCloseAddChannelDiscount()}>
              <ArrowRight size={24} />
            </IconButton>
            <Typography
              sx={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: '#49516F',
              }}
            >
              Add Channel Discount
            </Typography>
          </Stack>

          <form onSubmit={handleSubmit(onSubmitAddDiscountChannel)}>
            <Box sx={{ marginBottom: '15px' }}>
              <Controller
                control={control}
                name="discount_amount"
                render={() => (
                  <>
                    <InputLabelCustom>
                      <RequiredLabel />
                      Discount rate
                    </InputLabelCustom>
                    <NumericFormat
                      style={{ width: '100%' }}
                      placeholder="Enter discount rate"
                      customInput={TextField}
                      allowNegative={false}
                      error={!!errors.discount_amount}
                      onValueChange={(value) => {
                        setValue('discount_amount', Number(value.floatValue))
                        trigger('discount_amount')
                      }}
                      isAllowed={(values) => {
                        const { floatValue, formattedValue } = values
                        if (floatValue === 0) {
                          return floatValue >= 0
                        }
                        if (!floatValue) {
                          return formattedValue === ''
                        }
                        return floatValue <= 100 && floatValue >= 0
                      }}
                      className={classes['input-number']}
                    />
                    <FormHelperText error>
                      {errors.discount_amount &&
                        `${errors.discount_amount.message}`}
                    </FormHelperText>
                  </>
                )}
              />
            </Box>
            <Box sx={{ marginBottom: '15px' }}>
              <Controller
                control={control}
                name="max_discount_amount"
                render={() => (
                  <>
                    <InputLabelCustom>Maximum discount amount</InputLabelCustom>
                    <div className={classes['input-number']}>
                      <CurrencyNumberFormat
                        propValue={(value) => {
                          setValue(`max_discount_amount`, value)
                          trigger(`max_discount_amount`)
                        }}
                        error={!!errors.max_discount_amount}
                      />
                    </div>
                    <FormHelperText error>
                      {errors.max_discount_amount &&
                        `${errors.max_discount_amount.message}`}
                    </FormHelperText>
                  </>
                )}
              />
            </Box>
            <Stack direction="row" spacing={2}>
              <ButtonCustom
                variant="outlined"
                size="large"
                onClick={() => handleCloseAddChannelDiscount()}
              >
                Cancel
              </ButtonCustom>
              <ButtonCustom
                disable={loadingState}
                type="submit"
                size="large"
                variant="contained"
              >
                Submit
              </ButtonCustom>
            </Stack>
          </form>
        </Box>
      </Drawer>
      <Drawer
        open={stateAddDiscountSpecificProductDrawer}
        anchor="right"
        onClose={handleCloseDrawerSpecificProduct}
      >
        <Box sx={{ background: 'white', padding: '20px', width: '500px' }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: '15px' }}
          >
            <IconButton onClick={() => handleCloseDrawerSpecificProduct()}>
              <ArrowRight size={24} />
            </IconButton>
            <Typography
              sx={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: '#49516F',
              }}
            >
              Add Product Discount
            </Typography>
          </Stack>
          <InputLabelCustom>
            <RequiredLabel />
            Product
          </InputLabelCustom>
          {stateCurrentProduct ? (
            <>
              <Stack
                direction="row"
                sx={{
                  background: '#F8F9FC',
                  padding: '10px',
                  marginBottom: '15px',
                }}
                spacing={2}
              >
                <Box>
                  <Image
                    alt="image"
                    src={
                      stateCurrentProduct.thumbnail
                        ? stateCurrentProduct.thumbnail
                        : '/' + '/images/vapeProduct.png'
                    }
                    width={50}
                    height={50}
                  />
                </Box>
                <Stack spacing={1}>
                  <Typography>{stateCurrentProduct.code}</Typography>
                  <Typography>{stateCurrentProduct.name}</Typography>
                </Stack>
              </Stack>
              <ButtonCustom
                variant="outlined"
                sx={{ marginBottom: '15px' }}
                onClick={() => setStateSelectProductDrawer(true)}
              >
                Change product
              </ButtonCustom>
            </>
          ) : (
            <ButtonCustom
              variant="outlined"
              sx={{ marginBottom: '15px' }}
              onClick={() => setStateSelectProductDrawer(true)}
            >
              Select product
            </ButtonCustom>
          )}

          <InputLabelCustom>
            <RequiredLabel />
            Discount Type
          </InputLabelCustom>
          <form
            onSubmit={handleSubmitSpecificValue(
              onSubmitAddDiscountForSpecificProduct
            )}
          >
            <FormControl fullWidth>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={stateRadioGroup}
                onChange={handleChange}
              >
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label="Percentage"
                />
                <Box sx={{ marginBottom: '15px' }}>
                  <Box sx={{ marginBottom: '15px' }}>
                    <NumericFormat
                      style={{ width: '100%' }}
                      value={
                        stateRadioGroup === 1
                          ? getValuesSpecificValue('discount_amount')
                          : ''
                      }
                      placeholder="Enter discount rate"
                      customInput={TextField}
                      allowNegative={false}
                      disabled={stateRadioGroup === 2}
                      error={
                        stateRadioGroup === 1 &&
                        !!errosSpecificValue.discount_amount
                      }
                      onValueChange={(value) => {
                        if (stateRadioGroup === 1) {
                          setValueSpecificValue(
                            'discount_amount',
                            Number(value.floatValue)
                          )
                          triggerSpecificValue('discount_amount')
                        }
                      }}
                      isAllowed={(values) => {
                        const { floatValue, formattedValue } = values
                        if (floatValue === 0) {
                          return floatValue >= 0
                        }
                        if (!floatValue) {
                          return formattedValue === ''
                        }
                        return floatValue <= 100 && floatValue >= 0
                      }}
                      className={classes['input-number']}
                    />
                    {stateRadioGroup === 1 && (
                      <FormHelperText error>
                        {errosSpecificValue.discount_amount &&
                          `${errosSpecificValue.discount_amount.message}`}
                      </FormHelperText>
                    )}
                  </Box>
                  <Box>
                    <div className={classes['input-number']}>
                      <CurrencyNumberFormat
                        placeholder="Enter maximum discount amount"
                        disable={stateRadioGroup === 2}
                        propValue={(value) => {
                          console.log('value', value)
                          setValueSpecificValue(`max_discount_amount`, value)
                          triggerSpecificValue(`max_discount_amount`)
                        }}
                        error={!!errosSpecificValue.max_discount_amount}
                      />
                    </div>
                    {stateRadioGroup === 1 && (
                      <FormHelperText error>
                        {errosSpecificValue.max_discount_amount &&
                          `${errosSpecificValue.max_discount_amount.message}`}
                      </FormHelperText>
                    )}
                  </Box>
                </Box>
                <FormControlLabel
                  value={2}
                  control={<Radio />}
                  label="Fixed amount"
                />
                <div className={classes['input-number']}>
                  <CurrencyNumberFormat
                    disable={stateRadioGroup === 1}
                    placeholder="Enter discount amount"
                    propValue={(value) => {
                      if (stateRadioGroup === 2) {
                        setValueSpecificValue(`discount_amount`, Number(value))
                        triggerSpecificValue(`discount_amount`)
                      }
                    }}
                    error={
                      stateRadioGroup === 2 &&
                      !!errosSpecificValue.discount_amount
                    }
                  />
                </div>
                {stateRadioGroup === 2 && (
                  <FormHelperText error>
                    {errosSpecificValue.discount_amount &&
                      `${errosSpecificValue.discount_amount.message}`}
                  </FormHelperText>
                )}
              </RadioGroup>
            </FormControl>
            <Stack direction="row" spacing={2} sx={{ marginTop: '15px' }}>
              <ButtonCustom
                variant="outlined"
                size="large"
                onClick={() => setStateAddDiscountSpecificProductDrawer(false)}
              >
                Cancel
              </ButtonCustom>
              <ButtonCustom
                disabled={loadingState}
                type="submit"
                size="large"
                variant="contained"
              >
                Submit
              </ButtonCustom>
            </Stack>
          </form>
        </Box>
      </Drawer>
      <Drawer
        open={stateDrawerUpdateSpecificProduct}
        anchor="right"
        onClose={handleCloseUpdateSpecificProduct}
      >
        <Box sx={{ background: 'white', padding: '20px', width: '500px' }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: '15px' }}
          >
            <IconButton onClick={() => handleCloseUpdateSpecificProduct()}>
              <ArrowRight size={24} />
            </IconButton>
            <Typography
              sx={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: '#49516F',
              }}
            >
              Update product discount
            </Typography>
          </Stack>

          <InputLabelCustom>
            <RequiredLabel />
            Discount Type
          </InputLabelCustom>
          <form
            onSubmit={handleUpdateSpecificValue(handleUpdateSpecificProduct)}
          >
            <FormControl fullWidth>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={stateRadioGroup}
                onChange={handleChangeRadioGroupInSpecificProduct}
              >
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label="Percentage"
                />
                <Box sx={{ marginBottom: '15px' }}>
                  <Box sx={{ marginBottom: '15px' }}>
                    <NumericFormat
                      style={{ width: '100%' }}
                      value={
                        stateRadioGroup === 1
                          ? getValuesUpdateSpecificValue('discount_amount')
                          : ''
                      }
                      placeholder="Enter discount rate"
                      customInput={TextField}
                      allowNegative={false}
                      disabled={stateRadioGroup === 2}
                      error={
                        stateRadioGroup === 1 &&
                        !!errosUpdateSpecificValue.discount_amount
                      }
                      onValueChange={(value) => {
                        if (stateRadioGroup === 1) {
                          setValueUpdateSpecificValue(
                            'discount_amount',
                            Number(value.floatValue)
                          )
                          triggerUpdateSpecificValue('discount_amount')
                        }
                      }}
                      isAllowed={(values) => {
                        const { floatValue, formattedValue } = values
                        if (floatValue === 0) {
                          return floatValue >= 0
                        }
                        if (!floatValue) {
                          return formattedValue === ''
                        }
                        return floatValue <= 100 && floatValue >= 0
                      }}
                      className={classes['input-number']}
                    />
                    {stateRadioGroup === 1 && (
                      <FormHelperText error>
                        {errosUpdateSpecificValue.discount_amount &&
                          `${errosUpdateSpecificValue.discount_amount.message}`}
                      </FormHelperText>
                    )}
                  </Box>
                  <Box>
                    <div className={classes['input-number']}>
                      <CurrencyNumberFormat
                        // defaultPrice={
                        //   stateRadioGroup === 1
                        //     ? Number(
                        //         getValuesSpecificValue('max_discount_amount')
                        //       )
                        //     : ''
                        // }
                        defaultPrice={getValuesUpdateSpecificValue(
                          'max_discount_amount'
                        )}
                        placeholder="Enter maximum discount amount"
                        disable={stateRadioGroup === 2}
                        propValue={(value) => {
                          console.log('value', value)
                          setValueUpdateSpecificValue(
                            `max_discount_amount`,
                            value
                          )
                          triggerUpdateSpecificValue(`max_discount_amount`)
                        }}
                        error={!!errosUpdateSpecificValue.max_discount_amount}
                      />
                    </div>
                    {stateRadioGroup === 1 && (
                      <FormHelperText error>
                        {errosUpdateSpecificValue.max_discount_amount &&
                          `${errosUpdateSpecificValue.max_discount_amount.message}`}
                      </FormHelperText>
                    )}
                  </Box>
                </Box>
                <FormControlLabel
                  value={2}
                  control={<Radio />}
                  label="Fixed amount"
                />
                <div className={classes['input-number']}>
                  <CurrencyNumberFormat
                    disable={stateRadioGroup === 1}
                    defaultPrice={
                      stateRadioGroup === 2
                        ? getValuesUpdateSpecificValue('discount_amount')
                        : ''
                    }
                    placeholder="Enter discount amount"
                    propValue={(value) => {
                      if (stateRadioGroup === 2) {
                        setValueUpdateSpecificValue(
                          `discount_amount`,
                          Number(value)
                        )
                        triggerUpdateSpecificValue(`discount_amount`)
                      }
                    }}
                    error={
                      stateRadioGroup === 2 &&
                      !!errosUpdateSpecificValue.discount_amount
                    }
                  />
                </div>
                {stateRadioGroup === 2 && (
                  <FormHelperText error>
                    {errosUpdateSpecificValue.discount_amount &&
                      `${errosUpdateSpecificValue.discount_amount.message}`}
                  </FormHelperText>
                )}
              </RadioGroup>
            </FormControl>
            <Stack direction="row" spacing={2} sx={{ marginTop: '15px' }}>
              <ButtonCustom
                variant="outlined"
                size="large"
                onClick={() => handleCloseUpdateSpecificProduct()}
              >
                Cancel
              </ButtonCustom>
              <ButtonCustom
                disabled={loadingState}
                type="submit"
                size="large"
                variant="contained"
              >
                Submit
              </ButtonCustom>
            </Stack>
          </form>
        </Box>
      </Drawer>
      <Drawer
        anchor="right"
        open={stateSelectProductDrawer}
        onClose={() => setStateSelectProductDrawer(false)}
      >
        <Box sx={{ padding: '20px', background: 'white', width: '1500px' }}>
          <Typography
            sx={{
              fontSize: '2.4rem',
              fontWeight: 700,
              color: '#49516F',
            }}
          >
            Select product
          </Typography>
          <form
            onSubmit={handleSubmitSearch(onSubmitSearch)}
            className="form-search"
          >
            <Controller
              control={controlSearch}
              name="key"
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextFieldSearchCustom
                    id="key"
                    placeholder="Search product..."
                    {...field}
                  />
                </FormControl>
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
          <TableContainerTws>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws></TableCellTws>
                  <TableCellTws>Code</TableCellTws>
                  <TableCellTws>Name</TableCellTws>
                  <TableCellTws>Category</TableCellTws>
                  <TableCellTws>Quantity</TableCellTws>
                  <TableCellTws>Price</TableCellTws>
                  <TableCellTws>Brand</TableCellTws>
                  <TableCellTws>Manufacturer</TableCellTws>
                  <TableCellTws>Have variant</TableCellTws>
                  <TableCellTws>Action</TableCellTws>
                </TableRow>
              </TableHead>
              <TableBody>
                {stateProductForApply?.data.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      <TableRowTws>
                        <TableCellTws>
                          {Number(item.variants_count) > 0 && (
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setStateCurrentDetailVariant([])
                                if (stateIndexCollapse === index) {
                                  setStateIndexCollapse(-1)
                                  return
                                }
                                console.log('index', index)
                                handleClickCollapseProductVariant(item.id)
                                setStateIndexCollapse(index)
                              }}
                            >
                              {stateIndexCollapse === index ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                          )}
                        </TableCellTws>
                        <TableCellTws>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Image
                              alt="image"
                              src={
                                item.thumbnail
                                  ? item.thumbnail
                                  : '/' + '/images/vapeProduct.png'
                              }
                              width={50}
                              height={50}
                            />
                            <Typography>#{item.code}</Typography>
                          </Stack>
                        </TableCellTws>
                        <TableCellTws>{item.name}</TableCellTws>
                        <TableCellTws>{item.category.name}</TableCellTws>
                        <TableCellTws>
                          {item.instock ? item.instock : 'N/A'}
                        </TableCellTws>
                        <TableCellTws>
                          {item.retail_price
                            ? formatMoney(item.retail_price)
                            : 'N/A'}
                        </TableCellTws>
                        <TableCellTws>{item.brand.name}</TableCellTws>
                        <TableCellTws>{item.manufacturer.name}</TableCellTws>
                        <TableCellTws>{item.variants_count}</TableCellTws>
                        <TableCellTws>
                          <ButtonCustom
                            size="small"
                            variant="contained"
                            onClick={() =>
                              handleSelectCurrentProduct({
                                id: item.id,
                                name: item.name,
                                variants_count: item.variants_count,
                                thumbnail: item.thumbnail,
                                code: item.code,
                              })
                            }
                          >
                            Select
                          </ButtonCustom>
                        </TableCellTws>
                      </TableRowTws>
                      {Number(item.variants_count) > 0 &&
                        stateCurrentDetailVariant && (
                          <TableRowTws>
                            <TableCellTws
                              sx={{ paddingTop: 0, paddingBottom: 0 }}
                              colSpan={12}
                            >
                              <Collapse
                                in={stateIndexCollapse === index}
                                timeout="auto"
                                unmountOnExit
                              >
                                <Box sx={{ padding: '10px 0px' }}>
                                  <Typography
                                    sx={{
                                      marginBottom: '15px',
                                      fontSize: '1.6rem',
                                      fontWeight: 500,
                                    }}
                                  >
                                    Variant group for {item.name}
                                  </Typography>
                                  <Table sx={{ marginBottom: '10px' }}>
                                    <TableHead>
                                      <TableRow>
                                        <TableCellTws>Code</TableCellTws>
                                        <TableCellTws>Name</TableCellTws>
                                        <TableCellTws>Quantity</TableCellTws>
                                        <TableCellTws>Price</TableCellTws>

                                        {/* {stateCurrentDetailVariant.attributes.map(
                                          (item, index) => {
                                            return (
                                              <TableCellTws key={index}>
                                                {item.name}
                                              </TableCellTws>
                                            )
                                          }
                                        )} */}

                                        <TableCellTws>Action</TableCellTws>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {stateCurrentDetailVariant.map(
                                        (variant, idx) => {
                                          return (
                                            <TableRow
                                              key={idx}
                                              sx={{ cursor: 'pointer' }}
                                            >
                                              <TableCellTws>
                                                <Stack
                                                  direction="row"
                                                  alignItems="center"
                                                  spacing={2}
                                                >
                                                  <Image
                                                    alt="image"
                                                    src={
                                                      variant.thumbnail
                                                        ? variant.thumbnail
                                                        : '/' +
                                                          '/images/vapeProduct.png'
                                                    }
                                                    width={50}
                                                    height={50}
                                                  />
                                                  <Typography>
                                                    #{variant.code}
                                                  </Typography>
                                                </Stack>
                                              </TableCellTws>
                                              <TableCellTws>
                                                <Stack spacing={1}>
                                                  {variant.name}
                                                  <Stack
                                                    direction="row"
                                                    spacing={1}
                                                  >
                                                    {variant.attribute_options.map(
                                                      (obj, idx) => {
                                                        return (
                                                          <Stack
                                                            direction="row"
                                                            key={idx}
                                                            spacing={0.5}
                                                          >
                                                            <Typography
                                                              sx={{
                                                                fontWeight: 700,
                                                                fontSize:
                                                                  '1.2rem',
                                                              }}
                                                            >
                                                              {obj.attribute}
                                                            </Typography>
                                                            <Typography
                                                              sx={{
                                                                fontSize:
                                                                  '1.2rem',
                                                              }}
                                                            >
                                                              {obj.option}
                                                            </Typography>
                                                          </Stack>
                                                        )
                                                      }
                                                    )}
                                                  </Stack>
                                                </Stack>
                                              </TableCellTws>
                                              <TableCellTws>
                                                <Stack
                                                  direction="row"
                                                  alignItems="center"
                                                  spacing={2}
                                                >
                                                  {variant.quantity
                                                    ? variant.quantity.toLocaleString(
                                                        'en-US'
                                                      )
                                                    : 'N/A'}
                                                  {variant.quantity <
                                                    variant.low_stock_alert_level && (
                                                    <Tooltip
                                                      title="The stock is low"
                                                      arrow
                                                      placement="top"
                                                    >
                                                      <WarningCircle
                                                        style={{
                                                          marginLeft: '5px',
                                                        }}
                                                        weight="fill"
                                                        color="#E02D3C"
                                                        size={18}
                                                      />
                                                    </Tooltip>
                                                  )}
                                                </Stack>
                                              </TableCellTws>
                                              <TableCellTws>
                                                {variant.wholesale_price
                                                  ? formatMoney(
                                                      variant.wholesale_price
                                                    )
                                                  : 'N/A'}
                                              </TableCellTws>

                                              {/* {variant.attribute_options.map(
                                                (element, index) => {
                                                  return (
                                                    <TableCellTws key={index}>
                                                      {element.option}
                                                    </TableCellTws>
                                                  )
                                                }
                                              )} */}

                                              <TableCellTws
                                                width={80}
                                                sx={{ textAlign: 'center' }}
                                              >
                                                <ButtonCustom
                                                  size="small"
                                                  variant="contained"
                                                  onClick={() =>
                                                    handleSelectCurrentProduct({
                                                      id: variant.id,
                                                      name: variant.name,
                                                      thumbnail:
                                                        variant.thumbnail,
                                                      code: variant.code,
                                                    })
                                                  }
                                                >
                                                  Select
                                                </ButtonCustom>
                                              </TableCellTws>
                                            </TableRow>
                                          )
                                        }
                                      )}
                                    </TableBody>
                                  </Table>
                                </Box>
                              </Collapse>
                            </TableCellTws>
                          </TableRowTws>
                        )}
                    </React.Fragment>
                  )
                })}
              </TableBody>
            </Table>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={2}
            >
              <Typography>Rows per page</Typography>

              <FormControl sx={{ m: 1 }}>
                <SelectPaginationCustom
                  value={stateRowPerPage}
                  onChange={handleChangeRowsPerPage}
                  displayEmpty
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
                page={statePage}
                onChange={(event, page: number) =>
                  handleChangePagination(event, page)
                }
                count={
                  stateProductForApply
                    ? Math.ceil(
                        Number(stateProductForApply.totalItems) /
                          stateRowPerPage
                      )
                    : 0
                }
              />
            </Stack>
          </TableContainerTws>
        </Box>
      </Drawer>
      <Dialog
        open={stateDialogDelete}
        onClose={() => setStateDialogDelete(false)}
      >
        <DialogTitleTws>
          <IconButton onClick={() => setStateDialogDelete(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          Delete discount
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>Are you sure to delete ?</DialogContentTextTws>
        </DialogContentTws>
        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => setStateDialogDelete(false)}
              variant="outlined"
              size="large"
            >
              No
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={handleDeleteRemoveChannelDiscount}
              size="large"
            >
              Yes
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
      <Drawer
        anchor="right"
        open={stateDrawerUpdate}
        onClose={() => handleCloseUpdateChannelDiscount()}
      >
        <Box sx={{ background: 'white', width: '500px', padding: '20px' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={() => handleCloseUpdateChannelDiscount()}>
              <ArrowRight size={24} />
            </IconButton>
            <Typography
              sx={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: '#49516F',
              }}
            >
              Update Discount
            </Typography>
          </Stack>

          <form onSubmit={handleSubmitUpdate(onSubmitUpdateDiscountChannel)}>
            <Box sx={{ marginBottom: '15px' }}>
              <Controller
                control={controlUpdate}
                name="discount_amount"
                render={() => (
                  <>
                    <InputLabelCustom>
                      <RequiredLabel />
                      Discount rate
                    </InputLabelCustom>
                    <NumericFormat
                      style={{ width: '100%' }}
                      placeholder="Enter discount rate"
                      customInput={TextField}
                      value={getValuesUpdate('discount_amount')}
                      allowNegative={false}
                      error={!!errorsUpdate.discount_amount}
                      onValueChange={(value) => {
                        setValueUpdate(
                          'discount_amount',
                          Number(value.floatValue)
                        )
                        triggerUpdate('discount_amount')
                      }}
                      isAllowed={(values) => {
                        const { floatValue, formattedValue } = values
                        if (floatValue === 0) {
                          return floatValue >= 0
                        }
                        if (!floatValue) {
                          return formattedValue === ''
                        }
                        return floatValue <= 100 && floatValue >= 0
                      }}
                      className={classes['input-number']}
                    />
                    <FormHelperText error>
                      {errorsUpdate.discount_amount &&
                        `${errorsUpdate.discount_amount.message}`}
                    </FormHelperText>
                  </>
                )}
              />
            </Box>
            <Box sx={{ marginBottom: '15px' }}>
              <Controller
                control={controlUpdate}
                name="max_discount_amount"
                render={() => (
                  <>
                    <InputLabelCustom>Maximum discount amount</InputLabelCustom>
                    <div className={classes['input-number']}>
                      <CurrencyNumberFormat
                        defaultPrice={Number(
                          getValuesUpdate('max_discount_amount')
                        )}
                        propValue={(value) => {
                          setValueUpdate(`max_discount_amount`, value)
                          triggerUpdate(`max_discount_amount`)
                        }}
                        error={!!errorsUpdate.max_discount_amount}
                      />
                    </div>
                    <FormHelperText error>
                      {errorsUpdate.max_discount_amount &&
                        `${errorsUpdate.max_discount_amount.message}`}
                    </FormHelperText>
                  </>
                )}
              />
            </Box>
            <Stack direction="row" spacing={2}>
              <ButtonCustom
                variant="outlined"
                size="large"
                onClick={() => handleCloseUpdateChannelDiscount()}
              >
                Cancel
              </ButtonCustom>
              <ButtonCustom
                disabled={loadingState}
                type="submit"
                size="large"
                variant="contained"
              >
                Submit
              </ButtonCustom>
            </Stack>
          </form>
        </Box>
      </Drawer>
      <Dialog
        open={stateDialogDeleteSpecificProduct}
        onClose={() => setStateDeleteSpecificProduct(false)}
      >
        <DialogTitleTws>
          <IconButton onClick={() => setStateDeleteSpecificProduct(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          Delete specific product discount
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>Are you sure to delete ?</DialogContentTextTws>
        </DialogContentTws>
        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => setStateDeleteSpecificProduct(false)}
              variant="outlined"
              size="large"
            >
              No
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={handleDeleteSpecificProduct}
              size="large"
            >
              Yes
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
    </>
  )
}

export default DiscountComponent
