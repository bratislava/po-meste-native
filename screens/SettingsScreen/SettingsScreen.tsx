import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { SafeAreaView } from 'react-native-safe-area-context'
import { t } from 'i18n-js'

import ItemListButton from '@screens/ui/ItemListButton/ItemListButton'
import Header from '@components/Header'

import LanguageIcon from '@images/language.svg'
import AboutIcon from '@images/information.svg'
import FAQIcon from '@images/question.svg'

export const SettingsScreen = () => {
  const navigation = useNavigation()

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
      <Header text={t('screens.settingsScreen.screenTitle')} />
      <View style={styles.container}>
        <ItemListButton
          icon={LanguageIcon}
          text={t('screens.settingsScreen.changeLanguage')}
          onPress={() => {}}
        />
        <ItemListButton
          icon={AboutIcon}
          text={t('screens.settingsScreen.aboutApplication')}
          onPress={() => navigation.navigate('AboutScreen')}
        />
        <ItemListButton
          icon={FAQIcon}
          text={t('screens.settingsScreen.frequentlyAskedQuestions')}
          onPress={() => {}}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignContent: 'stretch',
    paddingTop: 20,
  },
})

export default SettingsScreen
