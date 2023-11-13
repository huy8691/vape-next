import React, { useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import { debounce } from '@mui/material/utils'
import { googleMapAPIKey } from 'src/constants/googlemapapikey.constant'
import { getGeocode, getLatLng } from 'use-places-autocomplete'
import { TextFieldCustom } from 'src/components'

// This key was created specifically for the demo in mui.com.
// You need to create a new one for your application.

function loadScript(src: string, position: HTMLElement | null, id: string) {
  if (!position) {
    return
  }

  const script = document.createElement('script')
  script.setAttribute('async', '')
  script.setAttribute('id', id)
  script.src = src
  position.appendChild(script)
}

const autocompleteService = { current: null }

interface MainTextMatchedSubstrings {
  offset: number
  length: number
}
interface StructuredFormatting {
  main_text: string
  secondary_text: string
  main_text_matched_substrings?: readonly MainTextMatchedSubstrings[]
}
interface PlaceType {
  description: string
  structured_formatting: StructuredFormatting
  place_id: string
}

interface Props {
  onChangeValue: (value: {
    address: string
    latitude: string
    longitude: string
  }) => void
  error?: boolean
  value?: {
    address: string
    latitude: string
    longitude: string
  }
}

const GoogleAutoComplete: React.FC<Props> = (props) => {
  const [value, setValue] = React.useState<any | null>({
    description: props.value?.address,
    latitude: props.value?.latitude,
    longitude: props.value?.longitude,
  })
  const [inputValue, setInputValue] = React.useState('')
  const [options, setOptions] = React.useState<readonly PlaceType[]>([])
  const loaded = React.useRef(false)

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${googleMapAPIKey}&libraries=places`,
        document.querySelector('head'),
        'google-maps'
      )
    }

    loaded.current = true
  }

  const fetch = React.useMemo(
    () =>
      debounce(
        (
          request: { input: string; componentRestrictions?: any },
          callback: (results?: readonly PlaceType[]) => void
        ) => {
          request.componentRestrictions = { country: 'us' }
          ;(autocompleteService.current as any).getPlacePredictions(
            request,
            callback
          )
        },
        300
      ),
    []
  )

  useEffect(() => {
    let active = true

    if (!autocompleteService.current && (window as any).google) {
      autocompleteService.current = new (
        window as any
      ).google.maps.places.AutocompleteService()
    }
    if (!autocompleteService.current) {
      return undefined
    }

    if (inputValue === '') {
      setOptions(value ? [value] : [])
      return undefined
    }
    console.log('value from google map', value)
    fetch({ input: inputValue }, (results?: readonly PlaceType[]) => {
      if (active) {
        let newOptions: readonly PlaceType[] = []

        if (value) {
          newOptions = [value]
        }

        if (results) {
          newOptions = [...newOptions, ...results]
        }

        setOptions(newOptions)
      }
    })

    return () => {
      active = false
    }
  }, [value, inputValue, fetch])

  useEffect(() => {
    // if(props.value?.address !=== value?.description){
    //   setValue({
    //     ...props.value,
    //     description: props.value?.address,
    //   })
    // }

    if (props.value) {
      setValue({
        ...props.value,
        description: props.value.address,
      })
    }
  }, [props.value])

  return (
    <>
      <Autocomplete
        id="google-map"
        getOptionLabel={(option) => {
          // console.log('444534543534', option)
          return option.description ? option.description : ''
        }}
        filterOptions={(x) => x}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions
        value={value}
        // inputValue={inputValue}
        noOptionsText="No locations"
        sx={{
          '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
            padding: '1px 5px',
          },
        }}
        onChange={(event: any, newValue: PlaceType | null) => {
          console.log('event target', event)
          setOptions(newValue ? [newValue, ...options] : options)
          setValue(newValue)
          console.log('newValue from autocomplete', newValue)
          console.log('33333', newValue)

          if (!newValue) {
            props.onChangeValue({
              address: '',
              latitude: '',
              longitude: '',
            })
            return
          }
          getGeocode({ placeId: newValue?.place_id }).then((results) => {
            const { lat, lng } = getLatLng(results[0])
            console.log('📍 Coordinates: ', { lat, lng }, newValue?.description)
            props.onChangeValue({
              address: newValue?.description ? newValue?.description : '',
              latitude: lat.toString(),
              longitude: lng.toString(),
            })
          })
        }}
        onInputChange={(event, newInputValue) => {
          console.log(event)
          setInputValue(newInputValue)
        }}
        renderInput={(params) => (
          <TextFieldCustom
            {...(params as any)}
            fullWidth
            error={props.error}
            placeholder={props.value?.address}
          />
        )}
        // renderOption={(props, option) => {
        //   const matches =
        //     option.structured_formatting.main_text_matched_substrings || []

        //   const parts = parse(
        //     option.structured_formatting.main_text,
        //     matches.map((match: any) => [
        //       match.offset,
        //       match.offset + match.length,
        //     ])
        //   )
        //   return (
        //     <li {...props}>
        //       <Grid container alignItems="center">
        //         <Grid item sx={{ display: 'flex', width: 30 }}>
        //           <LocationOnIcon sx={{ color: 'text.secondary' }} />
        //         </Grid>
        //         <Grid
        //           item
        //           sx={{ width: 'calc(100% - 30px)', wordWrap: 'break-word' }}
        //         >
        //           {parts.map((part, index) => (
        //             <Box
        //               key={index}
        //               component="span"
        //               sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
        //             >
        //               {part.text}
        //             </Box>
        //           ))}
        //           <Typography variant="body2" color="text.secondary">
        //             {option.structured_formatting.secondary_text}
        //           </Typography>
        //         </Grid>
        //       </Grid>
        //     </li>
        //   )
        // }}
      />
    </>
  )
}

export default GoogleAutoComplete
