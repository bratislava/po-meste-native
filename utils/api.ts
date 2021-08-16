import Constants from 'expo-constants'

const host =
  Constants.manifest?.extra?.host || 'https://api.planner.bratislava.sk'
const liveplannerHost =
  Constants.manifest?.extra?.apiBikeHost || 'https://live.planner.bratislava.sk'

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

// helper with a common fetch pattern for json endpoints & baked in host
const fetchJsonFromLivePlanner = async (
  path: string,
  options?: RequestInit
) => {
  const response = await fetch(`${liveplannerHost}${path}`, options)
  if (response.ok) {
    return response.json()
  } else {
    throw new ApiError(response)
  }
}

export const getMhdStops = () =>
  fetchJsonFromApi('/otp/routers/default/index/stops')
export const getRekolaStationInformation = () =>
  fetchJsonFromLivePlanner('/rekola/station_information.json')
export const getRekolaStationStatus = () =>
  fetchJsonFromLivePlanner('/rekola/station_status.json')
export const getSlovnaftBikeStopsStationInformation = () =>
  fetchJsonFromLivePlanner('/rekola/station_information.json')
export const getSlovnaftBikeStopsStationStatus = () =>
  fetchJsonFromLivePlanner('/rekola/station_status.json')
