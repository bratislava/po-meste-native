import React from 'react'
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Modal as NativeModal,
} from 'react-native'
import Link from '@components/Link'
import { t } from 'i18n-js'

export type ModalProps = {
  visible?: boolean
  children?: React.ReactNode
  onClose?: () => void
}

export default function Modal({
  visible = true,
  children,
  onClose = () => void 0,
}: ModalProps) {
  return (
    <NativeModal
      statusBarTranslucent
      animationType="fade"
      transparent
      visible={visible}
    >
      <View style={styles.modalWrapper}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalBackground}></View>
        </TouchableWithoutFeedback>
        <View style={styles.modalCard}>{children}</View>
        <Link
          style={styles.modalDismiss}
          onPress={onClose}
          title={t('common.cancel')}
        />
      </View>
    </NativeModal>
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
    width: '100%',
    borderRadius: 3,
    padding: 20,
    maxWidth: '80%',
    marginBottom: 20,
  },
  modalDismiss: {
    textAlign: 'center',
    width: '100%',
    color: 'white',
  },
})
