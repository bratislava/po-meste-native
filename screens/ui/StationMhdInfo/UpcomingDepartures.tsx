import React, { useCallback, useContext, useEffect, useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useQuery } from 'react-query'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'

import TicketSvg from '@images/ticket.svg'
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

  const { data, isLoading, error } = useQuery(
    ['getMhdStopStatusData', station.id],
    () => getMhdStopStatusData(station.id)
  )

  const [filtersLineNumber, setFiltersLineNumber] = useState<string[]>([])

  const getVehicleIconStyled = (
    vehicleType?: TransitVehicleType,
    color: string = mhdDefaultColors.grey
  ) => {
    const Icon = getVehicle(vehicleType)
    return <Icon width={30} height={30} fill={color} />
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
        <View style={styles.firstRow}>
          <View style={styles.start}>
            <View style={s.icon}>
              <TicketSvg fill="red" />
            </View>
            <Text>{`${station.name} ${
              station.platform ? station.platform : ''
            }`}</Text>
          </View>
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
            <TicketSvg fill="blue" />
          </TouchableOpacity>
        </View>
        <View style={styles.secondRow}>
          {/* TODO add loading, see comments https://inovaciebratislava.atlassian.net/browse/PLAN-233 */}
          {data?.allLines?.map((departure, index) => {
            const isActive = filtersLineNumber.includes(departure.lineNumber)

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.linkFilter,
                  {
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
                  <TicketSvg fill={isActive ? 'white' : colors.gray} />
                </View>
                <Text style={{ color: isActive ? 'white' : colors.gray }}>
                  {departure.lineNumber}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
      <BottomSheetScrollView
        contentContainerStyle={[
          styles.scrollingVehiclesData,
          styles.contentWrapper,
        ]}
      >
        {isLoading ? <LoadingView /> : null}
        {data?.departures
          ?.filter((departure) =>
            filtersLineNumber.includes(departure.lineNumber)
          )
          ?.map((departure, index) => {
            const diffMinutes = Duration.between(
              LocalDateTime.now(),
              LocalDateTime.parse(
                `${departure.date}T${departure.time}`
              ).plusHours(2)
            ).toMinutes()
            return (
              <TouchableOpacity
                key={index}
                style={styles.lineDeparture}
                onPress={() => {
                  globalstateContext.setTimeLineNumber(departure.lineNumber)
                  navigation.navigate('LineTimeline', {
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
  firstRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
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
    paddingHorizontal: 10,
  },
  contentWrapper: {
    paddingBottom: BOTTOM_VEHICLE_BAR_HEIGHT_ALL,
  },
  linkFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    marginHorizontal: 5,
    borderWidth: 1,
  },
  scrollingVehiclesData: {
    paddingHorizontal: 10,
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
})

export default UpcomingDepartures
