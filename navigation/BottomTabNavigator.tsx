/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import i18n from 'i18n-js'

import MapSvg from '../assets/images/map.svg'
import TicketSvg from '../assets/images/ticket.svg'
import MapScreen from '../screens/MapScreen'
import TabTwoScreen from '../screens/TabTwoScreen'
import { BottomTabParamList, MapParamList, TabTwoParamList } from '../types'
import SmsScreen from '../screens/SmsScreen'
import FromToScreen from '../screens/FromToScreen'

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Map"
      tabBarOptions={{ activeTintColor: '#FD4344' }}
    >
      <BottomTab.Screen
        name="Map"
        component={MapNavigator}
        options={{
          title: i18n.t('map'),
          // eslint-disable-next-line react/prop-types
          tabBarIcon: ({ color }) => <MapSvg fill={color} />,
        }}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoNavigator}
        options={{
          title: i18n.t('tabTwo'),
          // eslint-disable-next-line react/prop-types
          tabBarIcon: ({ color }) => <TicketSvg fill={color} />,
        }}
      />
    </BottomTab.Navigator>
  )
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const MapStack = createStackNavigator<MapParamList>()

function MapNavigator() {
  return (
    <MapStack.Navigator screenOptions={{ headerShown: false }}>
      <MapStack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ headerTitle: i18n.t('tabOneTitle') }}
      />
      <MapStack.Screen
        name="FromToScreen"
        component={FromToScreen}
        options={{ headerTitle: i18n.t('tabOneTitle') }}
      />
    </MapStack.Navigator>
  )
}

const TabTwoStack = createStackNavigator<TabTwoParamList>()

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator screenOptions={{ headerShown: false }}>
      <TabTwoStack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ headerTitle: i18n.t('tabTwoTitle') }}
      />
      <TabTwoStack.Screen
        name="SmsScreen"
        component={SmsScreen}
        options={{ headerTitle: i18n.t('smsTicketTitle') }}
      />
    </TabTwoStack.Navigator>
  )
}
