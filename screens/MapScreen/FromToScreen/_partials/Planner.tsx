import { Feather, Ionicons } from '@expo/vector-icons'
import BottomSheet from '@gorhom/bottom-sheet'
import { DateTimeFormatter, Instant, LocalDateTime } from '@js-joda/core'
import { useNavigation } from '@react-navigation/native'
import * as Location from 'expo-location'
import i18n from 'i18n-js'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { useQuery } from 'react-query'

import {
  aggregateBicycleLegs,
  colors,
  getProviderName,
  getTripPlanner,
  IteneraryProps,
  OtpPlannerProps,
} from '@utils'

import { ErrorView, Link, Modal, RadioButton } from '@components'
import { GlobalStateContext } from '@state/GlobalStateProvider'
import {
  MicromobilityProvider,
  ScheduleType,
  TravelModes,
  TravelModesOtpApi,
  VehicleData,
} from '@types'

const vehiclesDefault: VehicleData[] = [
  {
    mode: TravelModes.mhd,
    icon: MhdSvg,
    estimatedTimeMin: undefined,
    estimatedTimeMax: undefined,
    priceMin: undefined,
    priceMax: undefined,
  },
  {
    mode: TravelModes.bicycle,
    icon: CyclingSvg,
    estimatedTimeMin: undefined,
    estimatedTimeMax: undefined,
    priceMin: undefined,
    priceMax: undefined,
  },
  {
    mode: TravelModes.scooter,
    icon: ScooterSvg,
    estimatedTimeMin: undefined,
    estimatedTimeMax: undefined,
    priceMin: undefined,
    priceMax: undefined,
  },
  {
    mode: TravelModes.walk,
    icon: WalkingSvg,
    estimatedTimeMin: undefined,
    estimatedTimeMax: undefined,
    priceMin: undefined,
    priceMax: undefined,
  },
]

interface ElementsProps {
  ommitFirst: boolean
  isLoading: boolean
  data?: OtpPlannerProps
  provider?: MicromobilityProvider
  error?: any
  refetch?: () => unknown
}

import SearchFromToScreen from '@screens/MapScreen/SearchFromToScreen'

import FromToSelector from './FromToSelector'
import TripMiniature from './TripMiniature'
import VehicleSelector from './VehicleSelector'

import { Portal } from '@gorhom/portal'
import CyclingSvg from '@icons/vehicles/cycling.svg'
import MhdSvg from '@icons/vehicles/mhd.svg'
import ScooterSvg from '@icons/vehicles/scooter.svg'
import WalkingSvg from '@icons/walking.svg'

interface PlannerProps {
  from: { name: string; latitude: number; longitude: number }
  to: { name: string; latitude: number; longitude: number }
}

