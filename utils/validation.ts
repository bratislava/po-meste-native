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

export const apiZseChargers = yup.object().shape({
  localities: yup
    .array()
    .ensure()
    .of(
      yup.object().shape({
        // additional_info: yup.string().nullable(), //'6x AC socket (DLM)',
        // address: yup.string(), //'Dúbravka, Bagarova',
        // city: yup.string().nullable(), //'Bratislava',
        connectors: yup
          .array()
          .ensure()
          .of(
            yup.object().shape({
              // id: yup.number(), // 147118,
              pricing: yup.object().shape({
                // charging_price: yup.string().nullable(), // '0.29 €/kWh',
                // free_parking_time: yup.string().nullable(), // '720 min',
                // parking_price: yup.string(), // '3 €/h',
              }),
              // status: yup.string(), //'AVAILABLE',
              // type: yup.string(), //'Mennekes Type 2',
            })
          ),
        coordinates: yup.object().shape({
          latitude: yup.number().nullable(), // 48.181295,
          longitude: yup.number().nullable(), // 17.043218,
        }),
        // country_code: yup.string(), //'SK',
        // created: yup.string(), // '2021-02-15T10:30:01.210Z',
        // groups_max_power: yup.number(), // 76/NaN
        id: yup.number(), // 25,
        name: yup.string(), // 'ZSE BA Rezident Bagarova',
        // number_of_parking_spaces: yup.number(), // 3/NaN
        // number_parallel_charging_vehicles: yup.number(), //6,
        opening_times: yup.string().nullable(), //'24/7',
        reserved_capacity: yup.string().nullable(), //null,
      })
    ),
})
