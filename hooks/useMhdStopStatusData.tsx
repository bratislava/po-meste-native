import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { getMhdStopStatusData } from '../utils/api'
import { apiMhdStopStatus } from '../utils/validation'

interface StationStatusDataProps {
  id?: number
}

export default function useMhdStopStatusData({ id }: StationStatusDataProps) {
  const [validationErrors, setValidationErrors] = useState()
  const { data, isLoading, error } = useQuery(
    ['getMhdStopStatusData', id],
    () => id && getMhdStopStatusData(id),
    //TODO erase enabled, don't let undefined as id somehow
    { enabled: !!id }
  )

  const validatedTier = useMemo(() => {
    // console.log(data)
    try {
      const validatedStationInformation = apiMhdStopStatus.validateSync(data)
      return validatedStationInformation
    } catch (e) {
      setValidationErrors(e.errors)
      // console.log(e)
    }
  }, [data, setValidationErrors])

  return {
    data: validatedTier,
    isLoading: isLoading,
    errors: error || validationErrors,
  }
}
