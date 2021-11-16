import Constants from 'expo-constants'
import qs from 'qs'
import { apiMhdGrafikon, apiOtpPlanner } from './validation'
import { MicromobilityProvider, TravelModesOtpApi } from '../types'

const host =
  Constants.manifest?.extra?.apiHost || 'https://live-dev.planner.bratislava.sk'
const otpPlanner = 'https://api.planner.bratislava.sk/otp/routers/default/plan' // TODO use otp.planner.bratislava.sk
const otpRekolaPlanner =
  'https://rekola.planner.bratislava.sk/routers/default/plan'
const otpSlovnaftbajkPlanner =
  'https://slovnaftbajk.planner.bratislava.sk/routers/default/plan'
const otpTierPlanner = 'https://tier.planner.bratislava.sk/routers/default/plan'

// we should throw throwables only, so it's useful to extend Error class to contain useful info
export class ApiError extends Error {
  status: number
  response: Response
  constructor(response: Response) {
    super(response.statusText)
    this.status = response.status
    this.response = response
    this.name = 'ApiError'
  }
}

// helper with a common fetch pattern for json endpoints & baked in host
const fetchJsonFromApi = async (path: string, options?: RequestInit) => {
  const response = await fetch(`${host}${path}`, options)
  if (response.ok) {
    return response.json()
  } else {
    throw new ApiError(response)
  }
}

const fetchJsonFromOtpApi = async (plannerAddress: string, path: string) => {
  const response = await fetch(`${plannerAddress}${path}`)
  if (response.ok) {
    return response.json()
  } else {
    throw new ApiError(response)
  }
}

export const getMhdStops = () => fetchJsonFromApi('/mhd/stops')
export const getMhdStopStatusData = (id: string) =>
  fetchJsonFromApi(`/mhd/stop/${id}`)

export const getMhdTrip = (id: string) => fetchJsonFromApi(`/mhd/trip/${id}`)

// TODO do every query like they do it on Discovery channel, sorry, like this, validate immediately
export const getMhdGrafikon = async (stopId: string, lineNumber: string) =>
  apiMhdGrafikon.validateSync(
    await fetchJsonFromApi(`/mhd/stop/${stopId}/grafikon/${lineNumber}`)
  )

export const getMhdGrafikonn = (stopId: string, lineNumber: string) =>
  fetchJsonFromApi(`/mhd/stop/${stopId}/grafikon/${lineNumber}`)

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

export const getChargersStops = () => fetchJsonFromApi('/zse')

export const getTripPlanner = async (
  from: string,
  to: string,
  dateTime: Date,
  mode: TravelModesOtpApi = TravelModesOtpApi.transit,
  plannerApi?: MicromobilityProvider
) => {
  const adjustedDate = new Date(dateTime.getTime())
  if (
    plannerApi === MicromobilityProvider.rekola ||
    plannerApi == MicromobilityProvider.tier
  ) {
    adjustedDate.setHours(adjustedDate.getHours() + 20) // TODO erase when https://inovaciebratislava.atlassian.net/browse/PLAN-268 solved
  }

  const data = qs.stringify(
    {
      fromPlace: from,
      toPlace: to,
      time: adjustedDate.toISOString(),
      mode: mode,
      maxWalkDistance: '4828.032',
      arriveBy: 'false',
      wheelchair: 'false',
      debugItineraryFilter: 'false',
      locale: 'en',
    },
    { addQueryPrefix: true }
  )
  switch (plannerApi) {
    case MicromobilityProvider.rekola:
      return apiOtpPlanner.validateSync(
        await fetchJsonFromOtpApi(otpRekolaPlanner, data)
      )
    case MicromobilityProvider.slovnaftbajk:
      return apiOtpPlanner.validateSync(
        await fetchJsonFromOtpApi(otpSlovnaftbajkPlanner, data)
      )
    case MicromobilityProvider.tier:
      return apiOtpPlanner.validateSync(
        await fetchJsonFromOtpApi(otpTierPlanner, data)
      )
    default:
      return apiOtpPlanner.validateSync(
        await fetchJsonFromOtpApi(otpPlanner, data)
      )
  }
}
