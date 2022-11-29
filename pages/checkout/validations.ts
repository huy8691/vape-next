import * as Yup from 'yup'

const schema = Yup.object().shape(
  {
    address_name: Yup.string().required().min(2).max(50),
    recipient_name: Yup.string().required(),
    address: Yup.string().required().min(2).max(500),
    phone_number: Yup.string()
      .required()
      .matches(
        /^[2-9]{1}[0-9]{2}[0-9]{3}[0-9]{4}$/,
        'Phone number is not in correct format'
      ),
    note: Yup.string()
      .required()
      .nullable()
      .notRequired()
      .when('note', {
        is: (value: string) => value?.length,
        then: (rule) => rule.min(3),
      }),
  },
  [
    // Add Cyclic deps here because when require itself
    ['note', 'note'],
  ]
)

export { schema }
