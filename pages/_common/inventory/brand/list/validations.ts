import * as Yup from 'yup'

const schema = (t: any) => {
  return Yup.object().shape({
    name: Yup.string()
      .required(t('validate.name.required'))
      .min(2, t('validate.name.min'))
      .max(50, t('validate.name.max')),
    parent_category: Yup.number().nullable(),
    logo: Yup.string(),
  })
}
const schemaImportContact = (t: any) => {
  return Yup.object().shape({
    importData: Yup.mixed()
      .test('size', t('validate.importData.required'), (value) => {
        console.log('🚀 ~ file: validations.ts:9 ~ .test ~ value', value)
        if (value.length === 0) return false
        return true
      })
      .test('size', t('validate.importData.test'), (value) => {
        // attachment is optional
        if (!value.length) return false
        return value[0].size <= 20000
      }),
  })
}

export { schema, schemaImportContact }
