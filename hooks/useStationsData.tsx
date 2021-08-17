import _ from 'lodash'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

import {
  apiRekolaStationInformation,
  apiRekolaStationStatus,
} from '../utils/validation'

interface StationDataProps {
  stationInformationQueryKey: string
  getStationInformation: () => void
  stationStatusQueryKey: string
  getStationStatus: () => void
}

export default function UseStationsData({
  stationInformationQueryKey,
  getStationInformation,
  stationStatusQueryKey,
  getStationStatus,
}: StationDataProps) {
  // TODO handle loading / error
  const {
    data: dataStationInformation,
    isLoading: isLoadingStationInformation,
  } = useQuery(stationInformationQueryKey, getStationInformation)

  const { data: dataStationStatus, isLoading: isLoadingStationStatus } =
    useQuery(stationStatusQueryKey, getStationStatus, {
      enabled: !!dataStationInformation,
    })

  const validatedRekola = useMemo(() => {
    const validatedStationInformation =
      apiRekolaStationInformation.validateSync(dataStationInformation).data
        .stations
    const validatedStatus =
      apiRekolaStationStatus.validateSync(dataStationStatus).data.stations || []

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
  }, [dataStationStatus, dataStationInformation])

  return {
    dataMerged: validatedRekola,
    isLoading: isLoadingStationInformation || isLoadingStationStatus,
  }
}
