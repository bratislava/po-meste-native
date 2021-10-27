import React, { useContext } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'

import TicketSvg from '@images/ticket.svg'
import useMhdStopStatusData from '@hooks/useMhdStopStatusData'
import { GlobalStateContext } from '@components/common/GlobalStateProvider'
import { MhdStopProps } from '@utils/validation'
import { s } from '@utils/globalStyles'
import { getDateTimeFromDateAndTime } from '@utils/utils'
import { mhdDefaultColors } from '@utils/theme'

interface UpcomingDeparturesProps {
  station: MhdStopProps
}
const UpcomingDepartures = ({ station }: UpcomingDeparturesProps) => {
  const navigation = useNavigation()
  const globalstateContext = useContext(GlobalStateContext)

  const { data, isLoading, errors } = useMhdStopStatusData({
    id: station.id,
  })

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
      <ScrollView contentContainerStyle={styles.scrollingVehiclesData}>
        {data?.departures?.map((departure, index) => {
          const now = new Date()
          const arriveTime = getDateTimeFromDateAndTime(
            departure.date,
            departure.time
          )
          const diff =
            arriveTime && Math.abs(now.getTime() - arriveTime.getTime())
          const minutes = diff && Math.floor(diff / 1000 / 60)
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
                  {/* TODO add right icon https://inovaciebratislava.atlassian.net/browse/PLAN-239 */}
                  <TicketSvg
                    width={30}
                    height={40}
                    fill={
                      departure?.lineColor
                        ? `#${departure?.lineColor}`
                        : mhdDefaultColors.grey
                    }
                  />
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
                  {/* TODO add name https://inovaciebratislava.atlassian.net/browse/PLAN-244 */}
                  {departure.finalStationStopName}
                </Text>
              </View>
              <View style={styles.departureRight}>
                <Text>
                  {minutes !== false
                    ? minutes > 1
                      ? `${minutes} min`
                      : '<1 min'
                    : null}
                </Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
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
