import React, { useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useQuery } from 'react-query'

import { MhdStopProps } from '@utils/validation'
import { getMhdStopStatusData } from '@utils/api'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { GlobalStateContext } from '@components/common/GlobalStateProvider'
import { useNavigation } from '@react-navigation/core'
import { s } from '@utils/globalStyles'
import { getVehicle } from '@utils/utils'
import { TransitVehicleType } from '../../../types'
import { colors, mhdDefaultColors } from '@utils/theme'
import TicketSvg from '@images/ticket.svg'

interface TimetablesProps {
  station: MhdStopProps
}

const Timetables = ({ station }: TimetablesProps) => {
  const navigation = useNavigation()
  const globalStateContext = useContext(GlobalStateContext)
  const { data, isLoading, error } = useQuery(
    ['getMhdStopStatusData', station.id],
    () => getMhdStopStatusData(station.id)
  )

  const getVehicleIconStyled = (
    vehicleType?: TransitVehicleType,
    color: string = mhdDefaultColors.grey
  ) => {
    const Icon = getVehicle(vehicleType)
    return <Icon width={30} height={30} fill={color} />
  }

  return (
    <>
      <View style={styles.firstRow}>
        <View style={s.icon}>
          <TicketSvg fill="red" />
        </View>
        <Text>{`${station.name} ${
          station.platform ? station.platform : ''
        }`}</Text>
      </View>
      <View style={styles.secondRow}>
        {data?.allLines?.map((departure, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={styles.lineDeparture}
              onPress={() => {
                globalStateContext.setTimeLineNumber(departure.lineNumber)
                navigation.navigate('Timetable', {
                  lineNumber: departure.lineNumber,
                  stopId: station.id,
                })
              }}
            >
              <View style={styles.departureLeft}>
                <View key={index} style={s.icon}>
                  {getVehicleIconStyled(
                    departure.vehicleType, // TODO waits for https://inovaciebratislava.atlassian.net/browse/PLAN-274
                    departure?.lineColor
                      ? `#${departure?.lineColor}`
                      : undefined
                  )}
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
                  {/* // TODO waits for https://inovaciebratislava.atlassian.net/browse/PLAN-274 */}
                  {departure.finalStopName}
                </Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  firstRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    backgroundColor: colors.lightLightGray,
    paddingVertical: 10,
  },
  secondRow: {
    paddingTop: 10,
  },
  lineDeparture: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  departureLeft: {
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  finalStation: {
    marginLeft: 10,
  },
})

export default Timetables
