import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

export default function LoadingView() {
  return (
    <View style={[styles.map, styles.overlayLoading]}>
      <Text>LOADING...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayLoading: {
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
})
