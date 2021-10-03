import i18n from 'i18n-js'
import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native'
import { Button, Link } from '../../../components'
import CheckBox from 'react-native-check-box'
import { colors } from '../../../utils/theme'
import { useEffect } from 'react'

export type ConfirmationModalProps = {
  visible?: boolean
  onClose?: () => void
  onConfirm?: () => void
  title?: string
  bodyText?: string
  confirmText?: string
  dismissText?: string
  requiredCheckboxText?: string
}

export default function ConfirmationModal({
  visible = true,
  onClose = () => void 0,
  onConfirm = () => void 0,
  title,
  bodyText,
  confirmText,
  dismissText,
  requiredCheckboxText,
}: ConfirmationModalProps) {
  const [isChecked, setChecked] = useState(false)

  useEffect(() => {
    setChecked(false)
  }, [visible])

  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      transparent
      visible={visible}
    >
      <View style={styles.modalWrapper}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBackground}></View>
        </TouchableWithoutFeedback>
        <View style={styles.modalCard}>
          {title && <Text style={styles.modalTitle}>{title}</Text>}
          {bodyText && <Text style={styles.modalText}>{bodyText}</Text>}
          <Text style={styles.modalText}>{i18n.t('doYouWantToContinue')}</Text>
          {requiredCheckboxText && (
            <CheckBox
              onClick={() => setChecked(!isChecked)}
              isChecked={isChecked}
              style={styles.modalCheckbox}
              rightText={requiredCheckboxText}
              rightTextStyle={styles.modalCheckboxText}
              checkedCheckBoxColor={colors.primary}
              uncheckedCheckBoxColor={colors.gray}
            />
          )}
          <Button
            disabled={requiredCheckboxText ? !isChecked : false}
            style={styles.modalButton}
            onPress={onConfirm}
            title={confirmText ?? i18n.t('continue')}
          />
          <Link
            style={styles.modalDismiss}
            onPress={() => {
              onClose()
            }}
            title={dismissText ?? i18n.t('cancel')}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    opacity: 0.65,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 3,
    padding: 20,
    maxWidth: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.darkText,
  },
  modalText: {
    marginBottom: 20,
    color: colors.darkText,
  },
  modalCheckbox: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  modalCheckboxText: {
    color: colors.darkText,
  },
  modalButton: {
    marginBottom: 20,
  },
  modalDismiss: {
    textAlign: 'center',
    width: '100%',
  },
})
