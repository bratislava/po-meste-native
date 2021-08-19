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

export const stationInformationSchema = yup.object().shape({
  station_id: yup.string().required('error-malformed'),
  name: yup.string().required('error-malformed'),
  lat: yup.number().required('error-malformed'),
  lon: yup.number().required('error-malformed'),
  is_virtual_station: yup.boolean().required('error-malformed'),
})

export const apiRekolaStationInformation = yup.object().shape({
  data: yup.object().shape({
    stations: yup.array().ensure().of(stationInformationSchema),
  }),
})
export const stationStatusSchema = yup.object().shape({
  station_id: yup.string().required('error-malformed'),
  num_bikes_available: yup.number().required('error-malformed'),
  is_installed: yup.number().required('error-malformed'),
  is_renting: yup.number().required('error-malformed'),
  is_returning: yup.number().required('error-malformed'),
  last_reported: yup.string().required('error-malformed'),
})

export const apiRekolaStationStatus = yup.object().shape({
  data: yup.object().shape({
    stations: yup.array().ensure().of(stationStatusSchema),
  }),
})
