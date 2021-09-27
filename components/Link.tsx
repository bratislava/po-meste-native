// TODO copied from different project, might need cleanup if we're to use it
import React from 'react'
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableHighlight,
  Text,
} from 'react-native'
import { colors } from '../utils/theme'

const styles = StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
    color: colors.darkText,
  },
})

interface LinkProps {
  onPress: (event: GestureResponderEvent) => void
  title?: string
  style?: StyleProp<TextStyle>
}

const Link = ({ onPress, title, style }: LinkProps) => {
  return (
    <TouchableHighlight onPress={onPress} underlayColor="transparent">
      <Text style={[styles.link, style]}>{title}</Text>
    </TouchableHighlight>
  )
}

export default Link
