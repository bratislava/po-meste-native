import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { SettingsParamList } from '../../types'

import SettingsScreen from './SettingsScreen'
import AboutScreen from './AboutScreen'

const Stack = createStackNavigator<SettingsParamList>()

export const SettingsScreenNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
    </Stack.Navigator>
  )
}

export default SettingsScreenNavigation
