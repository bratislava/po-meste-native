import { Feather, Ionicons } from '@expo/vector-icons'
import BottomSheet, { TouchableOpacity } from '@gorhom/bottom-sheet'
import {
  DateTimeFormatter,
  Duration,
  Instant,
  LocalDateTime,
} from '@js-joda/core'
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
import {
  InteractionManager,
  Platform,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import {
  GooglePlaceDetail,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete'
import { useQuery } from 'react-query'

import {
  aggregateBicycleLegs,
  colors,
  favoriteDataSchema,
  FAVORITE_DATA_INDEX,
  getProviderName,
  getTripPlanner,
  IteneraryProps,
  OtpPlannerProps,
  s,
} from '@utils'

import { ErrorView } from '@components'
import DateTimePicker, { DateTimePickerRef } from '@components/DateTimePicker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GlobalStateContext } from '@state/GlobalStateProvider'
import {
  FavoriteData,
  GooglePlaceDataCorrected,
  MicromobilityProvider,
  ScheduleType,
  TravelModes,
  TravelModesOtpApi,
  VehicleData,
} from '@types'
import defaultFavoriteData from '../../defaultFavoriteData.json'

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

import WheelchairSvg from '@icons/wheelchair.svg'

interface PlannerProps {
  from: { name: string; latitude: number; longitude: number }
  to: { name: string; latitude: number; longitude: number }
}

export default function Planner(props: PlannerProps) {
  const { from: fromProp, to: toProp } = props

  const [interactionsFinished, setInteractionsFinished] = useState(false)

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      loadFavoriteData(setFavoriteData)
      setInteractionsFinished(true)
    })
  }, [])

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

  const { setFeedbackSent, getLocationWithPermission, location } =
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
  const datetimeSheetRef = useRef<BottomSheet>(null)
  const datetimePickerRef = useRef<DateTimePickerRef>(null)

  const [vehicles, setVehicles] = useState<VehicleData[]>(vehiclesDefault)

  const [selectedVehicle, setSelectedVehicle] = useState<TravelModes>(
    TravelModes.mhd
  )

  const [scheduledTime, setScheduledTime] = useState<ScheduleType>(
    ScheduleType.departure
  )

  const [dateTime, setDateTime] = useState(LocalDateTime.now())

  const [accessibleOnly, setAccessibleOnly] = useState(false)

  //#region "Favorites"
  const [favoriteData, setFavoriteData] = useState<FavoriteData>(
    defaultFavoriteData as any
  )
  const saveFavoriteData = (data: FavoriteData) => {
    if (favoriteData) {
      AsyncStorage.setItem(FAVORITE_DATA_INDEX, JSON.stringify(data))
    }
  }
  const loadFavoriteData = async (onLoad: (data: FavoriteData) => void) => {
    const favoriteDataString = await AsyncStorage.getItem(FAVORITE_DATA_INDEX)
    if (!favoriteDataString) return
    try {
      const validatedFavoriteData = favoriteDataSchema.validateSync(
        JSON.parse(favoriteDataString)
      ) as never as FavoriteData
      onLoad(validatedFavoriteData)
    } catch (e: any) {
      console.log(e.message)
      // overwrites favoriteData with the default data
      saveFavoriteData(favoriteData)
    }
  }
  //#endregion "Favorites"

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
    [
      'getOtpDataMhd',
      fromCoordinates,
      toCoordinates,
      dateTime,
      scheduledTime,
      accessibleOnly,
    ],
    () =>
      fromCoordinates &&
      toCoordinates &&
      getTripPlanner(
        `${fromCoordinates.latitude},${fromCoordinates.longitude}`,
        `${toCoordinates.latitude},${toCoordinates.longitude}`,
        dateTime,
        scheduledTime === ScheduleType.arrival,
        TravelModesOtpApi.transit,
        undefined,
        accessibleOnly
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

  useEffect(() => {
    if (location) {
      setFromName(i18n.t('screens.FromToScreen.Planner.currentPosition'))
      setFromCoordinates(location.coords)
    }
  }, [])

  const getLocationAsync = useCallback(
    async (
      setCoordinates: (location: {
        latitude: number
        longitude: number
      }) => void,
      reask: boolean
    ) => {
      const currentLocation = await getLocationWithPermission(true, reask)
      if (currentLocation) {
        setCoordinates(currentLocation.coords)
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
      const localNow = LocalDateTime.now()
      setDateTime(localNow)
      datetimePickerRef.current?.setDate(localNow)
      setCoordinates({
        latitude: details?.geometry.location.lat,
        longitude: details?.geometry.location.lng,
      })
    }
  }

  const onGooglePlaceFromChosen = useCallback(
    (
      data: GooglePlaceDataCorrected,
      details: GooglePlaceDetail | null = null
    ) => {
      setFromName(data.description)
      onGooglePlaceChosen(details, setFromCoordinates)
      fromBottomSheetRef?.current?.close()
    },
    []
  )

  const onGooglePlaceToChosen = useCallback(
    (
      data: GooglePlaceDataCorrected,
      details: GooglePlaceDetail | null = null
    ) => {
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
        fromCoordsName: { ...fromCoordinates, name: fromName },
        toCoordsName: { ...toCoordinates, name: toName },
      } as never
    )
    fromBottomSheetRef?.current?.close()
  }, [fromCoordinates, navigation, toCoordinates, fromName, toName])

  const setLocationFromMapTo = useCallback(() => {
    navigation.navigate(
      'ChooseLocationScreen' as never,
      {
        latitude: toCoordinates?.latitude,
        longitude: toCoordinates?.longitude,
        toNavigation: true,
        fromCoordsName: { ...fromCoordinates, name: fromName },
        toCoordsName: { ...toCoordinates, name: toName },
      } as never
    )
    toBottomSheetRef?.current?.close()
  }, [fromCoordinates, navigation, toCoordinates, fromName, toName])

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
                      fromPlace: fromName,
                      toPlace: toName,
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

  const hideSchedulePicker = () => {
    datetimeSheetRef.current?.close()
  }

  const handleConfirm = (date: Date) => {
    const utcTimestamp = Instant.parse(date.toISOString()) //'1989-08-16T00:00:00.000Z'
    const localDateTime = LocalDateTime.ofInstant(utcTimestamp)

    setDateTime(localDateTime)
    hideSchedulePicker()
  }

  const showSchedulePicker = () => {
    datetimeSheetRef.current?.snapToIndex(0)
  }

  const handleOptionChange = (scheduleTime: ScheduleType) => {
    setScheduledTime(scheduleTime)
  }

  const isDateTimeNow =
    Duration.between(dateTime, LocalDateTime.now())
      .abs()
      .compareTo(Duration.ofMinutes(1)) === -1
  const dateTimeToPrint = isDateTimeNow
    ? i18n.t('common.now')
    : dateTime.format(DateTimeFormatter.ofPattern('dd.MM. HH:mm'))

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FromToSelector
          onFromPlacePress={() => {
            fromBottomSheetRef?.current?.snapToIndex(0)
            fromRef?.current?.focus()
          }}
          onToPlacePress={() => {
            toBottomSheetRef?.current?.snapToIndex(0)
            toRef?.current?.focus()
          }}
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
        <View style={styles.schedulingContainer}>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <View
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
              }}
            >
              <TouchableOpacity
                onPress={showSchedulePicker}
                style={[
                  styles.row,
                  {
                    justifyContent: 'flex-start',
                  },
                ]}
              >
                <Feather name="clock" size={20} style={styles.schedulingIcon} />
                <Text style={styles.schedulingText}>
                  {scheduledTime === ScheduleType.departure &&
                    i18n.t('screens.FromToScreen.Planner.departure', {
                      time: dateTimeToPrint,
                    })}
                  {scheduledTime === ScheduleType.arrival &&
                    i18n.t('screens.FromToScreen.Planner.arrival', {
                      time: dateTimeToPrint,
                    })}
                </Text>
                <Ionicons
                  size={15}
                  style={styles.ionicon}
                  name="chevron-down"
                />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.row,
                { paddingLeft: 20, justifyContent: 'flex-end', flex: 1 },
              ]}
            >
              <View
                style={[
                  styles.row,
                  { flex: 0, position: 'relative', left: 12 },
                ]}
              >
                <WheelchairSvg
                  fill={colors.white}
                  width={20}
                  height={20}
                  style={styles.schedulingIcon}
                />
                <Text style={styles.schedulingText}>
                  {i18n.t('screens.FromToScreen.Planner.accessibleVehicles')}
                </Text>
              </View>
              <Switch
                trackColor={{ false: '#E1E4E8', true: '#ADCD00' }}
                thumbColor={colors.white}
                ios_backgroundColor="#E1E4E8"
                onValueChange={(value) => setAccessibleOnly(value)}
                value={accessibleOnly}
                style={{
                  flex: 0,
                  marginLeft: Platform.select({ ios: 10, android: 0 }),
                }}
              />
            </View>
          </View>
        </View>
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
      {interactionsFinished && (
        <Portal hostName="MapScreen">
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
            favoriteData={favoriteData}
            setFavoriteData={setFavoriteData}
          />
          <SearchFromToScreen
            sheetRef={toBottomSheetRef}
            onGooglePlaceChosen={onGooglePlaceToChosen}
            googleInputRef={toRef}
            setLocationFromMap={setLocationFromMapTo}
            inputPlaceholder={i18n.t(
              'screens.FromToScreen.Planner.toPlaceholder'
            )}
            initialSnapIndex={-1}
            favoriteData={favoriteData}
            setFavoriteData={setFavoriteData}
          />
        </Portal>
      )}
      {interactionsFinished && (
        <BottomSheet
          handleIndicatorStyle={s.handleStyle}
          snapPoints={[400]}
          index={-1}
          enablePanDownToClose
          ref={datetimeSheetRef}
        >
          <DateTimePicker
            onConfirm={handleConfirm}
            onScheduleTypeChange={handleOptionChange}
            ref={datetimePickerRef}
          />
        </BottomSheet>
      )}
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
    color: colors.white,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  schedulingContainer: {
    marginTop: 0,
    paddingVertical: 12,
  },
  schedulingText: {
    color: colors.white,
    marginHorizontal: 6,
    ...s.textSmall,
  },
  schedulingIcon: {
    color: colors.white,
    alignSelf: 'center',
    position: 'relative',
    top: -1,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 10,
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
})
