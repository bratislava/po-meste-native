import React, { useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import i18n from 'i18n-js'

import { TimetableType } from '../types'
import TicketSvg from '../assets/images/ticket.svg'
import ArrowRight from '../assets/images/arrow-right.svg'
import { s } from '../utils/globalStyles'
import { dummyDataTimetable } from '../dummyData'
import { Button } from '../components'
import ButtonGroup from '../components/ButtonGroup'

export default function Timetable() {
  const [activeTimetable, setActiveTimetable] = useState<TimetableType>(
    TimetableType.workDays
  )
  const activeIndex = useMemo(() => {
    const now = new Date().getTime()
    const times = dummyDataTimetable.timetable.reduce(
      (accumulatorHours, hourObject, indexHours) => {
        const timesInHours = hourObject.minutes.reduce(
          (accumulatorMinutes, departureMinute, indexMinutes) => {
            const date = new Date()
            date.setHours(hourObject.hour)
            date.setMinutes(departureMinute.minute)
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
        // console.log(timesInHours)
        if (accumulatorHours[0] > timesInHours[0] && timesInHours[0] > 0) {
          return [timesInHours[0], timesInHours[1], timesInHours[2]]
        }
        return accumulatorHours
      },
      [Infinity, Infinity, Infinity]
    )
    return times
  }, [dummyDataTimetable])

  // console.log(activeIndex)

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
                {dummyDataTimetable.lineNumber}
              </Text>
              <Text style={[styles.startStation, styles.textBold, s.blackText]}>
                {dummyDataTimetable.startStationStopName}
              </Text>
              <View style={[s.icon, styles.marginHorizontal]}>
                <ArrowRight width={10} fill="red" />
              </View>
              <Text style={s.blackText}>
                {dummyDataTimetable.finalStationStopName}
              </Text>
            </View>
          </View>
        </View>
        <View style={[s.horizontalMargin, styles.timetableDayType]}>
          <ButtonGroup style={styles.row}>
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
          </ButtonGroup>
        </View>
        <ScrollView
          // ref={scrollViewRef}
          contentContainerStyle={s.horizontalMargin}
        >
          <View style={styles.row}>
            <View style={styles.flexColumn}>
              {[
                4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23,
              ].map((hour, indexHours) => {
                const dataToShow = dummyDataTimetable.timetable.find(
                  (hourDataRow) => hourDataRow.hour === hour
                )
                return (
                  <View
                    key={hour}
                    style={[
                      styles.timetableRow,
                      indexHours % 2 === 0 ? styles.headerGrey : null,
                    ]}
                  >
                    <Text style={[styles.textBold, styles.hourText]}>
                      {hour}
                    </Text>
                    {dataToShow?.minutes.map((minuteData, indexMinutes) => {
                      return (
                        <Text
                          key={indexMinutes}
                          style={[
                            styles.minuteText,
                            activeIndex[1] === indexHours &&
                            activeIndex[2] === indexMinutes
                              ? s.bgRed
                              : null,
                          ]}
                        >
                          {`${minuteData.minute < 10 ? 0 : ''}${
                            minuteData.minute
                          }${
                            minuteData.additionalInfo
                              ? minuteData.additionalInfo
                              : ''
                          }`}
                        </Text>
                      )
                    })}
                  </View>
                )
              })}
            </View>
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
  textAlign: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexColumn: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  timetableRow: {
    width: '100%',
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hourText: {
    width: 20,
    marginRight: 20,
  },
  minuteText: {
    marginRight: 9,
  },
})
