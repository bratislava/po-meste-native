import React from 'react'
import { View, StyleSheet } from 'react-native'
// import { StackScreenProps } from '@react-navigation/stack'
// import { MapParamList } from '../../types'
import LanguageIcon from '@images/language.svg'
import AboutIcon from '@images/information.svg'
import FAQIcon from '@images/question.svg'

import ItemListButton from '@screens/ui/ItemListButton/ItemListButton'
import Header from '@components/Header'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/core'

export const SettingsScreen = () => {
  //props: StackScreenProps<MapParamList, 'Timetable'>

  const navigation = useNavigation()

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: 'white' }}>
      <Header text="Nastavenia" />
      <View style={styles.container}>
        <ItemListButton
          icon={LanguageIcon}
          text="Zmena jazyka"
          onPress={() => {}}
        />
        <ItemListButton
          icon={AboutIcon}
          text="O aplikácii"
          onPress={() => navigation.navigate('AboutScreen')}
        />
        <ItemListButton
          icon={FAQIcon}
          text="Často kladené otázky"
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
