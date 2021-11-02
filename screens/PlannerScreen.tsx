import React, { useEffect, useRef, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'

import MapView, { Polyline } from 'react-native-maps'
import { MapParamList } from '../types'

import googlePolyline from 'google-polyline'
import { TextItinerary } from './ui/TextItinerary/TextItinerary'

export default function PlannerScreen({
  route,
}: StackScreenProps<MapParamList, 'PlannerScreen'>) {
  const mapRef = useRef<MapView | null>(null)
  const legs = route?.params?.legs

  const allMarkers = useMemo(
    () =>
      legs?.flatMap((leg) => {
        if (leg.legGeometry.points) {
          const latLngs = googlePolyline.decode(leg.legGeometry.points)
          return latLngs.map((point) => ({
            latitude: point[0],
            longitude: point[1],
          }))
        }
        return []
      }),
    []
  )
  useEffect(() => {
    setTimeout(() => {
      mapRef.current?.fitToCoordinates(allMarkers)
    }, 250)
  }, [allMarkers, mapRef])

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 48.1512015,
          longitude: 17.1110118,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {legs?.reduce<JSX.Element[]>((accumulator, leg, index) => {
          if (leg.legGeometry.points) {
            const latlngs = googlePolyline.decode(leg.legGeometry.points)
            const marker = (
              <Polyline
                key={index}
                coordinates={latlngs.map((point) => ({
                  latitude: point[0],
                  longitude: point[1],
                }))}
                lineDashPattern={[1]}
                strokeColor="#000"
                strokeWidth={6}
              />
            )
            return accumulator.concat(marker)
          }
          return accumulator
        }, [])}
      </MapView>
      <TextItinerary legs={legs} />
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
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})
