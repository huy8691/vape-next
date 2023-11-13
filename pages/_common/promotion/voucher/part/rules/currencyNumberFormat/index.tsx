import { InputAdornment, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { hasSpecialCharacterPrice } from 'src/utils/global.utils'

interface Props {
  defaultPrice?: string | number | null

  propValue: (value: number | null) => void
  disable?: boolean
  placeholder?: string
  error?: boolean
}

const CurrencyNumberFormat = (props: Props) => {
  const [stateValue, setStateValue] = useState<string | number>('')
  console.log('props', props)
  useEffect(() => {
    console.log('propssss', props.defaultPrice)
    if (props.defaultPrice) {
      setStateValue(props.defaultPrice)
      props.propValue(Number(props.defaultPrice))
    }
    // if (props.defaultPrice === '') {
    //   setStateValue(props.defaultPrice)
    // }

    // if (props.disable) {
    //   console.log('props isdisable', props.disable)
    //   setStateValue('')
    //   props.propValue(null)
    // }
    console.log('stateValue', stateValue)
  }, [props.defaultPrice])
  return (
    <NumericFormat
      disabled={props.disable}
      placeholder={props.placeholder}
      error={props.error}
      allowNegative={false}
      InputProps={{
        startAdornment: <InputAdornment position="start">$</InputAdornment>,
      }}
      customInput={TextField}
      value={stateValue}
      thousandSeparator
      onKeyPress={(event: any) => {
        if (hasSpecialCharacterPrice(event.key)) {
          event.preventDefault()
        }
      }}
      onChange={(event) => {
        // props.trigger()
        if (!event.target.value || event.target.value === '') {
          setStateValue('')
          props.propValue(null)
          return
        }
        let valueFromInput: string | number = event.target.value.replace(
          /[^0-9]/g,
          ''
        )
        if (Number(event.target.value) !== 0) {
          valueFromInput = (Number(valueFromInput) / 100).toFixed(2)
        }

        setStateValue(valueFromInput)
        console.log('value from input', valueFromInput)
        props.propValue(Number(valueFromInput))
      }}
    />
  )
}

export default React.memo(CurrencyNumberFormat)
