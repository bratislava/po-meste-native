import {
  getRekolaStationInformation,
  getRekolaStationStatus,
} from '../utils/api'

import useStationData from './useStationsData'

export default function useRekolaData() {
  const { data, isLoading, error } = useStationData({
    stationInformationQueryKey: 'getRekolaStationInformation',
    getStationInformation: getRekolaStationInformation,
    stationStatusQueryKey: 'getRekolaStationStatus',
    getStationStatus: getRekolaStationStatus,
  })

  return {
    data,
    isLoading,
    error,
  }
}
