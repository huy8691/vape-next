import * as Yup from 'yup'

const schema = Yup.object().shape({
  search: Yup.string(),
})
const schemaImportContact = (t: any) => {
  return Yup.object().shape({
    importData: Yup.mixed()
      .test('size', t('validate.importData.required'), (value) => {
        if (value.length === 0) return false
        return true
      })
      .test('size', t('validate.importData.test'), (value) => {
        if (!value.length) return false
        return value[0].size <= 20000
      }),
  })
}

export { schema, schemaImportContact }
