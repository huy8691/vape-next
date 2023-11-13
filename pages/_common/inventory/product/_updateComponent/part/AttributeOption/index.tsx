import { yupResolver } from '@hookform/resolvers/yup'

import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'

import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/system'
import { X } from '@phosphor-icons/react'
import React, { useCallback, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { ButtonCustom, InputLabelCustom, TextFieldCustom } from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import RequiredLabel from 'src/components/requiredLabel'
// import { useAppDispatch } from 'src/store/hooks'
// import { loadingActions } from 'src/store/loading/loadingSlice'

import {
  AttributePropResponseType,
  AttributeWithOptionType,
  BeforeSubmitCreateVariantType,
  CreateAttributesOptionType,
  ValidateCreateAttributesOptionsType,
} from './attributeOptionModel'
import { schemaAttributeOptions } from './validations'
import { useTranslation } from 'react-i18next'

type Props = {
  stateAttribute: AttributePropResponseType
  handleSubmitCreateVariant: (
    value: any,
    attributes: { name: string; options: string[] }[]
  ) => void
}
const CustomBox = styled(Box)(({ theme }) => ({
  padding: '15px',
  background: '#FFFF',
  borderRadius: '10px',
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.12)' : '#fff',
}))
const CustomStack = styled(Stack)(({ theme }) => ({
  // background: '#F8F9FC',
  padding: '15px',
  borderRadius: '10px',
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F8F9FC',
}))

