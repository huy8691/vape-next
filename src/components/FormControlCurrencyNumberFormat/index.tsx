import React from 'react'
import { Controller } from 'react-hook-form'
import { InputLabelCustom } from '..'
import CustomCurrencyNumberFormat from '../CustomCurrencyNumberFormat'
import RequiredLabel from '../requiredLabel'
import { FormControl, FormHelperText } from '@mui/material'
import classes from './styles.module.scss'

interface PropsType {
  name: string
  errorPrice: boolean | undefined
  setValueVariant: any
  controlVariant: any
  trigger: any
}

const CustomCurrencyNumberFormatWithControl = (props: PropsType) => {
  return (
    <Controller
      control={props.controlVariant}
      //   name={`options_warehouse_distribution.${index}.price`}
      name={props.name}
      render={() => (
        <>
          <InputLabelCustom
            htmlFor="price"
            // error={!!errors.price || stateErrorPrice}
          >
            <RequiredLabel /> Pricing
          </InputLabelCustom>
          <FormControl fullWidth>
            <div className={classes['input-number']}>
              <CustomCurrencyNumberFormat
                setValuePrice={(value: string) => {
                  props.setValueVariant(value)
                  //   setValueVariant(
                  //     `options_warehouse_distribution.${index}.price`,
                  //     value
                  //   )
                }}
                errorPrice={
                  //   errorsVariant.options_warehouse_distribution &&
                  //   errorsVariant
                  //     .options_warehouse_distribution[
                  //     index
                  //   ] &&
                  //   !!errorsVariant
                  //     .options_warehouse_distribution[
                  //     index
                  //   ]?.price
                  props.errorPrice
                }
                trigger={props.trigger}
              />
            </div>
            <FormHelperText error>
              {
                props.errorPrice
                //   errorsVariant.options_warehouse_distribution &&
                //     errorsVariant.options_warehouse_distribution[index] &&
                //     !!errorsVariant.options_warehouse_distribution[index]?.price &&
                //     errorsVariant.options_warehouse_distribution &&
                //     errorsVariant.options_warehouse_distribution[index] &&
                //     !!errorsVariant.options_warehouse_distribution[index]?.price
                //       ?.message
              }
            </FormHelperText>
          </FormControl>
        </>
      )}
    />
  )
}

export default React.memo(CustomCurrencyNumberFormatWithControl)
