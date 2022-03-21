import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { apiMhdStops } from '../utils/validation'
import { getMhdStops } from '../utils/api'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function useMhdData() {
  const [validationErrors, setValidationErrors] = useState()
  const { data, isLoading, error, refetch } = useQuery(
    'getMhdStops',
    getMhdStops
  )
  const getCachedData = async () => {
    const cachedMhdStops = await AsyncStorage.getItem('mhdStops')
    if (cachedMhdStops == null) return null
    return JSON.parse(cachedMhdStops)
  }
  const { data: cachedData } = useQuery('getCachedMhdStops', getCachedData)

  const validatedMhdStops = useMemo(() => {
    if (data == null) return cachedData
    try {
      const mhdStops = apiMhdStops.validateSync(data)
      AsyncStorage.setItem('mhdStops', JSON.stringify(mhdStops))
      return mhdStops
    } catch (e: any) {
      setValidationErrors(e.errors)
      console.log(e)
    }
  }, [data, cachedData])

  return {
    data: validatedMhdStops,
    isLoading,
    errors: error || validationErrors,
    refetch,
  }
}
