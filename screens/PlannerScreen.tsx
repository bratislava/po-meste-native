import React, { useEffect, useRef, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import MapView, { Polyline } from 'react-native-maps'
import googlePolyline from 'google-polyline'
import BottomSheet from '@gorhom/bottom-sheet'

import { MapParamList } from '../types'
import { TextItinerary } from './ui/TextItinerary/TextItinerary'
import { HANDLE_HEIGHT, renderHeader } from '@components/BottomSheetHeader'
import { BOTTOM_VEHICLE_BAR_HEIGHT_ALL } from './ui/VehicleBar/VehicleBar'

export default function PlannerScreen({
  route,
}: StackScreenProps<MapParamList, 'PlannerScreen'>) {
  const mapRef = useRef<MapView | null>(null)
  const provider = route?.params?.provider
  const legs = route?.params?.legs
  const bottomSheetSnapPoints = [
    HANDLE_HEIGHT + BOTTOM_VEHICLE_BAR_HEIGHT_ALL + 30,
    '60%',
    '100%',
  ]

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
            var color;
            if (leg.route != ""){color = `#${leg.routeColor}`}
            else {color = getModeColor(leg.mode)}
            const marker = (
              <Polyline
                key={index}
                coordinates={latlngs.map((point) => ({
                  latitude: point[0],
                  longitude: point[1],
                }))}
                lineDashPattern={[1]}
                strokeColor={color}
                strokeWidth={6}
              />
            )
            return accumulator.concat(marker)
          }
          return accumulator
        }, [])}
      </MapView>
      <BottomSheet
        index={1}
        handleComponent={renderHeader}
        snapPoints={bottomSheetSnapPoints}
      >
        <TextItinerary legs={legs} provider={provider} />
      </BottomSheet>
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

function getModeColor(mode: import("../types").LegModes | undefined) {
  if(mode === "WALK") return '#444';
  if(mode === "BICYCLE") return '#0073e5';
  if(mode === "BUS") return '#080';
  if(mode === "TRAM") return '#800';
  return '#aaa';
}

