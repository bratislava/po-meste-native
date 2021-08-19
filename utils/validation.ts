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

export const freeBikeStatusSchema = yup.object().shape({
  bike_id: yup.string().required('error-malformed'),
  lat: yup.number().required('error-malformed'),
  lon: yup.number().required('error-malformed'),
  is_reserved: yup.boolean().required('error-malformed'),
  is_disabled: yup.boolean().required('error-malformed'),
  last_reported: yup.string().required('error-malformed'),
})

export const apiFreeBikeStatus = yup.object().shape({
  data: yup.object().shape({
    bikes: yup.array().ensure().of(freeBikeStatusSchema),
  }),
})
