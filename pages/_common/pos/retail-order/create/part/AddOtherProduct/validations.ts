import * as yup from 'yup'

export const schemaAddOtherPRoduct = (t: any) => {
  return yup.object().shape({
    price: yup
      .number()
      .typeError(t('create.validation.price.type'))
      .required(t('create.validation.price.required'))
      .min(1 / 100, t('create.validation.price.max'))
      .max(10000000, t('create.validation.price.max')),
    product_name: yup
      .string()
      .required(t('create.validation.productName.required'))
      .min(3, t('create.validation.productName.min'))
      .max(255, t('create.validation.productName.max')),
    quantity: yup
      .number()
      .typeError(t('create.validation.quantity.typeError'))
      .required(t('create.validation.quantity.required'))
      .min(1, t('create.validation.quantity.min'))
      .max(10000000, t('create.validation.quantity.max')),
    unit_type: yup.string().nullable().notRequired(),
  })
}
