import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import TicketSvg from '../../../assets/images/ticket.svg'

interface SearchBarProps {}

const SearchBar = ({}: SearchBarProps) => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity
      style={styles.searchBar}
      onPress={() => navigation.navigate('TabTwo')}
    >
      <Text style={styles.searchInput}>
        {/* TODO change for formattedMessage */}
        {'Where to'}
      </Text>
      <View style={styles.searchButton}>
        {/* TODO change for search icon */}
        <TicketSvg fill={'gray'} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  searchBar: {
    display: 'flex',
    flex: 1,
    position: 'absolute',
    top: '0%',
    marginTop: 30,
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
  searchButton: {
    marginRight: 20,
  },
})

export default SearchBar
