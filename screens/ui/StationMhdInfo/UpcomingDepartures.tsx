import React, { useContext } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'

import TicketSvg from '@images/ticket.svg'
import TramSvg from '@images/tram.svg'
import TrolleybusSvg from '@images/trolleybus.svg'
import BusSvg from '@images/bus.svg'
import useMhdStopStatusData from '@hooks/useMhdStopStatusData'
import { GlobalStateContext } from '@components/common/GlobalStateProvider'
import { MhdStopProps } from '@utils/validation'
import { s } from '@utils/globalStyles'
import { mhdDefaultColors } from '@utils/theme'
import { LocalDateTime, Duration } from '@js-joda/core'
import { TransitVehicleType } from '../../../types'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { BOTTOM_VEHICLE_BAR_HEIGHT_ALL } from '../VehicleBar/VehicleBar'

interface UpcomingDeparturesProps {
  station: MhdStopProps
}
const UpcomingDepartures = ({ station }: UpcomingDeparturesProps) => {
  const navigation = useNavigation()
  const globalstateContext = useContext(GlobalStateContext)

  const { data, isLoading, errors } = useMhdStopStatusData({
    id: station.id,
  })

  const getVehicle = (
    vehicletype?: TransitVehicleType,
    color: string = mhdDefaultColors.grey
  ) => {
    switch (vehicletype) {
      case TransitVehicleType.trolleybus:
        return <TrolleybusSvg width={30} height={40} fill={color} />
      case TransitVehicleType.tram:
        return <TramSvg width={30} height={40} fill={color} />
      case TransitVehicleType.bus:
        return <BusSvg width={30} height={40} fill={color} />
      default:
        return <BusSvg width={30} height={40} fill={color} />
    }
  }

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
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.linkFilter,
                  { backgroundColor: `#${departure.lineColor}` },
                ]} //TODO add colors https://inovaciebratislava.atlassian.net/browse/PLAN-238
                onPress={() => console.log('TODO filter line')}
              >
                <View style={s.icon}>
                  <TicketSvg fill="white" />
                </View>
                <Text style={s.whiteText}>{departure.lineNumber}</Text>
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
        {data?.departures?.map((departure, index) => {
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
                  {getVehicle(
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
                <Text>{diffMinutes > 1 ? `${diffMinutes} min` : '<1 min'}</Text>
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
    backgroundColor: 'lightgrey',
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
