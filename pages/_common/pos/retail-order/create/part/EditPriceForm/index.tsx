import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Dialog, FormHelperText, IconButton, Stack } from '@mui/material'
import { X } from '@phosphor-icons/react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  InputLabelCustom,
  TypographyH2,
} from 'src/components'
import { EditPriceType, ProductDataType } from './editPriceModal'
import { schema } from './validation'
import RequiredLabel from 'src/components/requiredLabel'
import classes from './styles.module.scss'

import CurrencyNumberFormat from 'src/components/CurrencyNumberFormat'
import { useTranslation } from 'next-i18next'
interface Props {
  stateOpen: boolean
  setStateOpen: () => void
  stateProduct?: ProductDataType
  stateIndex: number
  handleSubmitEditPrice: (value: number, index: number) => void
}
const EditPriceFormForProduct = (props: Props) => {
  const { t } = useTranslation('retail-order-list')
  const {
    handleSubmit,
    control,
    setValue,
    trigger,

    formState: { errors },
  } = useForm<EditPriceType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
    reValidateMode: 'onSubmit',
  })
  const onSubmitEditPrice = (value: EditPriceType) => {
    console.log('value from edit price', value)
    props.handleSubmitEditPrice(value.edited_price, props.stateIndex)
  }

  return (
    <Dialog
      open={props.stateOpen}
      onClose={() => {
        props.setStateOpen()
      }}
    >
      <form onSubmit={handleSubmit(onSubmitEditPrice)}>
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
              {t('create.editPriceFormForProduct.editPrice')}
            </TypographyH2>
          </DialogContentTextTws>

          <Box>
            <Controller
              control={control}
              name="edited_price"
              render={() => (
                <>
                  <InputLabelCustom
                    htmlFor="price"
                    error={!!errors.edited_price}
                  >
                    <RequiredLabel />{' '}
                    {t('create.editPriceFormForProduct.price')}
                  </InputLabelCustom>
                  <div className={classes['input-number']}>
                    <CurrencyNumberFormat
                      defaultPrice={
                        props.stateProduct?.edited_price
                          ? props.stateProduct?.edited_price.toFixed(2)
                          : props.stateProduct?.retail_price
                          ? props.stateProduct?.retail_price.toFixed(2)
                          : props.stateProduct?.min_retail_price?.toFixed(2)
                      }
                      propValue={(value) => {
                        setValue('edited_price', Number(value), {
                          shouldValidate: true,
                        })
                        console.log('Number value', value)
                        trigger('edited_price')
                      }}
                    />
                  </div>
                  <FormHelperText error>
                    {errors.edited_price && `${errors.edited_price.message}`}
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
              {t('create.editPriceFormForProduct.no')}
            </ButtonCancel>
            <ButtonCustom variant="contained" size="large" type="submit">
              {t('create.editPriceFormForProduct.create')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </form>
    </Dialog>
  )
}

export default EditPriceFormForProduct
