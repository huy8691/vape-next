import * as yup from 'yup'

export const schema = (t: any) => {
  return yup.object().shape({
    edited_price: yup
      .number()
      .typeError(t('create.validation.price.type'))
      .required(t('create.validation.price.required'))
      .min(1 / 100, t('create.validation.price.max'))
      .max(10000000, t('create.validation.price.max')),
  })
}
