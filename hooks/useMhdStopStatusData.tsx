import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { getMhdStopStatusData } from '../utils/api'
import { apiMhdStopStatus } from '../utils/validation'

interface StationStatusDataProps {
  id?: string
}

export default function useMhdStopStatusData({ id }: StationStatusDataProps) {
  const [validationErrors, setValidationErrors] = useState()
  const { data, isLoading, error } = useQuery(
    ['getMhdStopStatusData', id],
    () => id && getMhdStopStatusData(id),
    //TODO erase enabled, don't let undefined as id somehow
    { enabled: !!id }
  )

  const validatedData = useMemo(() => {
    try {
      const validatedStopStatusData = apiMhdStopStatus.validateSync(data)
      return validatedStopStatusData
    } catch (e) {
      setValidationErrors(e.errors)
    }
  }, [data, setValidationErrors])

  return {
    data: validatedData,
    isLoading: isLoading,
    errors: error || validationErrors,
  }
}
