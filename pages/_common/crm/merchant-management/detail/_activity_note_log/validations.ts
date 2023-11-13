import * as yup from 'yup'

const schema = (t: any) => {
  return yup.object().shape({
    content: yup
      .string()
      .required(t('validate.content.required'))
      .test('', '', function (value: any) {
        const regex = /^\s*$/
        if (regex.test(value)) {
          console.log(regex.test(value))
          return this.createError({
            message: t('validate.content.invalid'),
          })
        }
        return true
      })
      .max(5000, t('validate.content.max'))
      .min(2, t('validate.content.min')),
    files: yup.array(),
    log_type: yup.string(),
  })
}

export { schema }
