import { FormHelperText, InputAdornment, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { hasSpecialCharacterPrice } from 'src/utils/global.utils'

const CustomCurrencyNumberFormat = (props: any) => {
  const [value, setValue] = useState<string | number>('')
  const [stateErrorPrice, setStateErrorPrice] = useState(false)
  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    console.log('e from handleOnBlur', e)
    if (!e.target.value) {
      setStateErrorPrice(true)
      setValue('')
      props.trigger()
    }
  }
  useEffect(() => {
    setValue(props.defaultPrice)
  }, [props.defaultPrice])
  console.log('props.defaultPrice', props.defaultPrice)
  return (
    <>
      <NumericFormat
        {...props}
        allowNegative={false}
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }}
        customInput={TextField}
        placeholder="0.00"
        value={value}
        thousandSeparator
        // isAllowed={(value) => {
        //   const { floatValue } = value
        //   return Number(floatValue) <= 10000000
        // }}
        onKeyPress={(event: any) => {
          if (hasSpecialCharacterPrice(event.key)) {
            event.preventDefault()
          }
        }}
        onBlur={(e) => {
          // if (props.triggerVariantPrice()) {
          //   props.triggerVariantPrice()
          // }
          handleOnBlur(e)
        }}
        onChange={(event) => {
          // props.trigger()
          if (props.trigger()) {
            props.trigger()
          }
          if (
            !event.target.value ||
            event.target.value === '' ||
            Number(event.target.value) === 0
          ) {
            setValue('')
            props.setValuePrice('')
            if (props.havevariant) {
              props.handlecheckerror(true)
            }

            return
          }
          let valueFromInput: string | number = event.target.value.replace(
            /[^0-9]/g,
            ''
          )
          valueFromInput = (Number(valueFromInput) / 100).toFixed(2)
          setStateErrorPrice(
            Number(valueFromInput) >= 10000000 ||
              Number(valueFromInput) < 1 / 100
          )
          if (props.havevariant) {
            props.handlecheckerror(
              Number(valueFromInput) >= 10000000 ||
                Number(valueFromInput) < 1 / 100
            )
          }

          setValue(valueFromInput)
          props.setValuePrice(valueFromInput)
        }}
      />
      {!props.errorPrice && stateErrorPrice && value !== '' && (
        <FormHelperText error>
          Price must be between 1 to 10,000,000
        </FormHelperText>
      )}
    </>
  )
}

export default React.memo(CustomCurrencyNumberFormat)
