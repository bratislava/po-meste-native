import * as yup from 'yup'
import {
  ChargerStatus,
  ChargerTypes,
  LegModes,
  TransitVehicleType,
} from '@types'
import { colorRegex, dateStringRegex, timeStringRegex } from './utils'

export const mhdStop = yup
  .object()
  .shape({
    id: yup.string().required('error-malformed-stationStopId'),
    name: yup.string().required('error-malformed-name'),
    gpsLon: yup.string().required('error-malformed-gpsLon'),
    gpsLat: yup.string().required('error-malformed-gpsLat'),
    platform: yup.string().nullable(),
  })
  .noUnknown()

export type MhdStopProps = yup.Asserts<typeof mhdStop>
export const apiMhdStops = yup
  .object()
  .shape({ stops: yup.array().ensure().of(mhdStop) })

const stationInformationObject = {
  station_id: yup.string().required('error-malformed-station_id'),
  name: yup.string(),
  lat: yup.number(),
  lon: yup.number(),
  is_virtual_station: yup.boolean(),
}

export const stationInformationSchema = yup
  .object()
  .shape(stationInformationObject)
  .noUnknown()

export const apiRekolaStationInformation = yup.object().shape({
  data: yup.object().shape({
    stations: yup.array().ensure().of(stationInformationSchema),
  }),
})

const stationStatusObject = {
  station_id: yup.string().required('error-malformed-station_id'),
  num_bikes_available: yup
    .number()
    .required('error-malformed-num_bikes_available'),
  num_docks_available: yup.number(),
  is_installed: yup.number().required('error-malformed-is_installed'),
  is_renting: yup.number().required('error-malformed-is_renting'),
  is_returning: yup.number().required('error-malformed-is_returning'),
  last_reported: yup.string().required('error-malformed-last_reported'),
}

export const stationStatusSchema = yup
  .object()
  .shape(stationStatusObject)
  .noUnknown()

export const StationSchema = yup
  .object()
  .shape({ ...stationStatusObject, ...stationInformationObject })
  .noUnknown()

export type StationMicromobilityProps = yup.Asserts<typeof StationSchema>

export const apiRekolaStationStatus = yup.object().shape({
  data: yup.object().shape({
    stations: yup.array().ensure().of(StationSchema),
  }),
})

export type FreeBikeStatusProps = yup.Asserts<typeof freeBikeStatusSchema>

export const freeBikeStatusSchema = yup.object().shape({
  bike_id: yup.string().required('error-malformed-bike_id'),
  lat: yup.number().required('error-malformed-lat'),
  lon: yup.number().required('error-malformed-lon'),
  is_reserved: yup.boolean().required('error-malformed-is_reserved'),
  is_disabled: yup.boolean().required('error-malformed-is_disabled'),
  last_reported: yup.string().required('error-malformed-last_reported'),
  // TODO erase when not needed
  original: yup.object().shape({
    attributes: yup.object().shape({
      batteryLevel: yup
        .number()
        .required('error-malformed-freeBikeStatusSchema-batteryLevel'), // 65,
      code: yup.number().required('error-malformed-freeBikeStatusSchema-code'), // 238289,
      hasHelmet: yup
        .boolean()
        .required('error-malformed-freeBikeStatusSchema-hasHelmet'), // false,
      hasHelmetBox: yup
        .boolean()
        .required('error-malformed-freeBikeStatusSchema-hasHelmetBox'), // false,
      iotVendor: yup
        .string()
        .required('error-malformed-freeBikeStatusSchema-iotVendor'), // 'okai',
      isRentable: yup
        .boolean()
        .required('error-malformed-freeBikeStatusSchema-isRentable'), // true,
      lastLocationUpdate: yup
        .string()
        .required('error-malformed-freeBikeStatusSchema-lastLocationUpdate'), // '2021-11-08T14:58:42Z', verificate if needed
      lastStateChange: yup
        .string()
        .required('error-malformed-freeBikeStatusSchema-lastStateChange'), //'2021-11-02T00:38:40Z', verificate if needed
      lat: yup.number().required('error-malformed-freeBikeStatusSchema-lat'), //48.157839,
      licencePlate: yup
        .string()
        .required('error-malformed-freeBikeStatusSchema-licencePlate'), //'181WSF',
      lng: yup.number().required('error-malformed-freeBikeStatusSchema-lng'), //17.130128,
      maxSpeed: yup
        .number()
        .required('error-malformed-freeBikeStatusSchema-maxSpeed'), //25,
      state: yup
        .string()
        .required('error-malformed-freeBikeStatusSchema-state'), //'ACTIVE',
      vehicleType: yup
        .string()
        .required('error-malformed-freeBikeStatusSchema-vehicleType'), //'escooter',
      zoneId: yup
        .string()
        .required('error-malformed-freeBikeStatusSchema-zoneId'), //'BRATISLAVA',
    }),
  }),
})

