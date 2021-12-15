import { mhdDefaultColors } from '@utils/theme'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface LineNumberProps {
  number?: string | number
  color?: string
}

export const LineNumber = ({
  number = '?',
  color = mhdDefaultColors.grey,
}: LineNumberProps) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color.length === 6 ? `#${color}` : color,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          (typeof number === 'string' && number.length > 2) ||
          (typeof number === 'number' && number > 99)
            ? styles.smallText
            : null,
        ]}
      >
        {number}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 12,
  },
})
