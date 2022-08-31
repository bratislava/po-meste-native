import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import i18n from 'i18n-js'
import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import {
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
import PlaceSvg from '@icons/map-pin-marker.svg'
import PlusButtonSvg from '@icons/plus.svg'
import StopSignSvg from '@icons/stop-sign.svg'
import XSvg from '@icons/x.svg'
import {
  FavoriteData,
  FavoriteItem,
  FavoriteStop,
  GooglePlace,
  GooglePlaceDataCorrected,
} from '@types'
import produce from 'immer'
import { cloneDeep } from 'lodash'

interface SearchFromToScreen {
  sheetRef: MutableRefObject<BottomSheet | null>
  getMyLocation?: (reask?: boolean) => void
  onGooglePlaceChosen: (
    _data: GooglePlaceDataCorrected,
    detail: GooglePlaceDetail | null
  ) => void
  googleInputRef: React.MutableRefObject<GooglePlacesAutocompleteRef | null>
  setLocationFromMap: () => void
  inputPlaceholder: string
  initialSnapIndex: number
  favoriteData: FavoriteData
  setFavoriteData: Dispatch<SetStateAction<FavoriteData>>
}

type ModalPropsOmitOnClose<T = FavoriteModalProps> = Omit<T, 'onClose'>

export default function SearchFromToScreen({
  sheetRef,
  getMyLocation,
  onGooglePlaceChosen,
  googleInputRef,
  setLocationFromMap,
  inputPlaceholder,
  initialSnapIndex,
  favoriteData,
  setFavoriteData,
}: SearchFromToScreen) {
  useEffect(() => {
    if (getMyLocation) {
      getMyLocation()
    }
  }, [getMyLocation])

  const [modal, setModal] = useState<ModalPropsOmitOnClose | undefined>(
    undefined
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

  const handleFavoritePress = (favoriteItem: FavoriteItem) => {
    if (favoriteItem.place?.data && favoriteItem.place.detail)
      onGooglePlaceChosen(favoriteItem.place.data, favoriteItem.place.detail)
  }

  const addOrUpdatePlace = (favoritePlace?: FavoriteItem) => {
    if (!favoritePlace || !isFavoritePlace(favoritePlace)) return
    const newFavoriteData = produce(favoriteData, (draftFavoriteData) => {
      let matchingPlace = draftFavoriteData.favoritePlaces.find(
        (value) => value.id === favoritePlace.id
      )
      if (!matchingPlace) {
        //2 huge attributes which we do not need to store
        delete (favoritePlace.place?.detail as any).photos
        delete (favoritePlace.place?.detail as any).reviews
        draftFavoriteData.favoritePlaces.push(favoritePlace)
      } else {
        matchingPlace = { ...matchingPlace, ...favoritePlace }
      }
    })
    setFavoriteData(newFavoriteData)
  }

  const addStop = (stop?: FavoriteStop) => {
    if (
      favoriteData.favoriteStops.find(
        (favoriteStop) =>
          favoriteStop.place?.data.place_id === stop?.place?.data.place_id
      )
    )
      return
    if (stop) {
      const newFavoriteData = produce(favoriteData, (draftFavoriteData) => {
        delete (stop.place?.detail as any).photos
        delete (stop.place?.detail as any).reviews
        draftFavoriteData.favoriteStops.push(stop)
      })
      setFavoriteData(newFavoriteData)
    }
  }

  const deleteFavorite = (favorite?: FavoriteItem) => {
    if (!favorite) return
    if (isFavoritePlace(favorite)) {
      if (favorite.isHardSetName) return
      const updatedFavoritePlaces = favoriteData.favoritePlaces.filter(
        (value) => value.id !== favorite.id
      )
      setFavoriteData((oldData) => ({
        ...oldData,
        favoritePlaces: updatedFavoritePlaces,
      }))
    } else {
      const updatedFavoriteStops = favoriteData.favoriteStops.filter(
        (value) =>
          value.place?.data?.place_id !== favorite.place?.data?.place_id
      )
      setFavoriteData((oldData) => ({
        ...oldData,
        favoriteStops: updatedFavoriteStops,
      }))
    }
  }

  const addToHistory = (
    data: GooglePlaceDataCorrected,
    detail: GooglePlaceDetail | null
  ) => {
    const newHistory = cloneDeep(
      favoriteData.history.filter(
        (item) => item.data.place_id !== data.place_id
      )
    )
    const historyLenght = newHistory.unshift({
      data,
      detail: detail,
    })
    if (historyLenght > 15) newHistory.pop()
    setFavoriteData((oldData) => ({
      ...oldData,
      history: newHistory,
    }))
  }

  const deleteFromHistory = (place: GooglePlace) => {
    const newHistory = favoriteData.history.filter(
      (item) => item.data.place_id !== place.data.place_id
    )
    setFavoriteData((oldData) => ({
      ...oldData,
      history: newHistory,
    }))
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
        <View style={[s.horizontalMargin, styles.googleForm]}>
          <Autocomplete
            onGooglePlaceChosen={onGooglePlaceChosen}
            inputPlaceholder={inputPlaceholder}
            googleInputRef={googleInputRef}
            selectOnFocus
            addToHistory={addToHistory}
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
                onPress={() => handleFavoritePress(favoriteItem)}
                onMorePress={() =>
                  setModal({
                    type: 'place',
                    favorite: favoriteItem,
                    onConfirm: addOrUpdatePlace,
                    onDelete: !favoriteItem.isHardSetName
                      ? deleteFavorite
                      : undefined,
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
            showsHorizontalScrollIndicator={false}
          >
            {favoriteData.favoriteStops.map((favoriteItem, index) => (
              <FavoriteTile
                key={index}
                favoriteItem={favoriteItem}
                onPress={() => handleFavoritePress(favoriteItem)}
                onMorePress={() =>
                  setModal({
                    type: 'stop',
                    favorite: favoriteItem,
                    onDelete: deleteFavorite,
                  })
                }
              />
            ))}
          </ScrollView>
          {renderAddButton(() =>
            setModal({ type: 'stop', onConfirm: addStop })
          )}
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
          <BottomSheetScrollView style={styles.verticalScrollView}>
            {favoriteData.history.map((place, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onGooglePlaceChosen(place.data, place.detail)}
              >
                <View style={styles.verticalScrollItem}>
                  <View style={styles.leftSideItemWrapper}>
                    <HistorySvg width={30} height={20} fill={colors.black} />
                    {(place.detail?.types[0] as any) === 'transit_station' ? (
                      <StopSignSvg width={30} height={20} fill={colors.black} />
                    ) : (
                      <PlaceSvg width={30} height={20} fill={colors.black} />
                    )}
                    <View style={styles.placeTexts}>
                      <Text
                        style={[styles.placeAddress, { marginRight: 15 }]}
                        numberOfLines={1}
                      >
                        {place.data?.structured_formatting.main_text}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rightSideItemWrapper}>
                    <TouchableOpacity
                      onPress={() => deleteFromHistory(place)}
                      style={styles.deleteHistoryButton}
                    >
                      <XSvg width={16} height={16} fill={colors.black} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </BottomSheetScrollView>
        </View>
      </View>
      {modal && (
        <FavoriteModal
          type={modal.type}
          favorite={modal.favorite}
          onConfirm={modal.onConfirm}
          onDelete={modal.onDelete}
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
    paddingRight: 35,
  },
  verticalScrollView: {
    marginBottom: BOTTOM_TAB_NAVIGATOR_HEIGHT + 5,
  },
  verticalScrollItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    justifyContent: 'space-between',
  },
  leftSideItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    overflow: 'hidden',
  },
  rightSideItemWrapper: {
    flex: 0,
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
    right: -20,
    backgroundColor: colors.white,
    padding: 17,
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
  },
  googleForm: {
    flexDirection: 'row',
    marginBottom: 7,
    zIndex: 1,
  },
  deleteHistoryButton: { padding: 8 },
})
