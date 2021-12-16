import React from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import Constants from 'expo-constants'
import { openURL } from 'expo-linking'
import { t } from 'i18n-js'

import { Accordion, Link } from '@components/index'
import { colors } from '@utils/theme'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'

export const FAQScreen = () => {
  const contactEmailAddress = Constants.manifest?.extra?.contactEmailAddress

  const questions = new Array(3).fill(null).map((question, index) => {
    return {
      title: t(`screens.FAQScreen.questions.question${index + 1}.question`),
      body: t(`screens.FAQScreen.questions.question${index + 1}.answer`),
    }
  })

  return (
    <View style={{ flex: 1, paddingBottom: useBottomTabBarHeight() }}>
      <ScrollView>
        <View style={styles.bodyContainer}>
          <Accordion items={questions} />
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              {t('screens.FAQScreen.footerText')}
            </Text>
            <Link
              style={styles.link}
              onPress={() => openURL(`mailto:${contactEmailAddress}`)}
              title={contactEmailAddress}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  bodyContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  footerContainer: {
    alignItems: 'center',
    paddingBottom: 55,
  },
  footerText: {
    textAlign: 'center',
    marginTop: 20,
  },
  link: {
    color: colors.primary,
  },
})

export default FAQScreen