export default function Planner(props: PlannerProps) {
  const { from: fromProp, to: toProp } = props

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

  const fromPropName = fromProp?.name
  const toPropName = toProp?.name

  const { setFeedbackSent, getLocationWithPermission } =
    useContext(GlobalStateContext)

  const navigation = useNavigation()
  const [fromCoordinates, setFromCoordinates] = useState(fromPropCoordinates)
  const [fromName, setFromName] = useState<string | undefined>(fromPropName)
  const [toCoordinates, setToCoordinates] = useState(toPropCoordinates)

  const [toName, setToName] = useState<string | undefined>(toPropName)

  const fromRef = useRef<GooglePlacesAutocompleteRef | null>(null)
  const toRef = useRef<GooglePlacesAutocompleteRef | null>(null)
  const fromBottomSheetRef = useRef<BottomSheet>(null)
  const toBottomSheetRef = useRef<BottomSheet>(null)

  const [vehicles, setVehicles] = useState<VehicleData[]>(vehiclesDefault)

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
    data: dataMhd,
    isLoading: isLoadingMhd,
    error: errorMhd,
    refetch: refetchMhd,
  } = useQuery(
    ['getOtpDataMhd', fromCoordinates, toCoordinates, dateTime, scheduledTime],
    () =>
      fromCoordinates &&
      toCoordinates &&
      getTripPlanner(
        `${fromCoordinates.latitude},${fromCoordinates.longitude}`,
        `${toCoordinates.latitude},${toCoordinates.longitude}`,
        dateTime,
        scheduledTime === ScheduleType.arrival,
        TravelModesOtpApi.transit
      ),
    { enabled: fromCoordinates && toCoordinates ? true : false }
  )

  const {
    data: dataWalk,
    isLoading: isLoadingWalk,
    error: errorWalk,
    refetch: refetchWalk,
  } = useQuery(
    ['getOtpDataWalk', fromCoordinates, toCoordinates, dateTime, scheduledTime],
    () =>
      fromCoordinates &&
      toCoordinates &&
      getTripPlanner(
        `${fromCoordinates.latitude},${fromCoordinates.longitude}`,
        `${toCoordinates.latitude},${toCoordinates.longitude}`,
        dateTime,
        scheduledTime === ScheduleType.arrival,
        TravelModesOtpApi.walk
      ),
    { enabled: fromCoordinates && toCoordinates ? true : false }
  )

  const {
    data: dataMyBike,
    isLoading: isLoadingMyBike,
    error: errorMyBike,
    refetch: refetchMyBike,
  } = useQuery(
    [
      'getOtpDataMyBike',
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
        TravelModesOtpApi.bicycle
      ),
    { enabled: fromCoordinates && toCoordinates ? true : false }
  )

  const {
    data: dataMyScooter,
    isLoading: isLoadingMyScooter,
    error: errorMyScooter,
    refetch: refetchMyScooter,
  } = useQuery(
    [
      'getOtpDataMyScooter',
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
        TravelModesOtpApi.bicycle
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

  const getMinimalDurationFromIteneraries = (
    iteneraries: IteneraryProps[][]
  ) => {
    return Math.min(
      ...iteneraries.flatMap((tripChoice) =>
        tripChoice.map((tripChoice) => tripChoice.duration || Infinity)
      )
    )
  }
  const getMaximalDurationFromIteneraries = (
    iteneraries: IteneraryProps[][]
  ) => {
    return Math.max(
      ...iteneraries.flatMap((tripChoice) =>
        tripChoice.map((tripChoice) => tripChoice.duration || -Infinity)
      )
    )
  }

  const getAdjustedVehicleData = (
    minDuration: number,
    maxDuration: number,
    oldVehicles: VehicleData[],
    travelMode: TravelModes
  ) => {
    return oldVehicles.map((vehiclesType) => {
      if (vehiclesType.mode === travelMode) {
        return {
          ...vehiclesType,
          estimatedTimeMin:
            minDuration !== Infinity ? Math.round(minDuration / 60) : undefined,
          estimatedTimeMax:
            maxDuration !== -Infinity
              ? Math.round(maxDuration / 60)
              : undefined,
        }
      } else {
        return vehiclesType
      }
    })
  }

  const adjustMinMaxTravelTime = useCallback(
    (itineraries: IteneraryProps[][], travelMode: TravelModes) => {
      const minDuration = getMinimalDurationFromIteneraries([...itineraries])

      const maxDuration = getMaximalDurationFromIteneraries([...itineraries])

      setVehicles((oldVehicles) =>
        getAdjustedVehicleData(
          minDuration,
          maxDuration,
          oldVehicles,
          travelMode
        )
      )
    },
    []
  )

  useEffect(() => {
    adjustMinMaxTravelTime(
      [
        dataSlovnaftbajk?.plan?.itineraries
          ? dataSlovnaftbajk?.plan?.itineraries
          : [],
        dataRekola?.plan?.itineraries ? dataRekola?.plan?.itineraries : [],
        dataMyBike?.plan?.itineraries ? dataMyBike?.plan?.itineraries : [],
      ],
      TravelModes.bicycle
    )
  }, [dataSlovnaftbajk, dataRekola, dataMyBike, adjustMinMaxTravelTime])

  useEffect(() => {
    adjustMinMaxTravelTime(
      [
        dataTier?.plan?.itineraries ? dataTier?.plan?.itineraries : [],
        dataMyScooter?.plan?.itineraries
          ? dataMyScooter?.plan?.itineraries
          : [],
      ],
      TravelModes.scooter
    )
  }, [dataTier, dataMyScooter, adjustMinMaxTravelTime])

  useEffect(() => {
    adjustMinMaxTravelTime(
      [
        dataMhd?.plan?.itineraries
          ? // first result for TRANSIT trip is always walking whole trip
            // alternative is to reduce walking distance in request 'maxWalkDistance' http://dev.opentripplanner.org/apidoc/1.4.0/resource_PlannerResource.html
            dataMhd?.plan?.itineraries.filter(
              (_itenerary, index) => index !== 0
            )
          : [],
      ],
      TravelModes.mhd
    )
  }, [adjustMinMaxTravelTime, dataMhd])

  useEffect(() => {
    adjustMinMaxTravelTime(
      [dataWalk?.plan?.itineraries ? dataWalk?.plan?.itineraries : []],
      TravelModes.walk
    )
  }, [adjustMinMaxTravelTime, dataWalk])

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
      }) => void,
      reask: boolean
    ) => {
      const location = await getLocationWithPermission(true, reask)
      if (location) {
        const { latitude, longitude } = location.coords
        setCoordinates({
          latitude,
          longitude,
        })
        setFromName(i18n.t('screens.FromToScreen.Planner.currentPosition'))
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

  const handlePositiveFeedback = () => {
    setFeedbackSent(true)
  }

  const onVehicleChange = (mode: TravelModes) => {
    setSelectedVehicle(mode)
  }

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

  const getMyLocation = useCallback(
    (reask = false) => {
      fromBottomSheetRef?.current?.close()
      getLocationAsync(setFromCoordinates, reask)
    },
    [getLocationAsync]
  )

  const setLocationFromMapFrom = useCallback(() => {
    navigation.navigate(
      'ChooseLocationScreen' as never,
      {
        latitude: fromCoordinates?.latitude,
        longitude: fromCoordinates?.longitude,
        fromNavigation: true,
        fromCoords: fromCoordinates,
        toCoords: toCoordinates,
      } as never
    )
    fromBottomSheetRef?.current?.close()
  }, [fromCoordinates, navigation, toCoordinates])

  const setLocationFromMapTo = useCallback(() => {
    navigation.navigate(
      'ChooseLocationScreen' as never,
      {
        latitude: toCoordinates?.latitude,
        longitude: toCoordinates?.longitude,
        toNavigation: true,
        fromCoords: fromCoordinates,
        toCoords: toCoordinates,
      } as never
    )
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
          errorMessage={i18n.t('components.ErrorView.dataPlannerTripError', {
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
                  navigation.navigate(
                    'PlannerScreen' as never,
                    {
                      legs: tripChoice?.legs,
                      provider: provider,
                      isScooter: selectedVehicle === TravelModes.scooter,
                      travelMode: selectedVehicle,
                    } as never
                  )
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
          fromPlaceTextPlaceholder={i18n.t(
            'screens.FromToScreen.Planner.fromPlaceholder'
          )}
          toPlaceTextPlaceholder={i18n.t(
            'screens.FromToScreen.Planner.toPlaceholder'
          )}
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
                i18n.t('screens.FromToScreen.Planner.departure', {
                  time: dateTime.format(
                    DateTimeFormatter.ofPattern('dd.MM. HH:mm')
                  ),
                })}
              {scheduledTime === ScheduleType.arrival &&
                i18n.t('screens.FromToScreen.Planner.arrival', {
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
        {selectedVehicle === TravelModes.mhd && (
          <View>
            {(isLoadingMhd || dataMhd || errorMhd) && (
              <Text style={styles.textSizeBig}>
                {i18n.t('screens.FromToScreen.Planner.transit')}
              </Text>
            )}
            {getElements({
              ommitFirst: true,
              isLoading: isLoadingMhd,
              data: dataMhd,
              provider: undefined,
              error: errorMhd,
              refetch: refetchMhd,
            })}
          </View>
        )}
        {selectedVehicle === TravelModes.bicycle && (
          <>
            {(isLoadingMyBike || dataMyBike || errorMyBike) &&
              selectedVehicle === TravelModes.bicycle && (
                <Text style={styles.textSizeBig}>
                  {i18n.t('screens.FromToScreen.Planner.myBike')}
                </Text>
              )}
            {getElements({
              ommitFirst: true,
              isLoading: isLoadingMyBike,
              data: dataMyBike,
              provider: undefined,
              error: errorMyBike,
              refetch: refetchMyBike,
            })}
            {(isLoadingSlovnaftbajk ||
              isLoadingRekola ||
              dataSlovnaftbajk ||
              dataRekola ||
              errorSlovnaftbajk ||
              errorRekola) && (
              <Text style={styles.textSizeBig}>
                {i18n.t('screens.FromToScreen.Planner.rentedBike')}
              </Text>
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
            {(isLoadingMyScooter || dataMyScooter || errorMyScooter) && (
              <Text style={styles.textSizeBig}>
                {i18n.t('screens.FromToScreen.Planner.myScooter')}
              </Text>
            )}
            {getElements({
              ommitFirst: true,
              isLoading: isLoadingMyScooter,
              data: dataMyScooter,
              provider: undefined,
              error: errorMyScooter,
              refetch: refetchMyScooter,
            })}

            {(isLoadingTier || dataTier || errorTier) && (
              <Text style={styles.textSizeBig}>
                {i18n.t('screens.FromToScreen.Planner.rentedScooter')}
              </Text>
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
        {selectedVehicle === TravelModes.walk && (
          <>
            {(isLoadingWalk || dataWalk || errorWalk) && (
              <Text style={styles.textSizeBig}>
                {i18n.t('screens.FromToScreen.Planner.walk')}
              </Text>
            )}
            {getElements({
              ommitFirst: false,
              isLoading: isLoadingWalk,
              data: dataWalk,
              provider: undefined,
              error: errorWalk,
              refetch: refetchWalk,
            })}
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
      <Portal hostName="SafeView">
        <SearchFromToScreen
          sheetRef={fromBottomSheetRef}
          getMyLocation={getMyLocation}
          onGooglePlaceChosen={onGooglePlaceFromChosen}
          googleInputRef={fromRef}
          setLocationFromMap={setLocationFromMapFrom}
          inputPlaceholder={i18n.t(
            'screens.FromToScreen.Planner.fromPlaceholder'
          )}
          initialSnapIndex={-1}
        />
        <SearchFromToScreen
          sheetRef={toBottomSheetRef}
          onGooglePlaceChosen={onGooglePlaceToChosen}
          googleInputRef={toRef}
          setLocationFromMap={setLocationFromMapTo}
          inputPlaceholder={i18n.t(
            'screens.FromToScreen.Planner.toPlaceholder'
          )}
          initialSnapIndex={0}
        />
      </Portal>
      <Modal visible={visibleScheduleModal} onClose={hideSchedulePicker}>
        <RadioButton
          options={[
            {
              value: ScheduleType.departure,
              label: i18n.t('screens.FromToScreen.Planner.departureText'),
            },
            {
              value: ScheduleType.arrival,
              label: i18n.t('screens.FromToScreen.Planner.arrivalText'),
            },
          ]}
          value={scheduledTime}
          onChangeValue={handleOptionChange}
        />
        <Link
          style={styles.modalDismiss}
          onPress={hideSchedulePicker}
          title={i18n.t('common.cancel')}
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
  },
  textSizeBig: {
    color: colors.darkText,
    fontSize: 16,
    fontWeight: 'bold',
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
    backgroundColor: colors.primary,
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
