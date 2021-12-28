import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { TicketsParamList } from '@types'
import { Header } from '@components'

import SMSScreen from './SMSScreen'

const Stack = createStackNavigator<TicketsParamList>()

export const TicketsScreenNavigation = () => {
  return (
    <Stack.Navigator
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
