import React, { useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useQuery } from 'react-query'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { MhdStopProps } from '@utils/validation'
import { getMhdStopStatusData } from '@utils/api'
import { GlobalStateContext } from '@components/common/GlobalStateProvider'
import { useNavigation } from '@react-navigation/core'
import { s } from '@utils/globalStyles'
import { getVehicle } from '@utils/utils'
import { TransitVehicleType } from '@types'
import { colors, mhdDefaultColors } from '@utils/theme'
import MhdStopSignSvg from '@icons/stop-sign.svg'
import LoadingView from '../LoadingView/LoadingView'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { LineNumber } from '@components/LineNumber'
import ErrorView from '@components/ErrorView'

interface TimetablesProps {
  station: MhdStopProps
}

const Timetables = ({ station }: TimetablesProps) => {
  const navigation = useNavigation()
  const globalStateContext = useContext(GlobalStateContext)
  const { data, isLoading, error, refetch } = useQuery(
    ['getMhdStopStatusData', station.id],
    () => getMhdStopStatusData(station.id),
    {
      retry: 0,
    }
  )

  const getVehicleIconStyled = (
    vehicleType?: TransitVehicleType,
    color: string = mhdDefaultColors.grey
  ) => {
    const Icon = getVehicle(vehicleType)
    return <Icon width={30} height={30} fill={color} />
  }

  if (!isLoading && error)
    return (
      <ErrorView
        error={error}
        action={refetch}
        styleWrapper={styles.errorWrapper}
      />
    )

  return (
    <>
      <View style={styles.greyBackground}>
        <View style={[styles.firstRow, s.horizontalMargin]}>
          <View style={s.icon}>
            <MhdStopSignSvg fill={colors.primary} />
          </View>
          <Text>{`${station.name} ${
            station.platform ? station.platform : ''
          }`}</Text>
        </View>
      </View>
      <BottomSheetScrollView
        contentContainerStyle={[styles.secondRow, s.horizontalMargin]}
      >
        {isLoading && (
          <LoadingView
            stylesOuter={styles.elevation}
            iconWidth={80}
            iconHeight={80}
          />
        )}
        {data?.allLines?.map((departure, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={styles.lineDeparture}
              onPress={() => {
                globalStateContext.setTimeLineNumber(departure.lineNumber)
                navigation.navigate('LineTimetableScreen', {
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
                <LineNumber
                  number={departure.lineNumber}
                  color={departure.lineColor}
                />
                <Text style={[s.blackText, styles.finalStation]}>
                  {departure.usualFinalStop}
                </Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </BottomSheetScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  errorWrapper: {
    marginVertical: 20,
  },
  greyBackground: {
    backgroundColor: colors.lightLightGray,
    paddingVertical: 10,
  },
  firstRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 10,
  },
  secondRow: {
    paddingTop: 10,
  },
  elevation: {
    elevation: 1,
  },
  lineDeparture: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  departureLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  finalStation: {
    marginLeft: 10,
  },
})

export default Timetables
