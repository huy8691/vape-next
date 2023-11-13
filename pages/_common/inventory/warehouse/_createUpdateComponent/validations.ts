import * as Yup from 'yup'

const schema = (t: any) => {
  return Yup.object().shape(
    {
      name: Yup.string()
        .required(t('validate.name.required'))
        .matches(/\S+/, t('validate.name.matches'))
        .min(2, t('validate.name.min'))
        .max(50, t('validate.name.max')),
      address: Yup.string()
        .nullable()
        .notRequired()
        .when('address', {
          is: (value: string) => value?.length,
          then: (rule) =>
            rule
              .min(2, t('validate.address.min'))
              .max(255, t('validate.address.max'))
              .matches(/\S+/, t('validate.address.matches')),
        }),
      description: Yup.string()
        .nullable()
        .notRequired()
        .when('description', {
          is: (value: string) => value?.length,
          then: (rule) =>
            rule
              .min(2, t('validate.description.min'))
              .max(500, t('validate.description.max'))
              .matches(/\S+/, t('validate.description.matches')),
        }),
    },
    [
      // Add Cyclic deps here because when require itself
      ['address', 'address'],
      ['description', 'description'],
    ]
  )
}

export { schema }
