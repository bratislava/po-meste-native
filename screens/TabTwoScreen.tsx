import { useNavigation } from '@react-navigation/native'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Button from '../components/Button'

import EditScreenInfo from '../components/EditScreenInfo'

export default function TabTwoScreen() {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} />
      <EditScreenInfo path="/screens/TabTwoScreen.tsx" />
      <Button title={'sms'} onPress={() => navigation.navigate('SmsScreen')} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
