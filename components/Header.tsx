import React, { ReactNode } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import ChevronLeftSmall from '@images/chevron-left-small.svg'
import { colors } from '@utils/theme'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/core'

export interface HeaderProps {
  text?: string
  useBack?: boolean
  onBack?: () => void
  leftSlot?: ReactNode
  rightSlot?: ReactNode
}

export const Header = ({
  useBack = true,
  text,
  onBack,
  leftSlot,
  rightSlot,
}: HeaderProps) => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
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
        <Text style={styles.centerText}>{text}</Text>
      </View>
      <View style={styles.rightContainer}>{rightSlot}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
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
