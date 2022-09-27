import ChevronRightIconSVG from '@icons/chevron-right-small.svg'
import { MicromobilityProvider } from '@types'
import { getColor, getTextColor } from '@utils/utils'
import {
  FreeBikeStatusProps,
  StationMicromobilityProps,
} from '@utils/validation'
import i18n from 'i18n-js'
import React from 'react'
import { Platform } from 'react-native'
import AppLink from 'react-native-app-link'
import Button from './Button'

interface ProviderButtonProps {
  provider: MicromobilityProvider
  station?: StationMicromobilityProps | FreeBikeStatusProps
}

const ProviderButton = ({ provider, station }: ProviderButtonProps) => {
  const buttonTitle =
    provider === MicromobilityProvider.rekola
      ? 'Rekola'
      : provider === MicromobilityProvider.slovnaftbajk
      ? 'Bajk'
      : provider === MicromobilityProvider.tier
      ? 'Tier'
      : provider === MicromobilityProvider.bolt
      ? 'Bolt'
      : ''

  return (
    <Button
      contentStyle={{ backgroundColor: getColor(provider) }}
      titleStyle={[{ color: getTextColor(provider) }, { fontWeight: 'bold' }]}
      onPress={() => {
        switch (provider) {
          case MicromobilityProvider.rekola:
            AppLink.openInStore({
              appName: 'Rekola',
              appStoreId: 888759232,
              appStoreLocale: 'sk',
              playStoreId: 'cz.rekola.app',
            })
              .then()
              .catch()
            break
          case MicromobilityProvider.slovnaftbajk:
            AppLink.openInStore({
              appName: 'slovnaftbajk',
              appStoreId: 1364531772,
              appStoreLocale: 'sk',
              playStoreId: 'hu.cycleme.slovnaftbajk',
            })
              .then()
              .catch()
            break
          case MicromobilityProvider.tier:
            AppLink.openInStore({
              appName: 'tier',
              appStoreId: 1436140272,
              appStoreLocale: 'sk',
              playStoreId: 'com.tier.app',
            })
              .then()
              .catch()
            break
          case MicromobilityProvider.bolt:
            AppLink.maybeOpenURL(
              Platform.select({
                android: station?.original.rental_uris.android,
                ios: station?.original.rental_uris.ios,
              }) ?? '',
              {
                appName: 'bolt',
                appStoreId: 675033630,
                appStoreLocale: 'sk',
                playStoreId: 'ee.mtakso.client',
              }
            )
            break
        }
      }}
      size="small"
      title={i18n.t('screens.MapScreen.rent', {
        provider: buttonTitle,
      })}
      icon={
        <ChevronRightIconSVG
          height={14}
          width={14}
          fill={getTextColor(provider)}
          style={{ marginLeft: 14 }}
        />
      }
      iconRight
    />
  )
}

export default ProviderButton
