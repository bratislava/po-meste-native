import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import i18n from 'i18n-js'

const SearchBar = () => {
  const navigation = useNavigation()

  const insets = useSafeAreaInsets()
  return (
    <TouchableOpacity
      style={{
        ...styles.searchBar,
        marginTop: Math.max(insets.top, 30),
      }}
      onPress={() => navigation.navigate('FromToScreen')}
    >
      <Text style={styles.searchInput}>{i18n.t('whereTo')}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  searchBar: {
    display: 'flex',
    flex: 1,
    position: 'absolute',
    top: 0,
    width: '90%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 15,
  },
  searchInput: {
    marginLeft: 20,
    width: '80%',
  },
  // searchButton: {
  //   marginRight: 20,
  // },
})

export default SearchBar
