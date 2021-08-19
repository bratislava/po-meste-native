import * as yup from 'yup'

export const apiMhdStops = yup
  .array()
  .ensure()
  .of(
    yup
      .object()
      .shape({
        stationStopId: yup.number().required('error-malformed'),
        stationId: yup.number().required('error-malformed'),
        name: yup.string().required('error-malformed'),
        address: yup.string().nullable(true), // if required it throws error, doesn't needed at time of implementation
        gpsLon: yup.string().required('error-malformed'),
        gpsLat: yup.string().required('error-malformed'),
        tag: yup.string().required('error-malformed'),
      })
      .noUnknown()
  )
