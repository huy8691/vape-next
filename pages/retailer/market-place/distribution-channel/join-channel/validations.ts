import * as Yup from 'yup'

const schema = (t: any) => {
  return Yup.object().shape({
    code: Yup.string()
      .required(t('validation.joinChannel.required'))
      .min(1, t('validation.joinChannel.min')),
  })
}

export { schema }
