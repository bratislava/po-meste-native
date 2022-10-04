import BottomSheet from '@gorhom/bottom-sheet'
import { useNetInfo } from '@react-native-community/netinfo'
import { useIsFocused } from '@react-navigation/core'
import i18n from 'i18n-js'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Animated,
  ImageURISource,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps'

import {
  useHealthData,
  useRekolaData,
  useSlovnaftbajkData,
  useTierData,
} from '@hooks'

import {
  BOTTOM_VEHICLE_BAR_HEIGHT_ALL,
  ErrorView,
  LoadingView,
  VehicleBar,
} from '@components'

import { GlobalStateContext } from '@state/GlobalStateProvider'

import { useZseChargersData } from '@hooks'
import {
  BikeProvider,
  IconType,
  MicromobilityProvider,
  VehicleType,
  ZoomLevel,
} from '@types'
import {
  ChargerStationProps,
  FreeBikeStatusProps,
  getZoomLevel,
  LocalitiesProps,
  MhdStopProps,
  s,
  StationMicromobilityProps,
} from '@utils'

import { BOTTOM_TAB_NAVIGATOR_HEIGHT } from '@components/navigation/TabBar'

import SearchBar from './_partials/SearchBar'
import StationChargerInfo from './_partials/StationChargerInfo'
import StationMhdInfo from './_partials/StationMhdInfo'
import StationMicromobilityInfo from './_partials/StationMicromobilityInfo'

import { customMapStyle } from '../customMapStyle'

import CurrentLocationButton from '@components/CurrentLocationButton'
import useBoltData from '@hooks/useBoltData'
import { colors } from '@utils'

const VEHICLE_BAR_SHEET_HEIGHT_COLLAPSED = BOTTOM_TAB_NAVIGATOR_HEIGHT + 70
const VEHICLE_BAR_SHEET_HEIGHT_EXPANDED = BOTTOM_TAB_NAVIGATOR_HEIGHT + 195 // + 195 for 2 rows

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
  bolt: {
    xs: require('@icons/map/bolt/xs.png'),
    sm: require('@icons/map/bolt/sm.png'),
    md: require('@icons/map/bolt/md.png'),
    lg: require('@icons/map/bolt/lg.png'),
  },
}

