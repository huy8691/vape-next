import * as Yup from 'yup'

export const schemaValidation = Yup.object().shape({
  code: Yup.string(),
  number: Yup.string()
    .required('validation.card.required')
    .transform((value, originalValue) => {
      console.log(value)
      return originalValue.replace(/\s/g, '')
    })
    .matches(/^\d{14,16}$/, 'Card number must be 14-16 digits'),
  name: Yup.string()
    .required('validation.name.required')
    .min(5, 'Name must be at least 5 characters')
    .max(20, 'Name must be at most 50 characters'),
  cvc: Yup.string()
    .required('Card verification code is required ')
    .matches(/^\d{3,4}$/, 'Card verification code must be 3 or 4 digits'),
  expiry: Yup.string()
    .required('Expiry is required')
    .length(5, 'Expiry incorrect format'),
})
