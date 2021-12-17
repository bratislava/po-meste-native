import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { StackHeaderProps } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/core'
import { t } from 'i18n-js'
import { colors } from '@utils/theme'
import ChevronLeftSmall from '@icons/chevron-left-small.svg'

export interface HeaderProps extends StackHeaderProps {
  onBack?: () => void
  borderShown?: boolean
}

export const Header = ({
  insets,
  scene,
  onBack,
  borderShown = true,
}: HeaderProps) => {
  const navigation = useNavigation()
  const screenOptions = scene.descriptor.options

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          height: insets.top + 64,
          borderBottomWidth: borderShown ? 5 : 0,
        },
      ]}
    >
      <View style={styles.leftContainer}>
        {screenOptions.headerLeft === undefined ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => (onBack ? onBack() : navigation.goBack())}
          >
            <ChevronLeftSmall width={16} height={16} fill={colors.gray} />
          </TouchableOpacity>
        ) : (
          screenOptions.headerLeft
        )}
      </View>
      <View style={styles.centerContainer}>
        <Text style={styles.centerText}>
          {screenOptions.title ?? t(`screens.${scene.route.name}.screenTitle`)}
        </Text>
      </View>
      <View style={styles.rightContainer}>{screenOptions.headerRight}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    borderBottomColor: colors.primary,
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
