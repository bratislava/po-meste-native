import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Moment from 'react-moment'

import { colors } from '@utils/theme'
import { LegProps } from '@utils/validation'

import { LegModes, MicromobilityProvider } from '../../../types'
import Leg from './Leg'
import { s } from '@utils/globalStyles'
import { getColor, getIcon, getProviderName, getTextColor } from '@utils/utils'

type Props = {
  provider?: MicromobilityProvider
  duration: number
  departureDate: Date
  ariveDate: Date
  legs?: LegProps[]
  onPress: () => void
}

const TripMiniature = ({
  provider,
  duration,
  departureDate,
  ariveDate,
  legs,
  onPress,
}: Props) => {
  const [displayedStartStationName, setStartStationName] = useState('')

  // TODO is this necessary?
  useEffect(() => {
    if (legs) {
      setStartStationName(
        legs.find((leg) => (leg.mode === LegModes.bus || leg.mode === LegModes.tram))?.from.name || ''
      )
    }
  }, [legs])

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
            {displayedStartStationName.length > 0 && (
              <View style={styles.atTimeContainer}>
                {/* TODO use https://js-joda.github.io/js-joda/ for time manipulation */}
                <Moment
                  element={Text}
                  style={styles.atTime}
                  interval={5000}
                  date={departureDate}
                  trim
                  fromNow
                />
                {/* TODO localize this using i18n */}
                <Text numberOfLines={1}>z {displayedStartStationName}</Text>
              </View>
            )}
          </View>
          <View style={styles.rightContainer}>
            <View style={styles.durationContainer}>
              <Text style={styles.durationNumber}>{duration}</Text>
              <Text style={styles.durationMin}>min</Text>
            </View>
            <View style={styles.fromToTime}>
              <Moment element={Text} format="HH:mm">
                {departureDate}
              </Moment>
              <Text> - </Text>
              <Moment element={Text} format="HH:mm">
                {ariveDate}
              </Moment>
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
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
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
})

export default TripMiniature
