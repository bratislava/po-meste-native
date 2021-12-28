import _ from 'lodash'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { getChargersStops } from '../utils/api'
import { apiZseChargers } from '../utils/validation'

export default function useZseChargersData() {
  const [validationErrors, setValidationErrors] = useState()
  const { data, isLoading, error, refetch } = useQuery(
    'getChargersStops',
    getChargersStops
  )

  const validatedZseChargers = useMemo(() => {
    try {
      return apiZseChargers.validateSync(data)
    } catch (e) {
      setValidationErrors(e.errors)
      console.log(e)
    }
  }, [data])

  return {
    data: validatedZseChargers?.localities,
    isLoading,
    errors: error || validationErrors,
    refetch,
  }
}
