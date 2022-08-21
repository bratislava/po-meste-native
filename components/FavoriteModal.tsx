import { Favorite } from '@types'
import { s } from '@utils/globalStyles'
import { colors } from '@utils/theme'
import React, { useRef } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete'
import Autocomplete from './Autocomplete'
import Modal from './Modal'

export interface FavoriteModalProps {
  type: 'place' | 'stop'
  onConfirm: () => void
  onClose: () => void
  favorite?: Favorite
  title?: string
}

const onGooglePlaceChosen = () => false

const FavoriteModal = ({
  type,
  onConfirm,
  onClose,
  favorite,
  title,
}: FavoriteModalProps) => {
  const googleInputRef = useRef<GooglePlacesAutocompleteRef>(null)

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
        <View style={styles.googleFrom}>
          <Autocomplete
            onGooglePlaceChosen={onGooglePlaceChosen}
            inputPlaceholder={type === 'place' ? 'Adresa' : 'Zastávka'}
            googleInputRef={googleInputRef}
            placeTypeFilter={type === 'place' ? undefined : 'transit_station'}
          />
        </View>
        <TextInput style={styles.input} placeholder="Názov" />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    height: 480,
    paddingVertical: 32,
    overflow: 'hidden',
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
})

export default FavoriteModal
