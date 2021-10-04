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

interface SearchFromToScreen {
  sheetRef: MutableRefObject<BottomSheet | null>
  getMyLocation: () => void
  onGooglePlaceChosen: (
    _data: GooglePlaceData,
    details: GooglePlaceDetail | null
  ) => void
  googleInputRef: React.MutableRefObject<GooglePlacesAutocompleteRef | null>
  setLocationFromMap: () => void
}

export default function SearchFromToScreen({
  sheetRef,
  getMyLocation,
  onGooglePlaceChosen,
  googleInputRef,
  setLocationFromMap,
}: SearchFromToScreen) {
  const { height } = Dimensions.get('window')

  const renderContent = () => (
    <KeyboardAvoidingView style={[styles.content, { height: height }]}>
      <View style={[s.horizontalMargin, styles.content, { height: height }]}>
        <View style={styles.googleFrom}>
          <Ionicons
            size={30}
            style={{ marginBottom: -3, color: colors.lighterGray }}
            name="close"
          />
          <GooglePlacesAutocomplete
            ref={googleInputRef}
            styles={autoCompleteStyles}
            enablePoweredByContainer={false}
            fetchDetails
            placeholder={i18n.t('from')}
            onPress={onGooglePlaceChosen}
            query={{
              key: Constants.manifest?.extra?.googlePlacesApiKey,
              language: 'sk',
              components: 'country:sk',
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
          </View>
        </View>
        <View style={styles.categoryStops}>
          <View style={styles.separatorParent}>
            <View style={styles.separator}></View>
          </View>
          <Text style={styles.categoriesTitle}>{i18n.t('history')}</Text>
          <ScrollView contentContainerStyle={styles.verticalScrollView}>
            {dummyDataPlaceHistory.map((historyItem, index) => (
              <View key={index} style={styles.verticalScrollItem}>
                <HistorySvg width={30} height={20} />
                <View style={styles.placeTexts}>
                  <Text style={styles.placeAddress}>{historyItem.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
        <Button onPress={getMyLocation} title={i18n.t('myLocation')} />
        <Button onPress={setLocationFromMap} title={i18n.t('locationChoose')} />
      </View>
    </KeyboardAvoidingView>
  )

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  )

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={[height - (StatusBar.currentHeight || 0), 0]}
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
  verticalScrollView: {},
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
    marginVertical: 15,
    alignItems: 'center',
  },
  chooseFromMap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.lightGray,
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
    alignItems: 'center',
    marginBottom: 7,
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.lightGray,
    paddingHorizontal: 5,
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
    height: 40,
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
    flex: 1,
  },
  listView: {
    position: 'absolute',
    top: 50,
    elevation: 5,
    zIndex: 5,
    borderWidth: 2,
  },

  textInput: {
    marginBottom: 0,
    height: 50,
  },
}
