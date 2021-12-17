import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import i18n from 'i18n-js'

import { MapParamList } from '@types'
import { s } from '@utils/globalStyles'
import { colors, mhdDefaultColors } from '@utils/theme'
import DashedLine from '@components/DashedLine'
import { getMhdTrip } from '@utils/api'
import { LineNumber, LoadingView } from '@components'
import { getVehicle } from '@utils/utils'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import ErrorView from '@components/ErrorView'

export default function LineTimelineScreen({
  route,
}: StackScreenProps<MapParamList, 'LineTimelineScreen'>) {
  const { tripId, stopId } = route?.params

  const navigation = useNavigation()
  const [elementPosition, setElementPosition] = useState<number>()
  const bottomTabBarHeight = useBottomTabBarHeight()
  const scrollViewRef = useRef<ScrollView | null>(null)
  const { data, isLoading, error, refetch } = useQuery(
    ['getMhdTrip', tripId],
    () => getMhdTrip(tripId)
  )

  const activeIndex = useMemo(
    () => data?.timeline?.findIndex((stop) => stopId === stop.stopId),
    [data, stopId]
  )
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: elementPosition, animated: true })
  }, [elementPosition, scrollViewRef])

  const getVehicleIconStyledFilter = useCallback(() => {
    const Icon = getVehicle(data?.vehicleType)
    return (
      <Icon
        width={24}
        height={24}
        fill={data?.lineColor ? `#${data?.lineColor}` : mhdDefaultColors.grey}
      />
    )
  }, [data])

  if (!isLoading && error)
    return (
      <ErrorView
        errorMessage={i18n.t('dataLineTimelineScreenError')}
        error={error}
        action={refetch}
      />
    )

  return (
    <>
      <View style={{ flex: 1, paddingBottom: bottomTabBarHeight }}>
        <View style={styles.headerGrey}>
          <View style={s.horizontalMargin}>
            <View style={styles.header}>
              <View style={s.icon}>{getVehicleIconStyledFilter()}</View>
              <LineNumber number={data?.lineNumber} color={data?.lineColor} />
              <Text style={[styles.finalStation, s.blackText]}>
                {data?.finalStopName}
              </Text>
            </View>
          </View>
        </View>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[styles.columns, s.horizontalMargin]}
        >
          <View style={styles.dashedLineContainer}>
            <DashedLine
              dashLength={1}
              strokeWidth={4}
              spacing={12}
              color={colors.lighterGray}
            />
          </View>
          <View style={styles.departures}>
            {data?.timeline?.map((spot, index) => (
              <TouchableOpacity
                key={index}
                style={styles.departureLine}
                onPress={() => {
                  data?.lineNumber &&
                    navigation.navigate('LineTimetableScreen', {
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
                      ? styles.highlightedText
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
                      ? styles.highlightedText
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
      {isLoading && <LoadingView fullscreen iconWidth={80} iconHeight={80} />}
    </>
  )
}

const styles = StyleSheet.create({
  headerGrey: {
    backgroundColor: colors.lightLightGray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  dashedLineContainer: {
    paddingHorizontal: 10,
  },
  highlightedText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 20,
  },
  greyText: {
    color: colors.lighterGray,
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
    paddingLeft: 10,
  },
  time: {
    marginRight: 10,
  },
  columns: {
    flexDirection: 'row',
  },
  departures: {
    flex: 1,
    color: 'black',
    paddingBottom: 20,
  },
})
