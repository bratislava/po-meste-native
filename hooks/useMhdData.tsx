import _ from 'lodash'
import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { apiMhdStops } from '../utils/validation'
import { getMhdStops } from '../utils/api'

export default function useMhdData() {
  const [validationErrors, setValidationErrors] = useState()
  const { data, isLoading, error } = useQuery('getMhdStops', getMhdStops)

  const validatedMhdStops = useMemo(() => {
    try {
      return apiMhdStops.validateSync(data)
    } catch (e) {
      setValidationErrors(e.errors)
      console.log(e)
    }
  }, [data])

  return {
    data: validatedMhdStops,
    isLoading,
    errors: error || validationErrors,
  }
}
