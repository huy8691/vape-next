import * as Yup from 'yup'
import zipState from 'zip-state'

const schema = (t: any) => {
  return Yup.object().shape(
    {
      note: Yup.string()
        .nullable()
        .notRequired()
        .when('note', {
          is: (value: string) => value?.length,
          then: (rule) =>
            rule.min(5, t('validation.note')).max(255, t('validation.note')),
        }),
    },
    [
      // Add Cyclic deps here because when require itself
      ['note', 'note'],
    ]
  )
}

const phoneRegExp = /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/

const schemaAddress = (t: any) => {
  return Yup.object().shape({
    id: Yup.number(),
    name: Yup.string()
      .required(t('validation.addressName.required'))
      .min(2, t('validation.addressName.min'))
      .max(50, t('validation.addressName.max'))
      .matches(/^(?!\s).*/, t('validation.addressName.matches')),
    phone_number: Yup.string()
      .required(t('validation.phoneNumber.required'))
      .matches(phoneRegExp, t('validation.phoneNumber.matches')),
    address: Yup.string()
      .required(t('validation.address.required'))
      .min(2, t('validation.address.min'))
      .max(50, t('validation.address.max'))
      .matches(/^(?!\s).*/, t('validation.address.matches')),
    receiver_name: Yup.string()
      .required(t('validation.receiverName.required'))
      .min(2, t('validation.receiverName.min'))
      .max(50, t('validation.receiverName.max'))
      .matches(/^(?!\s).*/, t('validation.receiverName.matches')),
    city: Yup.string()
      .required('City field is required')
      .min(2, 'City must be at least 2 characters')
      .max(500, 'City must be at most 500 characters'),
    state: Yup.object()
      .shape({
        name: Yup.string().required(t('validation.state.required')),
        abbreviation: Yup.string().required(t('validation.state.required')),
      })
      .required(t('validation.state.required')),
    postal_zipcode: Yup.string()
      .required(t('validation.postalZipcode.required'))
      .min(5, t('validation.postalZipcode.min'))
      .max(9, t('validation.postalZipcode.max'))
      .test(
        'custom-validation',
        t('validation.postalZipcode.matches'),
        function (value) {
          if (value) return zipState(value) === this.parent?.state?.abbreviation
          return false
        }
      ),
  })
}

export { schema, schemaAddress }
