import {
  DateTimeFormatter,
  LocalDate,
  LocalDateTime,
  ZonedDateTime,
  ZoneId,
} from '@js-joda/core'
import '@js-joda/timezone'
import * as Sentry from '@sentry/react-native'
import { MicromobilityProvider, TravelModesOtpApi } from '@types'
import Constants from 'expo-constants'
import qs from 'qs'
import { API_ERROR_TEXT } from './constants'
import {
  apiMhdGrafikon,
  apiMhdStopStatus,
  apiMhdTrip,
  apiOtpPlanner,
} from './validation'

const host = 'planner.bratislava.sk'
const dataHostUrl = Constants.manifest?.extra?.apiHost || `https://live.${host}`
const otpPlannerUrl = `https://api.${host}/otp/routers/default/plan` // TODO use otp.planner.bratislava.sk
const otpRekolaPlannerUrl = `https://rekola.${host}/routers/default/plan`
const otpSlovnaftbajkPlannerUrl = `https://slovnaftbajk.${host}/routers/default/plan`
const otpTierPlannerUrl = `https://tier.${host}/routers/default/plan`

// we should throw throwables only, so it's useful to extend Error class to contain useful info
// export class ApiError extends Error {
//   // status: number
//   // response: Response
//   constructor(response: Response) {
//     super('No status text') // TODO response.statusText returns null which throw nasty error
//     // this.status = response.status || 0
//     // this.response = response
//     this.name = 'ApiError'
//   }
// }

const formatTimestamp = (date: Date) => {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  return `${hours < 10 ? '0' + hours : hours}:${
    minutes < 10 ? '0' + minutes : minutes
  }:${seconds < 10 ? '0' + seconds : seconds}`
}

// helper with a common fetch pattern for json endpoints & baked in host
const fetchJsonFromApi = async (path: string, options?: RequestInit) => {
  // leaving this console.log here because it is very important to keep track of fetches
  console.log(
    '%s\x1b[95m%s\x1b[0m',
    `[${formatTimestamp(new Date())}] `,
    `Fetching from '${path}'`
  )
  const response = await fetch(`${dataHostUrl}${path}`, options)
  if (response.ok) {
    return response.json()
  } else {
    Sentry.setExtra('responseManual', response)
    throw new Error(API_ERROR_TEXT)
  }
}

const fetchJsonFromOtpApi = async (plannerAddress: string, path: string) => {
  const response = await fetch(`${plannerAddress}${path}`)
  if (response.ok) {
    return response.json()
  } else {
    Sentry.setExtra('responseManual', response)
    throw new Error(API_ERROR_TEXT)
  }
}

//for testing purposes
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const getHealth = async () => {
  const health = await fetchJsonFromApi('/health')
  return health
}

export const getMhdStops = async () => {
  console.log('\x1b[92m%s\x1b[0m', 'fetching mhdStop data')
  return fetchJsonFromApi('/mhd/stops')
}
export const getMhdStopStatusData = async (id: string) =>
  apiMhdStopStatus.validateSync(await fetchJsonFromApi(`/mhd/stop/${id}`))

export const getMhdTrip = async (id: string) =>
  apiMhdTrip.validateSync(await fetchJsonFromApi(`/mhd/trip/${id}`))

// TODO do every query like they do it on Discovery channel, sorry, like this, validate immediately
export const getMhdGrafikon = async (
  stopId: string,
  lineNumber: string,
  date?: LocalDate
) => {
  let data = ''
  if (date) {
    data = qs.stringify(
      {
        date: date.format(DateTimeFormatter.ISO_LOCAL_DATE),
      },
      { addQueryPrefix: true }
    )
  }
  return apiMhdGrafikon.validateSync(
    await fetchJsonFromApi(`/mhd/stop/${stopId}/grafikon/${lineNumber}${data}`)
  )
}

export const getRekolaStationInformation = () =>
  fetchJsonFromApi('/rekola/station_information.json')
export const getRekolaStationStatus = () =>
  fetchJsonFromApi('/rekola/station_status.json')

export const getSlovnaftbajkStationInformation = () =>
  fetchJsonFromApi('/slovnaftbajk/station_information.json')
export const getSlovnaftbajkStationStatus = () =>
  fetchJsonFromApi('/slovnaftbajk/station_status.json')

export const getTierFreeBikeStatus = () =>
  fetchJsonFromApi('/tier/free_bike_status.json')

export const getChargersStops = async () => fetchJsonFromApi('/zse')

export const getTripPlanner = async (
  from: string,
  to: string,
  dateTime: LocalDateTime,
  arriveBy: boolean,
  mode: TravelModesOtpApi = TravelModesOtpApi.transit,
  plannerApi?: MicromobilityProvider
) => {
  const adjustedDateTime =
    plannerApi === MicromobilityProvider.rekola ||
    plannerApi == MicromobilityProvider.tier
      ? dateTime.plusHours(20) // TODO erase when https://inovaciebratislava.atlassian.net/browse/PLAN-268 solved
      : dateTime

  const zonedTime = ZonedDateTime.of(
    adjustedDateTime,
    ZoneId.of('Europe/Bratislava')
  )

  const data = qs.stringify(
    {
      fromPlace: from,
      toPlace: to,
      time: zonedTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME),
      mode: mode,
      maxWalkDistance: '4828.032',
      arriveBy: arriveBy,
      wheelchair: 'false',
      debugItineraryFilter: 'false',
      locale: 'en',
      allowedVehicleRentalNetworks: plannerApi?.toLowerCase(),
    },
    { addQueryPrefix: true }
  )
  return apiOtpPlanner.validateSync(
    await fetchJsonFromOtpApi(otpPlannerUrl, data)
  )
}
