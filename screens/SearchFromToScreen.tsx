import React, { MutableRefObject } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
  StatusBar,
} from 'react-native'
import i18n from 'i18n-js'
import { ScrollView } from 'react-native-gesture-handler'
import BottomSheet from 'reanimated-bottom-sheet'
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete'
import Constants from 'expo-constants'
import { Ionicons } from '@expo/vector-icons'

import { Button } from '../components'
import { dummyDataPlaceHistory } from '../dummyData'
import { s } from '../utils/globalStyles'
import { colors } from '../utils/theme'
import MhdSvg from '../assets/images/mhd.svg'
import HistorySvg from '../assets/images/history-search.svg'
import { BOTTOM_TAB_NAVIGATOR_HEIGHT } from '@navigation/TabBar'
import { SafeAreaView } from 'react-native-safe-area-context'

interface SearchFromToScreen {
  sheetRef: MutableRefObject<BottomSheet | null>
  getMyLocation?: () => void
  onGooglePlaceChosen: (
    _data: GooglePlaceData,
    details: GooglePlaceDetail | null
  ) => void
  googleInputRef: React.MutableRefObject<GooglePlacesAutocompleteRef | null>
  setLocationFromMap: () => void
  inputPlaceholder: string
}

export default function SearchFromToScreen({
  sheetRef,
  getMyLocation,
  onGooglePlaceChosen,
  googleInputRef,
  setLocationFromMap,
  inputPlaceholder,
}: SearchFromToScreen) {
  const { height } = Dimensions.get('window')

  const clearLocationTextInput = () => {
    googleInputRef.current?.setAddressText('')
    googleInputRef.current?.focus()
  }

  const renderContent = () => (
    <View style={styles.content}>
      <View style={[s.horizontalMargin, styles.content]}>
        <View style={styles.googleFrom}>
          <GooglePlacesAutocomplete
            renderLeftButton={() => (
              <Ionicons
                onPress={clearLocationTextInput}
                size={30}
                style={{
                  alignSelf: 'center',
                  marginBottom: -3,
                  color: colors.lighterGray,
                }}
                name="close"
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
              location: '48.1512015, 17.1110118',
              radius: '22000', //22 km
              strictbounds: true,
            }}
          />
        </View>
        <View>
          <Text style={styles.categoriesTitle}>{i18n.t('myAddresses')}</Text>
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
        </View>
        <View style={styles.categoryStops}>
          <View style={styles.separatorParent}>
            <View style={styles.separator}></View>
          </View>
          <View style={styles.chooseFromMapRow}>
            {getMyLocation && (
              <TouchableOpacity onPress={getMyLocation}>
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
                      {i18n.t('currentPosition')}
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
                      {i18n.t('choosePlaceFromMap')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.categoryStops}>
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
        </View>
      </View>
    </View>
  )

  const renderHeader = () => (
    <SafeAreaView style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </SafeAreaView>
  )

  return (
    <BottomSheet
      ref={sheetRef}
      initialSnap={1}
      snapPoints={[height, 0]}
      renderContent={renderContent}
      renderHeader={renderHeader}
      enabledContentTapInteraction={false} //https://github.com/osdnk/react-native-reanimated-bottom-sheet/issues/219#issuecomment-625894292
    />
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
  horizontalScrollItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    marginRight: 10,
    paddingHorizontal: 10,
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: 3,
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
    borderColor: colors.lightGray,
    paddingHorizontal: 5,
  },
  chooseFromMapText: {
    width: 100,
  },
  placeTexts: {
    marginLeft: 10,
  },
  placeName: {
    color: colors.primary,
  },
  placeAddressMinor: {
    color: colors.mediumGray,
  },
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
  header: {
    backgroundColor: 'white',
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
    height: 20,
  },
  panelHandle: {
    width: 100,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
    marginBottom: 10,
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
