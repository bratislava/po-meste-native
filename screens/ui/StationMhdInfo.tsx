import React, { useContext } from 'react'
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { MhdStopProps } from '@utils/validation'
import TicketSvg from '@images/ticket.svg'
import useMhdStopStatusData from '@hooks/useMhdStopStatusData'
import { GlobalStateContext } from './VehicleBar/GlobalStateProvider'
import { s } from '@utils/globalStyles'

interface StationMhdInfoProps {
  station: MhdStopProps
}
const StationMhdInfo = ({ station }: StationMhdInfoProps) => {
  const navigation = useNavigation()
  const globalstateContext = useContext(GlobalStateContext)

  const { data, isLoading, errors } = useMhdStopStatusData({
    id: station.stationStopId,
  })

  return (
    <View style={styles.vehicleBar}>
      <View style={styles.column}>
        <View style={styles.header}>
          <View style={styles.firstRow}>
            <View style={styles.start}>
              <View style={s.icon}>
                <TicketSvg fill="red" />
              </View>
              <Text>{station.name}</Text>
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
                <View style={s.icon}>
                  <TicketSvg fill="white" />
                </View>
                <Text style={s.whiteText}>{departure.value}</Text>
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
                onPress={() => {
                  globalstateContext.setTimeLineNumber(departure.lineNumber)
                  navigation.navigate('LineTimeline')
                }}
              >
                <View style={styles.departureLeft}>
                  <View key={index} style={s.icon}>
                    <TicketSvg width={30} height={40} fill="red" />
                  </View>
                  <Text style={[s.lineNumber, s.bgRed, s.whiteText]}>
                    {departure.lineNumber}
                  </Text>
                  <Text style={[s.blackText, styles.finalStation]}>
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

export default StationMhdInfo
