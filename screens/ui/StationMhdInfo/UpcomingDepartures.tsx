import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useQuery } from 'react-query'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'

import MhdStopSignSvg from '@images/stop-sign.svg'
import ForwardMhdStopSvg from '@images/forward-mhd-stop.svg'
import { GlobalStateContext } from '@components/common/GlobalStateProvider'
import { MhdStopProps } from '@utils/validation'
import { s } from '@utils/globalStyles'
import { colors, mhdDefaultColors } from '@utils/theme'
import { LocalDateTime, Duration } from '@js-joda/core'
import { TransitVehicleType } from '../../../types'
import { BOTTOM_VEHICLE_BAR_HEIGHT_ALL } from '../VehicleBar/VehicleBar'
import { getMhdStopStatusData } from '@utils/api'
import LoadingView from '../LoadingView/LoadingView'
import { getVehicle } from '@utils/utils'

interface UpcomingDeparturesProps {
  station: MhdStopProps
}
const UpcomingDepartures = ({ station }: UpcomingDeparturesProps) => {
  const navigation = useNavigation()
  const globalstateContext = useContext(GlobalStateContext)

  const { data, isLoading, error, refetch } = useQuery(
    ['getMhdStopStatusData', station.id],
    () => getMhdStopStatusData(station.id)
  )

  const [filtersLineNumber, setFiltersLineNumber] = useState<string[]>([])

  useEffect(() => {
    const interval = setInterval(() => refetch(), 30000)
    return () => {
      clearInterval(interval)
    }
  }, [refetch])

  const getVehicleIconStyled = (
    vehicleType?: TransitVehicleType,
    color: string = mhdDefaultColors.grey
  ) => {
    const Icon = getVehicle(vehicleType)
    return <Icon height={27} width={27} fill={color} />
  }

  const getVehicleIconStyledFilter = (
    vehicleType?: TransitVehicleType,
    color: string = mhdDefaultColors.grey
  ) => {
    const Icon = getVehicle(vehicleType)
    return <Icon width={17} height={17} fill={color} />
  }

  useEffect(() => {
    if (data?.allLines) {
      setFiltersLineNumber(
        data?.allLines?.map((singleLine) => singleLine.lineNumber)
      )
    }
  }, [data])

  const applyFilter = useCallback(
    (lineNumber: string) => {
      const index = filtersLineNumber.indexOf(lineNumber)
      if (index > -1) {
        if (
          data?.allLines &&
          filtersLineNumber.length === data.allLines.length
        ) {
          setFiltersLineNumber([lineNumber])
        } else {
          setFiltersLineNumber((oldFilters) =>
            oldFilters.filter((value) => value !== lineNumber)
          )
        }
      } else {
        setFiltersLineNumber((oldFilters) => oldFilters.concat(lineNumber))
      }
    },
    [data?.allLines, filtersLineNumber]
  )

  return (
    <View style={styles.column}>
      <View style={styles.header}>
        <View style={[styles.firstRow, s.horizontalMargin]}>
          <View style={styles.start}>
            <View style={s.icon}>
              <MhdStopSignSvg fill={colors.primary} />
            </View>
            <Text>{`${station.name} ${
              station.platform ? station.platform : ''
            }`}</Text>
          </View>
          <View style={styles.forward}>
            <TouchableOpacity
              style={styles.navigateToIcon}
              onPress={() =>
                navigation.navigate('FromToScreen', {
                  from: {
                    name: station.name,
                    latitude: parseFloat(station.gpsLat),
                    longitude: parseFloat(station.gpsLon),
                  },
                })
              }
            >
              <ForwardMhdStopSvg fill={colors.primary} height={20} width={20} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView horizontal contentContainerStyle={styles.secondRow}>
          {data?.allLines?.map((departure, index) => {
            const isActive = filtersLineNumber.includes(departure.lineNumber)

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.linkFilter,
                  {
                    marginLeft: index ? 5 : 0,
                    backgroundColor: `${
                      isActive
                        ? '#' + departure.lineColor
                        : colors.lightLightGray
                    }`,
                    borderColor: isActive
                      ? '#' + departure.lineColor
                      : colors.gray,
                  },
                ]} //TODO add colors https://inovaciebratislava.atlassian.net/browse/PLAN-238
                onPress={() => applyFilter(departure.lineNumber)}
              >
                <View style={s.icon}>
                  {getVehicleIconStyledFilter(
                    departure.vehicleType,
                    isActive ? 'white' : colors.gray
                  )}
                </View>
                <Text
                  style={[
                    { color: isActive ? 'white' : colors.gray },
                    s.boldText,
                  ]}
                >
                  {departure.lineNumber}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
      <BottomSheetScrollView
        contentContainerStyle={[
          styles.scrollingVehiclesData,
          styles.contentWrapper,
          s.horizontalMargin,
        ]}
      >
        {isLoading && (
          <LoadingView
            stylesOuter={styles.elevation}
            iconWidth={80}
            iconHeight={80}
          />
        )}
        {data?.departures
          ?.filter((departure) =>
            filtersLineNumber.includes(departure.lineNumber)
          )
          ?.map((departure, index) => {
            const diffMinutes = Duration.between(
              LocalDateTime.now(),
              LocalDateTime.parse(`${departure.date}T${departure.time}`)
            ).toMinutes()
            return (
              <TouchableOpacity
                key={index}
                style={styles.lineDeparture}
                onPress={() => {
                  globalstateContext.setTimeLineNumber(departure.lineNumber)
                  navigation.navigate('LineTimelineScreen', {
                    tripId: departure.tripId,
                    stopId: station.id,
                  })
                }}
              >
                <View style={styles.departureLeft}>
                  <View key={index} style={s.icon}>
                    {getVehicleIconStyled(
                      departure.vehicleType,
                      departure?.lineColor
                        ? `#${departure?.lineColor}`
                        : undefined
                    )}
                  </View>
                  <Text
                    style={[
                      s.lineNumber,
                      {
                        backgroundColor: departure.lineColor
                          ? `#${departure.lineColor}`
                          : mhdDefaultColors.grey,
                      },
                      s.whiteText,
                      s.boldText,
                    ]}
                  >
                    {departure.lineNumber}
                  </Text>
                  <Text style={[s.blackText, styles.finalStation]}>
                    {departure.finalStopName}
                  </Text>
                </View>
                <View style={styles.departureRight}>
                  <Text>
                    {diffMinutes > 1 ? `${diffMinutes} min` : '<1 min'}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })}
      </BottomSheetScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
    paddingBottom: 5,
  },
  elevation: {
    elevation: 1,
  },
  firstRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  header: {
    backgroundColor: colors.lightLightGray,
    paddingVertical: 10,
  },
  secondRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentWrapper: {
    paddingBottom: BOTTOM_VEHICLE_BAR_HEIGHT_ALL,
  },
  linkFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: 10,
  },
  scrollingVehiclesData: {
    paddingVertical: 5,
  },
  lineDeparture: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  departureLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  departureRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  finalStation: {
    marginLeft: 10,
  },
  start: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  navigateToIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  forward: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 25,
    elevation: 5,
  },
})

export default UpcomingDepartures
