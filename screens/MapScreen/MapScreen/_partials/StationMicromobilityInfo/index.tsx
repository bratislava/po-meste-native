import Text from '@components/Text'
import i18n from 'i18n-js'
import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import BatteryIcon from '@icons/battery.svg'
import RangeIcon from '@icons/finish-flag.svg'
import HelmetIcon from '@icons/helmet.svg'
import { MicromobilityProvider } from '@types'
import {
  boltPrice,
  colors,
  FreeBikeStatusProps,
  getMicromobilityImage,
  googlePlacesReverseGeocode,
  rekolaPrice,
  s,
  slovnaftbajkPrice,
  StationMicromobilityProps,
  tierPrice,
} from '@utils'

import ProviderButton from '@components/ProviderButton'
import InfoRow from '../InforRow'

interface StationMicromobilityInfoProps {
  station: StationMicromobilityProps | FreeBikeStatusProps
  provider: MicromobilityProvider
}

const StationMicromobilityInfo = ({
  station,
  provider,
}: StationMicromobilityInfoProps) => {
  const getMicromobilityIcon = useCallback(() => {
    return getMicromobilityImage(provider)
  }, [provider])
  const [nameBasedOnLocation, setNameBasedOnLocation] = useState('')
  useEffect(() => {
    if (
      station.name ||
      station.original?.attributes?.licencePlate ||
      !station.lat ||
      !station.lon
    )
      return
    googlePlacesReverseGeocode(station.lat, station.lon, (results) =>
      setNameBasedOnLocation(
        `${results[0].formatted_address.slice(
          0,
          results[0].formatted_address.indexOf(',')
        )}`
      )
    )
  }, [station])

  const getTitleAndPrice = useCallback(() => {
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

  const providerTitleAndPrice = getTitleAndPrice()
  return (
    <View style={styles.container}>
      <View style={[styles.header, s.horizontalMargin]}>
        <Text>{providerTitleAndPrice.title}</Text>
        {station.name ? (
          <Text style={[s.boldText, styles.fontBigger]}>{station.name}</Text>
        ) : station.original?.attributes?.licencePlate ? (
          <Text style={[s.boldText, styles.fontBigger]}>
            {station.original.attributes.licencePlate}
          </Text>
        ) : (
          <Text style={[s.boldText, styles.fontBigger]}>
            {nameBasedOnLocation}
          </Text>
        )}
      </View>
      <View style={styles.priceWrapper}>
        <Text style={s.horizontalMargin}>
          {i18n.t('screens.MapScreen.price')}
          <Text style={s.boldText}>{providerTitleAndPrice.price}</Text>
        </Text>
      </View>
      <View style={[s.horizontalMargin, styles.additionalInfoWrapper]}>
        <View style={styles.vehicleImage}>{getMicromobilityIcon()}</View>
        <View style={styles.rightContainer}>
          <View style={styles.additionalInfo}>
            {station.num_bikes_available !== undefined && (
              <InfoRow
                value={station.num_bikes_available}
                title={i18n.t('screens.MapScreen.availableBikes')}
              />
            )}
            {station.num_docks_available !== undefined && (
              <InfoRow
                value={station.num_docks_available}
                title={i18n.t('screens.MapScreen.freeBikeSpaces')}
              />
            )}
            {station?.original?.attributes?.batteryLevel !== undefined && ( // TODO remove from original
              <InfoRow
                value={station?.original?.attributes?.batteryLevel + '%'}
                title={i18n.t('screens.MapScreen.batteryCharge')}
                Icon={BatteryIcon}
              />
            )}
            {(station?.original?.current_range_meters ||
              station?.original?.attributes?.currentRangeMeters) && ( // TODO remove from original
              <InfoRow
                value={`${
                  (station?.original?.current_range_meters ||
                    station?.original?.attributes?.currentRangeMeters) / 1000
                } km`}
                title={i18n.t('screens.MapScreen.currentRange')}
                Icon={RangeIcon}
              />
            )}
            {station.original?.attributes?.hasHelmet !== undefined && ( // TODO remove from original
              <InfoRow
                value={i18n.t(
                  'common.' +
                    (station.original.attributes.hasHelmet ? 'yes' : 'no')
                )}
                title={i18n.t('screens.MapScreen.helmet')}
                Icon={HelmetIcon}
              />
            )}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
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
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  vehicleImage: {
    height: 130,
    width: 140,
    marginVertical: 20,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  rightContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    paddingVertical: 20,
  },
  additionalInfo: {
    marginBottom: 22,
  },
})

export default StationMicromobilityInfo
