import Constants from 'expo-constants'
import qs from 'qs'

const host =
  Constants.manifest?.extra?.host || 'https://live.planner.bratislava.sk'
// TODO change otpPlanner url from 'api.planner' to 'live.planner' when endpoint is available
const otpPlanner = 'https://api.planner.bratislava.sk/otp/routers/default/plan'

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

const fetchJsonFromOtpApi = async (path: string) => {
  const response = await fetch(`${otpPlanner}${path}`)
  if (response.ok) {
    return response.json()
  } else {
    throw new ApiError(response)
  }
}

export const getMhdStops = () => fetchJsonFromApi('/mhd/stops')
export const getMhdStopStatusData = (id: number) =>
  fetchJsonFromApi(`/mhd/stop/${id}`)

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
export const getTripPlanner = (
  from: string,
  to: string,
  dateTime: Date = new Date()
) => {
  return fetchJsonFromOtpApi(
    qs.stringify(
      {
        fromPlace: from,
        toPlace: to,
        time: dateTime.toISOString(),
        mode: 'BUS,WALK',
        maxWalkDistance: '4828.032',
        arriveBy: 'false',
        wheelchair: 'false',
        debugItineraryFilter: 'false',
        locale: 'en',
      },
      { addQueryPrefix: true }
    )
  )
}