export default function MapScreen() {
  const netInfo = useNetInfo()
  const vehiclesContext = useContext(GlobalStateContext)
  // TODO handle loading / error
  const {
    data: dataMhd,
    isLoading: isLoadingMhd,
    errors: errorsMhd,
    refetch: refetchMhd,
  } = vehiclesContext.mhdStopsData
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
  const {
    data: dataBolt,
    isLoading: isLoadingBolt,
    errors: errorsBolt,
    refetch: refetchBolt,
  } = useBoltData()
  const { data: healthData, error: healthError } = useHealthData()
  const providerStatus = healthData?.dependencyResponseStatus

  const [isMhdErrorOpen, setIsMhdErrorOpen] = useState(false)
  const [isTierErrorOpen, setIsTierErrorOpen] = useState(false)
  const [isZseErrorOpen, setIsZseErrorOpen] = useState(false)
  const [isRekolaErrorOpen, setIsRekolaErrorOpen] = useState(false)
  const [isSlovnaftbajkErrorOpen, setIsSlovnaftbajkErrorOpen] = useState(false)
  const [isBoltErrorOpen, setIsBoltErrorOpen] = useState(false)

  const mapRef = useRef<MapView>(null)

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
  // useful on Android, where the elevation shadow causes incorrect ordering of elements
  const [showCurrentLocationButton, setShowCurrentLocationButton] =
    useState(true)

  const [vehicleSheetIndex, setVehicleSheetIndex] = useState(1)

  const bottomSheetRef = useRef<BottomSheet>(null)
  const vehicleSheetRef = useRef<BottomSheet>(null)

  const bottomSheetSnapPoints = useMemo(() => {
    if (selectedMicromobilityStation) {
      return ['50%']
    } else {
      return ['50%', '95%']
    }
  }, [selectedMicromobilityStation, selectedMhdStation, selectedChargerStation])

  const isFocused = useIsFocused()

  const refetch = useCallback(() => {
    refetchTier()
    // TODO add SlovnaftbajkData rekola, zseChargers
  }, [refetchTier])

  useEffect(() => {
    if (isFocused) {
      refetch()
    }
  }, [isFocused])

  useEffect(() => {
    if (
      selectedMhdStation ||
      selectedMicromobilityStation ||
      selectedChargerStation
    ) {
      vehicleSheetRef.current?.snapToIndex(0)
      bottomSheetRef.current?.snapToIndex(0)
    } else {
      bottomSheetRef.current?.snapToIndex(-1)
    }
  }, [
    selectedMhdStation,
    selectedMicromobilityStation,
    selectedChargerStation,
    bottomSheetRef,
  ])

  const handleSheetClose = () => {
    operateBottomSheet({})
  }

  const zoomLevel = getZoomLevel(region)

  const operateBottomSheet = ({
    charger,
    micromobilityStation,
    micromobilityProvider,
    mhd,
  }: {
    charger?: ChargerStationProps
    micromobilityStation?: StationMicromobilityProps | FreeBikeStatusProps
    micromobilityProvider?: MicromobilityProvider
    mhd?: MhdStopProps
  }) => {
    if (zoomLevel > ZoomLevel.xs) {
      setSelectedChargerStation(charger)
      setSelectedBikeStation(micromobilityStation)
      setSelectedMicromobilityProvider(micromobilityProvider)
      setSelectedMhdStation(mhd)
    }
  }

  const getIcon = useCallback(
    (name: IconType) => {
      const icons = markerIcons[name]
      switch (getZoomLevel(region)) {
        case ZoomLevel.xs:
          return icons.xs
        case ZoomLevel.sm:
          return icons.sm
        case ZoomLevel.md:
          return icons.md
        case ZoomLevel.lg:
          return icons.lg
        default:
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
      if (region && Array.isArray(data)) {
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

  const filterScootersInView = useCallback(
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
                onPress={() =>
                  operateBottomSheet({
                    micromobilityStation: station,
                    micromobilityProvider:
                      bikeProvider === BikeProvider.rekola
                        ? MicromobilityProvider.rekola
                        : MicromobilityProvider.slovnaftbajk,
                  })
                }
                icon={
                  bikeProvider === BikeProvider.rekola
                    ? getIcon(IconType.rekola)
                    : bikeProvider === BikeProvider.slovnaftbajk
                    ? getIcon(IconType.slovnaftbajk)
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

  useEffect(() => setIsMhdErrorOpen(!!errorsMhd), [errorsMhd])
  useEffect(() => setIsTierErrorOpen(!!errorsTier), [errorsTier])
  useEffect(() => setIsZseErrorOpen(!!errorsZseChargers), [errorsZseChargers])
  useEffect(() => setIsRekolaErrorOpen(!!errorsRekola), [errorsRekola])
  useEffect(
    () => setIsSlovnaftbajkErrorOpen(!!errorsSlovnaftbajk),
    [errorsSlovnaftbajk]
  )

  const filterScooterAmount = (scooter: FreeBikeStatusProps, index: number) =>
    zoomLevel === ZoomLevel.xs ? index % 3 === 0 : true
  const filterMhdAmount = (mhdStop: MhdStopProps) =>
    zoomLevel === ZoomLevel.xs ? mhdStop.platform === 'A' : true

  const moveAnim = useRef(new Animated.Value(0)).current
  const moveCurrentLocationIcon = (index: number) => {
    Animated.timing(moveAnim, {
      toValue:
        index === 0
          ? VEHICLE_BAR_SHEET_HEIGHT_EXPANDED -
            VEHICLE_BAR_SHEET_HEIGHT_COLLAPSED
          : 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        customMapStyle={customMapStyle}
        initialRegion={{
          latitude: 48.1512015,
          longitude: 17.1110118,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onRegionChangeComplete={(region) => setRegion(region)}
        showsUserLocation
        showsMyLocationButton={false}
        mapPadding={{
          bottom: BOTTOM_VEHICLE_BAR_HEIGHT_ALL + 5,
          top: 80,
          right: 0,
          left: 0,
        }}
      >
        {vehiclesContext.vehicleTypes?.find(
          (vehicleType) => vehicleType.id === VehicleType.mhd
        )?.show &&
          dataMhd?.stops &&
          filterMhdInView(dataMhd.stops)
            .filter(filterMhdAmount)
            .map((stop) => (
              <Marker
                key={stop.id}
                coordinate={{
                  latitude: parseFloat(stop.gpsLat),
                  longitude: parseFloat(stop.gpsLon),
                }}
                tracksViewChanges={false}
                onPress={() => operateBottomSheet({ mhd: stop })}
                icon={getIcon(IconType.mhd)}
              >
                {stop.platform &&
                  zoomLevel === ZoomLevel.lg &&
                  (Platform.OS === 'android' ? (
                    <View style={markerLabelStyles.container}>
                      <Text style={markerLabelStyles.label}>
                        {stop.platform}
                      </Text>
                    </View>
                  ) : null)}
              </Marker>
            ))}
        {vehiclesContext.vehicleTypes?.find(
          (vehicleType) => vehicleType.id === VehicleType.scooter
        )?.show &&
          dataTier &&
          filterScootersInView(dataTier)
            .filter(filterScooterAmount)
            .map((vehicle) => {
              return (
                <Marker
                  key={vehicle.bike_id}
                  coordinate={{ latitude: vehicle.lat, longitude: vehicle.lon }}
                  tracksViewChanges={false}
                  onPress={() =>
                    operateBottomSheet({
                      micromobilityStation: vehicle,
                      micromobilityProvider: MicromobilityProvider.tier,
                    })
                  }
                  icon={getIcon(IconType.tier)}
                />
              )
            })}
        {vehiclesContext.vehicleTypes?.find(
          (vehicleType) => vehicleType.id === VehicleType.scooter
        )?.show &&
          dataBolt &&
          filterScootersInView(dataBolt)
            .filter(filterScooterAmount)
            .map((vehicle) => {
              return (
                <Marker
                  key={vehicle.bike_id}
                  coordinate={{ latitude: vehicle.lat, longitude: vehicle.lon }}
                  tracksViewChanges={false}
                  onPress={() =>
                    operateBottomSheet({
                      micromobilityStation: vehicle,
                      micromobilityProvider: MicromobilityProvider.bolt,
                    })
                  }
                  icon={getIcon(IconType.bolt)}
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
                    icon={getIcon(IconType.zse)}
                    onPress={() => operateBottomSheet({ charger })}
                  />
                )
                return accumulator.concat(marker)
              } else return accumulator
            },
            []
          )}
      </MapView>
      {(!netInfo.isConnected ||
        isLoadingMhd ||
        (isLoadingRekola && providerStatus?.rekola === 200) ||
        (isLoadingSlovnaftbajk && providerStatus?.slovnaftbajk === 200) ||
        (isLoadingTier && providerStatus?.tier === 200) ||
        (isLoadingZseChargers && providerStatus?.zse === 200) ||
        (isLoadingBolt && providerStatus?.bolt === 200)) && (
        <LoadingView fullscreen iconWidth={80} iconHeight={80} />
      )}
      <SearchBar />
      {isMhdErrorOpen &&
        dataError(
          isLoadingMhd,
          errorsMhd,
          () => {
            refetchMhd()
            setIsMhdErrorOpen(false)
          },
          i18n.t('components.ErrorView.dataMhdStopsError')
        )}
      {isRekolaErrorOpen &&
        dataError(
          isLoadingRekola,
          errorsRekola,
          () => {
            refetchRekola()
            setIsRekolaErrorOpen(false)
          },
          i18n.t('components.ErrorView.dataRekolaError')
        )}
      {isSlovnaftbajkErrorOpen &&
        dataError(
          isLoadingSlovnaftbajk,
          errorsSlovnaftbajk,
          () => {
            refetchSlovnaftbajk()
            setIsSlovnaftbajkErrorOpen(false)
          },
          i18n.t('components.ErrorView.dataSlovnaftbajkError')
        )}
      {isTierErrorOpen &&
        dataError(
          isLoadingTier,
          errorsTier,
          () => {
            refetchTier()
            setIsTierErrorOpen(false)
          },
          i18n.t('components.ErrorView.dataTierError')
        )}
      {isZseErrorOpen &&
        dataError(
          isLoadingZseChargers,
          errorsZseChargers,
          () => {
            refetchZseChargers()
            setIsZseErrorOpen(false)
          },
          i18n.t('components.ErrorView.dataZseChargersError')
        )}
      {isBoltErrorOpen &&
        dataError(
          isLoadingBolt,
          errorsBolt,
          () => {
            refetchBolt()
            setIsBoltErrorOpen(false)
          },
          i18n.t('components.ErrorView.dataBoltError')
        )}

      {showCurrentLocationButton && (
        <Animated.View
          style={{
            transform: [{ translateY: moveAnim }],
            position: 'absolute',
            right: 20,
            bottom: VEHICLE_BAR_SHEET_HEIGHT_EXPANDED + 70,
          }}
        >
          <CurrentLocationButton mapRef={mapRef} />
        </Animated.View>
      )}
      <BottomSheet
        ref={vehicleSheetRef}
        style={{ zIndex: 2 }}
        handleIndicatorStyle={{ ...s.handleStyle, marginBottom: 0 }}
        index={1}
        snapPoints={[
          VEHICLE_BAR_SHEET_HEIGHT_COLLAPSED,
          VEHICLE_BAR_SHEET_HEIGHT_EXPANDED,
        ]}
        onChange={(index) => {
          setVehicleSheetIndex(index)
          moveCurrentLocationIcon(index)
        }}
      >
        <VehicleBar />
      </BottomSheet>
      <BottomSheet
        handleIndicatorStyle={s.handleStyle}
        ref={bottomSheetRef}
        style={{ zIndex: 1 }}
        index={-1}
        snapPoints={bottomSheetSnapPoints}
        enablePanDownToClose
        onClose={handleSheetClose}
        onAnimate={(fromIndex, toIndex) => {
          if (toIndex === -1) {
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
        ) : selectedMhdStation ? (
          <StationMhdInfo station={selectedMhdStation} />
        ) : null}
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

export const markerLabelStyles = StyleSheet.create({
  container: {
    marginLeft: 5.5,
    marginTop: 18,
    backgroundColor: 'white',
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 3,
    paddingTop: 1,
  },
  label: {
    fontWeight: '700',
    fontSize: 8,
    lineHeight: 8,
    textAlignVertical: 'bottom',
  },
})
