import React from 'react'
import { ColorSchemeName, View } from 'react-native'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import i18n from 'i18n-js'

import { BottomTabParamList, RootStackParamList } from '@types'
import { linking } from '@utils'

import NotFoundScreen from '@screens/NotFoundScreen'
import SettingsScreen from '@screens/SettingsScreen'
import TicketsScreen from '@screens/TicketsScreen'
import MapScreen from '@screens/MapScreen'

import HomeSearchSvg from '@icons/home-search.svg'
import TicketSvg from '@icons/ticket-alt.svg'
import BurgerMenuSvg from '@icons/burger-menu.svg'

import TabBar from './_partials/TabBar'

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
}

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="Map"
      tabBarOptions={{
        activeTintColor: '#FD4344',
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <BottomTab.Screen
        name="Tickets"
        component={TicketsScreen}
        options={{
          title: i18n.t('tickets'),
          tabBarIcon: TicketSvg,
        }}
      />
      <BottomTab.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: i18n.t('searching'),
          tabBarIcon: HomeSearchSvg,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: i18n.t('settings'),
          tabBarIcon: BurgerMenuSvg,
        }}
      />
    </BottomTab.Navigator>
  )
}

const Stack = createStackNavigator<RootStackParamList>()

const Navigation = ({ colorScheme }: { colorScheme: ColorSchemeName }) => {
  return (
    <NavigationContainer linking={linking} theme={Theme}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <SafeAreaView style={{ flex: 1 }} edges={['right', 'bottom', 'left']}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Root" component={BottomTabNavigator} />
            <Stack.Screen
              name="NotFound"
              component={NotFoundScreen}
              options={{ title: 'Oops!' }}
            />
          </Stack.Navigator>
        </SafeAreaView>
      </View>
    </NavigationContainer>
  )
}

export default Navigation
