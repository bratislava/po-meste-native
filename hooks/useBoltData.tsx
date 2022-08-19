import { useNetInfo } from '@react-native-community/netinfo'
import { getBoltFreeBikeStatus } from '@utils/api'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { apiFreeBikeStatusBolt } from '../utils/validation'

export default function useBoltData() {
  const netInfo = useNetInfo()
  const [validationErrors, setValidationErrors] = useState()
  const { data, isLoading, error, refetch } = useQuery(
    'getBoltFreeBikeStatus',
    getBoltFreeBikeStatus,
    { enabled: netInfo.isConnected ?? false }
  )

  const validatedBolt = useMemo(() => {
    if (data) {
      try {
        const validatedStationInformation =
          apiFreeBikeStatusBolt.validateSync(data).data.bikes
        return validatedStationInformation
      } catch (e: any) {
        setValidationErrors(e.errors)
        console.log(e)
      }
    }
  }, [data])

  return {
    data: validatedBolt,
    isLoading: isLoading,
    errors: error || validationErrors,
    refetch: () => (netInfo.isConnected ? refetch() : null),
  }
}
