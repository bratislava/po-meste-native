import React, { useRef, useState } from 'react'
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps'
import { StyleSheet, View, Text } from 'react-native'
import i18n from 'i18n-js'
import { useNavigation } from '@react-navigation/native'

import MarkerSvg from '@icons/map-pin-marker.svg'
import { Button } from '../components'
import { StackScreenProps } from '@react-navigation/stack'
import { MapParamList } from '@types'
import { colors } from '../utils/theme'
import { s } from '../utils/globalStyles'

export default function ChooseLocation({
  route,
}: StackScreenProps<MapParamList, 'ChooseLocation'>) {
  const fromNavigation = route?.params?.fromNavigation
  const toNavigation = route?.params?.toNavigation
  const fromCoords = route?.params?.fromCoords
  const toCoords = route?.params?.toCoords

  const navigation = useNavigation()

  const ref = useRef<MapView>(null)
  const [region, setRegion] = useState<Region>()

  return (
    <View style={styles.container}>
      <View style={styles.mapWrapper}>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={ref}
          style={styles.map}
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
        <Text>{i18n.t('moveTheMapAndSelectTheDesiredPoint')}</Text>
        <View style={styles.addressWrapper}>
          <MarkerSvg fill={colors.black} width={20} height={20} />
          <Text style={styles.addressText}>
            {region?.latitude}, {region?.longitude}
          </Text>
        </View>
        <Button
          style={styles.confirm}
          title={i18n.t('confirmLocation')}
          onPress={() => {
            const naviagtionInstructions = {
              latitude: region?.latitude,
              longitude: region?.longitude,
            }
            navigation.navigate('FromToScreen', {
              from: fromNavigation ? naviagtionInstructions : fromCoords,
              to: toNavigation ? naviagtionInstructions : toCoords,
            })
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
