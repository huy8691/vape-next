import * as Yup from 'yup'

export const schema = Yup.object().shape({
  number: Yup.string()
    .required('Card number is required')
    .transform((_value, originalValue) => {
      return originalValue.replace(/\s/g, '')
    })
    .matches(/^\d{14,16}$/, 'Card number must be 14-16 digits'),
  cvc: Yup.string()
    .required('Card verification code is required ')
    .matches(/^\d{3,4}$/, 'Card verification code must be 3 or 4 digits'),
  expiry: Yup.string()
    .required('Expiry is required')
    .length(5, 'Expiry incorrect format'),
})
