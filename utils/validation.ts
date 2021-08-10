import * as yup from 'yup'

export const apiMhdStops = yup
  .array()
  .ensure()
  .of(
    yup
      .object()
      .shape({
        id: yup.string().required('error-malformed'),
        code: yup.string().required('error-malformed'),
        name: yup.string().required('error-malformed'),
        lat: yup.number().required('error-malformed'),
        lon: yup.number().required('error-malformed'),
      })
      .noUnknown()
  )
