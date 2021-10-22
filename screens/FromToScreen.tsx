import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react'
import { StyleSheet, View } from 'react-native'
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
import { LocationGeocodedAddress } from 'expo-location'
import BottomSheet from 'reanimated-bottom-sheet'

import { getTripPlanner } from '@utils/api'
import { apiOtpPlanner } from '@utils/validation'
import SearchFromToScreen from './SearchFromToScreen'
import TripMiniature from './ui/TripMiniature/TripMiniature'
import FromToSelector from './ui/FromToSelector/FromToSelector'
import VehicleSelector from './ui/VehicleSelector/VehicleSelector'

import BusSvg from '@images/bus.svg'
import CyclingSvg from '@images/cycling.svg'
import ScooterSvg from '@images/scooter.svg'
import WalkingSvg from '@images/walking.svg'
import { colors } from '@utils/theme'
import { MapParamList, TravelModes, VehicleData } from '../types'
import FeedbackAsker from './ui/FeedbackAsker/FeedbackAsker'

import { GlobalStateContext } from '@components/GlobalStateProvider'
import { useLocationWithPermision } from '@hooks/miscHooks'

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
  const [validationErrors, setValidationErrors] = useState()
  const [fromCoordinates, setFromCoordinates] = useState(fromPropCoordinates)
  const [fromName, setFromName] = useState(fromPropName)
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
    TravelModes.bus
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
        selectedVehicle
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

  const getLocationAsync = async (
    setCoordinates: (location: { latitude: number; longitude: number }) => void,
    setGeocode: (location: LocationGeocodedAddress[]) => void
  ) => {
    const location = await getLocationWithPermission(true)
    if (location) {
      const { latitude, longitude } = location.coords
      setCoordinates({
        latitude,
        longitude,
      })
      getGeocodeAsync({ latitude, longitude }, setGeocode).catch((err) => {
        setLocationPermisionError(err)
      })
    }
  }

  const validatedOtpData = useMemo(() => {
    try {
      const validatedData = apiOtpPlanner.validateSync(data)
      return validatedData
    } catch (e) {
      setValidationErrors(e.errors)
      console.log(e)
    }
  }, [data])

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

  const onGooglePlaceFromChosen = (
    data: GooglePlaceData,
    details: GooglePlaceDetail | null = null
  ) => {
    setFromName(data.description)
    onGooglePlaceChosen(details, setFromCoordinates)
    fromBottomSheetRef?.current?.snapTo(1)
  }

  const onGooglePlaceToChosen = (
    data: GooglePlaceData,
    details: GooglePlaceDetail | null = null
  ) => {
    setToName(data.description)
    onGooglePlaceChosen(details, setToCoordinates)
    toBottomSheetRef?.current?.snapTo(1)
  }

  const { setFeedbackSent } = useContext(GlobalStateContext)

  const handlePositiveFeedback = () => {
    setFeedbackSent(true)
  }

  const onVehicleChange = (mode: TravelModes) => {
    setSelectedVehicle(mode)
  }

  const vehicles: VehicleData[] = [
    {
      mode: TravelModes.bus,
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <FromToSelector
          onFromPlacePress={() => fromBottomSheetRef?.current?.snapTo(0)}
          onToPlacePress={() => toBottomSheetRef?.current?.snapTo(0)}
          fromPlaceText={fromName}
          toPlaceText={toName}
          fromPlaceTextPlaceholder={i18n.t('fromPlaceholder')}
          toPlaceTextPlaceholder={i18n.t('toPlaceholder')}
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
        {validatedOtpData?.plan?.itineraries?.map((tripChoice, index) => {
          return (
            <TripMiniature
              key={index}
              onPress={() =>
                navigation.navigate('PlannerScreen', {
                  legs: tripChoice?.legs,
                })
              }
              duration={Math.round(tripChoice.duration / 60)}
              departureDate={new Date(tripChoice.startTime)}
              ariveDate={new Date(tripChoice.endTime)}
              legs={tripChoice.legs}
            />
          )
        })}
        {validatedOtpData?.plan?.itineraries?.length != undefined &&
          validatedOtpData.plan.itineraries.length > 0 && (
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
        getMyLocation={() => {
          fromBottomSheetRef?.current?.snapTo(1)
          getLocationAsync(setFromCoordinates, setFromGeocode)
        }}
        onGooglePlaceChosen={onGooglePlaceFromChosen}
        googleInputRef={fromRef}
        setLocationFromMap={() =>
          navigation.navigate('ChooseLocation', {
            latitude: fromCoordinates?.latitude,
            longitude: fromCoordinates?.longitude,
            onConfirm: (latitude: number, longitude: number) => {
              setFromName(`${latitude}, ${longitude}`)
              setFromCoordinates({ latitude, longitude })
              fromBottomSheetRef?.current?.snapTo(1)
            },
          })
        }
        inputPlaceholder={i18n.t('fromPlaceholder')}
      />
      <SearchFromToScreen
        sheetRef={toBottomSheetRef}
        onGooglePlaceChosen={onGooglePlaceToChosen}
        googleInputRef={toRef}
        setLocationFromMap={() =>
          navigation.navigate('ChooseLocation', {
            latitude: toCoordinates?.latitude,
            longitude: toCoordinates?.longitude,
            onConfirm: (latitude: number, longitude: number) => {
              setToName(`${latitude}, ${longitude}`)
              setToCoordinates({ latitude, longitude })
              toBottomSheetRef?.current?.snapTo(1)
            },
          })
        }
        inputPlaceholder={i18n.t('toPlaceholder')}
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
