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
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
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
import { DateTimeFormatter, Instant, LocalDateTime } from '@js-joda/core'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Ionicons } from '@expo/vector-icons'
import { Feather } from '@expo/vector-icons'

import {
  getTripPlanner,
  colors,
  getOtpTravelMode,
  OtpPlannerProps,
  aggregateBicycleLegs,
  getProviderName,
} from '@utils'
import { useLocationWithPermision } from '@hooks'
import {
  MapParamList,
  MicromobilityProvider,
  ScheduleType,
  TravelModes,
  TravelModesOtpApi,
  VehicleData,
} from '@types'
import {
  FeedbackAsker,
  LoadingView,
  Modal,
  RadioButton,
  Link,
  ErrorView,
} from '@components'
import { GlobalStateContext } from '@state/GlobalStateProvider'

interface ElementsProps {
  ommitFirst: boolean
  isLoading: boolean
  data?: OtpPlannerProps
  provider?: MicromobilityProvider
  error?: any
  refetch?: () => unknown
}

import SearchFromToScreen from '@screens/MapScreen/SearchFromToScreen'

import TripMiniature from './_partials/TripMiniature'
import FromToSelector from './_partials/FromToSelector'
import VehicleSelector from './_partials/VehicleSelector'

import BusSvg from '@icons/bus.svg'
import CyclingSvg from '@icons/cycling.svg'
import ScooterSvg from '@icons/scooter.svg'
import WalkingSvg from '@icons/walking.svg'

