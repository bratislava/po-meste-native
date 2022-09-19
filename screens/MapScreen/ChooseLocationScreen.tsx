import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps'

import { Button } from '@components'
import { MapParamList } from '@types'
import { colors, s } from '@utils'

import MarkerSvg from '@icons/map-pin-marker.svg'
import { customMapStyle } from './customMapStyle'

export default function ChooseLocation({
  route,
}: StackScreenProps<MapParamList, 'ChooseLocationScreen'>) {
  const fromNavigation = route?.params?.fromNavigation
  const toNavigation = route?.params?.toNavigation
  const fromCoordsName = route?.params?.fromCoordsName
  const toCoordsName = route?.params?.toCoordsName

  const navigation = useNavigation()

  const ref = useRef<MapView>(null)
  const [region, setRegion] = useState<Region>()
  const [placeName, setPlaceName] = useState('')
  const [debounceTimeout, setDebouceTimeout] = useState<NodeJS.Timeout>()

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }
    setDebouceTimeout(
      setTimeout(() => {
        // TODO Add GooglePlacesApiKey authorization for reverse geocoding
        // if (region) {
        //   fetch(
        //     'https://maps.google.com/maps/api/geocode/json?' +
        //       new URLSearchParams({
        //         key: Constants.manifest?.extra?.googlePlacesApiKey,
        //         latlng: `${region.latitude},${region.longitude}`,
        //       })
        //   )
        //     .then((res) => res.json())
        //     .then((places) => {
        //       if (Array.isArray(places) && placeName.length > 0)
        //         setPlaceName(`${places[0].data.description}`)
        //     })
        // }
        if (region)
          ref.current?.addressForCoordinate(region).then((address) => {
            console.log({ address })
            const houseNumberRegex = /[0-9/]{1,}[A-Z]?/
            let name
            if (houseNumberRegex.test(address.name)) {
              if (address.thoroughfare == null) {
                name = i18n.t('screens.ChooseLocationScreen.unnamedLocation', {
                  latitude: region.latitude.toFixed(5),
                  longitude: region.longitude.toFixed(5),
                })
              } else {
                name = `${address.thoroughfare} ${address.name}`
              }
            } else {
              name = address.name
            }
            setPlaceName(name)
          })
      }, 200)
    )
    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout)
    }
  }, [region])

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={ref}
          style={styles.map}
          customMapStyle={customMapStyle}
          initialRegion={
            (route?.params?.latitude &&
              route?.params?.longitude && {
                latitude: route?.params?.latitude,
                longitude: route?.params?.longitude,
                latitudeDelta: 0.0461,
                longitudeDelta: 0.02105,
              }) || {
              latitude: 48.1512015,
              longitude: 17.1110118,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }
          }
          onRegionChange={(region) => {
            setRegion(region)
          }}
        />
        <View style={styles.markerWrapper} pointerEvents="none">
          <MarkerSvg fill={colors.primary} width={32} height={32} />
        </View>
      </View>
      <View style={styles.sheet}>
        <Text>
          {i18n.t(
            'screens.ChooseLocationScreen.moveTheMapAndSelectTheDesiredPoint'
          )}
        </Text>
        <View style={styles.addressWrapper}>
          <MarkerSvg fill={colors.black} width={20} height={20} />
          <Text style={styles.addressText}>{placeName}</Text>
        </View>
        <Button
          style={styles.confirm}
          title={i18n.t('screens.ChooseLocationScreen.confirmLocation')}
          onPress={async () => {
            console.log({ fromCoordsName, toCoordsName })
            const naviagtionInstructions = {
              latitude: region?.latitude,
              longitude: region?.longitude,
              name: placeName,
            }
            navigation.navigate(
              'FromToScreen' as never,
              {
                from: fromNavigation ? naviagtionInstructions : fromCoordsName,
                to: toNavigation ? naviagtionInstructions : toCoordsName,
              } as never
            )
          }}
        ></Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerWrapper: {
    display: 'flex',
    position: 'absolute',
    marginTop: '50%',
    marginLeft: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    ...s.shadow,
    flex: 1,
    backgroundColor: colors.white,
    marginTop: -7,
    width: '100%',
    display: 'flex',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 80,
    alignItems: 'center',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  addressWrapper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 20,
  },
  addressText: {
    marginLeft: 5,
    fontSize: 20,
    fontWeight: 'bold',
  },
  confirm: {},
  mapWrapper: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    flex: 2,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})
