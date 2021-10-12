import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import { colors } from '@utils/theme'

import ArrowRightSvg from '@images/arrow-right.svg'

type StepProps = { number: number; color: string; isLast?: boolean }

const Step = ({ number, color, isLast = false }: StepProps) => {
  return (
    <View style={styles.step}>
      <View style={[styles.stepBox, { backgroundColor: color }]}>
        <Text style={styles.stepNumber}>{number}</Text>
      </View>
      {!isLast && (
        <View style={styles.stepArrowContainer}>
          <ArrowRightSvg fill={colors.gray} />
        </View>
      )}
    </View>
  )
}

type Props = {
  duration: number
  startTime: number
  endTime: number
}

const TripMiniature = ({ duration }: Props) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.containerInner}>
        <View style={styles.leftContainer}>
          <View style={styles.stepsContainer}>
            <Step color="#A79ECD" number={33} />
            <Step color="#7690C9" number={4} />
            <Step color="#A79ECD" number={33} />
            <Step color="#7690C9" number={4} />
            <Step isLast color="#5DB56E" number={39} />
          </View>
          <View style={styles.atTimeContainer}>
            <Text style={styles.atTime}>o 13 min</Text>
            <Text> z </Text>
            <Text>Dlhé diely</Text>
          </View>
        </View>
        <View style={styles.rightContainer}>
          <View style={styles.durationContainer}>
            <Text style={styles.durationNumber}>25</Text>
            <Text style={styles.durationMin}>min</Text>
          </View>
          <View style={styles.fromToTime}>
            <Text>14:52</Text>
            <Text> - </Text>
            <Text>15:40</Text>
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
    padding: 10,
  },
  rightContainer: {
    position: 'relative',
    width: 110,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingRight: 10,
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
    transform: [{ rotate: '20deg' }, { scale: 1.5 }],
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  step: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  stepBox: {
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepArrowContainer: {
    alignItems: 'center',
    padding: 4,
  },
  stepNumber: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
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
  },
  atTimeContainer: {
    flexDirection: 'row',
  },
  atTime: {
    fontWeight: 'bold',
  },
})

export default TripMiniature
