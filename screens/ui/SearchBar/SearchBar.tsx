import React, { ReactElement } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

import TicketSvg from '../../../assets/images/ticket.svg'

interface SearchBarProps {
  value: string
  onChangeText: (value: string) => void
  cancelComponent: ReactElement
}

const SearchBar = ({
  value,
  onChangeText,
  cancelComponent,
}: SearchBarProps) => {
  return (
    <View style={styles.searchBar}>
      <TextInput
        style={styles.searchInput}
        value={value}
        placeholder={'Where to'} // TODO change for formattedMessage
        onChangeText={onChangeText}
      />
      <View style={styles.searchButton}>
        {/* TODO change for search icon */}
        <TicketSvg fill={'gray'} />
      </View>
    </View>
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
