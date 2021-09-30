import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { MhdStopProps } from '../../../utils/validation'

interface TimetablesProps {
  station: MhdStopProps
}

const Timetables = ({ station }: TimetablesProps) => {
  return (
    <View style={styles.container}>
      <Text>Timetables placeholder</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default Timetables
