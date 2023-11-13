import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { OtherProductType } from './addOtherProductModels'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaAddOtherPRoduct } from './validations'
import {
  Box,
  Dialog,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  InputLabelCustom,
  TextFieldCustom,
  TypographyH2,
} from 'src/components'
import CurrencyNumberFormat from 'src/components/CurrencyNumberFormat'
import RequiredLabel from 'src/components/requiredLabel'
import { NumericFormat } from 'react-number-format'
import { X } from '@phosphor-icons/react'
import classes from './styles.module.scss'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useTranslation } from 'next-i18next'

interface Props {
  stateOpen: boolean
  setStateOpen: () => void
  onSubmitAddOtherProduct: (value: OtherProductType) => void
}
const AddOtherProductForm = (props: Props) => {
  const [pushMessgage] = useEnqueueSnackbar()
  const { t } = useTranslation('retail-order-list')
  const {
    handleSubmit: handleSubmitAddOtherProduct,
    control: controlAddOtherProduct,
    setValue: setValueAddOtherProduct,
    trigger: triggerValueAddOtherProduct,
    watch: watchValueAddOtherProduct,
    formState: { errors: errorsAddOtherProduct },
  } = useForm<OtherProductType>({
    resolver: yupResolver(schemaAddOtherPRoduct(t)),
    mode: 'all',
  })
  const onSubmitAddOtherProduct = (value: OtherProductType) => {
    const submitValue: OtherProductType = {
      product_name: value.product_name,
      quantity: value.quantity,
      price: value.price,
      unit: value.unit ? value.unit : 'unit',
    }
    props.onSubmitAddOtherProduct(submitValue)
    props.setStateOpen()
    pushMessgage(
      t('create.AddOtherProductForm.addOtherProductSuccessfully'),
      'success'
    )
  }
  return (
    <Dialog
      open={props.stateOpen}
      onClose={() => {
        props.setStateOpen()
      }}
    >
      <form onSubmit={handleSubmitAddOtherProduct(onSubmitAddOtherProduct)}>
        <DialogTitleTws>
          <IconButton
            onClick={() => {
              props.setStateOpen()
            }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <DialogContentTws>
          <DialogContentTextTws>
            <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
              {' '}
              {t('create.AddOtherProductForm.addOtherProduct')}
            </TypographyH2>
          </DialogContentTextTws>
          <Box>
            <Controller
              control={controlAddOtherProduct}
              name="product_name"
              render={({ field }) => (
                <>
                  {' '}
                  <InputLabelCustom
                    error={!!errorsAddOtherProduct.product_name}
                  >
                    <RequiredLabel />
                    {t('create.AddOtherProductForm.productName')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <TextFieldCustom
                      id="product_name"
                      placeholder={t(
                        'create.AddOtherProductForm.enterProductName'
                      )}
                      error={!!errorsAddOtherProduct.product_name}
                      {...field}
                    />
                    <FormHelperText error>
                      {errorsAddOtherProduct.product_name &&
                        `${errorsAddOtherProduct.product_name.message}`}
                    </FormHelperText>
                  </FormControl>
                </>
              )}
            />
          </Box>
          <Stack direction="row" spacing={2}>
            <Box>
              <Controller
                control={controlAddOtherProduct}
                name="quantity"
                render={() => (
                  <>
                    <InputLabelCustom error={!!errorsAddOtherProduct.quantity}>
                      <RequiredLabel />
                      {t('create.AddOtherProductForm.quantity')}
                    </InputLabelCustom>
                    <NumericFormat
                      allowNegative={false}
                      customInput={TextField}
                      style={{ width: '100%' }}
                      thousandSeparator
                      isAllowed={(values) => {
                        const { floatValue, formattedValue } = values
                        if (!floatValue) {
                          return formattedValue === ''
                        }
                        return floatValue <= 10000000
                      }}
                      className={classes['input-number']}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {watchValueAddOtherProduct('unit')
                              ? watchValueAddOtherProduct('unit')?.toLowerCase()
                              : t('UNIT')}
                          </InputAdornment>
                        ),
                      }}
                      error={!!errorsAddOtherProduct.quantity}
                      placeholder="0"
                      onValueChange={(value) => {
                        setValueAddOtherProduct(
                          `quantity`,
                          Number(value.floatValue)
                        )
                        triggerValueAddOtherProduct(`quantity`)
                      }}
                    />
                    <FormHelperText error>
                      {errorsAddOtherProduct.quantity &&
                        `${errorsAddOtherProduct.quantity.message}`}
                    </FormHelperText>
                  </>
                )}
              />
            </Box>
            <Box>
              <Controller
                control={controlAddOtherProduct}
                name="unit"
                render={({ field }) => (
                  <>
                    <InputLabelCustom error={!!errorsAddOtherProduct.unit}>
                      {t('create.AddOtherProductForm.unitType')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="unit_type"
                        defaultValue={t('UNIT')}
                        placeholder={t(
                          'create.AddOtherProductForm.enterUnitType'
                        )}
                        error={!!errorsAddOtherProduct.unit}
                        {...field}
                      />
                      <FormHelperText error>
                        {errorsAddOtherProduct.unit &&
                          `${errorsAddOtherProduct.unit.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
          </Stack>
          <Box>
            <Controller
              control={controlAddOtherProduct}
              name="price"
              render={() => (
                <>
                  <InputLabelCustom
                    htmlFor="price"
                    error={!!errorsAddOtherProduct.price}
                  >
                    <RequiredLabel /> {t('create.AddOtherProductForm.price')}
                  </InputLabelCustom>
                  <div className={classes['input-number']}>
                    <CurrencyNumberFormat
                      propValue={(value) => {
                        console.log('value', value)
                        setValueAddOtherProduct('price', Number(value))
                        triggerValueAddOtherProduct('price')
                      }}
                    />
                  </div>
                  <FormHelperText error>
                    {errorsAddOtherProduct.price &&
                      `${errorsAddOtherProduct.price.message}`}
                  </FormHelperText>
                </>
              )}
            />
          </Box>
        </DialogContentTws>
        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => {
                props.setStateOpen()
              }}
              variant="outlined"
              size="large"
            >
              {t('create.AddOtherProductForm.no')}
            </ButtonCancel>
            <ButtonCustom variant="contained" size="large" type="submit">
              {t('create.AddOtherProductForm.create')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </form>
    </Dialog>
  )
}

export default AddOtherProductForm
