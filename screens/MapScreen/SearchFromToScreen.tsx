import { Ionicons } from '@expo/vector-icons'
import BottomSheet from '@gorhom/bottom-sheet'
import Constants from 'expo-constants'
import i18n from 'i18n-js'
import React, { MutableRefObject, useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete'

import { colors, s } from '@utils'

// import { dummyDataPlaceHistory } from '../dummyData'
import MarkerSvg from '@icons/map-pin-marker.svg'
import MhdSvg from '@icons/vehicles/mhd.svg'

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
  // const clearLocationTextInput = () => {
  //   googleInputRef.current?.setAddressText('')
  //   googleInputRef.current?.focus()
  // }

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
      snapPoints={['99%']}
      enablePanDownToClose
    >
      <View style={styles.content}>
        <View style={[s.horizontalMargin, styles.content]}>
          <View style={styles.googleFrom}>
            <GooglePlacesAutocomplete
              // renderLeftButton={() => (
              //   <Ionicons
              //     onPress={clearLocationTextInput}
              //     size={30}
              //     style={{
              //       alignSelf: 'center',
              //       marginBottom: -3,
              //       color: colors.lighterGray,
              //     }}
              //     name="close"
              //   />
              // )}
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
                    ? MhdSvg
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
          {/* <View>
            <Text style={styles.categoriesTitle}>{i18n.t('screens.SearchFromToScreen.myAddresses')}</Text>
            <ScrollView
              contentContainerStyle={styles.horizontalScrollView}
              horizontal
            >
              {dummyDataPlaceHistory.map((historyItem, index) => (
                <View key={index} style={styles.horizontalScrollItem}>
                  <Ionicons
                    size={30}
                    style={{ marginBottom: -3, color: colors.primary }}
                    name="heart-outline"
                  />
                  <View style={styles.placeTexts}>
                    <Text style={styles.placeName}>{historyItem.text}</Text>
                    <Text style={styles.placeAddressMinor}>
                      {historyItem.text}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={styles.categoryStops}>
            <View style={styles.separatorParent}>
              <View style={styles.separator}></View>
            </View>
            <Text style={styles.categoriesTitle}>{i18n.t('myStops')}</Text>
            <ScrollView
              contentContainerStyle={styles.horizontalScrollView}
              horizontal
            >
              {dummyDataPlaceHistory.map((historyItem, index) => (
                <View key={index} style={styles.horizontalScrollItem}>
                  <MhdSvg width={30} height={20} />
                  <View style={styles.placeTexts}>
                    <Text style={styles.placeAddress}>{historyItem.text}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View> */}
          <View style={styles.categoryStops}>
            <View style={styles.separatorParent}>
              <View style={styles.separator}></View>
            </View>
            <View style={styles.chooseFromMapRow}>
              {getMyLocation && (
                <TouchableOpacity onPress={() => getMyLocation(true)}>
                  <View style={styles.chooseFromMap}>
                    <Ionicons
                      size={30}
                      style={{
                        marginBottom: -3,
                        color: colors.primary,
                        width: 30,
                      }}
                      name="map-outline"
                    />
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
                    <Ionicons
                      size={30}
                      style={{
                        marginBottom: -3,
                        color: colors.primary,
                        width: 30,
                      }}
                      name="map-outline"
                    />
                    <View style={[styles.placeTexts, styles.chooseFromMapText]}>
                      <Text style={styles.placeAddress}>
                        {i18n.t(
                          'screens.SearchFromToScreen.choosePlaceFromMap'
                        )}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* <View style={styles.categoryStops}>
            <View style={styles.separatorParent}>
              <View style={styles.separator}></View>
            </View>
            <Text style={styles.categoriesTitle}>{i18n.t('history')}</Text>
            <View style={styles.verticalScrollView}>
              {dummyDataPlaceHistory.map((historyItem, index) => (
                <View key={index} style={styles.verticalScrollItem}>
                  <HistorySvg width={30} height={20} />
                  <View style={styles.placeTexts}>
                    <Text style={styles.placeAddress}>{historyItem.text}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View> */}
        </View>
      </View>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  // categoriesTitle: {
  //   marginTop: 14,
  //   marginBottom: 10,
  // },
  // horizontalScrollView: {
  //   flexDirection: 'row',
  //   borderWidth: 1,
  // },
  // verticalScrollView: {
  //   paddingBottom: BOTTOM_TAB_NAVIGATOR_HEIGHT,
  // },
  // horizontalScrollItem: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   height: 56,
  //   marginRight: 10,
  //   paddingHorizontal: 10,
  //   borderColor: colors.lightGray,
  //   borderWidth: 1,
  //   borderRadius: 3,
  // },
  // verticalScrollItem: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   height: 56,
  // },
  chooseFromMapRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
    alignItems: 'center',
  },
  chooseFromMap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.lightGray,
    paddingHorizontal: 5,
  },
  chooseFromMapText: {
    width: 100,
    alignItems: 'center',
  },
  placeTexts: {
    marginLeft: 10,
  },
  // placeName: {
  //   color: colors.primary,
  // },
  // placeAddressMinor: {
  //   color: colors.mediumGray,
  // },
  categoryStops: {
    marginTop: 14,
  },
  separatorParent: {
    alignItems: 'center',
  },
  separator: {
    alignItems: 'center',
    width: '100%',
    height: 1,
    backgroundColor: colors.lightGray,
  },
  placeAddress: {
    color: colors.blackLighter,
  },
  content: {
    backgroundColor: 'white',
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
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.lightGray,
  },
}
