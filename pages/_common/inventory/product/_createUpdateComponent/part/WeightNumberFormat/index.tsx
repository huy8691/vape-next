import { TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { hasSpecialCharacterPrice } from 'src/utils/global.utils'

interface Props {
  defaultPrice?: string | number
  propValue: (value: number | null) => void

  error?: boolean
}

const WeightNumberFormat = (props: Props) => {
  const [stateValue, setStateValue] = useState<string | number>('')
  console.log('props', props)
  useEffect(() => {
    if (props.defaultPrice) {
      setStateValue(props.defaultPrice)
      props.propValue(Number(props.defaultPrice))
    }
  }, [props.defaultPrice])
  return (
    <NumericFormat
      error={props.error}
      allowNegative={false}
      customInput={TextField}
      placeholder="0.00"
      value={stateValue}
      thousandSeparator
      onKeyPress={(event: any) => {
        if (hasSpecialCharacterPrice(event.key)) {
          event.preventDefault()
        }
      }}
      onChange={(event) => {
        // props.trigger()
        if (
          !event.target.value ||
          event.target.value === '' ||
          Number(event.target.value) === 0
        ) {
          setStateValue('')
          props.propValue(null)
          return
        }
        let valueFromInput: string | number = event.target.value.replace(
          /[^0-9]/g,
          ''
        )

        valueFromInput = (Number(valueFromInput) / 100).toFixed(2)
        setStateValue(valueFromInput)
        console.log('value from input', valueFromInput)
        props.propValue(Number(valueFromInput))
      }}
    />
  )
}

export default React.memo(WeightNumberFormat)
