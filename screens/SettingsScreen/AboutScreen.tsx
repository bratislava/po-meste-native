import React from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import Constants from 'expo-constants'
import { openURL } from 'expo-linking'

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
  const generalTermsAndConditionsLink =
    Constants.manifest?.extra?.generalTermsAndConditionsLink

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, paddingBottom: 55 }}>
      <Header text="O aplikácii" />
      {/* <View style={{ backgroundColor: 'lightblue', flex: 1 }}></View> */}
      <ScrollView>
        <View style={styles.bodyContainer}>
          <View style={styles.logoContainer}>
            <AppLogo width={96} height={96} />
          </View>
          <Text style={styles.versionText}>
            Verzia {Constants.manifest?.version || '1.0.0'}
          </Text>
          <Text style={styles.appName}>
            {Constants.manifest?.name || 'Po meste'}
          </Text>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat,
            rerum voluptate a vitae eligendi inventore officiis delectus, earum
            repudiandae asperiores ea, reprehenderit exercitationem corporis
            accusamus voluptatum ut quia explicabo itaque!
          </Text>
        </View>
        <Footer>
          <View style={styles.footerContainer}>
            <Text style={styles.footerLabel}>Kontakt</Text>
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
              title="Všeobecné obchodné podmienky"
            />
            <Text style={styles.footerLabel}>Powered by</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <View style={{ maxWidth: 120, alignItems: 'center', margin: 10 }}>
                <InovationBratislavaLogo width={48} height={48} />
                <Text style={{ textAlign: 'center', marginTop: 5 }}>
                  Inovácie mesta Bratislava
                </Text>
              </View>
              <View style={{ maxWidth: 120, alignItems: 'center', margin: 10 }}>
                <EuropeanUnionLogo width={64} height={48} />
                <Text style={{ textAlign: 'center', marginTop: 5 }}>
                  Co-funded by the European Union
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
})

export default AboutScreen
