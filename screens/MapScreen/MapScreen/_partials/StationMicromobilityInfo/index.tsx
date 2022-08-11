import i18n from 'i18n-js'
import React, { useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AppLink from 'react-native-app-link'

import { Button } from '@components'
import { MicromobilityProvider } from '@types'
import {
  colors,
  FreeBikeStatusProps,
  rekolaPrice,
  s,
  slovnaftbajkPrice,
  StationMicromobilityProps,
  tierPrice,
} from '@utils'

import RekoloVehicleIconSvg from '@images/rekolo-vehicle-icon.svg'
import SlovnaftbajkVehicleIconSvg from '@images/slovnaftbajk-vehicle-icon.svg'
import TierVehicleIconSvg from '@images/tier-vehicle-icon.svg'

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

  const getTitlePrice = useCallback(() => {
    let title = undefined
    let providerPrice: {
      unlockPrice?: number
      price: number
      duration: number
      unit: { translate: boolean; text: string }
      translationOption: string
    } | null = null
    switch (provider) {
      case MicromobilityProvider.rekola:
        title = i18n.t('screens.MapScreen.rekolaBikesTitle')
        providerPrice = rekolaPrice
        break
      case MicromobilityProvider.slovnaftbajk:
        title = i18n.t('screens.MapScreen.slovnaftbikesTitle')
        providerPrice = slovnaftbajkPrice
        break
      case MicromobilityProvider.tier:
        title = i18n.t('screens.MapScreen.tierTitle')
        providerPrice = tierPrice
        break
    }
    const translationOption = providerPrice.translationOption
    const formattedPrice = {
      unlockPrice: providerPrice.unlockPrice,
      price: providerPrice.price / 100,
      duration: providerPrice.duration.toString(),
      unit: providerPrice.unit.translate
        ? i18n.t(providerPrice.unit.text)
        : providerPrice.unit.text,
    }
    if (providerPrice.price % 100 !== 0) {
      formattedPrice.price.toFixed(2)
    }
    if (
      providerPrice.unlockPrice != undefined &&
      formattedPrice.unlockPrice != undefined
    ) {
      formattedPrice.unlockPrice /= 100
      if (providerPrice.unlockPrice % 100 !== 0) {
        formattedPrice.price.toFixed(2)
      }
    }
    if (providerPrice.duration === 1) formattedPrice.duration = ''
    else {
      formattedPrice.duration = formattedPrice.duration + ' '
    }
    const price = i18n.t(translationOption, {
      ...formattedPrice,
      price: formattedPrice.price.toString().replace('.', ','),
      unlockPrice: formattedPrice.unlockPrice?.toString().replace('.', ','),
    })
    return { title, price }
  }, [provider])

  const providerTitlePrice = getTitlePrice()
  return (
    <View style={styles.container}>
      <View style={[styles.header, s.horizontalMargin]}>
        <Text>{providerTitlePrice.title}</Text>
        {station.name && (
          <Text style={[s.boldText, styles.fontBigger]}>{station.name}</Text>
        )}
      </View>
      <View style={styles.priceWrapper}>
        <Text style={s.horizontalMargin}>
          {i18n.t('screens.MapScreen.price')}
          <Text style={s.boldText}>{providerTitlePrice.price}</Text>
        </Text>
      </View>
      <View style={[s.horizontalMargin, styles.additionalInfoWrapper]}>
        <View style={styles.vehicleImage}>{getMicromobilityIcon()}</View>
        <View style={styles.additionalText}>
          <View>
            {station.num_bikes_available !== undefined && (
              <Text>
                {i18n.t('screens.MapScreen.availableBikes', {
                  amount: station.num_bikes_available,
                })}
              </Text>
            )}
            {station.num_docks_available !== undefined && (
              <Text>
                {i18n.t('screens.MapScreen.freeBikeSpaces', {
                  amount: station.num_docks_available,
                })}
              </Text>
            )}
            {station.original?.attributes?.licencePlate !== undefined && ( // TODO remove from original
              <Text>
                {i18n.t('screens.MapScreen.licencePlate', {
                  id: station.original.attributes?.licencePlate, // TODO remove from original
                })}
              </Text>
            )}
            {station?.original?.attributes?.batteryLevel !== undefined && ( // TODO remove from original
              <Text>
                {i18n.t('screens.MapScreen.batteryCharge', {
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
                { fontWeight: 'bold' },
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
              title={i18n.t('screens.MapScreen.rent', { provider })}
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
