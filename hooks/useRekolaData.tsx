import {
  getRekolaStationInformation,
  getRekolaStationStatus,
} from '../utils/api'

import useStationData from './useStationsData'

export default function UseRekolaData() {
  // TODO handle loading / error
  const { dataMerged, isLoading } = useStationData({
    stationInformationQueryKey: 'getRekolaStationInformation',
    getStationInformation: getRekolaStationInformation,
    stationStatusQueryKey: 'getRekolaStationStatus',
    getStationStatus: getRekolaStationStatus,
  })

  return {
    dataMerged,
    isLoading,
  }
}
