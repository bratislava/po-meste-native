import HeartSvg from '@icons/favorite.svg'
import HomeSvg from '@icons/home.svg'
import MoreSvg from '@icons/more.svg'
import StopSignSvg from '@icons/stop-sign.svg'
import WorkSvg from '@icons/work.svg'
import { FavoritePlace, FavoriteStop } from '@types'
import { s } from '@utils/globalStyles'
import { colors } from '@utils/theme'
import { isFavoritePlace } from '@utils/utils'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface FavoriteTileProps {
  favoriteItem: FavoritePlace | FavoriteStop
  onPress: () => void
  onMorePress: () => void
}

const FavoriteTile = ({
  favoriteItem,
  onPress,
  onMorePress,
}: FavoriteTileProps) => {
  const isPlace = isFavoritePlace(favoriteItem)
  const {
    id = '',
    name = undefined,
    isHardSetName = false,
    icon = undefined,
  } = isPlace ? favoriteItem : {}
  const Icon = isPlace
    ? icon
      ? icon === 'home'
        ? HomeSvg
        : icon === 'work'
        ? WorkSvg
        : HeartSvg
      : HeartSvg
    : StopSignSvg
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.horizontalScrollItem}>
        <Icon width={20} height={20} fill={colors.tertiary} />
        <View style={styles.placeTexts}>
          <Text style={styles.placeName}>{name}</Text>
          <Text style={styles.placeAddressMinor}>
            {favoriteItem.placeData?.structured_formatting.main_text ?? '??'}
          </Text>
        </View>
        <TouchableOpacity onPress={onMorePress}>
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
