import BoltVehicleIconSvg from '@images/bolt-vehicle-icon.svg'
import RekoloVehicleIconSvg from '@images/rekolo-vehicle-icon.svg'
import SlovnaftbajkVehicleIconSvg from '@images/slovnaftbajk-vehicle-icon.svg'
import TierVehicleIconSvg from '@images/tier-vehicle-icon.svg'
import { MicromobilityProvider } from '@types'
import React from 'react'

export const getMicromobilityImage = (
  provider: MicromobilityProvider,
  height?: number,
  width?: number
) => {
  switch (provider) {
    case MicromobilityProvider.rekola:
      return <RekoloVehicleIconSvg height={height} width={width} />
    case MicromobilityProvider.slovnaftbajk:
      return <SlovnaftbajkVehicleIconSvg height={height} width={width} />
    case MicromobilityProvider.tier:
      return <TierVehicleIconSvg height={height} width={width} />
    case MicromobilityProvider.bolt:
      return <BoltVehicleIconSvg height={height} width={width} />
    default:
      return undefined
  }
}
