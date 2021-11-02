import React, {
  useCallback,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps'
import { StyleSheet, View, ImageURISource } from 'react-native'
import BottomSheet from 'reanimated-bottom-sheet'
import * as Location from 'expo-location'
import { TouchableHighlight } from 'react-native-gesture-handler'

import CurrentLocationSvg from '@images/current-location.svg'
import ErrorView from '@components/ErrorView'
import useRekolaData from '@hooks/useRekolaData'
import useSlovnaftbajkData from '@hooks/useSlovnaftbajkData'
import useTierData from '@hooks/useTierData'
import useMhdData from '@hooks/useMhdStopsData'
import useZseChargersData from '@hooks/useZseChargersData'
import { GlobalStateContext } from '@components/common/GlobalStateProvider'
import {
  FreeBikeStatusProps,
  LocalitiesProps,
  MhdStopProps,
  StationProps,
} from '@utils/validation'
import StationMhdInfo from './ui/StationMhdInfo/StationMhdInfo'

import { s } from '@utils/globalStyles'
import { colors } from '@utils/theme'
import { useLocationWithPermision } from '@hooks/miscHooks'
import { BikeProvider, VehicleType } from '../types'
import SearchBar from './ui/SearchBar/SearchBar'
import VehicleBar from './ui/VehicleBar/VehicleBar'
import LoadingView from './ui/LoadingView/LoadingView'
import { renderHeader } from '@components/BottomSheetHeader'

const MIN_DELTA_FOR_XS_MARKER = 0.05
const MIN_DELTA_FOR_SM_MARKER = 0.03
const MIN_DELTA_FOR_MD_MARKER = 0.01

type markerIcon = {
  xs: ImageURISource
  sm: ImageURISource
  md: ImageURISource
  lg: ImageURISource
}

const markerIcons: { [index: string]: markerIcon } = {
  mhd: {
    xs: require('../assets/images/map/mhd/xs.png'),
    sm: require('../assets/images/map/mhd/sm.png'),
    md: require('../assets/images/map/mhd/md.png'),
    lg: require('../assets/images/map/mhd/lg.png'),
  },
  scooter: {
    xs: require('../assets/images/map/scooter/xs.png'),
    sm: require('../assets/images/map/scooter/sm.png'),
    md: require('../assets/images/map/scooter/md.png'),
    lg: require('../assets/images/map/scooter/lg.png'),
  },
  slovnaftbajk: {
    xs: require('../assets/images/map/slovnaftbajk/xs.png'),
    sm: require('../assets/images/map/slovnaftbajk/sm.png'),
    md: require('../assets/images/map/slovnaftbajk/md.png'),
    lg: require('../assets/images/map/slovnaftbajk/lg.png'),
  },
  rekola: {
    xs: require('../assets/images/map/rekola/xs.png'),
    sm: require('../assets/images/map/rekola/sm.png'),
    md: require('../assets/images/map/rekola/md.png'),
    lg: require('../assets/images/map/rekola/lg.png'),
  },
  charger: {
    xs: require('../assets/images/map/charger/xs.png'),
    sm: require('../assets/images/map/charger/sm.png'),
    md: require('../assets/images/map/charger/md.png'),
    lg: require('../assets/images/map/charger/lg.png'),
  },
}

export default function MapScreen() {
  // TODO handle loading / error
  const {
    data: dataMhd,
    isLoading: isLoadingMhd,
    errors: errorsMhd,
  } = useMhdData()
  const { data: dataTier, isLoading: isLoadingTier } = useTierData()
  const { data: dataZseChargers, isLoading: isLoadingZseChargers } =
    useZseChargersData()
  const { data: dataMergedRekola, isLoading: isLoadingRekola } = useRekolaData()
  const { data: dataMergedSlovnaftbajk, isLoading: isLoadingSlovnaftbajk } =
    useSlovnaftbajkData()

  const mapRef = useRef<MapView>(null)

  const vehiclesContext = useContext(GlobalStateContext)

  const [selectedStation, setSelectedStation] = useState<
    StationProps | undefined
  >(undefined)
  const [selectedMhdStation, setSelectedMhdStation] = useState<
    MhdStopProps | undefined
  >(undefined)
  const [region, setRegion] = useState<Region | null>({
    latitude: 48.1512015,
    longitude: 17.1110118,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const { getLocationWithPermission } = useLocationWithPermision()

  const bottomSheetRef = useRef<BottomSheet>(null)

  const bottomSheetSnapPoints = useMemo(() => ['100%', '60%', 0], [])

  const moveMapToCurrentLocation = useCallback(
    async (
      permisionDeniedCallback: () => Promise<
        Location.LocationObject | undefined
      >
    ) => {
      const currentLocation = await permisionDeniedCallback()
      if (currentLocation) {
        mapRef.current?.fitToCoordinates(
          [
            currentLocation.coords,
            {
              latitude: currentLocation.coords.latitude + 0.0025,
              longitude: currentLocation.coords.longitude + 0.002,
            },
            {
              latitude: currentLocation.coords.latitude - 0.0025,
              longitude: currentLocation.coords.longitude - 0.002,
            },
          ],
          {
            edgePadding: { bottom: 100, top: 100, left: 100, right: 100 },
          }
        )
      }
    },
    []
  )

  useEffect(() => {
    setTimeout(() => {
      moveMapToCurrentLocation(() => getLocationWithPermission(false))
    }, 2000)
  }, [getLocationWithPermission, moveMapToCurrentLocation])

  useEffect(() => {
    if (selectedMhdStation) {
      bottomSheetRef.current?.snapTo(1)
    } else {
      bottomSheetRef.current?.snapTo(2)
    }
  }, [selectedMhdStation, bottomSheetRef])

  const handleSheetClose = () => {
    setSelectedMhdStation(undefined)
  }

  const getIcon = useCallback(
    (name: 'mhd' | 'scooter' | 'slovnaftbajk' | 'rekola' | 'charger') => {
      const latDelta = region?.latitudeDelta
      const icons = markerIcons[name]
      if (latDelta) {
        return latDelta >= MIN_DELTA_FOR_XS_MARKER
          ? icons.xs
          : latDelta >= MIN_DELTA_FOR_SM_MARKER
          ? icons.sm
          : latDelta >= MIN_DELTA_FOR_MD_MARKER
          ? icons.md
          : icons.lg
      } else {
        return undefined
      }
    },
    [region]
  )

  const filterInView = useCallback(
    (pointLat: number, pointLon: number, region: Region) => {
      const latOk =
        pointLat > region.latitude - region.latitudeDelta / 2 &&
        pointLat < region.latitude + region.latitudeDelta / 2
      const lonOk =
        pointLon > region.longitude - region.longitudeDelta / 2 &&
        pointLon < region.longitude + region.longitudeDelta / 2
      return latOk && lonOk
    },
    []
  )

  const filterMhdInView = useCallback(
    (data: MhdStopProps[]) => {
      if (region) {
        const inRange = data.filter((stop) => {
          return filterInView(
            parseFloat(stop.gpsLat),
            parseFloat(stop.gpsLon),
            region
          )
        })
        return inRange
      }
      return []
    },
    [filterInView, region]
  )

  const filterBikeInView = useCallback(
    (data: StationProps[]) => {
      if (region) {
        const inRange = data.filter((stop) => {
          if (stop.lat && stop.lon) {
            return filterInView(stop.lat, stop.lon, region)
          }
          return false
        })
        return inRange
      }
      return []
    },
    [filterInView, region]
  )

  const filterTierInView = useCallback(
    (data: FreeBikeStatusProps[]) => {
      if (region) {
        const inRange = data.filter((stop) => {
          if (stop.lat && stop.lon) {
            return filterInView(stop.lat, stop.lon, region)
          }
          return false
        })
        return inRange
      }
      return []
    },
    [filterInView, region]
  )

  const filterZseChargersInView = useCallback(
    (data: LocalitiesProps) => {
      if (region && data) {
        const inRange = data.filter((stop) => {
          if (stop?.coordinates.latitude && stop?.coordinates.longitude) {
            return filterInView(
              stop?.coordinates.latitude,
              stop?.coordinates.longitude,
              region
            )
          }
          return false
        })
        return inRange
      }
      return []
    },
    [filterInView, region]
  )

  const renderStations = useCallback(
    (data: StationProps[], bikeProvider: BikeProvider) => {
      return filterBikeInView(data).reduce<JSX.Element[]>(
        (accumulator, station) => {
          if (station.lat && station.lon && station.station_id) {
            const marker = (
              <Marker
                key={station.station_id}
                coordinate={{ latitude: station.lat, longitude: station.lon }}
                tracksViewChanges={false}
                onPress={() => setSelectedStation(station)}
                icon={
                  bikeProvider === BikeProvider.rekola
                    ? getIcon('rekola')
                    : bikeProvider === BikeProvider.slovnaftbajk
                    ? getIcon('slovnaftbajk')
                    : undefined
                }
              />
            )
            return accumulator.concat(marker)
          }
          return accumulator
        },
        []
      )
    },
    [filterBikeInView, getIcon]
  )

  return (
    <View style={styles.container}>
      {errorsMhd ? (
        <ErrorView error={errorsMhd} />
      ) : (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 48.1512015,
            longitude: 17.1110118,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onRegionChangeComplete={(region) => setRegion(region)}
        >
          {vehiclesContext.vehicleTypes?.find(
            (vehicleType) => vehicleType.id === VehicleType.mhd
          )?.show &&
            dataMhd?.stops &&
            filterMhdInView(dataMhd.stops).map((stop) => (
              <Marker
                key={stop.id}
                coordinate={{
                  latitude: parseFloat(stop.gpsLat),
                  longitude: parseFloat(stop.gpsLon),
                }}
                tracksViewChanges={false}
                onPress={() => setSelectedMhdStation(stop)}
                icon={getIcon('mhd')}
              />
            ))}
          {vehiclesContext.vehicleTypes?.find(
            (vehicleType) => vehicleType.id === VehicleType.scooter
          )?.show &&
            dataTier &&
            filterTierInView(dataTier).map((vehicle) => {
              return (
                <Marker
                  key={vehicle.bike_id}
                  coordinate={{ latitude: vehicle.lat, longitude: vehicle.lon }}
                  tracksViewChanges={false}
                  icon={getIcon('scooter')}
                />
              )
            })}

          {vehiclesContext.vehicleTypes?.find(
            (vehicleType) => vehicleType.id === VehicleType.bicycle
          )?.show &&
            dataMergedRekola &&
            renderStations(dataMergedRekola, BikeProvider.rekola)}
          {vehiclesContext.vehicleTypes?.find(
            (vehicleType) => vehicleType.id === VehicleType.bicycle
          )?.show &&
            dataMergedSlovnaftbajk &&
            renderStations(dataMergedSlovnaftbajk, BikeProvider.slovnaftbajk)}
          {vehiclesContext.vehicleTypes?.find(
            (vehicleType) => vehicleType.id === VehicleType.chargers
          )?.show &&
            dataZseChargers &&
            filterZseChargersInView(dataZseChargers).reduce<JSX.Element[]>(
              (accumulator, charger) => {
                if (
                  charger.coordinates.latitude &&
                  charger.coordinates.longitude
                ) {
                  const marker = (
                    <Marker
                      key={charger.id}
                      coordinate={{
                        latitude: charger.coordinates.latitude,
                        longitude: charger.coordinates.longitude,
                      }}
                      tracksViewChanges={false}
                      icon={getIcon('charger')}
                    />
                  )
                  return accumulator.concat(marker)
                } else return accumulator
              },
              []
            )}
        </MapView>
      )}
      {isLoadingMhd ||
      isLoadingRekola ||
      isLoadingSlovnaftbajk ||
      isLoadingTier ||
      isLoadingZseChargers ? (
        <LoadingView />
      ) : null}
      <View style={styles.currentLocation}>
        <TouchableHighlight
          onPress={() =>
            moveMapToCurrentLocation(() => getLocationWithPermission(true))
          }
        >
          <CurrentLocationSvg />
        </TouchableHighlight>
      </View>
      <SearchBar />
      <VehicleBar />
      <BottomSheet
        ref={bottomSheetRef}
        onCloseEnd={handleSheetClose}
        snapPoints={bottomSheetSnapPoints}
        enabledContentTapInteraction={false}
        renderHeader={renderHeader}
        renderContent={() => {
          return (
            <View style={styles.bottomSheetInnerStyle}>
              {selectedMhdStation && (
                <StationMhdInfo station={selectedMhdStation} />
              )}
            </View>
          )
        }}
      ></BottomSheet>
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
  bottomSheetInnerStyle: {
    backgroundColor: 'white',
    height: '100%',
    display: 'flex',
    paddingBottom: 50,
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
    bottom: 150,
    right: 30,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    ...s.shadow,
    elevation: 7,
  },
})
