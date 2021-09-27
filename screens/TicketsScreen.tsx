import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

export default function TicketsScreen() {
  return (
    <View style={styles.container}>
      <Text>Tickets</Text>
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
