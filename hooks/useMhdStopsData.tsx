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
  const [hasFetched, setHasFetched] = useState(false)
  const { data: cachedData } = useQuery('getCachedMhdStops', () =>
    getCachedStops('mhdStops')
  )
  const { data: healthData, error: healthError } = useQuery(
    'getHealth',
    getHealth
  )
  const { data: latestDatasetData } = useQuery(
    'getLastDataSet',
    getLatestDataset
  )
  const { data, isLoading, error, refetch } = useQuery(
    ['getMhdStops', healthData, latestDatasetData, healthError],
    getMhdStops,
    {
      enabled:
        !hasFetched &&
        ((healthData != undefined &&
          latestDatasetData != undefined &&
          healthData?.latestDataset !== latestDatasetData) ||
          healthError != null),
    }
  )

  const validatedMhdStops = useMemo(() => {
    healthData &&
      console.log(
        '\x1b[92m%s\x1b[0m',
        healthData?.latestDataset === latestDatasetData
          ? 'Timestamp matches, NOT fetching'
          : 'Timestamp differs, fetching'
      )
    if (data == undefined) return cachedData
    try {
      setHasFetched(true)
      const mhdStops = apiMhdStops.validateSync(data)
      setCachedStops(
        'mhdStops',
        mhdStops,
        healthData && healthData.latestDataset
      )
      return mhdStops
    } catch (e: any) {
      setValidationErrors(e.errors)
      console.log(e)
    }
  }, [data, cachedData, healthData])

  return {
    data: validatedMhdStops,
    isLoading,
    errors: error || validationErrors,
    refetch,
  }
}
