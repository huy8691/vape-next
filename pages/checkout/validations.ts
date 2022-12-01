import * as Yup from 'yup'

const schema = Yup.object().shape(
  {
    address_name: Yup.string()
      .required('Address name is a required field')
      .min(2, 'Address name must be at least 2 characters')
      .max(50, 'Address name must be at most 50 characters'),
    recipient_name: Yup.string()
      .required('Receiver name is a required field')
      .min(2, 'Receiver name must be at least 2 characters')
      .max(50, 'Receiver name must be at most 50 characters'),
    address: Yup.string()
      .required('Address is a required field')
      .min(2, 'Address must be at least 2 characters')
      .max(500, 'Address must be at most 500 characters'),
    phone_number: Yup.string()
      .required('Phone number is a required field')
      .matches(
        /^[2-9]{1}[0-9]{2}[0-9]{3}[0-9]{4}$/,
        'Phone number is not in correct format'
      ),
    note: Yup.string()
      .nullable()
      .notRequired()
      .when('note', {
        is: (value: string) => value?.length,
        then: (rule) => rule.min(3).max(255),
      }),
  },
  [
    // Add Cyclic deps here because when require itself
    ['note', 'note'],
  ]
)

export { schema }
