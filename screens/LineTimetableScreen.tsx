import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import _ from 'lodash'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import i18n from 'i18n-js'
import { StackScreenProps } from '@react-navigation/stack'
import { useQuery } from 'react-query'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { DateTimeFormatter, Instant, LocalDate } from '@js-joda/core'
import { Ionicons } from '@expo/vector-icons'

import { colors, mhdDefaultColors } from '@utils/theme'
import { getMhdGrafikon } from '@utils/api'
import { MapParamList, TimetableType } from '../types'
import ArrowRight from '@images/arrow-right.svg'
import { s } from '@utils/globalStyles'
import ErrorView from '@components/ErrorView'
import LoadingView from './ui/LoadingView/LoadingView'
import { getVehicle } from '@utils/utils'
import { LineNumber } from '@components/LineNumber'

export default function LineTimetableScreen({
  route,
}: StackScreenProps<MapParamList, 'LineTimetableScreen'>) {
  const [activeTimetable, setActiveTimetable] = useState<TimetableType>(
    TimetableType.workDays
  )
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [date, setDate] = useState(LocalDate.now())

  const { stopId, lineNumber } = route.params
  const { data, isLoading, error, refetch } = useQuery(
    ['getGrafikon', stopId, lineNumber, date],
    () => getMhdGrafikon(stopId, lineNumber, date)
  )

  const verticalScrollViewRef = useRef<ScrollView | null>(null)
  const horizontalScrollViewRef = useRef<ScrollView | null>(null)
  const [highlightedMinutePositionX, setHighlightedMinutePositionX] =
    useState<number>(0)
  const [highlightedMinutePositionY, setHighlightedMinutePositionY] =
    useState<number>(0)

  //scroll to highlighted minute on layout event
  useEffect(() => {
    setTimeout(() => {
      horizontalScrollViewRef.current?.scrollTo({
        x: highlightedMinutePositionX,
        animated: true,
      })
      verticalScrollViewRef.current?.scrollTo({
        y: highlightedMinutePositionY,
        animated: true,
      })
    }, 500)
  }, [
    highlightedMinutePositionX,
    highlightedMinutePositionY,
    verticalScrollViewRef,
    horizontalScrollViewRef,
  ])

  const formattedData = useMemo(() => {
    const timetableByHours = _.groupBy(data?.timetable, (value) => {
      return parseInt(value.split(':')[0])
    })
    return _.range(4, 24)
      .concat(0) // after midnight links is marked '00:24:00'
      .map((hour) => {
        return {
          hour,
          minutes: timetableByHours[hour]
            ? timetableByHours[hour].map((value) => ({
                minute: value.split(':')[1],
                additionalInfo: '',
              }))
            : [],
        }
      })
  }, [data])

  const activeIndex = useMemo(() => {
    const now = new Date().getTime()
    const times = formattedData.reduce(
      (accumulatorHours, hourObject, indexHours) => {
        const timesInHours = hourObject.minutes.reduce(
          (accumulatorMinutes, departureMinute, indexMinutes) => {
            const date = new Date()
            date.setHours(hourObject.hour)
            date.setMinutes(parseInt(departureMinute.minute))
            if (
              accumulatorMinutes[0] > date.getTime() - now &&
              date.getTime() - now > 0
            ) {
              return [date.getTime() - now, indexHours, indexMinutes]
            }
            return accumulatorMinutes
          },
          accumulatorHours
        )
        if (accumulatorHours[0] > timesInHours[0] && timesInHours[0] > 0) {
          return [timesInHours[0], timesInHours[1], timesInHours[2]]
        }
        return accumulatorHours
      },
      [Infinity, Infinity, Infinity]
    )
    return times
  }, [formattedData])

  const handleConfirm = (date: Date) => {
    const utcTimestamp = Instant.parse(date.toISOString()) //'1989-08-16T00:00:00.000Z'
    const localDateTime = LocalDate.ofInstant(utcTimestamp)

    setDate(localDateTime)
    hideDatePicker()
  }

  const showSchedulePicker = () => {
    setDatePickerVisibility(true)
  }

  const hideDatePicker = () => {
    setDatePickerVisibility(false)
  }

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

  const shouldBeMinuteHighlighted = (
    indexHours: number,
    indexMinutes: number
  ) => {
    return activeIndex[1] === indexHours && activeIndex[2] === indexMinutes
  }

  if (error) return <ErrorView error={error} action={refetch} />

  return (
    <View style={s.container}>
      <View style={styles.column}>
        {isLoading && (
          <LoadingView
            fullscreen
            stylesOuter={styles.elevation}
            iconWidth={80}
            iconHeight={80}
          />
        )}
        <View style={styles.headerGrey}>
          <View style={s.horizontalMargin}>
            <View style={styles.header}>
              <View style={s.icon}>{getVehicleIconStyledFilter()}</View>
              <LineNumber number={data?.lineNumber} color={data?.lineColor} />
              <Text style={[styles.startStation, styles.textBold, s.blackText]}>
                {data?.currentStopName}
              </Text>
              <View style={[s.icon, styles.marginHorizontal]}>
                <ArrowRight width={12} height={12} fill={colors.primary} />
              </View>
              <Text style={s.blackText}>{data?.finalStopName}</Text>
            </View>
          </View>
        </View>
        <View style={[s.horizontalMargin, styles.timetableDayType]}>
          <TouchableHighlight onPress={showSchedulePicker}>
            <Text style={styles.schedulingText}>
              {date.format(DateTimeFormatter.ofPattern('dd.MM.'))}
              {LocalDate.now().toString() === date.toString() &&
                i18n.t('today')}
              {LocalDate.now().toString() === date.minusDays(1).toString() &&
                i18n.t('tomorrow')}
              <Ionicons
                size={15}
                style={{
                  alignSelf: 'center',
                  color: colors.primary,
                }}
                name="chevron-down"
              />
            </Text>
          </TouchableHighlight>
          {/* <ButtonGroup style={styles.row}> //TODO left for https://inovaciebratislava.atlassian.net/browse/PLAN-293
            {Object.keys(TimetableType).map((key) => {
              return (
                <Button
                  key={key}
                  variant={activeTimetable === key ? 'danger' : 'secondary'}
                  titleStyle={styles.textAlign}
                  onPress={() => {
                    key === TimetableType.workDays &&
                      setActiveTimetable(TimetableType.workDays)
                    key === TimetableType.weekend &&
                      setActiveTimetable(TimetableType.weekend)
                    key === TimetableType.holidays &&
                      setActiveTimetable(TimetableType.holidays)
                  }}
                  title={
                    (key === TimetableType.workDays && i18n.t('workDays')) ||
                    (key === TimetableType.weekend && i18n.t('weekend')) ||
                    (key === TimetableType.holidays && i18n.t('holidays')) ||
                    ''
                  }
                />
              )
            })}
          </ButtonGroup> */}
        </View>
        <ScrollView
          ref={verticalScrollViewRef}
          contentContainerStyle={s.horizontalMargin}
        >
          <ScrollView
            ref={horizontalScrollViewRef}
            horizontal
            contentContainerStyle={styles.flexColumn}
          >
            {[
              4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
              22, 23, 0,
            ].map((hour, indexHours) => {
              const dataToShow = formattedData.find(
                (hourDataRow) => hourDataRow.hour === hour
              )
              return (
                <View
                  key={hour}
                  style={[
                    styles.timetableRow,
                    indexHours % 2 === 0 ? styles.headerEven : null,
                  ]}
                  onLayout={(event) =>
                    activeIndex[1] === indexHours &&
                    setHighlightedMinutePositionY(event.nativeEvent.layout.y)
                  }
                >
                  <Text
                    style={[
                      styles.textBold,
                      styles.hourText,
                      indexHours % 2 === 0 ? styles.hourEven : null,
                    ]}
                  >
                    {hour}
                  </Text>
                  {dataToShow?.minutes.map((minuteData, indexMinutes) => {
                    return (
                      <View
                        key={indexMinutes}
                        style={[
                          styles.minuteContainer,
                          shouldBeMinuteHighlighted(indexHours, indexMinutes)
                            ? styles.highlightedMinuteContainer
                            : null,
                        ]}
                        onLayout={(event) =>
                          shouldBeMinuteHighlighted(indexHours, indexMinutes) &&
                          setHighlightedMinutePositionX(
                            event.nativeEvent.layout.x
                          )
                        }
                      >
                        <Text
                          style={
                            shouldBeMinuteHighlighted(indexHours, indexMinutes)
                              ? styles.highlightedMinuteText
                              : null
                          }
                        >
                          {minuteData.minute}
                          {minuteData.additionalInfo
                            ? minuteData.additionalInfo
                            : ''}
                        </Text>
                      </View>
                    )
                  })}
                </View>
              )
            })}
          </ScrollView>
        </ScrollView>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        display="default"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
  },
  elevation: {
    elevation: 1,
  },
  headerGrey: {
    backgroundColor: colors.lightLightGray,
  },
  headerEven: {
    backgroundColor: colors.secondary,
  },
  hourEven: {
    color: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  timetableDayType: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 11,
    paddingBottom: 10,
  },
  startStation: {
    marginLeft: 10,
  },
  marginHorizontal: {
    marginHorizontal: 10,
  },
  textBold: {
    fontWeight: 'bold',
  },
  schedulingText: {
    color: colors.primary,
  },
  flexColumn: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginBottom: 100,
    minWidth: '100%',
  },
  timetableRow: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    flex: 1,
  },
  hourText: {
    width: 20,
    marginRight: 10,
  },
  minuteContainer: {
    padding: 4,
    borderRadius: 5,
  },
  highlightedMinuteContainer: {
    backgroundColor: colors.primary,
  },
  highlightedMinuteText: {
    color: 'white',
  },
})
