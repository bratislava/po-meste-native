import React from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { MhdStopProps } from '../../utils/validation'
import TicketSvg from '../../assets/images/ticket.svg'
import useMhdStopStatusData from '../../hooks/useMhdStopStatusData'

interface StationMhdInfoProps {
  station: MhdStopProps
}
const StationMhdInfo = ({ station }: StationMhdInfoProps) => {
  const navigation = useNavigation()

  const { data, isLoading, errors } = useMhdStopStatusData({
    id: station.stationStopId,
  })

  return (
    <View style={styles.vehicleBar}>
      <View style={styles.column}>
        <View style={styles.header}>
          <View style={styles.firstRow}>
            <View style={styles.start}>
              <View style={styles.busStopIcon}>
                <TicketSvg fill="red" />
              </View>
              <Text>{station.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.navigateToIcon}
              onPress={() => navigation.navigate('FromToScreen')} // TODO add gps coordinates to navigate from
            >
              <TicketSvg fill="blue" />
            </TouchableOpacity>
          </View>
          <View style={styles.secondRow}>
            {[
              // TODO change for real-lines
              { value: 1, color: 'red' },
              { value: 2, color: 'green' },
              { value: 70, color: 'yellow' },
            ]?.map((departure, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.linkFilter,
                  { backgroundColor: departure.color },
                ]}
                onPress={() => console.log('TODO filter line')}
              >
                <View style={styles.busStopIcon}>
                  <TicketSvg fill="white" />
                </View>
                <Text style={styles.whiteText}>{departure.value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.scrollingVehiclesData}>
          {data?.departures?.map((departure, index) => {
            const now = new Date()
            const departureTime = new Date(departure.time)
            departureTime.setHours(departureTime.getHours() - 2)

            const diff = Math.abs(now.getTime() - departureTime.getTime())

            const minutes = Math.floor(diff / 1000 / 60)
            return (
              <TouchableOpacity
                key={index}
                style={styles.lineDeparture}
                onPress={() => navigation.navigate('LineTimeline')}
              >
                <View style={styles.departureLeft}>
                  <View key={index} style={styles.busStopIcon}>
                    <TicketSvg width={30} height={40} fill="red" />
                  </View>
                  <Text style={[styles.lineNumber, styles.whiteText]}>
                    {departure.lineNumber}
                  </Text>
                  <Text style={styles.finalStation}>
                    {departure.finalStationStopName}
                  </Text>
                </View>
                <View style={styles.departureRight}>
                  <Text>{minutes > 1 ? `${minutes} min` : '<1 min'}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  vehicleBar: {
    display: 'flex',
    flex: 1,
    position: 'absolute',
    bottom: 0,
    marginBottom: 0,
    padding: 0,
    width: '100%',
    height: 300,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  column: {
    flex: 1,
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
  linkFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  scrollingVehiclesData: {
    paddingHorizontal: 10,
  },
  lineDeparture: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  departureLeft: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  departureRight: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  lineNumber: {
    backgroundColor: 'red',
    height: '100%',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  finalStation: {
    color: 'black',
    marginLeft: 10,
  },
  whiteText: {
    color: 'white',
  },
  start: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  busStopIcon: {
    marginRight: 10,
  },
  navigateToIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
})

export default StationMhdInfo
