import { TFunction } from 'i18next'
import * as Yup from 'yup'

const schema = (t: TFunction<['map']>) => {
  return Yup.object().shape({
    seller_id: Yup.number()
      .typeError(t('validate.seller_id'))
      .required(t('validate.seller_id')),
    name: Yup.string()
      .required(t('validate.name.required'))
      .matches(/\S+/, t('validate.name.matches'))
      .min(2, t('validate.name.min'))
      .max(100, t('validate.name.max')),
    desc: Yup.string(),
    origin: Yup.object().shape({
      address: Yup.string().required(t('validate.origin')),
      latitude: Yup.number().typeError(t('validate.origin')),
      longitude: Yup.number().typeError(t('validate.origin')),
    }),
    destination: Yup.object().shape({
      address: Yup.string().required(t('validate.destination')),
      latitude: Yup.number().typeError(t('validate.destination')),
      longitude: Yup.number().typeError(t('validate.destination')),
    }),
    date_from: Yup.string().required(t('validate.date_from')),
    // date_to: Yup.string().required('Date to is required'),
    locations: Yup.array()
      .of(
        Yup.object().shape({
          address: Yup.string().required(t('validate.locations.address')),
          latitude: Yup.number().typeError(t('validate.locations.latitude')),
          longitude: Yup.number().typeError(t('validate.locations.longitude')),
          contact: Yup.object()
            .shape({
              business_name: Yup.string(),
              id: Yup.number()
                .transform((value) => (Number.isNaN(value) ? null : value))
                .nullable(),
            })
            .nullable(),
        })
      )
      .test('testLocations', t('validate.locations.test'), (locations: any) => {
        return locations?.length > 0
      }),
  })
}

export { schema }
