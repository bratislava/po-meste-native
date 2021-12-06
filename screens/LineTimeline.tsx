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
import { LocalTime, DateTimeFormatter } from '@js-joda/core'
import { useQuery } from 'react-query'

import { MapParamList } from '../types'
import TicketSvg from '@images/ticket.svg'
import { s } from '@utils/globalStyles'
import { colors, mhdDefaultColors } from '@utils/theme'
import DashedLine from './ui/DashedLine/DashedLine'
import { getMhdTrip } from '@utils/api'

export default function LineTimeline({
  route,
}: StackScreenProps<MapParamList, 'LineTimeline'>) {
  const { tripId, stopId } = route?.params

  const navigation = useNavigation()
  const [elementPosition, setElementPosition] = useState<number>()
  const scrollViewRef = useRef<ScrollView | null>(null)
  const { data, isLoading, error } = useQuery(['getMhdTrip', tripId], () =>
    getMhdTrip(tripId)
  )

  const activeIndex = useMemo(
    () => data?.timeline?.findIndex((stop) => stopId === stop.stopId),
    [data, stopId]
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
                {/* TODO add right icon https://inovaciebratislava.atlassian.net/browse/PLAN-239 */}
                <TicketSvg
                  width={30}
                  height={40}
                  fill={
                    data?.lineColor
                      ? `#${data?.lineColor}`
                      : mhdDefaultColors.grey
                  }
                />
              </View>
              <Text
                style={[
                  s.lineNumber,
                  {
                    backgroundColor: data?.lineColor
                      ? `#${data?.lineColor}`
                      : mhdDefaultColors.grey,
                  },
                  s.whiteText,
                ]}
              >
                {data?.lineNumber}
              </Text>
              <Text style={[styles.finalStation, s.blackText]}>
                {data?.finalStopName}
              </Text>
            </View>
          </View>
        </View>
        <ScrollView ref={scrollViewRef} contentContainerStyle={combineStyles}>
          {/* TODO style dashed line */}
          <DashedLine color={colors.darkText} />
          <View style={styles.departures}>
            {data?.timeline?.map((spot, index) => (
              <TouchableOpacity
                key={index}
                style={styles.departureLine}
                onPress={() => {
                  data?.lineNumber &&
                    navigation.navigate('Timetable', {
                      stopId: spot.stopId,
                      lineNumber: data.lineNumber,
                    })
                }}
                onLayout={(event) =>
                  activeIndex == index &&
                  setElementPosition(event.nativeEvent.layout.y)
                }
              >
                <Text
                  style={[
                    activeIndex && activeIndex > index
                      ? styles.greyText
                      : activeIndex === index
                      ? styles.redText
                      : s.blackText,
                    styles.time,
                  ]}
                >
                  {LocalTime.parse(spot.time).format(
                    DateTimeFormatter.ofPattern('HH:mm')
                  )}
                </Text>
                <Text
                  style={[
                    activeIndex && activeIndex > index
                      ? styles.greyText
                      : activeIndex === index
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
