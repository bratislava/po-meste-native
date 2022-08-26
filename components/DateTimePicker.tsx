import ScrollPickerNative, {
  ScrollHandle,
  ScrollPickerProps as ScrollPickerNativeProps,
} from '@components/ScrollViewPicker'
import { convert, DateTimeFormatter, LocalDateTime } from '@js-joda/core'
import { ScheduleType } from '@types'
import { s } from '@utils/globalStyles'
import { colors } from '@utils/theme'
import { range } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Button from './Button'

const formatter = DateTimeFormatter.ofPattern('d.M')
const minutes = range(0, 60, 1).map((value) => (value < 10 ? '0' : '') + value)
const hours = range(0, 24, 1).map((value) => (value < 10 ? '0' : '') + value)
const days = range(0, 15, 1).map((value) => {
  const date = LocalDateTime.now()
  if (value < 7) return date.minusDays(7 - value).format(formatter)
  if (value > 7) return date.plusDays(value - 7).format(formatter)
  return 'dnes'
})

const ScrollPicker = React.forwardRef<ScrollHandle, ScrollPickerNativeProps>(
  (scrollPickerProps: ScrollPickerNativeProps, ref) => {
    return (
      <ScrollPickerNative
        ref={ref}
        style={{ width: 100 }}
        dataSource={scrollPickerProps.dataSource}
        selectedIndex={scrollPickerProps.selectedIndex ?? 1}
        renderItem={(data, index) => (
          <View key={index}>
            <Text style={[{ color: colors.black }, s.textLarge]}>{data}</Text>
          </View>
        )}
        onValueChange={scrollPickerProps.onValueChange}
        wrapperHeight={180}
        wrapperStyle={{ width: 100, height: 180 }}
        itemHeight={60}
        scrollViewComponent={ScrollView}
        highlightStyle={{
          backgroundColor: colors.lightLightGray,
          width: 100,
          ...scrollPickerProps.highlightStyle,
        }}
      />
    )
  }
)

interface DateTimePickerProps {
  onConfirm: (date: Date) => void
  onScheduleTypeChange: (scheduleType: ScheduleType) => void
}

const DateTimePicker = ({
  onConfirm,
  onScheduleTypeChange,
}: DateTimePickerProps) => {
  const [now, setNow] = useState(LocalDateTime.now())
  const [refreshingInterval, setRefreshingInterval] = useState<NodeJS.Timer>()
  const [selectedHour, setSelectedHour] = useState<number>(now.hour())
  const [selectedMinute, setSelectedMinute] = useState<number>(now.minute())
  const [selectedDateIndex, setSelectedDateIndex] = useState<number>(7)
  const [scheduleType, setScheduleType] = useState<ScheduleType | 'now'>('now')
  const datePickerRef = useRef<ScrollHandle>(null)
  const hourPickerRef = useRef<ScrollHandle>(null)
  const minutePickerRef = useRef<ScrollHandle>(null)

  useEffect(() => {
    setRefreshingInterval(
      setInterval(() => setNow(LocalDateTime.now()), 15 * 1000)
    )
    return () => {
      if (refreshingInterval) clearInterval(refreshingInterval)
    }
  }, [])

  useEffect(() => {
    if (scheduleType !== 'now') onScheduleTypeChange(scheduleType)
  }, [scheduleType, onScheduleTypeChange])

  const handleConfirm = () => {
    let adjustedDate = now
    if (selectedDateIndex < 7)
      adjustedDate = now.minusDays(7 - selectedDateIndex)
    if (selectedDateIndex > 7)
      adjustedDate = now.plusDays(selectedDateIndex - 7)
    const selectedDatetime = new Date(
      adjustedDate.year(),
      adjustedDate.monthValue() - 1,
      adjustedDate.dayOfMonth(),
      selectedHour,
      selectedMinute
    )
    onConfirm(selectedDatetime)
  }

  const resetToNow = () => {
    setSelectedHour(now.hour())
    hourPickerRef.current?.scrollTo(now.hour())
    setSelectedMinute(now.minute())
    minutePickerRef.current?.scrollTo(now.minute())
    setSelectedDateIndex(7)
    datePickerRef.current?.scrollTo(7)
  }

  const handleNow = () => {
    setScheduleType('now')
    resetToNow()
    onScheduleTypeChange(ScheduleType.departure)
    onConfirm(convert(now).toDate())
  }

  return (
    <View style={styles.contentWrapper}>
      <View style={styles.schedulePickerWrapper}>
        <TouchableOpacity onPress={() => handleNow()}>
          <Text
            style={
              scheduleType === 'now'
                ? styles.schedulePickerSelectedButton
                : styles.schedulePickerButton
            }
          >
            Teraz
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            scheduleType !== ScheduleType.departure &&
            setScheduleType(ScheduleType.departure)
          }
        >
          <Text
            style={
              scheduleType === ScheduleType.departure
                ? styles.schedulePickerSelectedButton
                : styles.schedulePickerButton
            }
          >
            Odchod o
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            scheduleType !== ScheduleType.arrival &&
            setScheduleType(ScheduleType.arrival)
          }
        >
          <Text
            style={
              scheduleType === ScheduleType.arrival
                ? styles.schedulePickerSelectedButton
                : styles.schedulePickerButton
            }
          >
            Príchod o
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.datetimePickersWrapper}>
        <ScrollPicker
          ref={datePickerRef}
          dataSource={days}
          selectedIndex={7}
          highlightStyle={{
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
          }}
          onValueChange={(value, index) => setSelectedDateIndex(index)}
        />
        <ScrollPicker
          ref={hourPickerRef}
          dataSource={hours}
          selectedIndex={selectedHour}
          onValueChange={(value) => setSelectedHour(+value)}
        />
        <ScrollPicker
          ref={minutePickerRef}
          dataSource={minutes}
          selectedIndex={selectedMinute}
          highlightStyle={{
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
          }}
          onValueChange={(value) => setSelectedMinute(+value)}
        />
      </View>
      <Button
        title="Nastaviť"
        onPress={handleConfirm}
        style={{ marginTop: 28 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  contentWrapper: {
    flexDirection: 'column',
    padding: 20,
  },
  schedulePickerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 24,
  },
  schedulePickerSelectedButton: {
    ...s.textSmall,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: colors.black,
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
    lineHeight: 25,
  },
  schedulePickerButton: {
    ...s.textSmall,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: colors.mediumGray,
    lineHeight: 25,
  },
  datetimePickersWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
})

export default DateTimePicker
