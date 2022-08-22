import BottomSheet from '@gorhom/bottom-sheet'
import i18n from 'i18n-js'
import React, { MutableRefObject, useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete'

import LocationSvg from '@icons/current-location.svg'
import MapSvg from '@icons/map.svg'

import { colors, isFavoritePlace, s, STYLES } from '@utils'

import Autocomplete from '@components/Autocomplete'
import FavoriteModal, { FavoriteModalProps } from '@components/FavoriteModal'
import FavoriteTile from '@components/FavoriteTile'
import { BOTTOM_TAB_NAVIGATOR_HEIGHT } from '@components/navigation/TabBar'
import HistorySvg from '@icons/history-search.svg'
import PlusButtonSvg from '@icons/plus.svg'
import { FavoriteData, FavoritePlace } from '@types'
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

  const [modal, setModal] = useState<FavoriteModalProps | undefined>(undefined)
  const [favoriteData, setFavoriteData] = useState<FavoriteData>(
    dummyDataPlaceHistory as any
  )

  useEffect(() => {
    googleInputRef.current?.focus()
  }, [googleInputRef])

  const renderAddButton = (onPress: () => void) => (
    <View style={styles.addButtonWrapper}>
      <TouchableOpacity style={styles.addButton} onPress={onPress}>
        <PlusButtonSvg width={30} height={30} />
      </TouchableOpacity>
    </View>
  )

  const addOrUpdatePlace = (place: FavoritePlace) => {
    let matchingPlace = favoriteData.favoritePlaces.find(
      (value) => value.id === place.id
    )
    if (!matchingPlace) {
      favoriteData.favoritePlaces.push(place)
    } else {
      matchingPlace = { ...matchingPlace, ...place }
    }
    setFavoriteData(favoriteData)
  }

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
          <Autocomplete
            onGooglePlaceChosen={onGooglePlaceChosen}
            inputPlaceholder={inputPlaceholder}
            googleInputRef={googleInputRef}
            selectOnFocus
          />
        </View>
        <View style={s.horizontalMargin}>
          <Text style={styles.categoriesTitle}>
            {i18n.t('screens.SearchFromToScreen.myAddresses')}
          </Text>
          <ScrollView
            contentContainerStyle={styles.horizontalScrollView}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {favoriteData.favoritePlaces.map((favoriteItem, index) => (
              <FavoriteTile
                key={index}
                favoriteItem={favoriteItem}
                onPress={() => {
                  if (favoriteItem.placeData && favoriteItem.placeDetail)
                    onGooglePlaceChosen(
                      favoriteItem.placeData,
                      favoriteItem.placeDetail
                    )
                }}
                onMorePress={() =>
                  setModal({
                    type: 'place',
                    favorite: favoriteItem,
                    onConfirm: addOrUpdatePlace,
                  })
                }
              />
            ))}
          </ScrollView>
          {renderAddButton(() =>
            setModal({
              type: 'place',
              onConfirm: addOrUpdatePlace,
            })
          )}
        </View>
        <View style={[styles.categoryStops, s.horizontalMargin]}>
          <Text style={styles.categoriesTitle}>
            {i18n.t('screens.SearchFromToScreen.myStops')}
          </Text>
          <ScrollView
            contentContainerStyle={styles.horizontalScrollView}
            horizontal
          >
            {favoriteData.favoriteStops.map((favoriteItem, index) => (
              <FavoriteTile
                key={index}
                favoriteItem={favoriteItem}
                onPress={() => false}
                onMorePress={() =>
                  setModal({ type: 'stop', favorite: favoriteItem })
                }
              />
            ))}
          </ScrollView>
          {renderAddButton(() => setModal({ type: 'stop' }))}
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
            {favoriteData.history.map((favoriteItem, index) => (
              <View key={index} style={styles.verticalScrollItem}>
                <HistorySvg width={30} height={20} fill={colors.black} />
                <View style={styles.placeTexts}>
                  <Text style={styles.placeAddress}>
                    {isFavoritePlace(favoriteItem)
                      ? favoriteItem.name
                      : favoriteItem.placeData?.structured_formatting.main_text}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
      {modal && (
        <FavoriteModal
          type={modal.type}
          favorite={modal.favorite}
          onConfirm={modal.onConfirm}
          onClose={() => setModal(undefined)}
        />
      )}
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  categoriesTitle: {
    marginTop: 14,
    marginBottom: 10,
  },
  horizontalScrollView: {
    minHeight: 62,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 64,
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
  history: {
    backgroundColor: colors.lightLightGray,
    paddingHorizontal: 20,
    flex: 1,
    alignSelf: 'stretch',
    borderTopEndRadius: STYLES.borderRadius,
  },
  addButton: {},
  addButtonWrapper: {
    position: 'absolute',
    zIndex: 2,
    bottom: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: 17,
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
  },
  googleFrom: {
    flexDirection: 'row',
    marginBottom: 7,
    zIndex: 1,
  },
})
