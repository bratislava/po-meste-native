import BottomSheet from '@gorhom/bottom-sheet'
import Constants from 'expo-constants'
import i18n from 'i18n-js'
import React, { MutableRefObject, useEffect, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete'

import LocationSvg from '@icons/current-location.svg'
import MapSvg from '@icons/map.svg'

import { colors, s, STYLES } from '@utils'

import FavoriteTile from '@components/FavoriteTile'
import { BOTTOM_TAB_NAVIGATOR_HEIGHT } from '@components/navigation/TabBar'
import HeartSvg from '@icons/favorite.svg'
import HistorySvg from '@icons/history-search.svg'
import MarkerSvg from '@icons/map-pin-marker.svg'
import MhdStopSvg from '@icons/stop-sign.svg'
import XSvg from '@icons/x.svg'
import dummyDataPlaceHistory from './dummyDataPlaceHistory.json'

interface SearchFromToScreen {
  sheetRef: MutableRefObject<BottomSheet | null>
  getMyLocation?: (reask?: boolean) => void
  onGooglePlaceChosen: (
    _data: GooglePlaceData,
    details: GooglePlaceDetail | null
  ) => void
  googleInputRef: React.MutableRefObject<GooglePlacesAutocompleteRef | null>
  setLocationFromMap: () => void
  inputPlaceholder: string
  initialSnapIndex: number
}

// for some reason, there is wrong typing on GooglePlaceData, so this is the fix :)
interface FixedGooglePlaceData extends GooglePlaceData {
  types: string[]
}

export default function SearchFromToScreen({
  sheetRef,
  getMyLocation,
  onGooglePlaceChosen,
  googleInputRef,
  setLocationFromMap,
  inputPlaceholder,
  initialSnapIndex,
}: SearchFromToScreen) {
  useEffect(() => {
    if (getMyLocation) {
      getMyLocation()
    }
  }, [getMyLocation])

  useEffect(() => {
    googleInputRef.current?.focus()
  }, [googleInputRef])
  const [googleAutocompleteSelection, setGoogleAutocompleteSelection] =
    useState<{ start: number } | undefined>(undefined)

  return (
    <BottomSheet
      ref={sheetRef}
      index={initialSnapIndex}
      snapPoints={['95%']}
      enablePanDownToClose
      handleIndicatorStyle={s.handleStyle}
    >
      <View style={styles.content}>
        <View style={[s.horizontalMargin, styles.googleFrom]}>
          <GooglePlacesAutocomplete
            renderLeftButton={() => (
              <XSvg
                onPress={() => googleInputRef.current?.clear()}
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
            onPress={onGooglePlaceChosen}
            query={{
              key: Constants.manifest?.extra?.googlePlacesApiKey,
              language: 'sk',
              location: '48.160170, 17.130256',
              radius: '20788', //20,788 km
              strictbounds: true,
            }}
            renderRow={(result: GooglePlaceData) => {
              const fixedResult = result as FixedGooglePlaceData
              const Icon =
                fixedResult.types[0] === 'transit_station'
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
                  <Text>{result.structured_formatting.main_text}</Text>
                </View>
              )
            }}
            textInputProps={{
              selectTextOnFocus: true,
              onBlur: () => {
                setGoogleAutocompleteSelection({ start: 0 })
                setTimeout(() => {
                  setGoogleAutocompleteSelection(undefined)
                }, 10)
              },
              selection: googleAutocompleteSelection,
            }}
          />
        </View>
        <View style={s.horizontalMargin}>
          <Text style={styles.categoriesTitle}>
            {i18n.t('screens.SearchFromToScreen.myAddresses')}
          </Text>
          <ScrollView
            contentContainerStyle={styles.horizontalScrollView}
            horizontal
          >
            {dummyDataPlaceHistory.map((historyItem, index) => (
              <FavoriteTile
                key={index}
                favoriteItem={historyItem}
                icon={(props) => <HeartSvg {...props} />}
                onPress={() => false}
              />
            ))}
          </ScrollView>
        </View>
        <View style={[styles.categoryStops, s.horizontalMargin]}>
          <Text style={styles.categoriesTitle}>
            {i18n.t('screens.SearchFromToScreen.myStops')}
          </Text>
          <ScrollView
            contentContainerStyle={styles.horizontalScrollView}
            horizontal
          >
            {dummyDataPlaceHistory.map((historyItem, index) => (
              <FavoriteTile
                key={index}
                favoriteItem={historyItem}
                icon={(props) => <MhdStopSvg {...props} />}
                onPress={() => false}
              />
            ))}
          </ScrollView>
        </View>
        <View style={[styles.categoryStops, s.horizontalMargin]}>
          <View style={styles.chooseFromMapRow}>
            {getMyLocation && (
              <TouchableOpacity onPress={() => getMyLocation(true)}>
                <View style={styles.chooseFromMap}>
                  <LocationSvg width={30} height={30} fill={colors.primary} />
                  <View style={[styles.placeTexts, styles.chooseFromMapText]}>
                    <Text style={styles.placeAddress}>
                      {i18n.t('screens.SearchFromToScreen.currentPosition')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            {setLocationFromMap && (
              <TouchableOpacity onPress={setLocationFromMap}>
                <View style={styles.chooseFromMap}>
                  <MapSvg width={30} height={30} fill={colors.primary} />
                  <View style={[styles.placeTexts, styles.chooseFromMapText]}>
                    <Text style={styles.placeAddress}>
                      {i18n.t('screens.SearchFromToScreen.choosePlaceFromMap')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={[styles.categoryStops, styles.history]}>
          <Text style={styles.categoriesTitle}>
            {i18n.t('screens.SearchFromToScreen.history')}
          </Text>
          <View style={styles.verticalScrollView}>
            {dummyDataPlaceHistory.map((historyItem, index) => (
              <View key={index} style={styles.verticalScrollItem}>
                <HistorySvg width={30} height={20} fill={colors.black} />
                <View style={styles.placeTexts}>
                  <Text style={styles.placeAddress}>{historyItem.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  categoriesTitle: {
    marginTop: 14,
    marginBottom: 10,
  },
  horizontalScrollView: {
    flexDirection: 'row',
    borderWidth: 1,
  },
  verticalScrollView: {
    paddingBottom: BOTTOM_TAB_NAVIGATOR_HEIGHT,
  },
  verticalScrollItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
  chooseFromMapRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
    alignItems: 'center',
  },
  chooseFromMap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  chooseFromMapText: {
    width: 100,
    alignItems: 'center',
  },
  placeTexts: {
    marginLeft: 10,
  },
  categoryStops: {
    marginTop: 14,
  },
  placeAddress: {
    color: colors.blackLighter,
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: 'white',
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height: '100%',
  },
  googleFrom: {
    flexDirection: 'row',
    marginBottom: 7,
    zIndex: 1,
  },

  searchResultRow: {
    flexDirection: 'row',
  },
  searchResultRowIcon: {
    marginRight: 5,
  },
  history: {
    backgroundColor: colors.lightLightGray,
    paddingHorizontal: 20,
    flex: 1,
    alignSelf: 'stretch',
    borderTopEndRadius: STYLES.borderRadius,
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
    paddingHorizontal: 15,
    letterSpacing: 0.5,
  },
}
