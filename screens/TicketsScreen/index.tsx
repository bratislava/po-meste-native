import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { TicketsParamList } from '@types'

import SMSScreen from './SMSScreen'
import { Header } from '@components/layout/Header'

const Stack = createStackNavigator<TicketsParamList>()

export const TicketsScreenNavigation = () => {
  return (
    <Stack.Navigator
      headerMode="screen"
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    >
      <Stack.Screen
        name="SMSScreen"
        component={SMSScreen}
        options={{ headerLeft: () => null }}
      />
    </Stack.Navigator>
  )
}

export default TicketsScreenNavigation
