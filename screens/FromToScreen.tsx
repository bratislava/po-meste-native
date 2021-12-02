import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import i18n from 'i18n-js'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { useQuery } from 'react-query'
import { useNavigation } from '@react-navigation/native'
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete'
import { StackScreenProps } from '@react-navigation/stack'
import * as Location from 'expo-location'
import BottomSheet from '@gorhom/bottom-sheet'
import { Instant, LocalDateTime } from '@js-joda/core'

import { getTripPlanner } from '@utils/api'
import SearchFromToScreen from './SearchFromToScreen'
import TripMiniature from './ui/TripMiniature/TripMiniature'
import FromToSelector from './ui/FromToSelector/FromToSelector'
import VehicleSelector from './ui/VehicleSelector/VehicleSelector'

import BusSvg from '@images/bus.svg'
import CyclingSvg from '@images/cycling.svg'
import ScooterSvg from '@images/scooter.svg'
import WalkingSvg from '@images/walking.svg'
import { colors } from '@utils/theme'
import { getOtpTravelMode } from '@utils/utils'
import {
  MapParamList,
  MicromobilityProvider,
  TravelModes,
  TravelModesOtpApi,
  VehicleData,
} from '../types'
import FeedbackAsker from './ui/FeedbackAsker/FeedbackAsker'
import { GlobalStateContext } from '@components/GlobalStateProvider'
import { useLocationWithPermision } from '@hooks/miscHooks'
import LoadingView from './ui/LoadingView/LoadingView'

