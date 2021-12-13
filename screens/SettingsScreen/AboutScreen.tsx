import React from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import Constants from 'expo-constants'
import { openURL } from 'expo-linking'
import { t } from 'i18n-js'

import Header from '@components/Header'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppLogo from '@images/app-logo.svg'
import Footer from '@components/Footer'
import Link from '@components/Link'
import { colors } from '@utils/theme'

import InovationBratislavaLogo from '@images/inovation-bratislava-logo.svg'
import EuropeanUnionLogo from '@images/european-union-logo.svg'

export const AboutScreen = () => {
  const contactEmailAddress = Constants.manifest?.extra?.contactEmailAddress
  const privacyPolicyLink = Constants.manifest?.extra?.privacyPolicyLink
  const generalTermsAndConditionsLink =
    Constants.manifest?.extra?.generalTermsAndConditionsLink

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, paddingBottom: 50 }}>
      <Header text={t('screens.aboutScreen.screenTitle')} />
      <ScrollView>
        <View style={styles.bodyContainer}>
          <View style={styles.logoContainer}>
            <AppLogo width={96} height={96} />
          </View>
          <Text style={styles.versionText}>
            {t('screens.aboutScreen.version')}{' '}
            {Constants.manifest?.version || t('screens.aboutScreen.unknown')}
          </Text>
          <Text style={styles.appName}>
            {Constants.manifest?.name || 'Po meste'}
          </Text>
          <Text style={styles.description}>
            {t('screens.aboutScreen.description')}
          </Text>
        </View>
        <Footer>
          <View style={styles.footerContainer}>
            <Text style={styles.footerLabel}>
              {t('screens.aboutScreen.contact')}
            </Text>
            <Link
              style={styles.footerLink}
              onPress={() => {
                openURL(`mailto:${contactEmailAddress}`)
              }}
              title={contactEmailAddress}
            />
            <Link
              style={styles.footerLink}
              onPress={() => openURL(generalTermsAndConditionsLink)}
              title={t('screens.aboutScreen.generalTermsAndConditions')}
            />
            <Link
              style={styles.footerLink}
              onPress={() => openURL(privacyPolicyLink)}
              title={t('privacyPolicy')}
            />
            <Text style={styles.footerLabel}>
              {t('screens.aboutScreen.poweredBy')}
            </Text>
            <View style={styles.poweredByContainer}>
              <View style={styles.poweredByItem}>
                <InovationBratislavaLogo width={48} height={48} />
                <Text style={styles.poweredByItemText}>
                  {t('screens.aboutScreen.inovationsBratislava')}
                </Text>
              </View>
              <View style={styles.poweredByItem}>
                <EuropeanUnionLogo width={64} height={48} />
                <Text style={styles.poweredByItemText}>
                  {t('screens.aboutScreen.coFundedByTheEuropeanUnion')}
                </Text>
              </View>
            </View>
          </View>
        </Footer>
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
  logoContainer: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: 'black',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 5 },
    textShadowRadius: 12,
    marginBottom: 10,
  },
  versionText: {
    fontSize: 12,
    marginBottom: 40,
    textAlign: 'center',
  },
  appName: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
  },
  description: {
    marginBottom: 40,
    textAlign: 'center',
  },
  footerContainer: {
    alignItems: 'center',
  },
  footerLabel: {
    marginBottom: 5,
  },
  footerLink: {
    color: colors.primary,
    marginBottom: 20,
  },
  poweredByContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  poweredByItem: {
    maxWidth: 120,
    alignItems: 'center',
    margin: 10,
  },
  poweredByItemText: {
    textAlign: 'center',
    marginTop: 5,
  },
})

export default AboutScreen
