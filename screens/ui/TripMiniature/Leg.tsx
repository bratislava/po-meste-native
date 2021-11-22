import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SvgProps } from 'react-native-svg'

import { colors } from '@utils/theme'

import { LegModes } from '../../../types'

import ChevronRightSvg from '@images/chevron-right-small.svg'
import WalkingSvg from '@images/walking.svg'

type LegProps = {
  shortName?: string
  color?: string
  isLast?: boolean
  duration?: number
  mode?: LegModes
  TransportIcon: React.FC<SvgProps>
}

const Leg = ({
  mode = LegModes.bus,
  shortName,
  color,
  isLast = false,
  duration = 0,
  TransportIcon,
}: LegProps) => {
  const isIndividualTransport =
    mode == LegModes.walk || mode == LegModes.bicycle

  return (
    <View style={styles.leg}>
      {(isIndividualTransport && (
        <View style={styles.legWalkingContainer}>
          {(mode === LegModes.walk && (
            <WalkingSvg width={20} height={20} fill="black" />
          )) ||
            (mode === LegModes.bicycle && (
              <TransportIcon width={30} height={20} fill="black" />
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
          <Text style={styles.legNumber}>{shortName ?? '?'}</Text>
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

const styles = StyleSheet.create({
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
})

export default Leg
