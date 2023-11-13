import * as Yup from 'yup'

const schema = (t: any) => {
  {
    return Yup.object().shape({
      search: Yup.string().matches(/^[a-zA-Z0-9\s]*$/, t('validate.search')),
    })
  }
}

export { schema }
