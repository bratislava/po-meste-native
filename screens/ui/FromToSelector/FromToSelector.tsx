import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

import { colors } from '@utils/theme'
import { s } from '@utils/globalStyles'

import SwitchSvg from '@images/switch.svg'
import CircleSvg from '@images/circle.svg'
import TriangleSvg from '@images/triangle.svg'
import DashedLine from '../DashedLine/DashedLine'

type Props = {
  fromPlaceText?: string
  toPlaceText?: string
  fromPlaceTextPlaceholder?: string
  toPlaceTextPlaceholder?: string
  onFromPlacePress: () => void
  onToPlacePress: () => void
  onSwitchPlacesPress: () => void
}

const FromToSelector = ({
  fromPlaceText,
  toPlaceText,
  fromPlaceTextPlaceholder,
  toPlaceTextPlaceholder,
  onFromPlacePress,
  onToPlacePress,
  onSwitchPlacesPress,
}: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.arrowContainer}>
        <CircleSvg width={20} height={20} fill={colors.primary} />
        <DashedLine spacing={4} dashLength={2} color={colors.gray} />
        <TriangleSvg width={20} height={20} fill={colors.primary} />
      </View>
      <View style={styles.inputsContainer}>
        <TouchableOpacity onPress={onFromPlacePress} style={styles.input}>
          <Text
            style={
              fromPlaceText ? styles.inputText : styles.inputTextPlaceholder
            }
          >
            {fromPlaceText || fromPlaceTextPlaceholder}
          </Text>
        </TouchableOpacity>
        <View style={styles.line}></View>
        <TouchableOpacity onPress={onToPlacePress} style={styles.input}>
          <Text
            style={toPlaceText ? styles.inputText : styles.inputTextPlaceholder}
          >
            {toPlaceText || toPlaceTextPlaceholder}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.switchPlacesContainer}>
        <TouchableOpacity
          style={styles.switchPlaces}
          onPress={onSwitchPlacesPress}
        >
          <SwitchSvg fill={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderColor: colors.lightGray,
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  arrowContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  inputsContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  switchPlacesContainer: {
    alignItems: 'center',
  },
  switchPlaces: {
    ...s.shadow,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 16,
    paddingLeft: 5,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: colors.lightGray,
  },
  inputTextPlaceholder: {
    color: colors.gray,
  },
  inputText: {
    color: 'black',
  },
})

export default FromToSelector