export default function FromToScreen({
  route,
}: StackScreenProps<MapParamList, 'FromToScreen'>) {
  const fromProp = route?.params?.from
  const fromPropCoordinates = useMemo(
    () =>
      (fromProp?.latitude !== undefined &&
        fromProp?.longitude !== undefined && {
          latitude: fromProp?.latitude,
          longitude: fromProp?.longitude,
        }) ||
      undefined,
    [fromProp]
  )
  const { getLocationWithPermission } = useLocationWithPermision()

  const fromPropName = fromProp?.name

  const navigation = useNavigation()
  const [fromCoordinates, setFromCoordinates] = useState(fromPropCoordinates)
  const [fromName, setFromName] = useState<string | undefined>(fromPropName)
  const [toCoordinates, setToCoordinates] = useState<
    | {
        latitude: number
        longitude: number
      }
    | undefined
  >(undefined)

  const [toName, setToName] = useState<string | undefined>(undefined)

  const fromRef = useRef<GooglePlacesAutocompleteRef | null>(null)
  const toRef = useRef<GooglePlacesAutocompleteRef | null>(null)
  const fromBottomSheetRef = useRef<BottomSheet>(null)
  const toBottomSheetRef = useRef<BottomSheet>(null)

  const [selectedVehicle, setSelectedVehicle] = useState<TravelModes>(
    TravelModes.mhd
  )

  const [locationPermisionError, setLocationPermisionError] =
    useState<string>('')
  const [fromGeocode, setFromGeocode] = useState<
    Location.LocationGeocodedAddress[] | null
  >(null)
  const [toGeocode, setToGeocode] = useState<
    Location.LocationGeocodedAddress[] | null
  >(null)

  const { data, isLoading, error } = useQuery(
    ['getOtpData', fromCoordinates, toCoordinates, selectedVehicle],
    () =>
      fromCoordinates &&
      toCoordinates &&
      getTripPlanner(
        `${fromCoordinates.latitude},${fromCoordinates.longitude}`,
        `${toCoordinates.latitude},${toCoordinates.longitude}`,
        new Date(),
        getOtpTravelMode(selectedVehicle)
      )
  )

  const {
    data: dataRekola,
    isLoading: isLoadingRekola,
    error: errorRekola,
  } = useQuery(
    ['getOtpRekolaData', fromCoordinates, toCoordinates],
    () =>
      fromCoordinates &&
      toCoordinates &&
      getTripPlanner(
        `${fromCoordinates.latitude},${fromCoordinates.longitude}`,
        `${toCoordinates.latitude},${toCoordinates.longitude}`,
        new Date(),
        TravelModesOtpApi.rented,
        MicromobilityProvider.rekola
      ),
    { enabled: fromCoordinates && toCoordinates ? true : false }
  )

  const {
    data: dataSlovnaftbajk,
    isLoading: isLoadingSlovnaftbajk,
    error: errorSlovnaftbajk,
  } = useQuery(
    ['getOtpSlovnaftbajkData', fromCoordinates, toCoordinates],
    () =>
      fromCoordinates &&
      toCoordinates &&
      getTripPlanner(
        `${fromCoordinates.latitude},${fromCoordinates.longitude}`,
        `${toCoordinates.latitude},${toCoordinates.longitude}`,
        new Date(),
        TravelModesOtpApi.rented,
        MicromobilityProvider.slovnaftbajk
      )
  )

  const {
    data: dataTier,
    isLoading: isLoadingTier,
    error: errorTier,
  } = useQuery(
    ['getOtpTierData', fromCoordinates, toCoordinates],
    () =>
      fromCoordinates &&
      toCoordinates &&
      getTripPlanner(
        `${fromCoordinates.latitude},${fromCoordinates.longitude}`,
        `${toCoordinates.latitude},${toCoordinates.longitude}`,
        new Date(),
        TravelModesOtpApi.rented,
        MicromobilityProvider.tier
      )
  )

  useEffect(() => {
    setFromCoordinates(fromPropCoordinates)
    setFromName(fromPropName)
  }, [fromPropName, fromPropCoordinates, setFromCoordinates, setFromName])

  const getGeocodeAsync = useCallback(
    async (
      location: { latitude: number; longitude: number },
      setGeocode: (locatoion: Location.LocationGeocodedAddress[]) => void
    ) => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setLocationPermisionError('Permission to access location was denied')
        return
      }

      const geocode = await Location.reverseGeocodeAsync(location)
      setGeocode(geocode)
    },
    [setLocationPermisionError]
  )

  const getNameFromGeocode = useCallback((geocode) => {
    if (geocode && geocode?.length > 0) {
      const { name, street } = geocode[0]
      return street && name
        ? `${street} ${name}`
        : street
        ? street
        : name
        ? name
        : ''
    }
  }, [])

  useEffect(() => {
    if (fromGeocode) {
      setFromName(getNameFromGeocode(fromGeocode))
    }
  }, [setFromName, fromGeocode, getNameFromGeocode])

  useEffect(() => {
    if (toGeocode) {
      setToName(getNameFromGeocode(toGeocode))
    }
  }, [setToName, toGeocode, getNameFromGeocode])

  useEffect(() => {
    toRef.current?.setAddressText(toName || '')
  }, [toRef, toName])

  const getLocationAsync = useCallback(
    async (
      setCoordinates: (location: {
        latitude: number
        longitude: number
      }) => void
    ) => {
      const location = await getLocationWithPermission(true)
      if (location) {
        const { latitude, longitude } = location.coords
        setCoordinates({
          latitude,
          longitude,
        })
        setFromName(i18n.t('currentPosition'))
      }
    },
    [getLocationWithPermission]
  )

  const onGooglePlaceChosen = (
    details: GooglePlaceDetail | null = null,
    setCoordinates: React.Dispatch<
      React.SetStateAction<
        | {
            latitude: number
            longitude: number
          }
        | undefined
      >
    >
  ) => {
    if (details?.geometry.location.lat && details?.geometry.location.lng) {
      setCoordinates({
        latitude: details?.geometry.location.lat,
        longitude: details?.geometry.location.lng,
      })
    }
  }

  const onGooglePlaceFromChosen = useCallback(
    (data: GooglePlaceData, details: GooglePlaceDetail | null = null) => {
      setFromName(data.description)
      onGooglePlaceChosen(details, setFromCoordinates)
      fromBottomSheetRef?.current?.close()
    },
    []
  )

  const onGooglePlaceToChosen = useCallback(
    (data: GooglePlaceData, details: GooglePlaceDetail | null = null) => {
      setToName(data.description)
      onGooglePlaceChosen(details, setToCoordinates)
      toBottomSheetRef?.current?.close()
    },
    []
  )

  const { setFeedbackSent } = useContext(GlobalStateContext)

  const handlePositiveFeedback = () => {
    setFeedbackSent(true)
  }

  const onVehicleChange = (mode: TravelModes) => {
    setSelectedVehicle(mode)
  }

  const vehicles: VehicleData[] = [
    {
      mode: TravelModes.mhd,
      icon: BusSvg,
      estimatedTime: '? - ? min',
      price: '~?,??€',
    },
    {
      mode: TravelModes.bicycle,
      icon: CyclingSvg,
      estimatedTime: '? min',
      price: '~?,??€',
    },
    {
      mode: TravelModes.scooter,
      icon: ScooterSvg,
      estimatedTime: '? min',
      price: '~?,??€',
    },
    {
      mode: TravelModes.walk,
      icon: WalkingSvg,
      estimatedTime: '? min',
      price: '--',
    },
  ]

  const onSwitchPlacesPress = useCallback(() => {
    const fromNameAlt = fromName
    const fromCoordinatesAlt = fromCoordinates

    const toNameAlt = toName
    const toCoordinatesAlt = toCoordinates

    setFromName(toNameAlt)
    setFromCoordinates(toCoordinatesAlt)

    setToName(fromNameAlt)
    setToCoordinates(fromCoordinatesAlt)
  }, [fromCoordinates, fromName, toCoordinates, toName])

  const getMyLocation = useCallback(() => {
    fromBottomSheetRef?.current?.close()
    getLocationAsync(setFromCoordinates)
  }, [getLocationAsync])

  const setLocationFromMapFrom = useCallback(
    () =>
      navigation.navigate('ChooseLocation', {
        latitude: fromCoordinates?.latitude,
        longitude: fromCoordinates?.longitude,
        onConfirm: (latitude: number, longitude: number) => {
          setFromName(`${latitude}, ${longitude}`)
          setFromCoordinates({ latitude, longitude })
          fromBottomSheetRef?.current?.close()
        },
      }),
    [fromCoordinates?.latitude, fromCoordinates?.longitude, navigation]
  )

  const setLocationFromMapTo = useCallback(
    () =>
      navigation.navigate('ChooseLocation', {
        latitude: toCoordinates?.latitude,
        longitude: toCoordinates?.longitude,
        onConfirm: (latitude: number, longitude: number) => {
          setToName(`${latitude}, ${longitude}`)
          setToCoordinates({ latitude, longitude })
          toBottomSheetRef?.current?.close()
        },
      }),
    [navigation, toCoordinates?.latitude, toCoordinates?.longitude]
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <FromToSelector
          onFromPlacePress={() => fromBottomSheetRef?.current?.snapToIndex(0)}
          onToPlacePress={() => toBottomSheetRef?.current?.snapToIndex(0)}
          fromPlaceText={fromName}
          toPlaceText={toName}
          fromPlaceTextPlaceholder={i18n.t('fromPlaceholder')}
          toPlaceTextPlaceholder={i18n.t('toPlaceholder')}
          onSwitchPlacesPress={onSwitchPlacesPress}
        />
      </View>
      <View>
        <VehicleSelector
          vehicles={vehicles}
          onVehicleChange={onVehicleChange}
          selectedVehicle={selectedVehicle}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {isLoading ? (
          <LoadingView />
        ) : (
          data?.plan?.itineraries && (
            <>
              {selectedVehicle === TravelModes.bicycle && (
                <Text style={styles.textSizeBig}>{i18n.t('myBike')}</Text>
              )}
              {selectedVehicle === TravelModes.scooter && (
                <Text style={styles.textSizeBig}>{i18n.t('myScooter')}</Text>
              )}
              {data.plan.itineraries.map((tripChoice, index) => (
                <TripMiniature
                  key={index}
                  onPress={() =>
                    navigation.navigate('PlannerScreen', {
                      legs: tripChoice?.legs,
                    })
                  }
                  duration={Math.round(tripChoice.duration / 60)}
                  departureDate={LocalDateTime.ofInstant(
                    Instant.ofEpochMilli(tripChoice.startTime)
                  )}
                  arriveDate={LocalDateTime.ofInstant(
                    Instant.ofEpochMilli(tripChoice.endTime)
                  )}
                  legs={tripChoice.legs}
                />
              ))}
            </>
          )
        )}
        {selectedVehicle === TravelModes.bicycle && (
          <>
            <Text style={styles.textSizeBig}>{i18n.t('rentedBike')}</Text>

            {isLoadingSlovnaftbajk ? (
              <LoadingView />
            ) : (
              dataSlovnaftbajk?.plan?.itineraries?.map((tripChoice, index) => (
                <TripMiniature
                  key={index}
                  onPress={() =>
                    navigation.navigate('PlannerScreen', {
                      legs: tripChoice?.legs,
                      provider: MicromobilityProvider.slovnaftbajk,
                    })
                  }
                  provider={MicromobilityProvider.slovnaftbajk}
                  duration={Math.round(tripChoice.duration / 60)}
                  departureDate={LocalDateTime.ofInstant(
                    Instant.ofEpochMilli(tripChoice.startTime)
                  )}
                  arriveDate={LocalDateTime.ofInstant(
                    Instant.ofEpochMilli(tripChoice.endTime)
                  )}
                  legs={tripChoice.legs}
                />
              ))
            )}
            {isLoadingRekola ? (
              <LoadingView />
            ) : (
              dataRekola?.plan?.itineraries?.map((tripChoice, index) => (
                <TripMiniature
                  key={index}
                  onPress={() =>
                    navigation.navigate('PlannerScreen', {
                      legs: tripChoice?.legs,
                      provider: MicromobilityProvider.rekola,
                    })
                  }
                  provider={MicromobilityProvider.rekola}
                  duration={Math.round(tripChoice.duration / 60)}
                  departureDate={LocalDateTime.ofInstant(
                    Instant.ofEpochMilli(tripChoice.startTime)
                  )}
                  arriveDate={LocalDateTime.ofInstant(
                    Instant.ofEpochMilli(tripChoice.endTime)
                  )}
                  legs={tripChoice.legs}
                />
              ))
            )}
          </>
        )}
        {selectedVehicle === TravelModes.scooter && (
          <>
            <Text style={styles.textSizeBig}>{i18n.t('rentedScooter')}</Text>
            {isLoadingTier ? (
              <LoadingView />
            ) : (
              dataTier?.plan?.itineraries?.map((tripChoice, index) => (
                <TripMiniature
                  key={index}
                  onPress={() =>
                    navigation.navigate('PlannerScreen', {
                      legs: tripChoice?.legs,
                      provider: MicromobilityProvider.tier,
                    })
                  }
                  provider={MicromobilityProvider.tier}
                  duration={Math.round(tripChoice.duration / 60)}
                  departureDate={LocalDateTime.ofInstant(
                    Instant.ofEpochMilli(tripChoice.startTime)
                  )}
                  arriveDate={LocalDateTime.ofInstant(
                    Instant.ofEpochMilli(tripChoice.endTime)
                  )}
                  legs={tripChoice.legs}
                />
              ))
            )}
          </>
        )}
        {data?.plan?.itineraries?.length != undefined &&
          data.plan.itineraries.length > 0 && (
            <FeedbackAsker
              onNegativeFeedbackPress={() => {
                navigation.navigate('Feedback')
              }}
              onPositiveFeedbackPress={handlePositiveFeedback}
            />
          )}
      </ScrollView>
      <SearchFromToScreen
        sheetRef={fromBottomSheetRef}
        getMyLocation={getMyLocation}
        onGooglePlaceChosen={onGooglePlaceFromChosen}
        googleInputRef={fromRef}
        setLocationFromMap={setLocationFromMapFrom}
        inputPlaceholder={i18n.t('fromPlaceholder')}
        initialSnapIndex={-1}
      />
      <SearchFromToScreen
        sheetRef={toBottomSheetRef}
        onGooglePlaceChosen={onGooglePlaceToChosen}
        googleInputRef={toRef}
        setLocationFromMap={setLocationFromMapTo}
        inputPlaceholder={i18n.t('toPlaceholder')}
        initialSnapIndex={0}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: colors.lightLightGray,
    height: '100%',
    paddingBottom: 55,
  },
  textSizeBig: {
    color: colors.darkText,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginVertical: 12,
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  scrollView: {
    minWidth: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 65,
  },
})
