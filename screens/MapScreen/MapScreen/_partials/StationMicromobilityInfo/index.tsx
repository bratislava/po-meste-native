import Text from '@components/Text'
import i18n from 'i18n-js'
import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'

import { MicromobilityProvider } from '@types'
import {
  boltPrice,
  colors,
  FreeBikeStatusProps,
  getMicromobilityImage,
  rekolaPrice,
  s,
  slovnaftbajkPrice,
  StationMicromobilityProps,
  tierPrice,
} from '@utils'

import ProviderButton from '@components/ProviderButton'

interface StationMicromobilityInfoProps {
  station: StationMicromobilityProps | FreeBikeStatusProps
  provider: MicromobilityProvider
}

const StationMicromobilityInfo = ({
  station,
  provider,
}: StationMicromobilityInfoProps) => {
  const getMicromobilityIcon = useCallback(() => {
    return getMicromobilityImage(provider, 150)
  }, [provider])

  const getTitlePrice = useCallback(() => {
    let title = undefined
    let providerPrice: {
      unlockPrice?: number
      price: number
      interval: number
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
      case MicromobilityProvider.bolt:
        title = i18n.t('screens.MapScreen.boltTitle')
        providerPrice = boltPrice
        break
    }
    const translationOption = providerPrice.translationOption
    const formattedPrice = {
      unlockPrice: providerPrice.unlockPrice,
      price: providerPrice.price / 100,
      interval: providerPrice.interval.toString(),
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
    if (providerPrice.interval === 1) formattedPrice.interval = ''
    else {
      formattedPrice.interval = formattedPrice.interval + ' '
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
                {i18n.t('screens.MapScreen.availableBikes')}
                <Text style={s.boldText}>{station.num_bikes_available}</Text>
              </Text>
            )}
            {station.num_docks_available !== undefined && (
              <Text>
                {i18n.t('screens.MapScreen.freeBikeSpaces')}
                <Text style={s.boldText}>{station.num_docks_available}</Text>
              </Text>
            )}
            {station.original?.attributes?.licencePlate !== undefined && ( // TODO remove from original
              <Text>
                {i18n.t('screens.MapScreen.licencePlate')}
                <Text style={s.boldText}>
                  {station.original.attributes?.licencePlate}
                </Text>
              </Text>
            )}
            {station?.original?.attributes?.batteryLevel !== undefined && ( // TODO remove from original
              <Text>
                {i18n.t('screens.MapScreen.batteryCharge')}
                <Text style={s.boldText}>
                  {station?.original?.attributes?.batteryLevel}%
                </Text>
              </Text>
            )}
            {station?.original?.current_range_meters !== undefined && ( // TODO remove from original
              <Text>
                {i18n.t('screens.MapScreen.currentRange')}
                <Text style={s.boldText}>
                  {station?.original?.current_range_meters / 1000} km
                </Text>
              </Text>
            )}
          </View>
          <View style={{ alignItems: 'center' }}>
            <ProviderButton provider={provider} station={station} />
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
    width: 130,
    margin: 20,
  },
  additionalText: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-evenly',
    paddingVertical: 20,
  },
})

export default StationMicromobilityInfo
