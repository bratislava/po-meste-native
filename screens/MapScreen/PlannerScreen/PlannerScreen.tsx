import BottomSheet from '@gorhom/bottom-sheet'
import { StackScreenProps } from '@react-navigation/stack'
import * as Location from 'expo-location'
import googlePolyline from 'google-polyline'
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps'

import {
  BOTTOM_TAB_NAVIGATOR_HEIGHT,
  BOTTOM_VEHICLE_BAR_HEIGHT_ALL,
} from '@components'
import { MapParamList } from '@types'
import {
  aggregateBicycleLegs,
  getColor,
  hexToRgba,
  modeColors,
  s,
} from '@utils'

import CurrentLocationSvg from '@icons/current-location.svg'
import { TextItinerary } from './_partials/TextItinerary'

import { GlobalStateContext } from '@state/GlobalStateProvider'

export default function PlannerScreen({
  route,
}: StackScreenProps<MapParamList, 'PlannerScreen'>) {
  const mapRef = useRef<MapView | null>(null)
  const [sheetIndex, setSheetIndex] = useState(1)
  const provider = route?.params?.provider
  const legs = route?.params?.legs
  const isScooter = route?.params?.isScooter
  const bottomSheetSnapPoints = [
    BOTTOM_VEHICLE_BAR_HEIGHT_ALL + 30,
    '60%',
    '95%',
  ]
  const { height } = useWindowDimensions()
  const { getLocationWithPermission } = useContext(GlobalStateContext)
  // keep this in sync with the middle bottomSheetSnapPoint percentage
  const middleSnapPointMapPadding = 0.5 * (height - BOTTOM_TAB_NAVIGATOR_HEIGHT) // TODO add top bar to the equation instead of rounding down to 0.5
  const bottomMapPaddingForSheeptSnapPoints = [
    BOTTOM_VEHICLE_BAR_HEIGHT_ALL + 30,
    middleSnapPointMapPadding,
    middleSnapPointMapPadding,
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
    [legs]
  )

  const moveMapToCurrentLocation = useCallback(
    async (
      permisionDeniedCallback: () => Promise<
        Location.LocationObject | undefined | null
      >
    ) => {
      const currentLocation = await permisionDeniedCallback()
      if (currentLocation) {
        mapRef.current?.animateCamera({ center: currentLocation.coords })
      }
    },
    []
  )

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 48.1512015,
          longitude: 17.1110118,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onLayout={() => mapRef.current?.fitToCoordinates(allMarkers)}
        showsUserLocation
        showsMyLocationButton={false}
        mapPadding={{
          // this tells it not to render anything interesting under the bottom sheet
          // needs finetuning but as a quick hack does the job
          bottom: bottomMapPaddingForSheeptSnapPoints[sheetIndex],
          top: 0,
          right: 0,
          left: 0,
        }}
      >
        {legs?.reduce<JSX.Element[]>((accumulator, leg, index) => {
          if (leg.legGeometry.points) {
            const latlngs = googlePolyline.decode(leg.legGeometry.points)
            const color = hexToRgba(
              leg.rentedBike
                ? getColor(provider) || '#aaa'
                : leg.routeColor
                ? `#${leg.routeColor}`
                : modeColors[leg.mode || 'DEFAULT'],
              0.6
            )
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
      {Platform.select({ ios: true, android: true }) && (
        <View style={styles.currentLocation}>
          <TouchableOpacity
            onPress={() =>
              moveMapToCurrentLocation(() => getLocationWithPermission(true))
            }
          >
            <CurrentLocationSvg />
          </TouchableOpacity>
        </View>
      )}
      <BottomSheet
        index={1}
        snapPoints={bottomSheetSnapPoints}
        onChange={setSheetIndex}
      >
        <TextItinerary
          legs={aggregateBicycleLegs(legs)}
          provider={provider}
          isScooter={isScooter}
        />
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
  currentLocation: {
    position: 'absolute',
    top: 10,
    right: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    ...s.shadow,
    elevation: 7,
  },
})
