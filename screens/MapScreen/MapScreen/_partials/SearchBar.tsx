import Text from '@components/Text'
import SearchSvg from '@icons/search.svg'
import { useNavigation } from '@react-navigation/native'
import { s } from '@utils/globalStyles'
import { colors } from '@utils/theme'
import i18n from 'i18n-js'
import React, { useState } from 'react'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const SearchBar = () => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const [isPressed, setIsPressed] = useState(false)

  return (
    <View
      style={[
        styles.outerContainer,
        {
          marginTop: Math.max(insets.top, 30),
        },
      ]}
    >
      <TouchableWithoutFeedback
        style={styles.searchBar}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        onPress={() => navigation.navigate('FromToScreen')}
      >
        <View
          style={[
            styles.container,
            isPressed && { backgroundColor: colors.lightLightGray },
          ]}
        >
          <SearchSvg
            width={20}
            height={20}
            fill={colors.primary}
            style={styles.searchIcon}
          />
          <Text style={styles.searchInput}>
            {i18n.t('screens.MapScreen.whereTo')}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    ...s.shadow,
    elevation: 7,
    width: '90%',
    borderRadius: 30,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 30,
    height: 50,
  },
  searchBar: {},
  searchInput: {
    marginLeft: 16,
    width: '100%',
    color: colors.mediumGray,
    letterSpacing: 0.5,
  },
  searchIcon: {
    marginLeft: 16,
  },
})

export default SearchBar
