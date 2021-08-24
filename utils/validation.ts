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

const leg = yup.object().shape({
  startTime: yup.string(), //1629715140000,
  endTime: yup.number(), //1629715287000,
  departureDelay: yup.number(), //0,
  arrivalDelay: yup.number(), //0,
  realTime: yup.bool(), //false,
  distance: yup.number(), //581.766,
  pathway: yup.bool(), //false,
  mode: yup.string().required('error-malformed'),
  duration: yup.number().required('error-malformed'),
  transitLeg: yup.bool(), //false,
  route: yup.string(), //'',
  agencyTimeZoneOffset: yup.number(), //7200000,
  interlineWithPreviousLeg: yup.bool(), //false,
  from: yup.object().shape({
    name: yup.string(), //'Origin',
    lon: yup.number(), //17.114381790161133,
    lat: yup.number(), //48.11598432875021,
    departure: yup.number(), //1629715140000,
    vertexType: yup.string(), //'NORMAL',
  }),
  to: yup.object().shape({
    name: yup.string(), //"corner of sidewalk and service road",
    lon: yup.number(), //17.1122924,
    lat: yup.number(), //48.118943900000005,
    arrival: yup.number(), //1629715287000,
    departure: yup.number(), //1629715287000,
    vertexType: yup.string(), //"NORMAL"
  }),
  legGeometry: yup.object().shape({
    points: yup.string(), //"ystdH{smgBByA?I@q@IAG??Q?SAICGCCEAYAc@AUAMDUNGDEDQLiAv@qBvABP[AEBg@?KNEVCbCG~EOAs@?_@A?b@YA",
    length: yup.number(), //35
  }),
  steps: yup
    .array()
    .ensure()
    .of(
      yup.object().shape({
        distance: yup.number(), //326.82599999999996,
        relativeDirection: yup.string(), //"DEPART",
        streetName: yup.string(), //"path",
        absoluteDirection: yup.string(), //"EAST",
        stayOn: yup.bool(), //false,
        area: yup.bool(), //false,
        bogusName: yup.bool(), //false,
        lon: yup.number(), //17.114380723574783,
        lat: yup.number(), //48.11597108360832,
        elevation: yup.string(), //""
      })
    ),
  rentedBike: yup.bool(), //false,
})

export type LegProps = yup.TypeOf<typeof leg>

