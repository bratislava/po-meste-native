import {
  getSlovnaftbajkStationInformation,
  getSlovnaftbajkStationStatus,
} from '../utils/api'

import useStationData from './useStationsData'

export default function useSlovnaftbajkData() {
  const { data, isLoading, error } = useStationData({
    stationInformationQueryKey: 'getSlovnaftbajkStationInformation',
    getStationInformation: getSlovnaftbajkStationInformation,
    stationStatusQueryKey: 'getSlovnaftbajkStationStatus',
    getStationStatus: getSlovnaftbajkStationStatus,
  })

  return {
    data,
    isLoading,
    error,
  }
}