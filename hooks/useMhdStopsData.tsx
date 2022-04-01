import { useMemo, useState } from 'react'
import { useQuery } from 'react-query'

import { apiMhdStops } from '../utils/validation'
import { getHealth, getMhdStops } from '../utils/api'
import {
  getCachedStops,
  getLatestDataset,
  setCachedStops,
  setLatestDataset,
} from '@utils/utils'

export default function useMhdData() {
  const [validationErrors, setValidationErrors] = useState()
  const { data: healthData, error: healthError } = useQuery(
    'getHealth',
    getHealth
  )
  const { data: latestDatasetData } = useQuery(
    'getLastDataSet',
    getLatestDataset
  )
  const fetchNewData = useMemo(() => {
    if (healthError != undefined) return true
    if (healthData == undefined) return false
    if (healthData.latestDataset === latestDatasetData) return false
    else return true
  }, [healthData, healthError, latestDatasetData])
  const { data, isLoading, error, refetch } = useQuery(
    'getMhdStops',
    getMhdStops,
    { enabled: fetchNewData }
  )
  const { data: cachedData } = useQuery('getCachedMhdStops', () =>
    getCachedStops('mhdStops')
  )

  const validatedMhdStops = useMemo(() => {
    if (data == null) return cachedData
    if (fetchNewData)
      try {
        const mhdStops = apiMhdStops.validateSync(data)
        setCachedStops('mhdStops', mhdStops)
        setLatestDataset(healthData.latestDataset)
        return mhdStops
      } catch (e: any) {
        setValidationErrors(e.errors)
        console.log(e)
      }
  }, [data, cachedData, fetchNewData])

  return {
    data: validatedMhdStops,
    isLoading,
    errors: error || validationErrors,
    refetch,
  }
}
