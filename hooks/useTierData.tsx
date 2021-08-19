import _ from 'lodash'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { getTierFreeBikeStatus } from '../utils/api'
import { apiFreeBikeStatus } from '../utils/validation'

export default function useTierData() {
  const [validationErrors, setValidationErrors] = useState()
  const { data, isLoading, error } = useQuery(
    'getTierFreeBikeStatus',
    getTierFreeBikeStatus
  )

  const validatedTier = useMemo(() => {
    try {
      const validatedStationInformation =
        apiFreeBikeStatus.validateSync(data).data.bikes
      return validatedStationInformation
    } catch (e) {
      setValidationErrors(e.errors)
      console.log(e)
    }
  }, [data])

  return {
    data: validatedTier,
    isLoading: isLoading,
    errors: error || validationErrors,
  }
}
