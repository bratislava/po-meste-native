import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'

import { MapParamList } from '../types'
import TicketSvg from '../assets/images/ticket.svg'

const dummyData = {
  lineNumber: 4,
  finalStationStopName: 'Dúbravka',
  timeline: [
    {
      dateTime: '2021-09-02T09:40:13.541Z',
      stopName: 'Lúčanka',
      active: false,
    },
    {
      dateTime: '2021-09-02T09:41:13.541Z',
      stopName: 'Strečnianska',
      active: false,
    },
    {
      dateTime: '2021-09-02T09:42:13.541Z',
      stopName: 'Šintavská',
      active: false,
    },
    {
      dateTime: '2021-09-02T09:43:13.541Z',
      stopName: 'Topoľčianska',
      active: false,
    },
    {
      dateTime: '2021-09-02T09:44:13.541Z',
      stopName: 'TECHNOpol',
      active: false,
    },
    {
      dateTime: '2021-09-02T09:40:13.541Z',
      stopName: 'Lúčanka',
      active: false,
    },
    {
      dateTime: '2021-09-02T09:41:13.541Z',
      stopName: 'Strečnianska',
      active: false,
    },
    {
      dateTime: '2021-09-02T09:42:13.541Z',
      stopName: 'Šintavská',
      active: false,
    },
    {
      dateTime: '2021-09-02T09:43:13.541Z',
      stopName: 'Topoľčianska',
      active: false,
    },
    {
      dateTime: '2021-09-02T09:44:13.541Z',
      stopName: 'TECHNOpol',
      active: false,
    },
    {
      dateTime: '2021-09-02T09:40:13.541Z',
      stopName: 'Lúčanka',
      active: false,
    },
    {
      dateTime: '2021-09-02T09:41:13.541Z',
      stopName: 'Strečnianska',
      active: false,
    },
    {
      dateTime: '2021-09-02T09:42:13.541Z',
      stopName: 'Šintavská',
      active: false,
    },
    {
      dateTime: '2021-09-02T09:43:13.541Z',
      stopName: 'Topoľčianska',
      active: true,
    },
    {
      dateTime: '2021-09-02T09:44:13.541Z',
      stopName: 'TECHNOpol',
      active: false,
    },
  ],
}

export default function LineTimeline({
  route,
}: StackScreenProps<MapParamList, 'LineTimeline'>) {
  const activeIndex = useMemo(
    () => dummyData.timeline.findIndex((departure) => departure.active),
    [dummyData]
  )
  const [elementPosition, setElementPosition] = useState<number>()
  const scrollViewRef = useRef<ScrollView | null>(null)

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: elementPosition, animated: true })
  }, [elementPosition, scrollViewRef])

  const combineStyles = StyleSheet.flatten([styles.columns, styles.content])

  return (
    <View style={styles.vehicleBar}>
      <View style={styles.column}>
        <View style={styles.headerGrey}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.busStopIcon}>
                <TicketSvg width={30} height={40} fill="red" />
              </View>
              <Text style={[styles.lineNumber, styles.whiteText]}>
                {dummyData.lineNumber}
              </Text>
              <Text style={styles.finalStation}>
                {dummyData.finalStationStopName}
              </Text>
            </View>
          </View>
        </View>
        <ScrollView ref={scrollViewRef} contentContainerStyle={combineStyles}>
          <View style={styles.line}></View>
          <View style={styles.departures}>
            {dummyData.timeline.map((spot, index) => (
              <TouchableOpacity
                key={index}
                style={styles.departureLine}
                onPress={() => {
                  //TODO add connection to Grafikon
                }}
                onLayout={(event) =>
                  setElementPosition(event.nativeEvent.layout.y)
                }
              >
                <Text
                  style={[
                    activeIndex > index
                      ? styles.greyText
                      : spot.active
                      ? styles.redText
                      : styles.blackText,
                    styles.time,
                  ]}
                >
                  {`${new Date(spot.dateTime).getHours()}:${new Date(
                    spot.dateTime
                  ).getMinutes()}`}
                </Text>
                <Text
                  style={[
                    activeIndex > index
                      ? styles.greyText
                      : spot.active
                      ? styles.redText
                      : styles.blackText,
                    styles.underlineText,
                  ]}
                >
                  {spot.stopName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    marginHorizontal: 30,
  },
  vehicleBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
  },
  column: {
    flex: 1,
  },
  headerGrey: {
    backgroundColor: 'lightgrey',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  busStopIcon: {
    marginRight: 10,
  },
  lineNumber: {
    backgroundColor: 'red',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  blackText: {
    color: 'black',
  },
  whiteText: {
    color: 'white',
  },
  redText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 25,
  },
  greyText: {
    color: 'grey',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  finalStation: {
    color: 'black',
    marginLeft: 10,
  },
  departureLine: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 15,
  },
  time: {
    marginRight: 10,
  },
  line: {
    borderWidth: 5,
    borderColor: 'black',
    marginHorizontal: 10,
    borderStyle: 'dotted',
    borderRadius: 1,
    // https://stackoverflow.com/questions/48258084/borderstyle-not-working-in-android-react-native#comment111720287_48258424
  },
  columns: {
    flexDirection: 'row',
  },
  departures: {
    flex: 1,
    color: 'black',
  },
})
