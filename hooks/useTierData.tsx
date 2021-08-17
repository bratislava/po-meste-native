import _ from 'lodash'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { getTierFreeBikeStatus } from '../utils/api'
import { apiFreeBikeStatus } from '../utils/validation'

export default function UseTierData() {
  // TODO handle loading / error
  const {
    data: dataTierFreeBikeStatus,
    isLoading: isLoadingTierFreeBikeStatus,
  } = useQuery('getTierFreeBikeStatus', getTierFreeBikeStatus)

  const validatedTier = useMemo(() => {
    const validatedStationInformation = apiFreeBikeStatus.validateSync(
      dataTierFreeBikeStatus
    ).data.bikes
    return validatedStationInformation
  }, [dataTierFreeBikeStatus])

  return {
    data: validatedTier,
    isLoading: isLoadingTierFreeBikeStatus,
  }
}
