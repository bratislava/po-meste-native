import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors } from '@utils/theme'
import { s } from '@utils/globalStyles'

const HEIGHT = 8
const PADDING_TOP = 10
const MARGIN_BOTTOM = 10

export const HANDLE_HEIGHT = PADDING_TOP + PADDING_TOP + MARGIN_BOTTOM
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
    paddingTop: PADDING_TOP,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 100,
    height: HEIGHT,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
    marginBottom: MARGIN_BOTTOM,
  },
})
