import React from 'react'

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

type Props = {
  duration: number
  startTime: number
  endTime: number
}

const TripMiniature = ({ duration }: Props) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View>
        <Text>Trip Miniature</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {},
})

export default TripMiniature
