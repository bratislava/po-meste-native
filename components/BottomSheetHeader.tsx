import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors } from '@utils/theme'
import { s } from '@utils/globalStyles'
import { STYLES } from '@utils/constants'

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
    paddingTop: 10,
    borderTopLeftRadius: STYLES.borderRadius,
    borderTopRightRadius: STYLES.borderRadius,
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
