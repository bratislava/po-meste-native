import React from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import Constants from 'expo-constants'
import { openURL } from 'expo-linking'
import { t } from 'i18n-js'

import Header from '@components/Header'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Accordion, Link } from '@components/index'

export const FAQScreen = () => {
  const questions = new Array(3).fill(null).map((question, index) => {
    return {
      title: t(`screens.faqScreen.questions.question${index + 1}.question`),
      body: t(`screens.faqScreen.questions.question${index + 1}.answer`),
    }
  })

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, paddingBottom: 50 }}>
      <Header text={t('screens.faqScreen.screenTitle')} />
      <ScrollView>
        <View style={styles.bodyContainer}>
          <Accordion items={questions} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  bodyContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
})

export default FAQScreen
