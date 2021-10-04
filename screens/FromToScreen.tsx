import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native'
import i18n from 'i18n-js'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { useQuery } from 'react-query'
import { useNavigation } from '@react-navigation/native'
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete'
import Constants from 'expo-constants'
import { StackScreenProps } from '@react-navigation/stack'
import * as Location from 'expo-location'
import { LocationGeocodedAddress } from 'expo-location'
import BottomSheet from 'reanimated-bottom-sheet'

import { Button } from '../components'
import { getTripPlanner } from '../utils/api'
import { apiOtpPlanner } from '../utils/validation'
import { MapParamList } from '../types'
import FromToSelector from './ui/FromToSelector/FromToSelector'
import SearchFromToScreen from './SearchFromToScreen'
import { s } from '../utils/globalStyles'

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

  const [locationPermisionError, setLocationPermisionError] =
    useState<string>('')
  const [fromGeocode, setFromGeocode] = useState<
    Location.LocationGeocodedAddress[] | null
  >(null)
  const [toGeocode, setToGeocode] = useState<
    Location.LocationGeocodedAddress[] | null
  >(null)

  const { data, isLoading, error } = useQuery(
    ['getOtpData', fromCoordinates, toCoordinates],
    () =>
      fromCoordinates &&
      toCoordinates &&
      getTripPlanner(
        `${fromCoordinates.latitude},${fromCoordinates.longitude}`,
        `${toCoordinates.latitude},${toCoordinates.longitude}`
      )
  )

  useEffect(() => {
    setFromCoordinates(fromPropCoordinates)
    setFromName(fromPropName)
  }, [fromPropName, fromPropCoordinates, setFromCoordinates, setFromName])

  const getGeocodeAsync = useCallback(
    async (
      location: { latitude: number; longitude: number },
      setGeocode: (locatoion: LocationGeocodedAddress[]) => void
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
    const { status } = await Location.requestForegroundPermissionsAsync()

    if (status !== 'granted') {
      setLocationPermisionError('Permission to access location was denied')
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    })
    const { latitude, longitude } = location.coords
    setCoordinates({
      latitude,
      longitude,
    })
    getGeocodeAsync({ latitude, longitude }, setGeocode).catch((err) => {
      setLocationPermisionError(err)
    })
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
  }

  const onGooglePlaceToChosen = (
    _data: GooglePlaceData,
    details: GooglePlaceDetail | null = null
  ) => {
    onGooglePlaceChosen(details, setToCoordinates)
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={s.horizontalMargin}>
          <View style={styles.header}>
            <FromToSelector
              fromPlaceText="from place set"
              fromPlaceTextPlaceholder="Odkiaľ idete?"
              toPlaceTextPlaceholder="Kamže, kam?"
            />
          </View>
          <View style={styles.googleFrom}>
            <Text
              style={styles.input}
              onPress={() => fromBottomSheetRef?.current?.snapTo(0)}
            >
              {fromName || i18n.t('from')}
            </Text>
          </View>
          <View style={styles.googleFrom}>
            <GooglePlacesAutocomplete
              ref={toRef}
              styles={autoCompleteStyles}
              enablePoweredByContainer={false}
              fetchDetails
              placeholder={i18n.t('to')}
              onPress={onGooglePlaceToChosen}
              query={{
                key: Constants.manifest?.extra?.googlePlacesApiKey,
                language: 'sk',
                components: 'country:sk',
              }}
            />
            <Button
              onPress={() => getLocationAsync(setToCoordinates, setToGeocode)}
              title={i18n.t('myLocation')}
            />
            <Button
              onPress={() =>
                navigation.navigate('ChooseLocation', {
                  latitude: toCoordinates?.latitude,
                  longitude: toCoordinates?.longitude,
                  onConfirm: (latitude: number, longitude: number) => {
                    setToName(`${latitude}, ${longitude}`)
                    setToCoordinates({ latitude, longitude })
                  },
                })
              }
              title={i18n.t('locationChoose')}
            />
          </View>
          <ScrollView contentContainerStyle={styles.scrollView}>
            {validatedOtpData?.plan?.itineraries?.map((tripChoice, index) => {
              return (
                <View style={styles.trip} key={index}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('PlannerScreen', {
                        legs: tripChoice?.legs,
                      })
                    }
                  >
                    <Text>{`trip ${index} duration: ${tripChoice.duration}`}</Text>
                    <Text>{new Date(tripChoice.startTime).toISOString()}</Text>
                    <Text>{new Date(tripChoice.endTime).toISOString()}</Text>
                  </TouchableOpacity>
                </View>
              )
            })}
          </ScrollView>
        </View>
        <SearchFromToScreen
          sheetRef={fromBottomSheetRef}
          getMyLocation={() =>
            getLocationAsync(setFromCoordinates, setFromGeocode)
          }
          onGooglePlaceChosen={onGooglePlaceFromChosen}
          googleInputRef={fromRef}
          setLocationFromMap={() =>
            navigation.navigate('ChooseLocation', {
              latitude: fromCoordinates?.latitude,
              longitude: fromCoordinates?.longitude,
              onConfirm: (latitude: number, longitude: number) => {
                setFromName(`${latitude}, ${longitude}`)
                setFromCoordinates({ latitude, longitude })
              },
            })
          }
        />
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
  },
  scrollView: {
    minWidth: '100%',
    borderWidth: 1,
  },
  googleFrom: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  trip: {
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: 'white',
  },
})

const autoCompleteStyles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-unused-styles
  container: {
    width: '100%',
  },
  // eslint-disable-next-line react-native/no-unused-styles
  listView: {
    position: 'absolute',
    top: 50,
    elevation: 5,
    zIndex: 5,
  },
})
