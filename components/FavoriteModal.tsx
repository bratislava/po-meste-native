import HeartSvg from '@icons/favorite.svg'
import HomeSvg from '@icons/home.svg'
import StopSignSvg from '@icons/stop-sign.svg'
import WorkSvg from '@icons/work.svg'
import { FavoritePlace, FavoriteStop } from '@types'
import { s } from '@utils/globalStyles'
import { colors } from '@utils/theme'
import { isFavoritePlace } from '@utils/utils'
import React, { useRef, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete'
import uuid from 'react-native-uuid'
import Autocomplete from './Autocomplete'
import Button from './Button'
import Modal from './Modal'

export interface FavoriteModalProps {
  type: 'place' | 'stop'
  onClose: () => void
  onConfirm?: (place: FavoritePlace | FavoriteStop | undefined) => void
  onDelete?: (place: FavoritePlace | FavoriteStop | undefined) => void
  favorite?: FavoritePlace | FavoriteStop
}

const FavoriteModal = ({
  type,
  onConfirm,
  onDelete,
  onClose,
  favorite,
}: FavoriteModalProps) => {
  const googleInputRef = useRef<GooglePlacesAutocompleteRef>(null)
  const [googlePlace, setGooglePlace] = useState<
    { data: GooglePlaceData; details: GooglePlaceDetail | null } | undefined
  >(undefined)
  const [favoriteName, setFavoriteName] = useState('')
  const [isEditingName, setIsEditingName] = useState(isFavoritePlace(favorite))
  const [isEditingAddress, setIsEditingAddress] = useState(false)

  const isPlace = isFavoritePlace(favorite) || type === 'place'
  const icon = isFavoritePlace(favorite) ? favorite.icon : undefined
  const Icon = isPlace
    ? icon
      ? icon === 'home'
        ? HomeSvg
        : icon === 'work'
        ? WorkSvg
        : HeartSvg
      : HeartSvg
    : StopSignSvg

  console.log({ favorite })

  const onSave = () => {
    if (!onConfirm) {
      onClose()
      return
    }
    if (isPlace) {
      if (isFavoritePlace(favorite)) {
        favorite.placeData = googlePlace?.data
        favorite.placeDetail = googlePlace?.details ?? undefined
        favorite.isHardSetName ? false : (favorite.name = favoriteName)
        onConfirm(favorite)
      } else {
        const newFavoritPlace: FavoritePlace = {
          id: uuid.v4().toString(),
          name: favoriteName,
          placeData: googlePlace?.data,
          placeDetail: googlePlace?.details ?? undefined,
        }
        onConfirm(newFavoritPlace)
      }
    } else {
      if (favorite) {
        favorite.placeData = googlePlace?.data
        favorite.placeDetail = googlePlace?.details ?? undefined
        onConfirm(favorite)
      } else {
        const newFavoritStop: FavoriteStop = {
          placeData: googlePlace?.data,
          placeDetail: googlePlace?.details ?? undefined,
        }
        onConfirm(newFavoritStop)
      }
    }
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <View style={styles.modal}>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.iconWrapper}>
            <Icon width={30} height={30} fill={colors.primary} />
          </View>
        </View>
        {isPlace &&
          (isFavoritePlace(favorite) && favorite.isHardSetName ? (
            <Text
              style={[
                s.textLarge,
                s.boldText,
                { alignSelf: 'center', marginBottom: 15 },
              ]}
            >
              {favorite.name}
            </Text>
          ) : (
            <TextInput
              style={styles.input}
              placeholder="Názov"
              onChangeText={(text) => setFavoriteName(text)}
              defaultValue={
                isFavoritePlace(favorite) ? favorite.name : undefined
              }
            />
          ))}
        <View style={styles.googleFrom}>
          <Autocomplete
            onGooglePlaceChosen={(data, details) =>
              setGooglePlace({ data, details })
            }
            inputPlaceholder="Adresa"
            googleInputRef={googleInputRef}
          />
        </View>
        <View style={{ flexGrow: 1 }} />
        {onConfirm && (
          <Button
            style={styles.button}
            variant="approve"
            title="Uložiť"
            onPress={() => onSave()}
          />
        )}
        {onDelete && (
          <Button
            style={styles.button}
            variant="outlined"
            title="Odstrániť"
            onPress={() => {
              onDelete(favorite)
              onClose()
            }}
          />
        )}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    height: 320,
    paddingVertical: 32,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  input: {
    borderWidth: 2,
    borderColor: colors.mediumGray,
    height: 50,
    borderRadius: 30,
    paddingHorizontal: 18,
    letterSpacing: 0.5,
    marginBottom: 15,
  },
  googleFrom: {
    flexDirection: 'row',
    marginBottom: 7,
    zIndex: 1,
  },
  button: {
    marginTop: 15,
  },
  iconWrapper: {
    padding: 11,
    borderWidth: 4,
    borderColor: colors.primary,
    borderRadius: 30,
    width: 60,
    height: 60,
    marginBottom: 15,
  },
})

export default FavoriteModal
