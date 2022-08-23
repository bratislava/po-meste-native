import MarkerSvg from '@icons/map-pin-marker.svg'
import MhdStopSvg from '@icons/stop-sign.svg'
import XSvg from '@icons/x.svg'
import { colors } from '@utils/theme'
import Constants from 'expo-constants'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete'

interface AutocompleteProps {
  onGooglePlaceChosen: (
    _data: GooglePlaceData,
    details: GooglePlaceDetail | null
  ) => void
  googleInputRef: React.MutableRefObject<GooglePlacesAutocompleteRef | null>
  inputPlaceholder: string
  placeTypeFilter?: string
  selectOnFocus?: boolean
  addToHistory?: (
    data: GooglePlaceData,
    detail: GooglePlaceDetail | null
  ) => void
}

// for some reason, there is wrong typing on GooglePlaceData, so this is the fix :)
interface FixedGooglePlaceData extends GooglePlaceData {
  types: string[]
}

const Autocomplete = ({
  googleInputRef,
  inputPlaceholder,
  onGooglePlaceChosen,
  placeTypeFilter,
  selectOnFocus = false,
  addToHistory,
}: AutocompleteProps) => {
  const [googleAutocompleteSelection, setGoogleAutocompleteSelection] =
    useState<{ start: number } | undefined>(undefined)
  return (
    <GooglePlacesAutocomplete
      renderLeftButton={() => (
        <XSvg
          onPress={() => googleInputRef.current?.setAddressText('')}
          width={20}
          height={20}
          style={{
            alignSelf: 'center',
          }}
          fill={colors.mediumGray}
        />
      )}
      ref={googleInputRef}
      styles={autoCompleteStyles}
      enablePoweredByContainer={false}
      fetchDetails
      placeholder={inputPlaceholder}
      onPress={(data, detail) => {
        onGooglePlaceChosen(data, detail)
        addToHistory && addToHistory(data, detail)
      }}
      query={{
        key: Constants.manifest?.extra?.googlePlacesApiKey,
        language: 'sk',
        location: '48.160170, 17.130256',
        radius: '20788', //20,788 km
        strictbounds: true,
        type: placeTypeFilter,
      }}
      renderRow={(result: GooglePlaceData) => {
        const fixedResult = result as FixedGooglePlaceData
        const Icon =
          fixedResult.types[0] === 'transit_station' ? MhdStopSvg : MarkerSvg
        return (
          <View style={styles.searchResultRow}>
            <Icon
              style={styles.searchResultRowIcon}
              fill={colors.lighterGray}
              width={16}
              height={16}
            />
            <Text>{result.structured_formatting.main_text}</Text>
          </View>
        )
      }}
      textInputProps={{
        selectTextOnFocus: selectOnFocus,
        onBlur: () => {
          setGoogleAutocompleteSelection({ start: 0 })
          setTimeout(() => {
            setGoogleAutocompleteSelection(undefined)
          }, 10)
        },
        selection: googleAutocompleteSelection,
      }}
    />
  )
}

const styles = StyleSheet.create({
  searchResultRow: {
    flexDirection: 'row',
  },
  searchResultRowIcon: {
    marginRight: 5,
  },
})

const autoCompleteStyles = {
  container: {
    zIndex: 1,
  },
  listView: {
    height: '100%',
  },
  textInput: {
    marginBottom: 0,
    height: 50,
  },
  textInputContainer: {
    borderWidth: 2,
    borderRadius: 30,
    borderColor: colors.mediumGray,
    paddingHorizontal: 18,
    letterSpacing: 0.5,
  },
}

export default Autocomplete
