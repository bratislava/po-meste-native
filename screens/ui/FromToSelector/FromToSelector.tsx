import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

import { colors } from '@utils/theme'
import { s } from '@utils/globalStyles'

import SwitchSvg from '@images/switch.svg'
import CircleSvg from '@images/circle.svg'
import TriangleSvg from '@images/triangle.svg'

type Props = {
  fromPlaceText?: string
  toPlaceText?: string
  fromPlaceTextPlaceholder?: string
  toPlaceTextPlaceholder?: string
  onFromPlacePress?: () => void
  onToPlacePress?: () => void
  onSwitchPlacesPress?: () => void
}

const FromToSelector = ({
  fromPlaceText,
  toPlaceText,
  fromPlaceTextPlaceholder,
  toPlaceTextPlaceholder,
  onFromPlacePress,
  onToPlacePress,
}: Props) => {
  const [fromPlace, setFromPlace] = useState('')
  const [isFromPlacePlaceholder, setFromPlacePlaceholder] = useState(false)
  const [toPlace, setToPlace] = useState('')
  const [isToPlacePlaceholder, setToPlacePlaceholder] = useState(false)

  useEffect(() => {
    setFromPlace(fromPlaceText ?? fromPlaceTextPlaceholder ?? '')
    setFromPlacePlaceholder(!fromPlaceText?.length)
  }, [fromPlaceText, fromPlaceTextPlaceholder])

  useEffect(() => {
    setToPlace(toPlaceText ?? toPlaceTextPlaceholder ?? '')
    setToPlacePlaceholder(!toPlaceText?.length)
  }, [toPlaceText, toPlaceTextPlaceholder])

  return (
    <View style={styles.container}>
      <View style={styles.arrowContainer}>
        <CircleSvg fill={colors.primary} />
        <View style={styles.dashedLine}></View>
        <TriangleSvg fill={colors.primary} />
      </View>
      <View style={styles.inputsContainer}>
        <TouchableOpacity onPress={onFromPlacePress} style={styles.input}>
          <Text
            style={isFromPlacePlaceholder ? styles.inputTextPlaceholder : {}}
          >
            {fromPlace}
          </Text>
        </TouchableOpacity>
        <View style={styles.line}></View>
        <TouchableOpacity onPress={onToPlacePress} style={styles.input}>
          <Text style={isToPlacePlaceholder ? styles.inputTextPlaceholder : {}}>
            {toPlace}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.switchPlacesContainer}>
        <TouchableOpacity style={styles.switchPlaces}>
          <SwitchSvg fill={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const c = {
  border: colors.lightGray,
  placeholder: colors.gray,
  path: colors.gray,
}

const styles = StyleSheet.create({
  container: {
    borderColor: c.border,
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  dashedLine: {
    flex: 1,
    borderColor: c.path,
    borderWidth: 1,
    width: 0,
    borderRadius: 1,
    borderStyle: 'dashed',
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
    backgroundColor: c.border,
  },
  inputTextPlaceholder: {
    color: c.placeholder,
  },
})

export default FromToSelector
