import * as Yup from 'yup'

const schema = Yup.object().shape(
  {
    name: Yup.string()
      .required('Warehouse name is required field')
      .matches(/\S+/, 'Warehouse name must not contain leading spaces')
      .min(2, 'Warehouse name must be at least 2 characters')
      .max(50, 'Warehouse name max length must be 50 characters'),
    address: Yup.string()
      .nullable()
      .notRequired()
      .when('address', {
        is: (value: string) => value?.length,
        then: (rule) =>
          rule
            .min(2, 'Address must be at least 2 characters')
            .max(255, 'Address must be at most 255 characters')
            .matches(/\S+/, 'Address must not contain leading spaces'),
      }),
    description: Yup.string()
      .nullable()
      .notRequired()
      .when('description', {
        is: (value: string) => value?.length,
        then: (rule) =>
          rule
            .min(2, 'Description must be at least 2 characters')
            .max(500, 'Description must be at most 500 characters')
            .matches(/\S+/, 'Description must not contain leading spaces'),
      }),
  },
  [
    // Add Cyclic deps here because when require itself
    ['address', 'address'],
    ['description', 'description'],
  ]
)

export { schema }
