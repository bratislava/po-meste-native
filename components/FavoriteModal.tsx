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
  const [isEditing, setIsEditing] = useState(false)
  const [favoriteName, setFavoriteName] = useState('')

  if (
    type === 'place' &&
    ((favorite && isFavoritePlace(favorite)) || !favorite)
  )
    return (
      <Modal onClose={onClose}>
        <View style={styles.modal}>
          <Text
            style={[
              s.textLarge,
              s.boldText,
              { alignSelf: 'center', marginBottom: 15 },
            ]}
          >
            {type === 'place' ? 'Moje adresy' : 'Moje zastávky'}
          </Text>
          {favorite && !isEditing ? (
            <Text>{`${favorite.name} - ${favorite.placeData?.structured_formatting?.main_text}`}</Text>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Názov"
                onChangeText={(text) => setFavoriteName(text)}
                defaultValue={favorite ? favorite.name : undefined}
              />
              <View style={styles.googleFrom}>
                <Autocomplete
                  onGooglePlaceChosen={(data, details) =>
                    setGooglePlace({ data, details })
                  }
                  inputPlaceholder="Adresa"
                  googleInputRef={googleInputRef}
                />
              </View>
            </>
          )}
          <View style={{ flexGrow: 1 }} />
          {(isEditing || !favorite) && onConfirm ? (
            <Button
              style={styles.button}
              variant="approve"
              title="Uložiť"
              onPress={() => {
                if (favorite) {
                  favorite.placeData = googlePlace?.data
                  favorite.placeDetail = googlePlace?.details ?? undefined
                  favorite.name = favoriteName
                  onConfirm(favorite)
                } else {
                  const newFavorit = {
                    id: uuid.v4(),
                    name: favoriteName,
                    placeData: googlePlace?.data,
                    placeDetail: googlePlace?.details ?? undefined,
                  }
                  onConfirm(newFavorit)
                }
                onClose()
              }}
            />
          ) : (
            <Button
              style={styles.button}
              variant="approve"
              title="Upraviť"
              onPress={() => {
                setIsEditing(true)
                if (favorite) {
                  setFavoriteName(favorite.name)
                  googleInputRef.current?.setAddressText(
                    favorite.placeData?.structured_formatting?.main_text ?? ''
                  )
                }
              }}
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
  if (type === 'stop')
    return (
      <Modal onClose={onClose}>
        <View style={[styles.modal, { height: 240 }]}>
          <Text
            style={[
              s.textLarge,
              s.boldText,
              { alignSelf: 'center', marginBottom: 15 },
            ]}
          >
            Moje adresy
          </Text>
          {favorite ? (
            <Text>{favorite.placeData?.structured_formatting}</Text>
          ) : (
            <View style={styles.googleFrom}>
              <Autocomplete
                onGooglePlaceChosen={(data, details) =>
                  setGooglePlace({ data, details })
                }
                inputPlaceholder="Zastávka"
                googleInputRef={googleInputRef}
                placeTypeFilter="transit_station"
              />
            </View>
          )}
          <View style={{ flexGrow: 1 }} />
          {favorite && onDelete && (
            <Button
              style={styles.button}
              variant="outlined"
              title="Odstrániť"
              onPress={() => {
                onDelete({
                  placeData: googlePlace?.data,
                  placeDetail: googlePlace?.details ?? undefined,
                })
                onClose()
              }}
            />
          )}
          {!favorite && onConfirm && (
            <Button
              style={styles.button}
              variant="approve"
              title="Uložiť"
              onPress={() => {
                onConfirm({
                  placeData: googlePlace?.data,
                  placeDetail: googlePlace?.details ?? undefined,
                })
                onClose()
              }}
            />
          )}
        </View>
      </Modal>
    )
  return null
}

const styles = StyleSheet.create({
  modal: {
    height: 480,
    paddingVertical: 32,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
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
})

export default FavoriteModal
