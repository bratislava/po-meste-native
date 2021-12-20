import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import i18n from 'i18n-js'
import {
  DateTimeFormatter,
  Duration,
  Instant,
  LocalDateTime,
} from '@js-joda/core'

import { colors } from '@utils/theme'
import { LegProps } from '@utils/validation'

import { LegModes, MicromobilityProvider } from '../../../types'
import Leg from './Leg'
import { s } from '@utils/globalStyles'
import { getColor, getIcon, getProviderName, getTextColor } from '@utils/utils'
import LoadingView from '../LoadingView/LoadingView'

type Props = {
  provider?: MicromobilityProvider
  duration?: number
  departureDateTime?: LocalDateTime
  arriveDateTime?: LocalDateTime
  legs?: LegProps[]
  onPress?: () => void
  isLoading?: boolean
}

const TripMiniature = ({
  provider,
  duration,
  departureDateTime,
  arriveDateTime,
  legs,
  onPress,
  isLoading,
}: Props) => {
  const [startStationName, setStartStationName] = useState('')
  const [diffMinutes, setDiffMinutes] = useState(
    departureDateTime !== undefined
      ? Duration.between(LocalDateTime.now(), departureDateTime).toMinutes()
      : undefined
  )
  const [firstStopDateTime, setFirstStopDateTime] = useState<
    LocalDateTime | undefined
  >(undefined)

  // TODO is this necessary?
  useEffect(() => {
    if (legs) {
      const firstStop = legs.find(
        (leg) => leg.mode === LegModes.bus || leg.mode === LegModes.tram
      )
      if (firstStop) {
        firstStop.from.departure &&
          setFirstStopDateTime(
            LocalDateTime.ofInstant(
              Instant.ofEpochMilli(firstStop.from.departure)
            )
          )
        setStartStationName(firstStop.from.name || '')
      }
    }
  }, [legs])

  useEffect(() => {
    if (firstStopDateTime) {
      const timer = setInterval(() => {
        setDiffMinutes(
          Duration.between(LocalDateTime.now(), firstStopDateTime).toMinutes()
        )
      }, 10000)
      return () => {
        clearInterval(timer)
      }
    }
  }, [firstStopDateTime])

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.containerOuter}>
        <View style={styles.row}>
          {provider && (
            <Text
              style={[
                s.boldText,
                styles.providerText,
                {
                  backgroundColor: getColor(provider),
                  color: getTextColor(provider),
                },
              ]}
            >
              {getProviderName(provider)}
            </Text>
          )}
        </View>
        {isLoading && <LoadingView fullscreen stylesOuter={styles.elevation} />}
        <View style={styles.containerInner}>
          <View style={styles.leftContainer}>
            {legs && (
              <View style={styles.legsContainer}>
                {legs.map((leg, index) => (
                  <Leg
                    key={index}
                    isLast={index === legs.length - 1}
                    mode={leg.mode}
                    duration={leg.duration}
                    color={leg.routeColor}
                    shortName={leg.routeShortName}
                    TransportIcon={getIcon(provider)}
                  />
                ))}
              </View>
            )}
            {startStationName.length > 0 && (
              <View style={styles.atTimeContainer}>
                {diffMinutes != undefined && (
                  <Text style={styles.atTime}>
                    {diffMinutes < 0
                      ? i18n.t('beforeIn', { time: Math.abs(diffMinutes) })
                      : i18n.t('startingIn', { time: diffMinutes })}
                  </Text>
                )}
                <Text numberOfLines={1}>
                  {i18n.t('from', {
                    place: startStationName,
                  })}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.rightContainer}>
            {duration !== undefined && (
              <View style={styles.durationContainer}>
                <Text style={styles.durationNumber}>{duration}</Text>
                <Text style={styles.durationMin}>min</Text>
              </View>
            )}
            <View style={styles.fromToTime}>
              <Text>
                {departureDateTime &&
                  departureDateTime.format(
                    DateTimeFormatter.ofPattern('HH:mm')
                  )}{' '}
                -
                {arriveDateTime &&
                  arriveDateTime.format(DateTimeFormatter.ofPattern('HH:mm'))}
              </Text>
            </View>
            <View style={styles.rightContainerBackground}></View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowRadius: 12,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    marginBottom: 10,
  },
  containerOuter: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
    minHeight: 100,
    elevation: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    elevation: 10,
  },
  containerInner: {
    flex: 1,
    flexDirection: 'row',
  },
  providerText: {
    borderBottomRightRadius: 8,
    paddingHorizontal: 10,
  },
  leftContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 10,
  },
  rightContainer: {
    position: 'relative',
    width: 100,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 10,
  },
  rightContainerBackground: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    top: -100,
    bottom: -100,
    left: 30,
    right: -10,
    backgroundColor: colors.lightGray,
    transform: [{ rotate: '15deg' }, { scale: 1.5 }],
  },
  legsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  durationContainer: {
    flexDirection: 'row',
    position: 'relative',
    zIndex: 10,
    alignItems: 'flex-end',
  },
  durationNumber: {
    fontWeight: 'bold',
    color: colors.darkText,
    fontSize: 36,
  },
  durationMin: {
    fontWeight: 'bold',
    color: colors.darkText,
    marginBottom: 5,
  },
  fromToTime: {
    color: colors.darkText,
    flexDirection: 'row',
    position: 'relative',
    zIndex: 10,
    marginBottom: 5,
  },
  atTimeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
    paddingRight: 10,
  },
  atTime: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  elevation: {
    elevation: 1,
  },
})

export default TripMiniature
