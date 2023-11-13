import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Dialog, FormHelperText, IconButton, Stack } from '@mui/material'
import { X } from '@phosphor-icons/react'
import React, { useEffect } from 'react'
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
import { EditPriceType, OtherProductType } from './editPriceModal'
import { schema } from './validation'
import RequiredLabel from 'src/components/requiredLabel'
import classes from './styles.module.scss'

import CurrencyNumberFormat from 'src/components/CurrencyNumberFormat'
import { useTranslation } from 'next-i18next'
interface Props {
  stateOpen: boolean
  setStateOpen: () => void
  stateProduct?: OtherProductType
  stateIndex: number
  handleSubmitEditPrice: (value: number, index: number) => void
}
const EditPriceFormForOtherProduct = (props: Props) => {
  const { t } = useTranslation('retail-order-list')

  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<EditPriceType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })
  const onSubmitEditPrice = (value: EditPriceType) => {
    console.log('value', value)
    props.handleSubmitEditPrice(value.edited_price, props.stateIndex)
  }
  useEffect(() => {
    if (!props.stateProduct) return
    setValue('edited_price', Number(props.stateProduct.price))
  }, [props.stateProduct])
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
              {t('create.editPriceFormForOtherProduct.editPrice')}
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
                    {t('create.editPriceFormForOtherProduct.price')}
                  </InputLabelCustom>
                  <div className={classes['input-number']}>
                    <CurrencyNumberFormat
                      defaultPrice={getValues('edited_price').toFixed(2)}
                      propValue={(value) => {
                        setValue('edited_price', Number(value))
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
              {t('create.editPriceFormForOtherProduct.no')}
            </ButtonCancel>
            <ButtonCustom variant="contained" size="large" type="submit">
              {t('create.editPriceFormForOtherProduct.create')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </form>
    </Dialog>
  )
}

export default EditPriceFormForOtherProduct
