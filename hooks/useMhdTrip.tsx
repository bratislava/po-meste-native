import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { getMhdTrip } from '../utils/api'
import { apiMhdTrip } from '../utils/validation'

interface StationStatusDataProps {
  id: string
}

export default function useMhdTrip({ id }: StationStatusDataProps) {
  const [validationErrors, setValidationErrors] = useState()
  const { data, isLoading, error } = useQuery(['getMhdTrip', id], () =>
    getMhdTrip(id)
  )

  const validatedData = useMemo(() => {
    try {
      const validatedStopStatusData = apiMhdTrip.validateSync(data)
      return validatedStopStatusData
    } catch (e) {
      setValidationErrors(e.errors)
      console.log(e)
    }
  }, [data, setValidationErrors])

  return {
    data: validatedData,
    isLoading: isLoading,
    errors: error || validationErrors,
  }
}
