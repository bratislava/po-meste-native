import React, { useState } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import * as SMS from 'expo-sms'
import i18n from 'i18n-js'

import {
  Button,
  ConfirmationModal,
  ConfirmationModalProps,
} from '../components'
import { SmsTicketNumbers, SmsTicketPrices, TicketName } from '../types'
import { ScrollView } from 'react-native-gesture-handler'
import { presentPrice } from '../utils/utils'

export default function SmsScreen() {
  async function handleSend(receiverNumber: string) {
    const isAvailable = await SMS.isAvailableAsync()
    if (isAvailable) {
      await SMS.sendSMSAsync(receiverNumber, '.')
    } else {
      Alert.alert('', i18n.t('smsNotAvailable'), [
        {
          text: i18n.t('smsOK'),
        },
      ])
    }
  }

  const onModalClose = () => {
    setConfirmationModalVisible(false)
  }

  const onModalConfirm = async (phoneNumber: string) => {
    await handleSend(phoneNumber)
    setConfirmationModalVisible(false)
  }

  const ticketNames: TicketName[] = [
    'ticket40min',
    'ticket70min',
    'ticket24hours',
  ]

  const getTicketButtonTitle = (ticketName: TicketName) => {
    return `${i18n.t(
      `screens.ticketsScreen.tickets.${ticketName}.name`
    )} / ${presentPrice(SmsTicketPrices[ticketName])}`
  }

  const modalData: { [key in TicketName]: ConfirmationModalProps } = {
    ticket40min: {
      onClose: onModalClose,
      onConfirm: () => onModalConfirm(SmsTicketNumbers.ticket40min),
      bodyText: i18n.t('screens.ticketsScreen.smsModal.bodyText', {
        ticketName: i18n.t('screens.ticketsScreen.tickets.ticket40min.name'),
        price: presentPrice(SmsTicketPrices.ticket40min),
      }),
    },
    ticket70min: {
      onClose: onModalClose,
      onConfirm: () => onModalConfirm(SmsTicketNumbers.ticket70min),
      bodyText: i18n.t('screens.ticketsScreen.smsModal.bodyText', {
        ticketName: i18n.t('screens.ticketsScreen.tickets.ticket70min.name'),
        price: presentPrice(SmsTicketPrices.ticket70min),
      }),
    },
    ticket24hours: {
      onClose: onModalClose,
      onConfirm: () => onModalConfirm(SmsTicketNumbers.ticket24hours),
      bodyText: i18n.t('screens.ticketsScreen.smsModal.bodyText', {
        ticketName: i18n.t('screens.ticketsScreen.tickets.ticket24hours.name'),
        price: presentPrice(SmsTicketPrices.ticket24hours),
      }),
    },
  }

  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false)

  const [confirmationModalProps, setConfirmationModalProps] = useState(
    modalData.ticket40min
  )

  const ticketButtonClickHandler = (ticketName: TicketName) => {
    setConfirmationModalProps(modalData[ticketName])
    setConfirmationModalVisible(true)
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>{i18n.t('smsTicketTitle')}</Text>
        <Text style={styles.smsInfo}>{i18n.t('smsInfo')}</Text>
        {ticketNames.map((ticketName, i) => {
          return (
            <View key={i} style={styles.buttonFullWidth}>
              <Button
                title={getTicketButtonTitle(ticketName)}
                onPress={() => ticketButtonClickHandler(ticketName)}
                isFullWidth
                size="large"
              />
            </View>
          )
        })}
        <View style={styles.separator}></View>
        <Text style={styles.smsInfo}>
          {i18n.t('ticketDuplicateDescription')}
        </Text>
        <View style={[styles.buttonFullWidth, { marginHorizontal: 71 }]}>
          <Button
            title={i18n.t('ticketDuplicate')}
            onPress={() => handleSend(SmsTicketNumbers.ticketDuplicate)}
            isFullWidth
            size="small"
            variant="secondary"
          />
        </View>
      </ScrollView>
      <ConfirmationModal
        visible={confirmationModalVisible}
        onClose={confirmationModalProps.onClose}
        onConfirm={confirmationModalProps.onConfirm}
        title={i18n.t('screens.ticketsScreen.smsModal.title')}
        bodyText={confirmationModalProps.bodyText}
        requiredCheckboxText={i18n.t(
          'screens.ticketsScreen.smsModal.checkboxText'
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    // fontSize: 25,
    // fontWeight: '500',
    marginTop: 33,
    // marginBottom: 46,
    textTransform: 'uppercase',
    // lineHeight: 30,
  },
  smsInfo: {
    // marginHorizontal: 28,
    // marginBottom: 31,
    // lineHeight: 23,
    // fontSize: 15,
    textAlign: 'center',
  },
  buttonFullWidth: {
    flexDirection: 'row',
    marginHorizontal: 20,
    margin: 10,
  },
  separator: {
    // marginTop: 45,
    // marginBottom: 22,
    borderBottomWidth: 1,
    width: '60%',
  },
})
