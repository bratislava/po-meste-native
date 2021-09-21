import React, { useRef, useState } from 'react'
import MapView, { Region } from 'react-native-maps'
import { StyleSheet, View } from 'react-native'
import i18n from 'i18n-js'
import { useNavigation } from '@react-navigation/native'

import TicketSvg from '../assets/images/ticket.svg'
import { Button } from '../components'
import { StackScreenProps } from '@react-navigation/stack'
import { MapParamList } from '../types'

export default function ChooseLocation({
  route,
}: StackScreenProps<MapParamList, 'ChooseLocation'>) {
  const navigation = useNavigation()

  const ref = useRef<MapView>(null)
  const [region, setRegion] = useState<Region>()

  return (
    <View style={styles.container}>
      <MapView
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
        onRegionChange={(region) => setRegion(region)}
      />
      <View style={styles.searchBar} pointerEvents="none">
        <TicketSvg fill="red" />
      </View>
      <Button
        style={styles.confirm}
        title={i18n.t('confirmLocation')}
        onPress={() => {
          route?.params?.onConfirm(region?.latitude, region?.longitude)
          navigation.goBack()
        }}
      ></Button>
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
  searchBar: {
    display: 'flex',
    position: 'absolute',
    marginTop: '50%',
    marginLeft: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirm: {
    display: 'flex',
    flex: 1,
    position: 'absolute',
    bottom: 0,
    marginBottom: 10,
    marginTop: 30,
    width: '90%',
    height: 50,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})
