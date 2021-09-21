import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'

import { MapParamList } from '../types'
import TicketSvg from '../assets/images/ticket.svg'
import { dummyDataLineTimeline } from '../dummyData'
import { s } from '../utils/globalStyles'
import { colors } from '../utils/theme'

export default function LineTimeline({
  route,
}: StackScreenProps<MapParamList, 'LineTimeline'>) {
  const navigation = useNavigation()
  const [elementPosition, setElementPosition] = useState<number>()
  const scrollViewRef = useRef<ScrollView | null>(null)

  const activeIndex = useMemo(
    () =>
      dummyDataLineTimeline.timeline.findIndex((departure) => departure.active),
    [dummyDataLineTimeline]
  )
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: elementPosition, animated: true })
  }, [elementPosition, scrollViewRef])

  const combineStyles = StyleSheet.flatten([styles.columns, s.horizontalMargin])

  return (
    <View style={s.container}>
      <View style={styles.column}>
        <View style={styles.headerGrey}>
          <View style={s.horizontalMargin}>
            <View style={styles.header}>
              <View style={s.icon}>
                <TicketSvg width={30} height={40} fill="red" />
              </View>
              <Text style={[s.lineNumber, s.bgRed, s.whiteText]}>
                {dummyDataLineTimeline.lineNumber}
              </Text>
              <Text style={[styles.finalStation, s.blackText]}>
                {dummyDataLineTimeline.finalStationStopName}
              </Text>
            </View>
          </View>
        </View>
        <ScrollView ref={scrollViewRef} contentContainerStyle={combineStyles}>
          <View style={styles.line}></View>
          <View style={styles.departures}>
            {dummyDataLineTimeline.timeline.map((spot, index) => (
              <TouchableOpacity
                key={index}
                style={styles.departureLine}
                onPress={() => {
                  navigation.navigate('Timetable')
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
                      : s.blackText,
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
                      : s.blackText,
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
  redText: {
    color: colors.error,
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
