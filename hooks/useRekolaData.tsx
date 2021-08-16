import _ from 'lodash'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import {
  getRekolaStationInformation,
  getRekolaStationStatus,
} from '../utils/api'
import {
  apiRekolaStationInformation,
  apiRekolaStationStatus,
} from '../utils/validation'

export default function UseRekolaData() {
  // TODO handle loading / error
  const {
    data: dataRekolaStationInformation,
    isLoading: isLoadingRekolaStationInformation,
  } = useQuery('getRekolaStationInformation', getRekolaStationInformation)

  const {
    data: dataRekolaStationStatus,
    isLoading: isLoadingRekolaStationStatus,
  } = useQuery('getRekolaStationStatus', getRekolaStationStatus, {
    enabled: !!dataRekolaStationInformation,
  })

  const validatedRekola = useMemo(() => {
    const validatedStationInformation =
      apiRekolaStationInformation.validateSync(dataRekolaStationInformation)
        .data.stations
    const validatedStatus =
      apiRekolaStationStatus.validateSync(dataRekolaStationStatus).data
        .stations || []

    if (validatedStationInformation && validatedStatus) {
      const merged = validatedStatus.map((stationStatus) => {
        const sameStationInformation = validatedStationInformation.find(
          (stationInformationTmp) =>
            stationInformationTmp.station_id === stationStatus.station_id
        )
        const mergedStation = {
          ...stationStatus,
          ...sameStationInformation,
        }
        return mergedStation
      })
      return merged
    }
  }, [dataRekolaStationStatus, dataRekolaStationInformation])

  return {
    dataMerged: validatedRekola,
    loading: isLoadingRekolaStationInformation || isLoadingRekolaStationStatus,
  }
}
