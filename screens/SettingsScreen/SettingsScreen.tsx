import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/core'
import Constants from 'expo-constants'
import { t } from 'i18n-js'
import { openURL } from 'expo-linking'
import CheckBox from 'react-native-check-box'

import { ItemListButton, Modal, Button } from '@components'
import { GlobalStateContext } from '@state/GlobalStateProvider'
import { colors } from '@utils'
import { PreferredLanguage } from '@types'

import LanguageIcon from '@icons/language.svg'
import AboutIcon from '@icons/information.svg'
import FAQIcon from '@icons/question.svg'

export const SettingsScreen = () => {
  const privacyPolicyLink = Constants.manifest?.extra?.privacyPolicyLink

  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false)
  const navigation = useNavigation()

  const { preferredLanguage, changePreferredLanguage } =
    useContext(GlobalStateContext)

  const [selectedLangugage, setSelectedLanguage] =
    useState<PreferredLanguage>(preferredLanguage)

  useEffect(() => {
    setSelectedLanguage(preferredLanguage)
  }, [preferredLanguage])

  const onLanguageModalConfirm = () => {
    setLanguageModalVisible(false)
    changePreferredLanguage(selectedLangugage)
  }

  const onLanguageModalCancel = () => {
    setLanguageModalVisible(false)
    setSelectedLanguage(preferredLanguage)
  }

  return (
    <View style={{ flex: 1, paddingBottom: useBottomTabBarHeight() }}>
      <ScrollView>
        <View style={styles.container}>
          <ItemListButton
            icon={LanguageIcon}
            text={t('screens.SettingsScreen.changeLanguage')}
            onPress={() => setLanguageModalVisible(true)}
          />
          <ItemListButton
            icon={AboutIcon}
            text={t('screens.SettingsScreen.aboutApplication')}
            onPress={() => navigation.navigate('AboutScreen')}
          />
          <ItemListButton
            icon={FAQIcon}
            text={t('screens.SettingsScreen.frequentlyAskedQuestions')}
            onPress={() => navigation.navigate('FAQScreen')}
          />
          <ItemListButton
            icon={FAQIcon}
            text={t('common.privacyPolicy')}
            onPress={() => openURL(privacyPolicyLink)}
          />
        </View>
      </ScrollView>
      <Modal visible={isLanguageModalVisible} onClose={onLanguageModalCancel}>
        <Text style={styles.modalTitle}>
          {t('screens.SettingsScreen.langugageModal.chooseLanguage')}
        </Text>
        <CheckBox
          onClick={() => setSelectedLanguage(PreferredLanguage.en)}
          isChecked={selectedLangugage == PreferredLanguage.en}
          style={styles.modalCheckbox}
          rightText="English"
          rightTextStyle={styles.modalCheckboxText}
          checkedCheckBoxColor={colors.primary}
          uncheckedCheckBoxColor={colors.gray}
        />
        <CheckBox
          onClick={() => setSelectedLanguage(PreferredLanguage.sk)}
          isChecked={selectedLangugage == PreferredLanguage.sk}
          style={styles.modalCheckbox}
          rightText="Slovenčina"
          rightTextStyle={styles.modalCheckboxText}
          checkedCheckBoxColor={colors.primary}
          uncheckedCheckBoxColor={colors.gray}
        />
        <CheckBox
          onClick={() => setSelectedLanguage(PreferredLanguage.auto)}
          isChecked={selectedLangugage == PreferredLanguage.auto}
          style={styles.modalCheckbox}
          rightText="Auto"
          rightTextStyle={styles.modalCheckboxText}
          checkedCheckBoxColor={colors.primary}
          uncheckedCheckBoxColor={colors.gray}
        />
        <Button
          style={styles.modalButton}
          onPress={onLanguageModalConfirm}
          title={t('screens.SettingsScreen.langugageModal.confirm')}
        />
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignContent: 'stretch',
    paddingTop: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
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
  modalButton: {},
})

export default SettingsScreen
