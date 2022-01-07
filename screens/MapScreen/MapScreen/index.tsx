import React, {
  useCallback,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps'
import { StyleSheet, View, ImageURISource, Platform, Image } from 'react-native'
import BottomSheet from '@gorhom/bottom-sheet'
import * as Location from 'expo-location'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useIsFocused } from '@react-navigation/core'
import i18n from 'i18n-js'

import { useRekolaData, useSlovnaftbajkData, useTierData } from '@hooks'

import {
  ErrorView,
  LoadingView,
  VehicleBar,
  BOTTOM_VEHICLE_BAR_HEIGHT_ALL,
} from '@components'

import { GlobalStateContext } from '@state/GlobalStateProvider'

import {
  useMhdStopsData,
  useZseChargersData,
  useLocationWithPermision,
} from '@hooks'
import {
  ChargerStationProps,
  FreeBikeStatusProps,
  LocalitiesProps,
  MhdStopProps,
  StationMicromobilityProps,
  s,
} from '@utils'
import {
  BikeProvider,
  IconType,
  MicromobilityProvider,
  VehicleType,
} from '@types'

import { BOTTOM_TAB_NAVIGATOR_HEIGHT } from '@components/navigation/TabBar'

import SearchBar from './_partials/SearchBar'
import StationMhdInfo from './_partials/StationMhdInfo'
import StationMicromobilityInfo from './_partials/StationMicromobilityInfo'
import StationChargerInfo from './_partials/StationChargerInfo'

import CurrentLocationSvg from '@icons/current-location.svg'

const MIN_DELTA_FOR_XS_MARKER = 0.05
const MIN_DELTA_FOR_SM_MARKER = 0.03
const MIN_DELTA_FOR_MD_MARKER = 0.01

const SPACING = 7.5

type markerIcon = {
  xs: ImageURISource
  sm: ImageURISource
  md: ImageURISource
  lg: ImageURISource
}

const markerIcons: { [index: string]: markerIcon } = {
  mhd: {
    xs: require('@icons/map/mhd/xs.png'),
    sm: require('@icons/map/mhd/sm.png'),
    md: require('@icons/map/mhd/md.png'),
    lg: require('@icons/map/mhd/lg.png'),
  },
  tier: {
    xs: require('@icons/map/tier/xs.png'),
    sm: require('@icons/map/tier/sm.png'),
    md: require('@icons/map/tier/md.png'),
    lg: require('@icons/map/tier/lg.png'),
  },
  slovnaftbajk: {
    xs: require('@icons/map/slovnaftbajk/xs.png'),
    sm: require('@icons/map/slovnaftbajk/sm.png'),
    md: require('@icons/map/slovnaftbajk/md.png'),
    lg: require('@icons/map/slovnaftbajk/lg.png'),
  },
  rekola: {
    xs: require('@icons/map/rekola/xs.png'),
    sm: require('@icons/map/rekola/sm.png'),
    md: require('@icons/map/rekola/md.png'),
    lg: require('@icons/map/rekola/lg.png'),
  },
  zse: {
    xs: require('@icons/map/zse/xs.png'),
    sm: require('@icons/map/zse/sm.png'),
    md: require('@icons/map/zse/md.png'),
    lg: require('@icons/map/zse/lg.png'),
  },
}

