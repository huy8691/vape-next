import * as Yup from 'yup'

const schema = Yup.object().shape({
  search: Yup.string(),
})
const schemaImportCategory = (t: any) => {
  return Yup.object().shape({
    importData: Yup.mixed()
      .test('size', t('validate.importData.required'), (value) => {
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
export { schema, schemaImportCategory }
