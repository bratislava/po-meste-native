import {
  getSlovnaftbajkStationInformation,
  getSlovnaftbajkStationStatus,
} from '../utils/api'

import useStationData from './useStationsData'

export default function UseSlovnaftbajkData() {
  // TODO handle loading / error
  const { dataMerged, isLoading } = useStationData({
    stationInformationQueryKey: 'getSlovnaftbajkStationInformation',
    getStationInformation: getSlovnaftbajkStationInformation,
    stationStatusQueryKey: 'getSlovnaftbajkStationStatus',
    getStationStatus: getSlovnaftbajkStationStatus,
  })

  return {
    dataMerged,
    isLoading,
  }
}
