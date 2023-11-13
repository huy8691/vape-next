import { TFunction } from 'i18next'
import * as Yup from 'yup'

const schema = Yup.object().shape({
  search: Yup.string(),
})
const schemaLead = Yup.object().shape({
  key: Yup.string(),
})
const schemaUpdateMessage = (t: TFunction<['messages'], undefined>) => {
  return Yup.object().shape({
    title: Yup.string()
      .required(t('messages:validate.title.required'))
      .min(5, t('messages:validate.title.minMax'))
      .max(50, t('messages:validate.title.minMax')),
    message: Yup.string()
      .required(t('messages:validate.message.minMax'))
      .min(5, t('messages:validate.message.minMax'))
      .max(10000, t('messages:validate.message.minMax')),
  })
}
export { schema, schemaLead, schemaUpdateMessage }