export const apiOtpPlanner = yup.object().shape({
  requestParameters: yup.object().shape({
    date: yup.string(), // "08-23-2021"
    wheelchair: yup.bool(), // 'false'
    triangleTimeFactor: yup.number(), // '1'
    fromPlace: yup.string(), // '48.11598432875021,17.114381790161133'
    maxWalkDistance: yup.string(), //'4828.032'
    locale: yup.string(), //'en'
    triangleSlopeFactor: yup.string(), //'0'
    mode: yup.string(), //'BICYCLE'
    arriveBy: yup.string(), //'false'
    debugItineraryFilter: yup.string(), //'false'
    optimize: yup.string(), //'TRIANGLE'
    toPlace: yup.string(), //'48.154162386386886,17.122664451599118'
    time: yup.string(), //'12:39pm',
    triangleSafetyFactor: yup.string(), //'0',
  }),
  plan: yup.object().shape({
    date: yup.number(), //1629715140000,
    from: yup.object().shape({
      name: yup.string(), //"Origin",
      lon: yup.number(), //17.114381790161133,
      lat: yup.number(), //48.11598432875021,
      vertexType: yup.string(), //"NORMAL"
    }),
    to: yup.object().shape({
      name: yup.string(), //"Destination",
      lon: yup.number(), //17.122664451599118,
      lat: yup.number(), //48.154162386386886,
      vertexType: yup.string(), //"NORMAL"
    }),
    itineraries: yup
      .array()
      .ensure()
      .of(
        yup.object().shape({
          duration: yup.number().required('error-malformed'),
          startTime: yup.number().required('error-malformed'),
          endTime: yup.number().required('error-malformed'),
          walkTime: yup.number(), //1240,
          transitTime: yup.number(), //0,
          waitingTime: yup.number(), //0,
          walkDistance: yup.number(), //5161.642999999999,
          walkLimitExceeded: yup.bool(), //true,
          elevationLost: yup.number(), //0.0,
          elevationGained: yup.number(), //0.0,
          transfers: yup.number(), //0,
          fare: yup.object().shape({
            fare: yup.object().shape({}),
            details: yup.object().shape({}),
          }),
          legs: yup.array().ensure().of(leg),
        })
      ),
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

export const apiOtpPlanner = yup.object().shape({
  requestParameters: yup.object().shape({
    date: yup.string(), // "08-23-2021"
    wheelchair: yup.bool(), // 'false'
    triangleTimeFactor: yup.number(), // '1'
    fromPlace: yup.string(), // '48.11598432875021,17.114381790161133'
    maxWalkDistance: yup.string(), //'4828.032'
    locale: yup.string(), //'en'
    triangleSlopeFactor: yup.string(), //'0'
    mode: yup.string(), //'BICYCLE'
    arriveBy: yup.string(), //'false'
    debugItineraryFilter: yup.string(), //'false'
    optimize: yup.string(), //'TRIANGLE'
    toPlace: yup.string(), //'48.154162386386886,17.122664451599118'
    time: yup.string(), //'12:39pm',
    triangleSafetyFactor: yup.string(), //'0',
  }),
  plan: yup.object().shape({
    date: yup.number(), //1629715140000,
    from: yup.object().shape({
      name: yup.string(), //"Origin",
      lon: yup.number(), //17.114381790161133,
      lat: yup.number(), //48.11598432875021,
      vertexType: yup.string(), //"NORMAL"
    }),
    to: yup.object().shape({
      name: yup.string(), //"Destination",
      lon: yup.number(), //17.122664451599118,
      lat: yup.number(), //48.154162386386886,
      vertexType: yup.string(), //"NORMAL"
    }),
    itineraries: yup
      .array()
      .ensure()
      .of(
        yup.object().shape({
          duration: yup.number().required('error-malformed'),
          startTime: yup.number().required('error-malformed'),
          endTime: yup.number().required('error-malformed'),
          walkTime: yup.number(), //1240,
          transitTime: yup.number(), //0,
          waitingTime: yup.number(), //0,
          walkDistance: yup.number(), //5161.642999999999,
          walkLimitExceeded: yup.bool(), //true,
          elevationLost: yup.number(), //0.0,
          elevationGained: yup.number(), //0.0,
          transfers: yup.number(), //0,
          fare: yup.object().shape({
            fare: yup.object().shape({}),
            details: yup.object().shape({}),
          }),
          legs: yup
            .array()
            .ensure()
            .of(
              yup.object().shape({
                startTime: yup.string(), //1629715140000,
                endTime: yup.number(), //1629715287000,
                departureDelay: yup.number(), //0,
                arrivalDelay: yup.number(), //0,
                realTime: yup.bool(), //false,
                distance: yup.number(), //581.766,
                pathway: yup.bool(), //false,
                mode: yup.string().required('error-malformed'),
                duration: yup.number().required('error-malformed'),
                transitLeg: yup.bool(), //false,
                route: yup.string(), //'',
                agencyTimeZoneOffset: yup.number(), //7200000,
                interlineWithPreviousLeg: yup.bool(), //false,
                from: yup.object().shape({
                  name: yup.string(), //'Origin',
                  lon: yup.number(), //17.114381790161133,
                  lat: yup.number(), //48.11598432875021,
                  departure: yup.number(), //1629715140000,
                  vertexType: yup.string(), //'NORMAL',
                }),
                to: yup.object().shape({
                  name: yup.string(), //"corner of sidewalk and service road",
                  lon: yup.number(), //17.1122924,
                  lat: yup.number(), //48.118943900000005,
                  arrival: yup.number(), //1629715287000,
                  departure: yup.number(), //1629715287000,
                  vertexType: yup.string(), //"NORMAL"
                }),
                legGeometry: yup.object().shape({
                  points: yup.string(), //"ystdH{smgBByA?I@q@IAG??Q?SAICGCCEAYAc@AUAMDUNGDEDQLiAv@qBvABP[AEBg@?KNEVCbCG~EOAs@?_@A?b@YA",
                  length: yup.number(), //35
                }),
                steps: yup
                  .array()
                  .ensure()
                  .of(
                    yup.object().shape({
                      distance: yup.number(), //326.82599999999996,
                      relativeDirection: yup.string(), //"DEPART",
                      streetName: yup.string(), //"path",
                      absoluteDirection: yup.string(), //"EAST",
                      stayOn: yup.bool(), //false,
                      area: yup.bool(), //false,
                      bogusName: yup.bool(), //false,
                      lon: yup.number(), //17.114380723574783,
                      lat: yup.number(), //48.11597108360832,
                      elevation: yup.string(), //""
                    })
                  ),
                rentedBike: yup.bool(), //false,
              })
            ),
        })
      ),
  }),
})
