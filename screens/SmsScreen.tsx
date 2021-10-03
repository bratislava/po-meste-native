import React, { useState } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import * as SMS from 'expo-sms'
import i18n from 'i18n-js'

import {
  Button,
  ConfirmationModal,
  ConfirmationModalProps,
} from '../components'
import { SmsTicketNumbers, SmsTicketPrices } from '../types'
import { ScrollView } from 'react-native-gesture-handler'
import { presentPrice } from '../utils/presentPrice'

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

  type ticketData = {
    button: {
      title: string
    }
    modal: ConfirmationModalProps
  }

  const ticketsData: ticketData[] = [
    {
      button: {
        title: `${i18n.t(
          'screens.ticketsScreen.tickets.ticket40min.name'
        )} / ${presentPrice(SmsTicketPrices.ticket40min)}`,
      },
      modal: {
        onConfirm: async () => {
          handleSend(SmsTicketNumbers.ticket40min)
          setConfirmationModalVisible(false)
        },
        bodyText: i18n.t(
          'screens.ticketsScreen.smsModal.bodyTexts.ticket40min',
          {
            price: presentPrice(SmsTicketPrices.ticket40min),
          }
        ),
      },
    },
    {
      button: {
        title: `${i18n.t(
          'screens.ticketsScreen.tickets.ticket70min.name'
        )} / ${presentPrice(SmsTicketPrices.ticket70min)}`,
      },
      modal: {
        onConfirm: async () => {
          handleSend(SmsTicketNumbers.ticket70min)
          setConfirmationModalVisible(false)
        },
        bodyText: i18n.t(
          'screens.ticketsScreen.smsModal.bodyTexts.ticket70min',
          {
            price: presentPrice(SmsTicketPrices.ticket70min),
          }
        ),
      },
    },
    {
      button: {
        title: `${i18n.t(
          'screens.ticketsScreen.tickets.ticket24hours.name'
        )} / ${presentPrice(SmsTicketPrices.ticket24hours)}`,
      },
      modal: {
        onConfirm: async () => {
          handleSend(SmsTicketNumbers.ticket24hours)
          setConfirmationModalVisible(false)
        },
        bodyText: i18n.t(
          'screens.ticketsScreen.smsModal.bodyTexts.ticket24hours',
          {
            price: presentPrice(SmsTicketPrices.ticket24hours),
          }
        ),
      },
    },
  ]

  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false)

  const [confirmationModalProps, setConfirmationModalProps] = useState(
    ticketsData[0].modal
  )

  const ticketButtonClickHandler = (ticketData: ticketData) => {
    setConfirmationModalProps(ticketData.modal)
    setConfirmationModalVisible(true)
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>{i18n.t('smsTicketTitle')}</Text>
        <Text style={styles.smsInfo}>{i18n.t('smsInfo')}</Text>
        {ticketsData.map((ticketData, i) => {
          return (
            <View key={i} style={styles.buttonFullWidth}>
              <Button
                title={ticketData.button.title}
                onPress={() => ticketButtonClickHandler(ticketData)}
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
        {...confirmationModalProps}
        visible={confirmationModalVisible}
        onClose={() => setConfirmationModalVisible(false)}
        title={i18n.t('screens.ticketsScreen.smsModal.title')}
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