export default function FromToScreen({
  route,
}: StackScreenProps<MapParamList, 'FromToScreen'>) {
  const { from: fromProp, to: toProp } = route.params || {}

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

  const toPropCoordinates = useMemo(
    () =>
      (toProp?.latitude !== undefined &&
        toProp?.longitude !== undefined && {
          latitude: toProp?.latitude,
          longitude: toProp?.longitude,
        }) ||
      undefined,
    [toProp]
  )
  const { getLocationWithPermission } = useLocationWithPermision()

  const fromPropName = fromProp?.name
  const toPropName = toProp?.name

  const navigation = useNavigation()
  const [fromCoordinates, setFromCoordinates] = useState(fromPropCoordinates)
  const [fromName, setFromName] = useState<string | undefined>(fromPropName)
  const [toCoordinates, setToCoordinates] = useState(toPropCoordinates)

  const [toName, setToName] = useState<string | undefined>(toPropName)

  const fromRef = useRef<GooglePlacesAutocompleteRef | null>(null)
  const toRef = useRef<GooglePlacesAutocompleteRef | null>(null)
  const fromBottomSheetRef = useRef<BottomSheet>(null)
  const toBottomSheetRef = useRef<BottomSheet>(null)

  const [selectedVehicle, setSelectedVehicle] = useState<TravelModes>(
    TravelModes.mhd
  )

  const [scheduledTime, setScheduledTime] = useState<ScheduleType>(
    ScheduleType.departure
  )

  const [visibleScheduleModal, setVisibleScheduleModal] = useState(false)

  const [dateTime, setDateTime] = useState(LocalDateTime.now())

  const [locationPermisionError, setLocationPermisionError] =
    useState<string>('')
  const [fromGeocode, setFromGeocode] = useState<
    Location.LocationGeocodedAddress[] | null
  >(null)
  const [toGeocode, setToGeocode] = useState<
    Location.LocationGeocodedAddress[] | null
  >(null)

  const {
    data: dataStandard,
    isLoading: isLoadingStandard,
    error: errorStandard,
    refetch: refetchStandard,
  } = useQuery(
    [
      'getOtpData',
      fromCoordinates,
      toCoordinates,
      selectedVehicle,
      dateTime,
      scheduledTime,
    ],
    () =>
      fromCoordinates &&
      toCoordinates &&
      getTripPlanner(
        `${fromCoordinates.latitude},${fromCoordinates.longitude}`,
        `${toCoordinates.latitude},${toCoordinates.longitude}`,
        dateTime,
        scheduledTime === ScheduleType.arrival,
        getOtpTravelMode(selectedVehicle)
      ),
    { enabled: fromCoordinates && toCoordinates ? true : false }
  )

  const {
    data: dataRekola,
    isLoading: isLoadingRekola,
    error: errorRekola,
    refetch: refetchRekola,
  } = useQuery(
    [
      'getOtpRekolaData',
      fromCoordinates,
      toCoordinates,
      dateTime,
      scheduledTime,
    ],
    () =>
      fromCoordinates &&
      toCoordinates &&
      getTripPlanner(
        `${fromCoordinates.latitude},${fromCoordinates.longitude}`,
        `${toCoordinates.latitude},${toCoordinates.longitude}`,
        dateTime,
        scheduledTime === ScheduleType.arrival,
        TravelModesOtpApi.rented,
        MicromobilityProvider.rekola
      ),
    { enabled: fromCoordinates && toCoordinates ? true : false }
  )

  const {
    data: dataSlovnaftbajk,
    isLoading: isLoadingSlovnaftbajk,
    error: errorSlovnaftbajk,
    refetch: refetchSlovnaftbajk,
  } = useQuery(
    [
      'getOtpSlovnaftbajkData',
      fromCoordinates,
      toCoordinates,
      dateTime,
      scheduledTime,
    ],
    () =>
      fromCoordinates &&
      toCoordinates &&
      getTripPlanner(
        `${fromCoordinates.latitude},${fromCoordinates.longitude}`,
        `${toCoordinates.latitude},${toCoordinates.longitude}`,
        dateTime,
        scheduledTime === ScheduleType.arrival,
        TravelModesOtpApi.rented,
        MicromobilityProvider.slovnaftbajk
      ),
    { enabled: fromCoordinates && toCoordinates ? true : false }
  )

  const {
    data: dataTier,
    isLoading: isLoadingTier,
    error: errorTier,
    refetch: refetchTier,
  } = useQuery(
    ['getOtpTierData', fromCoordinates, toCoordinates, dateTime, scheduledTime],
    () =>
      fromCoordinates &&
      toCoordinates &&
      getTripPlanner(
        `${fromCoordinates.latitude},${fromCoordinates.longitude}`,
        `${toCoordinates.latitude},${toCoordinates.longitude}`,
        dateTime,
        scheduledTime === ScheduleType.arrival,
        TravelModesOtpApi.rented,
        MicromobilityProvider.tier
      ),
    { enabled: fromCoordinates && toCoordinates ? true : false }
  )

  useEffect(() => {
    setFromCoordinates(fromPropCoordinates)
    setFromName(fromPropName)
  }, [fromPropName, fromPropCoordinates, setFromCoordinates, setFromName])

  useEffect(() => {
    setToCoordinates(toPropCoordinates)
    setToName(toPropName)
  }, [toPropName, toPropCoordinates, setToCoordinates, setToName])

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

  const setLocationFromMapFrom = useCallback(() => {
    navigation.navigate('ChooseLocation', {
      latitude: fromCoordinates?.latitude,
      longitude: fromCoordinates?.longitude,
      fromNavigation: true,
      fromCoords: fromCoordinates,
      toCoords: toCoordinates,
    })
    fromBottomSheetRef?.current?.close()
  }, [fromCoordinates, navigation, toCoordinates])

  const setLocationFromMapTo = useCallback(() => {
    navigation.navigate('ChooseLocation', {
      latitude: toCoordinates?.latitude,
      longitude: toCoordinates?.longitude,
      toNavigation: true,
      fromCoords: fromCoordinates,
      toCoords: toCoordinates,
    })
    toBottomSheetRef?.current?.close()
  }, [fromCoordinates, navigation, toCoordinates])

  const getElements = ({
    ommitFirst,
    isLoading,
    data,
    provider,
    error,
    refetch,
  }: ElementsProps) => {
    if (!isLoading && error)
      return (
        <ErrorView
          errorMessage={i18n.t('dataPlannerTripError', {
            provider: (provider && getProviderName(provider)) || '',
          })}
          error={error}
          action={refetch}
        />
      )

    return (
      <>
        {isLoading && (
          <TripMiniature provider={provider} isLoading={isLoading} />
        )}
        {data?.plan?.itineraries?.map((tripChoice, index) => {
          // first result for TRANSIT trip is always walking whole trip
          // alternative is to reduce walking distance in request 'maxWalkDistance' http://dev.opentripplanner.org/apidoc/1.4.0/resource_PlannerResource.html
          if (
            selectedVehicle === TravelModes.mhd &&
            index === 0 &&
            ommitFirst
          ) {
            return undefined
          } else
            return (
              <TripMiniature
                key={index}
                onPress={() =>
                  navigation.navigate('PlannerScreen', {
                    legs: tripChoice?.legs,
                    provider: provider,
                    isScooter: selectedVehicle === TravelModes.scooter,
                  })
                }
                provider={provider}
                duration={Math.round(tripChoice.duration / 60)}
                departureDateTime={LocalDateTime.ofInstant(
                  Instant.ofEpochMilli(tripChoice.startTime)
                )}
                arriveDateTime={LocalDateTime.ofInstant(
                  Instant.ofEpochMilli(tripChoice.endTime)
                )}
                legs={
                  tripChoice.legs
                    ? aggregateBicycleLegs(tripChoice.legs)
                    : undefined
                }
                isScooter={selectedVehicle === TravelModes.scooter}
              />
            )
        })}
      </>
    )
  }

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }

  const hideDatePicker = () => {
    setDatePickerVisibility(false)
  }

  const handleConfirm = (date: Date) => {
    const utcTimestamp = Instant.parse(date.toISOString()) //'1989-08-16T00:00:00.000Z'
    const localDateTime = LocalDateTime.ofInstant(utcTimestamp)

    setDateTime(localDateTime)
    hideDatePicker()
  }

  const hideSchedulePicker = () => {
    setVisibleScheduleModal(false)
  }

  const showSchedulePicker = () => {
    setVisibleScheduleModal(true)
  }

  const handleOptionChange = (scheduleTime: ScheduleType) => {
    setScheduledTime(scheduleTime)
    setVisibleScheduleModal(false)
    showDatePicker()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FromToSelector
          onFromPlacePress={() => fromBottomSheetRef?.current?.snapToIndex(0)}
          onToPlacePress={() => toBottomSheetRef?.current?.snapToIndex(0)}
          fromPlaceText={
            fromName ||
            (fromProp?.latitude !== undefined &&
            fromProp?.longitude !== undefined
              ? `${fromProp.latitude}, ${fromProp.longitude}`
              : undefined)
          }
          toPlaceText={
            toName ||
            (toProp?.latitude !== undefined && toProp?.longitude !== undefined
              ? `${toProp.latitude}, ${toProp.longitude}`
              : undefined)
          }
          fromPlaceTextPlaceholder={i18n.t('fromPlaceholder')}
          toPlaceTextPlaceholder={i18n.t('toPlaceholder')}
          onSwitchPlacesPress={onSwitchPlacesPress}
        />
        <TouchableOpacity
          style={styles.schedulingContainer}
          onPress={showSchedulePicker}
        >
          <View style={styles.row}>
            <Feather
              name="clock"
              size={15}
              style={{
                alignSelf: 'center',
                color: colors.primary,
                marginRight: 4,
              }}
            />
            <Text style={styles.schedulingText}>
              {scheduledTime === ScheduleType.departure &&
                i18n.t('departure', {
                  time: dateTime.format(
                    DateTimeFormatter.ofPattern('dd.MM. HH:mm')
                  ),
                })}
              {scheduledTime === ScheduleType.arrival &&
                i18n.t('arrival', {
                  time: dateTime.format(
                    DateTimeFormatter.ofPattern('dd.MM. HH:mm')
                  ),
                })}
            </Text>
            <Ionicons size={15} style={styles.ionicon} name="chevron-down" />
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <VehicleSelector
          vehicles={vehicles}
          onVehicleChange={onVehicleChange}
          selectedVehicle={selectedVehicle}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View>
          {(isLoadingStandard || dataStandard || errorStandard) && (
            <>
              {selectedVehicle === TravelModes.bicycle && (
                <Text style={styles.textSizeBig}>{i18n.t('myBike')}</Text>
              )}
              {selectedVehicle === TravelModes.scooter && (
                <Text style={styles.textSizeBig}>{i18n.t('myScooter')}</Text>
              )}
            </>
          )}
          {getElements({
            ommitFirst: true,
            isLoading: isLoadingStandard,
            data: dataStandard,
            provider: undefined,
            error: errorStandard,
            refetch: refetchStandard,
          })}
        </View>
        {selectedVehicle === TravelModes.bicycle && (
          <>
            {(isLoadingSlovnaftbajk ||
              isLoadingRekola ||
              dataSlovnaftbajk ||
              dataRekola ||
              errorSlovnaftbajk ||
              errorRekola) && (
              <Text style={styles.textSizeBig}>{i18n.t('rentedBike')}</Text>
            )}
            <View style={styles.providerContainer}>
              {getElements({
                ommitFirst: false,
                isLoading: isLoadingSlovnaftbajk,
                data: dataSlovnaftbajk,
                provider: MicromobilityProvider.slovnaftbajk,
                error: errorSlovnaftbajk,
                refetch: refetchSlovnaftbajk,
              })}
            </View>
            <View style={styles.providerContainer}>
              {getElements({
                ommitFirst: false,
                isLoading: isLoadingRekola,
                data: dataRekola,
                provider: MicromobilityProvider.rekola,
                error: errorRekola,
                refetch: refetchRekola,
              })}
            </View>
          </>
        )}
        {selectedVehicle === TravelModes.scooter && (
          <>
            {(isLoadingTier || dataTier || errorTier) && (
              <Text style={styles.textSizeBig}>{i18n.t('rentedScooter')}</Text>
            )}
            <View style={styles.providerContainer}>
              {getElements({
                ommitFirst: false,
                isLoading: isLoadingTier,
                data: dataTier,
                provider: MicromobilityProvider.tier,
                error: errorTier,
                refetch: refetchTier,
              })}
            </View>
          </>
        )}
        {/* {dataStandard?.plan?.itineraries?.length != undefined &&
          dataStandard.plan.itineraries.length > 0 && (
            <FeedbackAsker
              onNegativeFeedbackPress={() => {
                navigation.navigate('Feedback')
              }}
              onPositiveFeedbackPress={handlePositiveFeedback}
            />
          )} */}
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
      <Modal visible={visibleScheduleModal} onClose={hideSchedulePicker}>
        <RadioButton
          options={[
            {
              value: ScheduleType.departure,
              label: i18n.t('departureText'),
            },
            {
              value: ScheduleType.arrival,
              label: i18n.t('arrivalText'),
            },
          ]}
          value={scheduledTime}
          onChangeValue={handleOptionChange}
        />
        <Link
          style={styles.modalDismiss}
          onPress={hideSchedulePicker}
          title={i18n.t('cancel')}
        />
      </Modal>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        display="spinner"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
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
  ionicon: {
    alignSelf: 'center',
    color: colors.primary,
    marginLeft: 9,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  schedulingContainer: {
    marginTop: 10,
  },
  schedulingText: {
    color: colors.primary,
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
  providerContainer: {
    marginBottom: 10,
  },
  modalDismiss: {
    textAlign: 'center',
    width: '100%',
  },
})
