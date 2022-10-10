import Text from '@components/Text'
import i18n from 'i18n-js'
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import CheckBox from 'react-native-check-box'

import { colors } from '../utils/theme'
import Button from './Button'
import Modal from './Modal'

export type ConfirmationModalProps = {
  visible?: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  bodyText?: string
  confirmText?: string
  dismissText?: string
  requiredCheckboxText?: string
}

export default function ConfirmationModal({
  visible = true,
  onClose,
  onConfirm,
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
    <Modal visible={visible} onClose={onClose}>
      {title && <Text style={styles.modalTitle}>{title}</Text>}
      {bodyText && <Text style={styles.modalText}>{bodyText}</Text>}
      <Text style={styles.modalText}>
        {i18n.t('common.doYouWantToContinue')}
      </Text>
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
        title={confirmText ?? i18n.t('common.continue')}
      />
    </Modal>
  )
}

const styles = StyleSheet.create({
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
