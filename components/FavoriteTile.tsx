import MoreSvg from '@icons/more.svg'
import { s } from '@utils/globalStyles'
import { colors } from '@utils/theme'
import React, { ReactElement } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SvgProps } from 'react-native-svg'

interface FavoriteTileProps {
  favoriteItem: any
  onPress: () => void
  icon?: (props: SvgProps) => ReactElement
}

const FavoriteTile = ({ favoriteItem, onPress, icon }: FavoriteTileProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.horizontalScrollItem}>
        {icon && icon({ width: 20, height: 20, fill: colors.tertiary })}
        <View style={styles.placeTexts}>
          <Text style={styles.placeName}>{favoriteItem.text}</Text>
          <Text style={styles.placeAddressMinor}>{favoriteItem.text}</Text>
        </View>
        <TouchableOpacity>
          <MoreSvg
            width={20}
            height={20}
            fill={colors.tertiary}
            style={styles.more}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  horizontalScrollItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    marginRight: 10,
    paddingHorizontal: 13,
    backgroundColor: colors.secondary,
    ...s.roundedBorder,
  },
  placeTexts: {
    color: colors.tertiary,
    marginLeft: 10,
  },
  placeName: {
    color: colors.tertiary,
    fontWeight: 'bold',
    ...s.textTiny,
  },
  placeAddressMinor: {
    color: colors.tertiary,
    ...s.textTiny,
  },
  more: {
    marginLeft: 27,
    padding: 5,
  },
})

export default FavoriteTile
