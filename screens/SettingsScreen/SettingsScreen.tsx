import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { SafeAreaView } from 'react-native-safe-area-context'
import { t } from 'i18n-js'

import { GlobalStateContext } from '@components/GlobalStateProvider'
import ItemListButton from '@screens/ui/ItemListButton/ItemListButton'
import Header from '@components/Header'
import LanguageIcon from '@images/language.svg'
import AboutIcon from '@images/information.svg'
import FAQIcon from '@images/question.svg'
import Modal from '@components/Modal'
import { colors } from '@utils/theme'
import Button from '@components/Button'
import CheckBox from 'react-native-check-box'
import { PrefferedLanguage } from '../../types'

export const SettingsScreen = () => {
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false)
  const navigation = useNavigation()

  const { preferredLanguage, changePrefferedLangugage } =
    useContext(GlobalStateContext)

  const [selectedLangugage, setSelectedLanguage] =
    useState<PrefferedLanguage>(preferredLanguage)

  useEffect(() => {
    setSelectedLanguage(preferredLanguage)
  }, [preferredLanguage])

  const onLanguageModalConfirm = () => {
    setLanguageModalVisible(false)
    changePrefferedLangugage(selectedLangugage)
  }

  const onLanguageModalCancel = () => {
    setLanguageModalVisible(false)
    setSelectedLanguage(preferredLanguage)
  }

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
      <Header text={t('screens.settingsScreen.screenTitle')} />
      <View style={styles.container}>
        <ItemListButton
          icon={LanguageIcon}
          text={t('screens.settingsScreen.changeLanguage')}
          onPress={() => setLanguageModalVisible(true)}
        />
        <ItemListButton
          icon={AboutIcon}
          text={t('screens.settingsScreen.aboutApplication')}
          onPress={() => navigation.navigate('AboutScreen')}
        />
        <ItemListButton
          icon={FAQIcon}
          text={t('screens.settingsScreen.frequentlyAskedQuestions')}
          onPress={() => navigation.navigate('FAQScreen')}
        />
      </View>
      <Modal visible={isLanguageModalVisible} onClose={onLanguageModalCancel}>
        <Text style={styles.modalTitle}>
          {t('screens.settingsScreen.langugageModal.chooseLanguage')}
        </Text>
        <CheckBox
          onClick={() => setSelectedLanguage(PrefferedLanguage.en)}
          isChecked={selectedLangugage == PrefferedLanguage.en}
          style={styles.modalCheckbox}
          rightText="English"
          rightTextStyle={styles.modalCheckboxText}
          checkedCheckBoxColor={colors.primary}
          uncheckedCheckBoxColor={colors.gray}
        />
        <CheckBox
          onClick={() => setSelectedLanguage(PrefferedLanguage.sk)}
          isChecked={selectedLangugage == PrefferedLanguage.sk}
          style={styles.modalCheckbox}
          rightText="Slovenčina"
          rightTextStyle={styles.modalCheckboxText}
          checkedCheckBoxColor={colors.primary}
          uncheckedCheckBoxColor={colors.gray}
        />
        <CheckBox
          onClick={() => setSelectedLanguage(PrefferedLanguage.auto)}
          isChecked={selectedLangugage == PrefferedLanguage.auto}
          style={styles.modalCheckbox}
          rightText="Auto"
          rightTextStyle={styles.modalCheckboxText}
          checkedCheckBoxColor={colors.primary}
          uncheckedCheckBoxColor={colors.gray}
        />
        <Button
          style={styles.modalButton}
          onPress={onLanguageModalConfirm}
          title={t('screens.settingsScreen.langugageModal.confirm')}
        />
      </Modal>
    </SafeAreaView>
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
