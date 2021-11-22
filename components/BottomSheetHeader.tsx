import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors } from '@utils/theme'
import { s } from '@utils/globalStyles'

// TODO solve top empty space
export const renderHeader = () => (
  <SafeAreaView style={styles.header}>
    <View style={styles.panelHeader}>
      <View style={styles.panelHandle} />
    </View>
  </SafeAreaView>
)

const styles = StyleSheet.create({
  header: {
    ...s.shadow,
    backgroundColor: 'white',
    marginBottom: -1,
    paddingTop: 10,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 100,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
    marginBottom: 10,
  },
})