const AttributeOptionComponent = ({
  stateAttribute,
  handleSubmitCreateVariant,
}: Props) => {
  // const dispatch = useAppDispatch()
  const { t } = useTranslation('product')

  const [pushMessage] = useEnqueueSnackbar()
  // force update rerender
  const [stateRerender, setStateRerender] = useState(false)
  // const [stateDeleteArray, setStateDeleteArray] = useState<number[]>([])
  const {
    register,
    handleSubmit,
    control,

    formState: { errors: errorsAttributeOption },
    setValue,
    getValues,
  } = useForm<ValidateCreateAttributesOptionsType>({
    resolver: yupResolver(schemaAttributeOptions(t)),
    defaultValues: {
      arr_attributes: [
        {
          attribute: {
            // id: undefined,
            // name: '',
            options: [],
          },
          options: [],
        },
      ],
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    // shouldUnregister: true,
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'arr_attributes',
  })

  const handleCreateAttributeOption = async (
    value: ValidateCreateAttributesOptionsType
  ) => {
    // buttonBeforeGenerateRef.current.click()
    // if (fieldsVariant.length > 0) {
    //   resetVariant()
    //   console.log('resetVariant')
    console.log('stateAttribute', stateAttribute)
    console.log('value when submit', value.arr_attributes)
    const cloneArrayAttribute: CreateAttributesOptionType[] = JSON.parse(
      JSON.stringify(value.arr_attributes)
    )
    const containAll = cloneArrayAttribute.every((item, index) => {
      const foundIndex = stateAttribute.data.findIndex(
        (element) => element.name === item.attribute.name
      )
      if (foundIndex === -1) return true
      if (stateAttribute.data[foundIndex].options.length < 5) {
        const cloneArrayOption = stateAttribute.data[foundIndex].options.map(
          (option) => option.name
        )
        const temporaryArrayOption = cloneArrayOption.concat(item.options)
        const checkLengthArrayOption = temporaryArrayOption.filter(
          (obj, position) => temporaryArrayOption.indexOf(obj) === position
        )
        if (checkLengthArrayOption.length > 5) {
          pushMessage(
            `${t(
              'createUpdate.attributeOptions.canNotCreateMoreOptionForAttribute'
            )} ${index + 1} `,
            'error'
          )
          return false
        }
      }
      if (stateAttribute.data[foundIndex].options.length === 5) {
        const result = item.options.every((obj) => {
          console.log('obj', obj)
          console.log('stateAttribute', stateAttribute.data[foundIndex].options)
          return stateAttribute.data[foundIndex].options.some(
            (option) => option.name === obj
          )
        })

        if (!result) {
          pushMessage(
            `${t(
              'createUpdate.attributeOptions.canNotCreateMoreOptionForAttribute'
            )} ${index + 1} `,
            'error'
          )
          return false
        }
      }
      return true
    })
    console.log('contain all', containAll)
    if (!containAll) return

    // check if duplicate attribute
    const attributeArrayFromSubmitValue = value.arr_attributes.map(
      (item) => item.attribute.name
    )
    const isDuplicate = attributeArrayFromSubmitValue.some(
      (item, index) => attributeArrayFromSubmitValue.indexOf(item) != index
    )
    if (isDuplicate) {
      pushMessage(
        t('createUpdate.attributeOptions.duplicateAttributeNameIsNotAllowed'),
        'error'
      )
      return
    }
    // dispatch(loadingActions.doLoading())

    // transform array of attributes and options to variant
    const attrs: any = []
    const attributes: any = []
    // generate variant without properties
    value.arr_attributes.forEach((element) => {
      attributes.push({
        name: element.attribute.name,
        options: element.options,
      })
      const a = element.options.map((obj) => ({
        name: element.attribute.name,
        option: obj,
      }))
      attrs.push(a)
    })
    const crossproduct = await attrs.reduce(
      (xs: any, ys: any) =>
        xs.flatMap((x: any) => ys.map((y: any) => [...x, y])),
      [[]]
    )
    // map array based on variant with properties
    const generatingArray: BeforeSubmitCreateVariantType[] = []
    await crossproduct.forEach((element: AttributeWithOptionType[]) => {
      const item: BeforeSubmitCreateVariantType = {
        options: element,
        price: null,
        warehouses: [],
        images: [],
        thumbnail: '',
        distribution_channel: [],
        error: true,
      }
      generatingArray.push(item)
    })

    handleSubmitCreateVariant(generatingArray, attributes)
    console.log('generatingArray', generatingArray)
  }

  const onError = (err: any) => {
    console.log('err', err)
  }

  const handleCheckDisableAutocomplete = useCallback(
    (option: string, index: number) =>
      getValues(`arr_attributes.${index}.options`).length === 5 &&
      !getValues(`arr_attributes.${index}.options`).includes(option),
    [getValues]
  )
  const handleOnBlurAttribute = (index: number) => {
    const foundIndex = stateAttribute.data.findIndex(
      (item) =>
        item.name === getValues(`arr_attributes.${index}.attribute.name`)
    )
    console.log('onBlur', foundIndex)

    if (foundIndex < 0) return
    setValue(`arr_attributes.${index}.attribute`, {
      name: getValues(`arr_attributes.${index}.attribute.name`),
      options: stateAttribute.data[foundIndex].options,
    })
    setStateRerender(!stateRerender)
    console.log('setValue', getValues(`arr_attributes.${index}.attribute`))
  }
  return (
    <>
      <CustomStack mb={2}>
        <Typography
          sx={{ fontSize: '1.6rem', fontWeight: 500, marginBottom: '15px' }}
        >
          {t('createUpdate.attributeOptions.productVariant')}
        </Typography>
        <form onSubmit={handleSubmit(handleCreateAttributeOption, onError)}>
          <Box sx={{ width: '100%', marginBottom: '15px' }}>
            <Grid sx={{ width: '100%' }} container columnSpacing={3}>
              {fields.map((item, index) => {
                return (
                  <Grid xs={4} key={item.id} sx={{ height: '100%' }}>
                    <CustomBox sx={{ height: '100%' }}>
                      <Box sx={{ marginBottom: '15px', position: 'relative' }}>
                        {fields.length >= 2 && (
                          <IconButton
                            sx={{
                              background: '#ffffff',
                              position: 'absolute',
                              top: '-35px',
                              right: '-34px',
                              boxShadow: '0px 4px 4px 0px #0000000D',
                            }}
                            onClick={() => {
                              remove(index)
                            }}
                          >
                            <X size={20} weight="bold" />
                          </IconButton>
                        )}
                        <>
                          <Controller
                            control={control}
                            name={`arr_attributes.${index}.attribute.name`}
                            render={() => (
                              <>
                                <InputLabelCustom
                                  htmlFor={`arr_attributes.${index}.attribute.name`}
                                  sx={{ marginBottom: '15px' }}
                                  error={
                                    !!errorsAttributeOption?.arr_attributes?.[
                                      index
                                    ]?.attribute?.name
                                  }
                                >
                                  <RequiredLabel />
                                  {t(
                                    'createUpdate.attributeOptions.attributeName'
                                  )}
                                </InputLabelCustom>
                                <FormControl fullWidth>
                                  <Autocomplete
                                    freeSolo
                                    disablePortal
                                    placeholder={t(
                                      'createUpdate.attributeOptions.enterAttributeName'
                                    )}
                                    options={stateAttribute.data}
                                    // selectOnFocus
                                    // clearOnBlur

                                    getOptionLabel={(item) => {
                                      return typeof item === 'string'
                                        ? item
                                        : item.name
                                    }}
                                    // value={value}
                                    renderInput={(params) => (
                                      <TextFieldCustom
                                        {...(params as any)}
                                        {...register(
                                          `arr_attributes.${index}.attribute.name` as const
                                        )}
                                        onBlur={() =>
                                          handleOnBlurAttribute(index)
                                        }
                                        onKeyDown={(event) => {
                                          if (event.key === 'Enter') {
                                            event.preventDefault()
                                          }
                                        }}
                                        error={
                                          !!errorsAttributeOption
                                            ?.arr_attributes?.[index]?.attribute
                                        }
                                      />
                                    )}
                                    onInputChange={(e: any, value) => {
                                      console.log('e', e)
                                      console.log(
                                        'value on input change',
                                        value
                                      )
                                      setValue(
                                        `arr_attributes.${index}.attribute`,
                                        {
                                          name: value,
                                          options: [],
                                        }
                                      )
                                    }}
                                    onChange={(e, value) => {
                                      console.log('e', e)
                                      if (!value) {
                                        return
                                      }
                                      // set option for options autocomplete
                                      console.log('value from on change', value)
                                      setValue(
                                        `arr_attributes.${index}.attribute`,
                                        typeof value === 'string'
                                          ? {
                                              name: value,
                                              options: [],
                                            }
                                          : value
                                      )
                                      setValue(
                                        `arr_attributes.${index}.options`,
                                        []
                                      )
                                    }}
                                  />
                                  <FormHelperText
                                    error={
                                      !!errorsAttributeOption?.arr_attributes?.[
                                        index
                                      ]?.attribute?.name
                                    }
                                  >
                                    {errorsAttributeOption?.arr_attributes?.[
                                      index
                                    ]?.attribute?.name &&
                                      `${errorsAttributeOption?.arr_attributes?.[index]?.attribute?.name?.message}`}
                                  </FormHelperText>
                                </FormControl>
                              </>
                            )}
                          />
                        </>
                      </Box>
                      <Box>
                        <Controller
                          control={control}
                          name={`arr_attributes.${index}.options`}
                          render={({ field: { value } }) => (
                            <>
                              <InputLabelCustom
                                htmlFor={`arr_attributes.${index}.options`}
                                sx={{ marginBottom: '15px' }}
                                error={
                                  !!errorsAttributeOption?.arr_attributes?.[
                                    index
                                  ]?.options
                                }
                              >
                                {t('createUpdate.attributeOptions.options')}
                              </InputLabelCustom>
                              <FormControl fullWidth>
                                <Autocomplete
                                  // {...register(
                                  //   `arr_attributes.${index}.options` as const
                                  // )}
                                  freeSolo={
                                    getValues(`arr_attributes.${index}.options`)
                                      .length >= 5
                                      ? false
                                      : true
                                  }
                                  getOptionDisabled={(option) =>
                                    handleCheckDisableAutocomplete(
                                      option,
                                      index
                                    )
                                  }
                                  disablePortal
                                  multiple
                                  clearOnBlur
                                  id="combo-box-demo"
                                  value={value}
                                  options={getValues(
                                    `arr_attributes.${index}.attribute`
                                  ).options.map((a: any) => a.name)}
                                  getOptionLabel={(item) => {
                                    return typeof item === 'string'
                                      ? item
                                      : item.name
                                  }}
                                  renderInput={(params) => (
                                    <TextFieldCustom
                                      {...(params as any)}
                                      onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                          event.preventDefault()
                                        }
                                      }}
                                      disabled={
                                        getValues(
                                          `arr_attributes.${index}.options`
                                        ).length >= 5
                                      }
                                      error={
                                        !!errorsAttributeOption
                                          ?.arr_attributes?.[index]?.options
                                      }
                                    />
                                  )}
                                  onChange={(e, value) => {
                                    console.log('e', e)
                                    console.log(
                                      `arr_attributes.${index}.options`,
                                      value
                                    )
                                    setValue(
                                      `arr_attributes.${index}.options`,
                                      value
                                    )

                                    // if (stateEnableConfig) {
                                    //   generateProductVariant()
                                    // }
                                  }}
                                />

                                <FormHelperText
                                  error={
                                    !!errorsAttributeOption?.arr_attributes?.[
                                      index
                                    ]?.options
                                  }
                                >
                                  {errorsAttributeOption?.arr_attributes?.[
                                    index
                                  ]?.options &&
                                    `${errorsAttributeOption?.arr_attributes?.[index]?.options?.message}`}
                                </FormHelperText>
                              </FormControl>
                            </>
                          )}
                        />
                      </Box>
                    </CustomBox>
                  </Grid>
                )
              })}
              {fields.length < 3 && (
                <Grid xs={4}>
                  <ButtonCustom
                    variant="outlined"
                    sx={{
                      width: '100%',
                      height: '100%',
                      background: '#ffffff',
                    }}
                    onClick={() => {
                      append({
                        attribute: {
                          id: undefined,
                          name: '',
                          options: [],
                        },
                        options: [],
                      })
                    }}
                  >
                    {t('createUpdate.attributeOptions.pressToAddVariant')}
                  </ButtonCustom>
                </Grid>
              )}
            </Grid>
          </Box>
          <ButtonCustom
            variant="contained"
            size="small"
            type="submit"
            sx={{ padding: '15px!important' }}
          >
            {t('createUpdate.attributeOptions.generateProductVariants')}
          </ButtonCustom>
          {/* <ButtonCustom
            onClick={() => {
              const temporaryAttributesArray = getValues('arr_attributes')

              console.log(
                'getValue from arr attribute',
                getValues('arr_attributes')
              )
              console.log(
                'some length = 0 ',
                temporaryAttributesArray.some(
                  (item) => item.options.length === 0
                )
              )
              trigger('arr_attributes')
            }}
          >
            Trigger get value
          </ButtonCustom> */}
        </form>
      </CustomStack>
    </>
  )
}

export default React.memo(AttributeOptionComponent)
