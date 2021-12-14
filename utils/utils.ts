import i18n from 'i18n-js'
import AppLink from 'react-native-app-link'

import {
  MicromobilityProvider,
  TransitVehicleType,
  TravelModes,
  TravelModesOtpApi,
} from '../types'
import { colors } from './theme'
import CyclingSvg from '@images/cycling.svg'
import SlovnaftbajkSvg from '@images/slovnaftbajk.svg'
import TierSvg from '@images/tier.svg'
import RekoloSvg from '@images/rekolo.svg'
import TramSvg from '@images/tram.svg'
import TrolleybusSvg from '@images/trolleybus.svg'
import BusSvg from '@images/bus.svg'

export const presentPrice = (price: number /* in cents */) => {
  return i18n.t('presentPrice', { price: (price / 100).toFixed(2) })
}

export const dateStringRegex =
  /^(?:[2]\d\d\d)-(?:[0]\d|1[012])-(?:0[1-9]|[12]\d|3[01])$/
export const timeStringRegex =
  /^(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)$/
export const colorRegex = /^([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
export const validateTime = (time: string) => {
  if (!time.match(timeStringRegex)) return 'errEmailNotValid'
  return null
}

export const getOtpTravelMode = (mode: TravelModes) => {
  switch (mode) {
    case TravelModes.mhd:
      return TravelModesOtpApi.transit
    case TravelModes.bicycle:
      return TravelModesOtpApi.bicycle
    case TravelModes.scooter:
      return TravelModesOtpApi.rented
    case TravelModes.walk:
      return TravelModesOtpApi.walk
    default:
      return TravelModesOtpApi.transit
  }
}

export const getProviderName = (provider: MicromobilityProvider) => {
  switch (provider) {
    case MicromobilityProvider.rekola:
      return i18n.t('providerNames.rekola')
    case MicromobilityProvider.tier:
      return i18n.t('providerNames.tier')
    case MicromobilityProvider.slovnaftbajk:
      return i18n.t('providerNames.slovnaftbajk')
    default:
      return undefined
  }
}

export const getIcon = (provider?: MicromobilityProvider) => {
  switch (provider) {
    case MicromobilityProvider.rekola:
      return RekoloSvg
    case MicromobilityProvider.slovnaftbajk:
      return SlovnaftbajkSvg
    case MicromobilityProvider.tier:
      return TierSvg
    default:
      return CyclingSvg
  }
}

export const openProviderApp = async (provider: MicromobilityProvider) => {
  switch (provider) {
    case MicromobilityProvider.rekola:
      await AppLink.openInStore({
        appName: 'Rekola',
        appStoreId: 888759232,
        appStoreLocale: 'sk',
        playStoreId: 'cz.rekola.app',
      })
      break
    case MicromobilityProvider.slovnaftbajk:
      await AppLink.openInStore({
        appName: 'slovnaftbajk',
        appStoreId: 1364531772,
        appStoreLocale: 'sk',
        playStoreId: 'hu.cycleme.slovnaftbajk',
      })
      break
    case MicromobilityProvider.tier:
      await AppLink.openInStore({
        appName: 'tier',
        appStoreId: 1436140272,
        appStoreLocale: 'sk',
        playStoreId: 'com.tier.app',
      })
      break
  }
}

export const getColor = (provider?: MicromobilityProvider) => {
  switch (provider) {
    case MicromobilityProvider.rekola:
      return colors.rekolaColor
    case MicromobilityProvider.slovnaftbajk:
      return colors.slovnaftColor
    case MicromobilityProvider.tier:
      return colors.tierColor
    default:
      break
  }
}

export const getTextColor = (provider: MicromobilityProvider) => {
  switch (provider) {
    case MicromobilityProvider.rekola:
      return colors.white
    default:
      return colors.darkText
  }
}

export const getVehicle = (vehicletype?: TransitVehicleType) => {
  switch (vehicletype) {
    case TransitVehicleType.trolleybus:
      return TrolleybusSvg
    case TransitVehicleType.tram:
      return TramSvg
    case TransitVehicleType.bus:
      return BusSvg
    default:
      return BusSvg
  }
}

export const hexToRgba = (color: string, alpha: number) => {
  //match valid hex color formats: #RRGGBB or #RGB
  if (!color.match(/^#[a-fA-F0-9]{3}$|^#[a-fA-F0-9]{6}$/)) return undefined

  const r = color.length === 4 ? color[1].repeat(2) : color.substr(1, 2)
  const g = color.length === 4 ? color[2].repeat(2) : color.substr(3, 2)
  const b = color.length === 4 ? color[3].repeat(2) : color.substr(5, 2)
  const result = `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(
    b,
    16
  )}, ${alpha})`
  return result
}
