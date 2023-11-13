import * as Yup from 'yup'

const schema = Yup.object().shape({
  name: Yup.string(),
})

const schemaAttribute = (t: any) => {
  return Yup.object().shape({
    name: Yup.string().required(t('validate.name')),
  })
}

const schemaOption = (t: any) => {
  {
    return Yup.object().shape({
      name: Yup.string().required(t('validate.name')),
    })
  }
}
const schemaCreateOption = (t: any) => {
  return Yup.object().shape({
    name: Yup.string().required(t('validate.name')),
    attribute: Yup.number().required(),
  })
}
const schemaUpdateAttribute = (t: any) => {
  return Yup.object().shape({
    name: Yup.string()
      .min(2, t('validate.attributeName.minMax'))
      .max(50, t('validate.attributeName.minMax'))
      .matches(/\S+/, t('validate.attributeName.matches'))
      .required(t('validate.attributeName.required')),
    options: Yup.array().of(
      Yup.object().shape({
        id: Yup.number().nullable(),
        name: Yup.string()
          .min(1, t('validate.optionsName.minMax'))
          .max(50, t('validate.optionsName.minMax'))
          .matches(/\S+/, t('validate.optionsName.matches'))
          .required(t('validate.optionsName.required')),
      })
    ),
  })
}

export {
  schema,
  schemaAttribute,
  schemaOption,
  schemaCreateOption,
  schemaUpdateAttribute,
}
