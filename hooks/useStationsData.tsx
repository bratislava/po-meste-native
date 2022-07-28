import { getCachedStops, setCachedStops } from '@utils/utils'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { useNetInfo } from '@react-native-community/netinfo'
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

export default function useStationsData({
  stationInformationQueryKey,
  getStationInformation,
  stationStatusQueryKey,
  getStationStatus,
}: StationDataProps) {
  const netInfo = useNetInfo()
  const isConnected = netInfo.isConnected ?? false
  const [validationErrors, setValidationErrors] = useState()
  const {
    data: dataStationInformation,
    isLoading: isLoadingStationInformation,
    error: errorStationInformation,
    refetch: refetchStationInformation,
  } = useQuery(stationInformationQueryKey, getStationInformation, {
    enabled: isConnected,
  })

  const {
    data: dataStationStatus,
    isLoading: isLoadingStationStatus,
    error: errorStationStatus,
    refetch: refetchStationStatus,
  } = useQuery(stationStatusQueryKey, getStationStatus, {
    enabled: isConnected,
  })

  const providerIndex = stationInformationQueryKey.slice(3, -18).toLowerCase()

  const { data: cachedStationData } = useQuery(providerIndex, () =>
    getCachedStops(providerIndex)
  )

  const validatedData = useMemo(() => {
    if (dataStationStatus == null || dataStationInformation == null)
      return cachedStationData
    try {
      const validatedStationInformation =
        apiRekolaStationInformation.validateSync(dataStationInformation).data
          .stations

      const validatedStationStatus =
        apiRekolaStationStatus.validateSync(dataStationStatus).data.stations

      if (validatedStationInformation && validatedStationStatus) {
        const merged = validatedStationStatus.map((stationStatus) => {
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
        setCachedStops(providerIndex, JSON.stringify(merged))
        return merged
      }
    } catch (e: any) {
      setValidationErrors(e.errors)
      console.log(e)
    }
  }, [dataStationStatus, dataStationInformation, cachedStationData])

  return {
    data: validatedData,
    isLoading: isLoadingStationInformation || isLoadingStationStatus,
    error: errorStationInformation || errorStationStatus || validationErrors,
    refetch: () => {
      if (isConnected) {
        refetchStationInformation()
        refetchStationStatus()
      }
    },
  }
}
