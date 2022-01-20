import React, { FC } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import ChevronRightSmall from '@icons/chevron-right-small.svg'
import { colors } from '@utils/theme'
import { SvgProps } from 'react-native-svg'

export interface ItemListButtonProps {
  icon: FC<SvgProps>
  text: string
  onPress: () => void
}

export const ItemListButton = ({
  icon: Icon,
  text,
  onPress,
}: ItemListButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <Icon width={32} height={32} fill={colors.primary} />
          <Text style={styles.text}>{text}</Text>
        </View>
        <View style={styles.rightContainer}>
          <ChevronRightSmall width={16} height={16} fill={colors.gray} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 20,
    fontWeight: 'bold',
  },
  rightContainer: {},
})

export default ItemListButton
