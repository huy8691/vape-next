import * as Yup from 'yup'

const schema = (t: any) => {
  return Yup.object().shape({
    name: Yup.string()
      .required(t('validate.nameBrand.required'))
      .min(2, t('validate.nameBrand.min'))
      .max(50, t('validate.nameBrand.max'))
      .matches(/\S+/, t('validate.nameBrand.matches')),
    // logo: Yup.string(),
  })
}

export { schema }
