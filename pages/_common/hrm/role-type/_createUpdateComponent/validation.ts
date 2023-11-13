import { TFunction } from 'i18next'
import * as Yup from 'yup'

const schema = (t: TFunction<['role-type']>) => {
  return Yup.object().shape({
    name: Yup.string().required(t('role-type:validate.name')),
    // .required('Name is a required field')
    // .min(2, 'Name must be at least 2 characters')
    // .max(255, 'Name must be less than or equal to 255 characters')
    // // .matches(/^\s*$/, 'Name Invalid'),
    // .test('', '', function (value: any) {
    //   const regex = /^\s*$/
    //   if (regex.test(value)) {
    //     console.log(regex.test(value))
    //     return this.createError({
    //       message: 'Name invalid',
    //     })
    //   }
    //   return true
    // }),
  })
}

export { schema }
