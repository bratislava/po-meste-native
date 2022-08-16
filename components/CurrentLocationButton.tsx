import CurrentLocationSvg from '@icons/current-location.svg'
import { s } from '@utils/globalStyles'
import { colors } from '@utils/theme'
import React from 'react'
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

interface CurrentLocationButtonProps {
  onPress: () => void
  style: StyleProp<ViewStyle>
}

const CurrentLocationButton = ({
  onPress,
  style,
}: CurrentLocationButtonProps) => {
  return (
    <View style={[styles.currentLocation, style]}>
      <TouchableOpacity onPress={onPress}>
        <CurrentLocationSvg fill={colors.primary} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  currentLocation: {
    position: 'absolute',
    right: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    ...s.shadow,
    elevation: 7,
  },
})

export default CurrentLocationButton
