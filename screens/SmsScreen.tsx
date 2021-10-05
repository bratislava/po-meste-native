import React from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import * as SMS from 'expo-sms'
import i18n from 'i18n-js'

import { Button } from '@components/index'
import { SmsTicketNumbers } from '../types'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>{i18n.t('smsTicketTitle')}</Text>
        <Text style={styles.smsInfo}>{i18n.t('smsInfo')}</Text>
        <View style={styles.buttonFullWidth}>
          <Button
            style={styles.ticketButton}
            title={i18n.t('ticket40')}
            onPress={() => handleSend(SmsTicketNumbers.ticket40min)}
            isFullWidth
            size="large"
          />
        </View>
        <View style={styles.buttonFullWidth}>
          <Button
            style={styles.ticketButton}
            title={i18n.t('ticket70')}
            onPress={() => handleSend(SmsTicketNumbers.ticket70min)}
            isFullWidth
            size="small"
          />
        </View>
        <View style={styles.buttonFullWidth}>
          <Button
            style={styles.ticketButton}
            title={i18n.t('ticketDay')}
            onPress={() => handleSend(SmsTicketNumbers.ticket24hours)}
            isFullWidth
            size="small"
          />
        </View>
        <View style={styles.separator}></View>
        <Text style={styles.smsInfo}>
          {i18n.t('ticketDuplicateDescription')}
        </Text>
        <View style={[styles.buttonFullWidth, { marginHorizontal: 71 }]}>
          <Button
            style={styles.ticketButton}
            title={i18n.t('ticketDuplicate')}
            onPress={() => handleSend(SmsTicketNumbers.ticketDuplicate)}
            isFullWidth
            size="small"
            variant="secondary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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
  ticketButton: {
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    // fontWeight: '500',
    // fontSize: 22,
    // lineHeight: 26,
  },
  separator: {
    // marginTop: 45,
    // marginBottom: 22,
    borderBottomWidth: 1,
    width: '60%',
  },
})
