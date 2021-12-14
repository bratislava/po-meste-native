import React, { ReactNode } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import ChevronLeftSmall from '@images/chevron-left-small.svg'
import { colors } from '@utils/theme'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/core'
import { StackHeaderProps } from '@react-navigation/stack'
import { t } from 'i18n-js'

export interface HeaderProps extends StackHeaderProps {
  useBack?: boolean
  onBack?: () => void
  leftSlot?: ReactNode
  rightSlot?: ReactNode
}

export const Header = ({
  insets,
  useBack = true,
  scene,
  onBack,
  leftSlot,
  rightSlot,
}: HeaderProps) => {
  const navigation = useNavigation()
  const screenOptions = scene.descriptor.options

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, height: insets.top + 64 },
      ]}
    >
      <View style={styles.leftContainer}>
        {useBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              onBack ? onBack() : navigation.goBack()
            }}
          >
            <ChevronLeftSmall width={16} height={16} fill={colors.gray} />
          </TouchableOpacity>
        )}
        {leftSlot}
      </View>
      <View style={styles.centerContainer}>
        <Text style={styles.centerText}>
          {screenOptions.title ?? t(`screens.${scene.route.name}.screenTitle`)}
        </Text>
      </View>
      <View style={styles.rightContainer}>{rightSlot}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    borderBottomColor: colors.primary,
    borderBottomWidth: 5,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 15,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  centerContainer: {
    flex: 5,
  },
  centerText: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 18,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
})

export default Header
