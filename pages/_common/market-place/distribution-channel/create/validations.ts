import * as Yup from 'yup'

const schema = (t: any) => {
  return Yup.object().shape({
    name: Yup.string()
      .required(t('validation.createDC.required'))
      .min(2, t('validation.createDC.min'))
      .max(255, t('validation.createDC.max'))
      // .matches(/^\s*$/, 'Name Invalid'),
      .test('', '', function (value: any) {
        const regex = /^\s*$/
        if (regex.test(value)) {
          console.log(regex.test(value))
          return this.createError({
            message: t('validation.createDC.matches'),
          })
        }
        return true
      }),
  })
}

export { schema }
