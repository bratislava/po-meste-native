import EditSvg from '@icons/edit-pencil.svg'
import HeartSvg from '@icons/favorite.svg'
import HomeSvg from '@icons/home.svg'
import StopSignSvg from '@icons/stop-sign.svg'
import TrashcanSvg from '@icons/trashcan.svg'
import WorkSvg from '@icons/work.svg'
import { FavoritePlace, FavoriteStop } from '@types'
import { s } from '@utils/globalStyles'
import { colors } from '@utils/theme'
import { isFavoritePlace } from '@utils/utils'
import React, { useEffect, useRef, useState } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
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
  const nameInputRef = useRef<TextInput>(null)
  const googleInputRef = useRef<GooglePlacesAutocompleteRef>(null)
  const [googlePlace, setGooglePlace] = useState<
    { data: GooglePlaceData; details?: GooglePlaceDetail | null } | undefined
  >(undefined)
  const [favoriteName, setFavoriteName] = useState('')
  const [isEditingName, setIsEditingName] = useState(
    isFavoritePlace(favorite) && favorite.name ? false : true
  )
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

  useEffect(() => {
    if (isFavoritePlace(favorite)) {
      setFavoriteName(favorite.name)
    }
    if (googleInputRef.current && favorite?.placeData) {
      googleInputRef.current.setAddressText(favorite.placeData.description)
      setGooglePlace({
        data: favorite.placeData,
        details: favorite.placeDetail,
      })
    }
  }, [favorite])

  useEffect(() => {
    if (isEditingName) nameInputRef.current?.focus()
  }, [isEditingName])

  const handleSave = () => {
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

  const handleDelete = () => {
    if (onDelete) onDelete(favorite)
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
            <View style={styles.inputWrapper}>
              <TextInput
                ref={nameInputRef}
                style={styles.input}
                placeholder="Názov"
                onChangeText={(text) => setFavoriteName(text)}
                defaultValue={
                  isFavoritePlace(favorite) ? favorite.name : undefined
                }
                editable={isEditingName}
              />
              {!isEditingName && (
                <View style={styles.editButtonContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setIsEditingName(true)}
                  >
                    <EditSvg width={24} height={24} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        <View style={styles.googleFrom}>
          <Autocomplete
            onGooglePlaceChosen={(data, details) =>
              setGooglePlace({ data, details })
            }
            inputPlaceholder="Adresa"
            googleInputRef={googleInputRef}
            placeTypeFilter={type === 'stop' ? 'transit_station' : undefined}
          />
        </View>
        <View style={{ flexGrow: 1 }} />
        <View
          style={[
            styles.buttonsContainer,
            { justifyContent: onDelete ? 'space-between' : 'center' },
          ]}
        >
          {onDelete && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete()}
            >
              <TrashcanSvg width={24} height={24} />
            </TouchableOpacity>
          )}
          {onConfirm && (
            <Button
              style={styles.button}
              variant="approve"
              size="small"
              title="Uložiť"
              onPress={() => handleSave()}
            />
          )}
        </View>
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
  inputWrapper: {
    display: 'flex',
    borderWidth: 2,
    borderColor: colors.mediumGray,
    height: 50,
    borderRadius: 30,
    paddingLeft: 18,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    letterSpacing: 0.5,
    flexGrow: 1,
  },
  editButtonContainer: {
    justifyContent: 'center',
  },
  editButton: {
    zIndex: 2,
    padding: 10,
    paddingRight: 18,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  googleFrom: {
    flexDirection: 'row',
    marginBottom: 7,
    zIndex: 1,
  },
  button: { flexGrow: 1, maxWidth: 185 },
  iconWrapper: {
    padding: 11,
    borderWidth: 4,
    borderColor: colors.primary,
    borderRadius: 30,
    width: 60,
    height: 60,
    marginBottom: 15,
  },
  buttonsContainer: {
    marginTop: 15,
    display: 'flex',
    flexDirection: 'row',
  },
  deleteButton: {
    padding: 7,
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: 22,
    marginRight: 30,
  },
})

export default FavoriteModal