export default function MapScreen() {
  // TODO handle loading / error
  const {
    data: dataMhd,
    isLoading: isLoadingMhd,
    errors: errorsMhd,
    refetch: refetchMhd,
  } = useMhdStopsData()

  const {
    data: dataTier,
    isLoading: isLoadingTier,
    refetch: refetchTier,
    errors: errorsTier,
  } = useTierData()
  const {
    data: dataZseChargers,
    isLoading: isLoadingZseChargers,
    errors: errorsZseChargers,
    refetch: refetchZseChargers,
  } = useZseChargersData()
  const {
    data: dataMergedRekola,
    isLoading: isLoadingRekola,
    error: errorsRekola,
    refetch: refetchRekola,
  } = useRekolaData()
  const {
    data: dataMergedSlovnaftbajk,
    isLoading: isLoadingSlovnaftbajk,
    error: errorsSlovnaftbajk,
    refetch: refetchSlovnaftbajk,
  } = useSlovnaftbajkData()

  const mapRef = useRef<MapView>(null)

  const vehiclesContext = useContext(GlobalStateContext)

  const [selectedMicromobilityStation, setSelectedBikeStation] = useState<
    StationMicromobilityProps | FreeBikeStatusProps | undefined
  >(undefined)
  const [selectedMicromobilityProvider, setSelectedMicromobilityProvider] =
    useState<MicromobilityProvider | undefined>(undefined)
  const [selectedMhdStation, setSelectedMhdStation] = useState<
    MhdStopProps | undefined
  >(undefined)
  const [selectedChargerStation, setSelectedChargerStation] = useState<
    ChargerStationProps | undefined
  >(undefined)
  const [region, setRegion] = useState<Region | null>({
    latitude: 48.1512015,
    longitude: 17.1110118,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const { getLocationWithPermission } = useLocationWithPermision()
  // useful on Android, where the elevation shadow causes incorrect ordering of elements
  const [showCurrentLocationButton, setShowCurrentLocationButton] =
    useState(true)

  const bottomSheetRef = useRef<BottomSheet>(null)

  const bottomSheetSnapPoints = useMemo(() => {
    if (selectedMicromobilityStation) {
      return ['50%']
    } else {
      return ['50%', '95%']
    }
  }, [selectedMicromobilityStation])

  const isFocused = useIsFocused()

  const refetch = useCallback(() => {
    refetchTier()
    // TODO add SlovnaftbajkData rekola, zseChargers
  }, [refetchTier])

  useEffect(() => {
    if (isFocused) {
      refetch()
    }
  }, [isFocused, refetch])

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
    if (
      selectedMhdStation ||
      selectedMicromobilityStation ||
      selectedChargerStation
    ) {
      bottomSheetRef.current?.snapToIndex(0)
    }
  }, [
    selectedMhdStation,
    selectedMicromobilityStation,
    selectedChargerStation,
    bottomSheetRef,
  ])

  const handleSheetClose = () => {
    setSelectedMhdStation(undefined)
    setSelectedBikeStation(undefined)
    setSelectedMicromobilityProvider(undefined)
    setSelectedChargerStation(undefined)
  }

  const getIcon = useCallback(
    (name: IconType) => {
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
    (data: StationMicromobilityProps[]) => {
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
    (data: StationMicromobilityProps[], bikeProvider: BikeProvider) => {
      return filterBikeInView(data).reduce<JSX.Element[]>(
        (accumulator, station) => {
          if (station.lat && station.lon && station.station_id) {
            const marker = (
              <Marker
                key={station.station_id}
                coordinate={{ latitude: station.lat, longitude: station.lon }}
                tracksViewChanges={false}
                onPress={() => {
                  setSelectedMhdStation(undefined)
                  setSelectedBikeStation(station)
                  setSelectedMicromobilityProvider(
                    bikeProvider === BikeProvider.rekola
                      ? MicromobilityProvider.rekola
                      : MicromobilityProvider.slovnaftbajk
                  )
                  setSelectedChargerStation(undefined)
                }}
                icon={
                  Platform.OS === 'android'
                    ? bikeProvider === BikeProvider.rekola
                      ? getIcon(IconType.rekola)
                      : bikeProvider === BikeProvider.slovnaftbajk
                      ? getIcon(IconType.slovnaftbajk)
                      : undefined
                    : undefined
                }
                image={
                  Platform.OS === 'ios'
                    ? bikeProvider === BikeProvider.rekola
                      ? getIcon(IconType.rekola)
                      : bikeProvider === BikeProvider.slovnaftbajk
                      ? getIcon(IconType.slovnaftbajk)
                      : undefined
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

  const dataError = (
    isLoading: boolean,
    errors: any,
    refetch: () => unknown,
    errorMessage: string
  ) => {
    if (!isLoading) {
      return (
        <View style={styles.errorBackground}>
          <ErrorView
            errorMessage={errorMessage}
            error={errors}
            action={refetch}
          />
        </View>
      )
    }
  }

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
        onRegionChangeComplete={(region) => setRegion(region)}
        showsUserLocation
        mapPadding={{
          bottom: BOTTOM_VEHICLE_BAR_HEIGHT_ALL + 5,
          top: 0,
          right: 0,
          left: 0,
        }}
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
              onPress={() => {
                setSelectedBikeStation(undefined)
                setSelectedChargerStation(undefined)
                setSelectedMicromobilityProvider(undefined)
                setSelectedMhdStation(stop)
              }}
              icon={
                Platform.OS === 'android' ? getIcon(IconType.mhd) : undefined
              }
              image={Platform.OS === 'ios' ? getIcon(IconType.mhd) : undefined}
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
                onPress={() => {
                  setSelectedMhdStation(undefined)
                  setSelectedChargerStation(undefined)
                  setSelectedBikeStation(vehicle)
                  setSelectedMicromobilityProvider(MicromobilityProvider.tier)
                }}
                icon={
                  Platform.OS === 'android' ? getIcon(IconType.tier) : undefined
                }
                image={
                  Platform.OS === 'ios' ? getIcon(IconType.tier) : undefined
                }
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
                    icon={
                      Platform.OS === 'android'
                        ? getIcon(IconType.zse)
                        : undefined
                    }
                    image={
                      Platform.OS === 'ios' ? getIcon(IconType.zse) : undefined
                    }
                    onPress={() => {
                      setSelectedMhdStation(undefined)
                      setSelectedBikeStation(undefined)
                      setSelectedMicromobilityProvider(undefined)
                      setSelectedChargerStation(charger)
                    }}
                  />
                )
                return accumulator.concat(marker)
              } else return accumulator
            },
            []
          )}
      </MapView>
      {(isLoadingMhd ||
        isLoadingRekola ||
        isLoadingSlovnaftbajk ||
        isLoadingTier ||
        isLoadingZseChargers) && (
        <LoadingView fullscreen iconWidth={80} iconHeight={80} />
      )}
      {Platform.select({ ios: true, android: showCurrentLocationButton }) && (
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
      <SearchBar />
      {errorsMhd &&
        dataError(
          isLoadingMhd,
          errorsMhd,
          refetchMhd,
          i18n.t('dataMhdStopsError')
        )}
      {errorsRekola &&
        dataError(
          isLoadingRekola,
          errorsRekola,
          refetchRekola,
          i18n.t('dataRekolaError')
        )}
      {errorsSlovnaftbajk &&
        dataError(
          isLoadingSlovnaftbajk,
          errorsSlovnaftbajk,
          refetchSlovnaftbajk,
          i18n.t('dataSlovnaftbajkError')
        )}
      {errorsTier &&
        dataError(
          isLoadingTier,
          errorsTier,
          refetchTier,
          i18n.t('dataTierError')
        )}
      {errorsZseChargers &&
        dataError(
          isLoadingZseChargers,
          errorsZseChargers,
          refetchZseChargers,
          i18n.t('dataZseChargersError')
        )}
      <VehicleBar />
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={bottomSheetSnapPoints}
        onClose={handleSheetClose}
        enablePanDownToClose
        onChange={(index) => {
          if (index === -1) {
            setShowCurrentLocationButton(true)
          } else {
            setShowCurrentLocationButton(false)
          }
        }}
      >
        {selectedChargerStation ? (
          <StationChargerInfo
            name={selectedChargerStation.name}
            openingTimes={selectedChargerStation.opening_times}
            numberOfParkingSpaces={
              selectedChargerStation.number_of_parking_spaces
            }
            connectors={selectedChargerStation.connectors}
          />
        ) : selectedMicromobilityStation && selectedMicromobilityProvider ? (
          <StationMicromobilityInfo
            station={selectedMicromobilityStation}
            provider={selectedMicromobilityProvider}
          />
        ) : (
          selectedMhdStation && <StationMhdInfo station={selectedMhdStation} />
        )}
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
    bottom: BOTTOM_TAB_NAVIGATOR_HEIGHT,
  },
  currentLocation: {
    position: 'absolute',
    bottom:
      BOTTOM_TAB_NAVIGATOR_HEIGHT + BOTTOM_VEHICLE_BAR_HEIGHT_ALL + SPACING,
    right: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    ...s.shadow,
    elevation: 7,
  },
  errorBackground: {
    display: 'flex',
    flex: 1,
    position: 'absolute',
    top: 100,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 15,
  },
})
