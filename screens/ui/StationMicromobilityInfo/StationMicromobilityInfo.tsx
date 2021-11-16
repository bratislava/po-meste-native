import React, { useCallback } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import i18n from 'i18n-js'

import {
  FreeBikeStatusProps,
  StationMicromobilityProps,
} from '@utils/validation'
import { colors } from '@utils/theme'
import { s } from '@utils/globalStyles'
import { rekolaPrice } from '@utils/constants'
import RekoloVehicleIconSvg from '@images/rekolo-vehicle-icon.svg'
import SlovnaftbajkVehicleIconSvg from '@images/slovnaftbajk-vehicle-icon.svg'
import TierVehicleIconSvg from '@images/tier-vehicle-icon.svg'
import Button from '@components/Button'
import { MicromobilityProvider } from '../../../types'
import AppLink from 'react-native-app-link'

interface StationMicromobilityInfoProps {
  station: StationMicromobilityProps | FreeBikeStatusProps
  provider: MicromobilityProvider
}

const StationMicromobilityInfo = ({
  station,
  provider,
}: StationMicromobilityInfoProps) => {
  const getMicromobilityIcon = useCallback(() => {
    let icon = undefined
    switch (provider) {
      case MicromobilityProvider.rekola:
        icon = <RekoloVehicleIconSvg height={150} />
        break
      case MicromobilityProvider.slovnaftbajk:
        icon = <SlovnaftbajkVehicleIconSvg height={150} />
        break
      case MicromobilityProvider.tier:
        icon = <TierVehicleIconSvg height={150} />
        break
    }
    return icon
  }, [provider])

  const getButtonColor = useCallback(() => {
    let color = undefined
    switch (provider) {
      case MicromobilityProvider.rekola:
        color = colors.rekolaColor
        break
      case MicromobilityProvider.slovnaftbajk:
        color = colors.slovnaftColor
        break
      case MicromobilityProvider.tier:
        color = colors.tierColor
        break
    }
    return color
  }, [provider])

  const getTitle = useCallback(() => {
    let title = undefined
    switch (provider) {
      case MicromobilityProvider.rekola:
        title = i18n.t('rekolaBikesTitle')
        break
      case MicromobilityProvider.slovnaftbajk:
        title = i18n.t('slovnaftbikesTitle')
        break
      case MicromobilityProvider.tier:
        title = i18n.t('tierTitle')
        break
    }
    return title
  }, [provider])

  return (
    <View style={styles.container}>
      <View style={[styles.header, s.horizontalMargin]}>
        <Text>{getTitle()}</Text>
        {station.name && (
          <Text style={[s.boldText, styles.fontBigger]}>{station.name}</Text>
        )}
      </View>
      <View style={styles.priceWrapper}>
        <Text style={s.horizontalMargin}>
          {i18n.t('price')}
          <Text style={s.boldText}>
            {i18n.t('rekolaPriceFrom', {
              money: (rekolaPrice.amount / 100).toFixed(2), // TODO change for real price based on provider etc.
              time: rekolaPrice.duration,
            })}
          </Text>
        </Text>
      </View>
      <View style={[s.horizontalMargin, styles.additionalInfoWrapper]}>
        <View style={styles.vehicleImage}>{getMicromobilityIcon()}</View>
        <View style={styles.additionalText}>
          <View>
            {station.num_bikes_available !== undefined && (
              <Text>
                {i18n.t('availableBikes', {
                  amount: station.num_bikes_available,
                })}
              </Text>
            )}
            {station.num_docks_available !== undefined && (
              <Text>
                {i18n.t('freeBikeSpaces', {
                  amount: station.num_docks_available,
                })}
              </Text>
            )}
            {station.original?.attributes?.licencePlate !== undefined && ( // TODO remove from original
              <Text>
                {i18n.t('licencePlate', {
                  id: station.original.attributes?.licencePlate, // TODO remove from original
                })}
              </Text>
            )}
            {station?.original?.attributes?.batteryLevel !== undefined && ( // TODO remove from original
              <Text>
                {i18n.t('batteryCharge', {
                  amount: station?.original?.attributes?.batteryLevel, // TODO remove from original
                })}
              </Text>
            )}
          </View>
          <View>
            <Button
              style={{ backgroundColor: getButtonColor() }}
              titleStyle={[
                (provider === MicromobilityProvider.tier ||
                  provider === MicromobilityProvider.slovnaftbajk) && {
                  color: colors.darkText,
                },
                { fontWeight: '700' },
              ]}
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
                }
              }}
              title={i18n.t('rent', { provider })}
            />
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  header: {
    marginVertical: 10,
  },
  fontBigger: {
    fontSize: 22,
  },
  priceWrapper: {
    paddingVertical: 10,
    backgroundColor: colors.lightLightGray,
  },
  additionalInfoWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  vehicleImage: {
    width: 150,
  },
  additionalText: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
})

export default StationMicromobilityInfo