export const apiFreeBikeStatus = yup.object().shape({
  data: yup.object().shape({
    bikes: yup.array().ensure().of(freeBikeStatusSchema),
  }),
})

const leg = yup.object().shape({
  startTime: yup.string(), //'1629715140000',
  endTime: yup.number(), //1629715287000,
  departureDelay: yup.number(), //0,
  arrivalDelay: yup.number(), //0,
  realTime: yup.bool(), //false,
  distance: yup.number(), //581.766,
  pathway: yup.bool(), //false,
  mode: yup
    .mixed<LegModes>()
    .oneOf(Object.values(LegModes))
    .required('error-malformed-mode'),
  duration: yup.number().required('error-malformed-duration'),
  transitLeg: yup.bool(), //false,
  route: yup.string(), //'',
  agencyTimeZoneOffset: yup.number(), //7200000,
  interlineWithPreviousLeg: yup.bool(), //false,
  routeShortName: yup.string(), //'96'
  routeColor: yup.string(), //'E5097F'
  headsign: yup.string(), //Holíčska
  from: yup.object().shape({
    name: yup.string(), //'Origin',
    lon: yup.number(), //17.114381790161133,
    lat: yup.number(), //48.11598432875021,
    departure: yup.number(), //1629715140000,
    vertexType: yup.string(), //'NORMAL',
    arrival: yup.number(), //1635150900000,
    platformCode: yup.string(), //'87',
    stopCode: yup.string(), //'87',
    stopId: yup.string(), //'1:000000008700002',
    stopIndex: yup.number(), //18,
    zoneId: yup.string(), //'100',
  }),
  to: yup.object().shape({
    name: yup.string(), //"corner of sidewalk and service road",
    lon: yup.number(), //17.1122924,
    lat: yup.number(), //48.118943900000005,
    arrival: yup.number(), //1629715287000,
    departure: yup.number(), //1629715287000,
    vertexType: yup.string(), //"NORMAL"
    platformCode: yup.string(), //'87',
    stopCode: yup.string(), //'87',
    stopId: yup.string(), //'1:000000008700002',
    stopIndex: yup.number(), //18,
    zoneId: yup.string(), //'100',
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
  tripId: yup.string(), // "1:3008_02_585_1496",
})

export type LegProps = yup.TypeOf<typeof leg>

export type OtpPlannerProps = yup.Asserts<typeof apiOtpPlanner>

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
          duration: yup.number().required('error-malformed-duration'), // 3991
          startTime: yup.number().required('error-malformed-startTime'), // 1635431403000
          endTime: yup.number().required('error-malformed-endTime'),
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

export type ConnectorProps = yup.Asserts<typeof connectors>
const connectors = yup.object().shape({
  id: yup.number(), // 147118,
  pricing: yup.object().shape({
    charging_price: yup.string().nullable(), // '0.29 €/kWh',
    free_parking_time: yup.string().nullable(), // '720 min',
    parking_price: yup.string(), // '3 €/h',
  }),
  status: yup.mixed<ChargerStatus>().oneOf(Object.values(ChargerStatus)), //'AVAILABLE', 'BUSY', 'DISCONNECTED'
  type: yup.mixed<ChargerTypes>().oneOf(Object.values(ChargerTypes)), //'Mennekes Type 2',
})

export const chargerStation = yup.object().shape({
  // additional_info: yup.string().nullable(), //'6x AC socket (DLM)',
  // address: yup.string(), //'Dúbravka, Bagarova',
  // city: yup.string().nullable(), //'Bratislava',
  connectors: yup.array().ensure().of(connectors),
  coordinates: yup.object().shape({
    latitude: yup.number().nullable(), // 48.181295,
    longitude: yup.number().nullable(), // 17.043218,
  }),
  // country_code: yup.string(), //'SK',
  // created: yup.string(), // '2021-02-15T10:30:01.210Z',
  // groups_max_power: yup.number(), // 76/NaN
  id: yup.number(), // 25,
  name: yup.string(), // 'ZSE BA Rezident Bagarova',
  number_of_parking_spaces: yup.number().nullable(), // 3
  // number_parallel_charging_vehicles: yup.number(), //6,
  opening_times: yup.string().nullable(), //'24/7',
  reserved_capacity: yup.string().nullable(), //null,
})

export type ChargerStationProps = yup.Asserts<typeof chargerStation>

const localities = yup.array().ensure().of(chargerStation)

export const apiZseChargers = yup.object().shape({
  localities: localities,
})

export type LocalitiesProps = yup.Asserts<typeof localities>

export const apiMhdStopStatus = yup.object().shape({
  allLines: yup
    .array()
    .ensure()
    .of(
      yup.object().shape({
        vehicleType: yup
          .mixed<TransitVehicleType>()
          .oneOf(Object.values(TransitVehicleType)),
        lineNumber: yup.string().required('error-lineNumber'),
        lineColor: yup
          .string()
          .matches(colorRegex, {
            message: 'error-allLines-lineColor-wrong-format',
            excludeEmptyStrings: true,
          })
          .required('error-allLines-lineColor'),
        usualFinalStop: yup.string(),
      })
    ),
  currentStop: yup.object().shape({
    stop_name: yup.string(),
  }),
  departures: yup
    .array()
    .ensure()
    .of(
      yup.object().shape({
        date: yup
          .string()
          .matches(dateStringRegex, {
            message: 'error-malformed-apiMhdGrafikon-date-wrong-format',
            excludeEmptyStrings: true,
          })
          .required('error-departures-date'),
        time: yup
          .string()
          .matches(timeStringRegex, {
            message: 'error-malformed-apiMhdGrafikon-time-wrong-format',
            excludeEmptyStrings: true,
          })
          .required('error-departures-time'),
        lineNumber: yup.string().required('error-departures-lineNumber'),
        lineColor: yup
          .string()
          .matches(colorRegex, {
            message: 'error-malformed-departures-lineColor-wrong-format',
            excludeEmptyStrings: true,
          })
          .required('error-departures-lineColor'),
        tripId: yup.string().required('error-departures-tripId'),
        finalStopName: yup.string().required('error-departures-finalStopName'),
        wheelchair: yup.bool().required('error-departures-wheelchair'),
        vehicleType: yup
          .mixed<TransitVehicleType>()
          .oneOf(Object.values(TransitVehicleType)), // TODO this is dangerous because when something unexpected comes like number 20 all data is considered unvalidated
        delay: yup.number().nullable(), //39,
        isLive: yup.boolean(), //true
      })
    ),
})

export const apiMhdTrip = yup.object().shape({
  lineNumber: yup.string(),
  // .required('error-malformed-apiMhdTrip-lineNumber'),
  finalStopName: yup.string(),
  // .required('error-malformed-apiMhdTrip-finalStopName'),
  lineColor: yup.string().matches(colorRegex, {
    message: 'error-malformed-apiMhdTrip-lineColor-wrong-format',
    excludeEmptyStrings: true,
  }),
  // .required('error-malformed-apiMhdTrip-lineColor'),
  timeline: yup
    .array()
    .ensure()
    .of(
      yup.object().shape({
        time: yup
          .string()
          .matches(timeStringRegex, {
            message: 'error-malformed-apiMhdTrip-timeline-time-wrong-format',
            excludeEmptyStrings: true,
          })
          .required('error-malformed-apiMhdTrip-time'),
        stopName: yup.string().required('error-malformed-apiMhdTrip-stopName'),
        stopId: yup.string().required('error-malformed-apiMhdTrip-stopId'),
      })
    ),
})

export const apiMhdGrafikon = yup.object().shape({
  lineNumber: yup.string(),
  // .required('error-malformed-apiMhdGrafikon-lineNumber'),
  currentStopName: yup.string(),
  // .required('error-malformed-apiMhdGrafikon-currentStopName'),
  finalStopName: yup.string(),
  // .required('error-malformed-apiMhdGrafikon-finalStopName'),
  lineColor: yup.string().matches(colorRegex, {
    message: 'error-malformed-apiMhdGrafikon-lineColor-wrong-format',
    excludeEmptyStrings: true,
  }),
  // .required('error-malformed-apiMhdGrafikon-lineColor'),
  timetable: yup
    .array()
    .ensure()
    .of(
      yup
        .string()
        .matches(timeStringRegex, {
          message: 'error-malformed-apiMhdGrafikon-time-wrong-format',
          excludeEmptyStrings: true,
        })
        .required('error-malformed-apiMhdGrafikon-time')
    ),
})
