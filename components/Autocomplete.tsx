import MarkerSvg from '@icons/map-pin-marker.svg'
import MhdStopSvg from '@icons/stop-sign.svg'
import XSvg from '@icons/x.svg'
import { GooglePlaceDataCorrected } from '@types'
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
    _data: GooglePlaceDataCorrected,
    details: GooglePlaceDetail | null
  ) => void
  googleInputRef: React.MutableRefObject<GooglePlacesAutocompleteRef | null>
  inputPlaceholder: string
  placeTypeFilter?: string
  selectOnFocus?: boolean
  addToHistory?: (
    data: GooglePlaceDataCorrected,
    detail: GooglePlaceDetail | null
  ) => void
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
      // "react-native-google-places-autocomplete" version: 2.4.1, wrong typing of GooglePlaceData
      onPress={(data, detail) => {
        onGooglePlaceChosen(data as unknown as GooglePlaceDataCorrected, detail)
        addToHistory &&
          addToHistory(data as unknown as GooglePlaceDataCorrected, detail)
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
        // "react-native-google-places-autocomplete" version: 2.4.1, wrong typing of GooglePlaceData
        const correctedResult = result as unknown as GooglePlaceDataCorrected
        const Icon =
          correctedResult.types[0] === 'transit_station'
            ? MhdStopSvg
            : MarkerSvg
        return (
          <View style={styles.searchResultRow}>
            <Icon
              style={styles.searchResultRowIcon}
              fill={colors.lighterGray}
              width={16}
              height={16}
            />
            <Text>{`${correctedResult.description}`}</Text>
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
