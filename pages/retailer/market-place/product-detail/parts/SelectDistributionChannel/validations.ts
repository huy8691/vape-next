import * as Yup from 'yup'

export const schema = Yup.object().shape({
  id: Yup.number().typeError('Id mus be a number'),
})
