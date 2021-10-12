import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Moment from 'react-moment'

import { colors } from '@utils/theme'

import ChevronRightSvg from '@images/chevron-right-small.svg'
import WalkingSvg from '@images/walking.svg'
import CyclingSvg from '@images/cycling.svg'

import { LegProps } from '@utils/validation'
import { Modes } from '../../../types'

type LegComponentProps = {
  number?: number | string
  color?: string
  isLast?: boolean
  duration?: number
  mode?: Modes
}

const LegComponent = ({
  mode = Modes.bus,
  number,
  color,
  isLast = false,
  duration = 0,
}: LegComponentProps) => {
  const isIndividualTransport = mode == Modes.walk || mode == Modes.bicycle

  return (
    <View style={styles.leg}>
      {(isIndividualTransport && (
        <View style={styles.legWalkingContainer}>
          {(mode == Modes.walk && (
            <WalkingSvg width={20} height={20} fill="black" />
          )) ||
            (mode == Modes.bicycle && (
              <CyclingSvg width={30} height={20} fill="black" />
            ))}
          <View style={styles.legDurationContainer}>
            <Text style={styles.legDurationNumber}>
              {Math.round(duration / 60)}
            </Text>
            <Text>min</Text>
          </View>
        </View>
      )) || (
        <View
          style={[
            styles.legBox,
            { backgroundColor: color ? `#${color}` : 'black' },
          ]}
        >
          <Text style={styles.legNumber}>{number ?? '?'}</Text>
        </View>
      )}

      {!isLast && (
        <View style={styles.legArrowContainer}>
          <ChevronRightSvg width={12} height={12} fill={colors.gray} />
        </View>
      )}
    </View>
  )
}

type Props = {
  duration: number
  departureTime: number
  ariveTime: number
  legs?: LegProps[]
  onPress: () => void
}

const TripMiniature = ({
  duration,
  departureTime,
  ariveTime,
  legs,
  onPress,
}: Props) => {
  const [displayedDuration, setDisplayedDuration] = useState(0)
  const [displayedDeparture, setDisplayedDeparture] = useState<Date>(new Date())
  const [displayedArive, setDisplayedArive] = useState<Date>(new Date())
  const [displayedStartStationName, setStartStationName] = useState('')

  useEffect(() => {
    setDisplayedDuration(Math.round(duration / 60))
  }, [duration])

  useEffect(() => {
    setDisplayedDeparture(new Date(departureTime))
  }, [departureTime])

  useEffect(() => {
    setDisplayedArive(new Date(ariveTime))
  }, [ariveTime])

  useEffect(() => {
    if (legs) {
      setStartStationName(
        legs.find((leg) => leg.mode == Modes.bus)?.headsign || ''
      )
    }
  }, [legs])

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.containerInner}>
        <View style={styles.leftContainer}>
          {legs && (
            <View style={styles.legsContainer}>
              {legs.map((leg, index) => {
                if (leg.mode == Modes.bus) {
                  console.log(leg)
                }
                return (
                  <LegComponent
                    key={index}
                    isLast={++index == legs.length}
                    mode={leg.mode as Modes}
                    duration={leg.duration}
                    color={leg.routeColor}
                    number={leg.routeShortName}
                  />
                )
              })}
            </View>
          )}
          {displayedStartStationName.length > 0 && (
            <View style={styles.atTimeContainer}>
              <Moment
                element={Text}
                style={styles.atTime}
                interval={5000}
                date={departureTime}
                trim
                fromNow
              />
              <Text numberOfLines={1}>z {displayedStartStationName}</Text>
            </View>
          )}
        </View>
        <View style={styles.rightContainer}>
          <View style={styles.durationContainer}>
            <Text style={styles.durationNumber}>{displayedDuration}</Text>
            <Text style={styles.durationMin}>min</Text>
          </View>
          <View style={styles.fromToTime}>
            <Moment element={Text} format="HH:mm">
              {displayedDeparture}
            </Moment>
            <Text> - </Text>
            <Moment element={Text} format="HH:mm">
              {displayedArive}
            </Moment>
          </View>
          <View style={styles.rightContainerBackground}></View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowRadius: 16,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    marginBottom: 10,
  },
  containerInner: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
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
  leg: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  legBox: {
    width: 28,
    height: 28,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legArrowContainer: {
    alignItems: 'center',
    padding: 4,
  },
  legNumber: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  legDurationContainer: {},
  legWalkingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legDurationNumber: {
    fontWeight: 'bold',
    marginBottom: -4,
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
})

export default TripMiniature
