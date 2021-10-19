import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getMhdGrafikon } from '@utils/api'
import { apiMhdGrafikon } from '@utils/validation'

interface StationStatusDataProps {
  stopId: string
  lineNumber: string
}

export default function useMhdGrafikon({
  stopId,
  lineNumber,
}: StationStatusDataProps) {
  const [validationErrors, setValidationErrors] = useState()
  const { data, isLoading, error } = useQuery(
    ['getGrafikon', stopId, lineNumber],
    () => getMhdGrafikon(stopId, lineNumber)
  )

  const validatedData = useMemo(() => {
    try {
      const validatedStopStatusData = apiMhdGrafikon.validateSync(data)
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
