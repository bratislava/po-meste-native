import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'

import { MapParamList } from '../types'

export default function LineTimeline({
  route,
}: StackScreenProps<MapParamList, 'LineTimeline'>) {
  return (
    <View style={styles.container}>
      <Text>LineTimeline</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
