/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import React, { useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import i18n from 'i18n-js'

import HomeSearchSvg from '@images/home-search.svg'
import TicketSvg from '@images/ticket-alt.svg'
import BurgerMenuSvg from '@images/burger-menu.svg'

import SettingsScreen from '@screens/SettingsScreen'
import MapScreen from '@screens/MapScreen'
import {
  BottomTabParamList,
  TicketsParamList,
  MapParamList,
  SettingsParamList,
} from '../types'
import SmsScreen from '@screens/SmsScreen'
import FromToScreen from '@screens/FromToScreen'
import PlannerScreen from '@screens/PlannerScreen'
import LineTimeline from '@screens/LineTimeline'
import { GlobalStateContext } from '@components/common/GlobalStateProvider'
import Timetable from '@screens/Timetable'
import ChooseLocation from '@screens/ChooseLocation'
import Feedback from '@screens/FeedbackScreen'

import TabBar from './TabBar'

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

export default function BottomTabNavigator() {
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
        component={TicketsNavigator}
        options={{
          title: i18n.t('tickets'),
          tabBarIcon: TicketSvg,
        }}
      />
      <BottomTab.Screen
        name="Map"
        component={MapNavigator}
        options={{
          title: i18n.t('searching'),
          tabBarIcon: HomeSearchSvg,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          title: i18n.t('settings'),
          tabBarIcon: BurgerMenuSvg,
        }}
      />
    </BottomTab.Navigator>
  )
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TicketsStack = createStackNavigator<TicketsParamList>()

function TicketsNavigator() {
  return (
    <TicketsStack.Navigator screenOptions={{}}>
      <TicketsStack.Screen name="SmsScreen" component={SmsScreen} />
    </TicketsStack.Navigator>
  )
}

const MapStack = createStackNavigator<MapParamList>()

function MapNavigator() {
  const globalstateContext = useContext(GlobalStateContext)
  return (
    <MapStack.Navigator screenOptions={{}}>
      <MapStack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <MapStack.Screen
        name="FromToScreen"
        component={FromToScreen}
        options={{
          headerTitle: i18n.t('fromToScreenTitle'),
        }}
      />
      <MapStack.Screen
        name="PlannerScreen"
        component={PlannerScreen}
        options={{ headerTitle: i18n.t('plannerTitle') }}
      />
      <MapStack.Screen
        name="LineTimeline"
        component={LineTimeline}
        options={{
          headerTitle: i18n.t('lineTimelineTitle', {
            lineNumber: globalstateContext.timeLineNumber,
          }),
        }}
      />
      <MapStack.Screen
        name="Timetable"
        component={Timetable}
        options={{
          headerTitle: i18n.t('timetableTitle', {
            lineNumber: globalstateContext.timeLineNumber,
          }),
        }}
      />
      <MapStack.Screen
        name="ChooseLocation"
        component={ChooseLocation}
        options={{ headerTitle: i18n.t('chooseLocationTitle') }}
      />
      <MapStack.Screen
        name="Feedback"
        component={Feedback}
        options={{ headerTitle: i18n.t('feedbackTitle') }}
      />
    </MapStack.Navigator>
  )
}

const TabTwoStack = createStackNavigator<SettingsParamList>()

function SettingsNavigator() {
  return (
    <TabTwoStack.Navigator screenOptions={{ headerShown: false }}>
      <TabTwoStack.Screen name="SettingsScreen" component={SettingsScreen} />
    </TabTwoStack.Navigator>
  )
}
