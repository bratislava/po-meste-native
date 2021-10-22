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

import TicketsScreen from '@screens/TicketsScreen'
import MapScreen from '@screens/MapScreen'
import TabTwoScreen from '@screens/TabTwoScreen'
import {
  BottomTabParamList,
  TicketsParamList,
  MapParamList,
  TabTwoParamList,
} from '../types'
import SmsScreen from '@screens/SmsScreen'
import FromToScreen from '@screens/FromToScreen'
import PlannerScreen from '@screens/PlannerScreen'
import LineTimeline from '@screens/LineTimeline'
import { GlobalStateContext } from '@screens/ui/VehicleBar/GlobalStateProvider'
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
        component={TabTwoNavigator}
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
        name="TabTwo"
        component={TicketsNavigator}
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
      <TicketsStack.Screen
        name="TicketsScreen"
        component={TicketsScreen}
        options={{ headerTitle: i18n.t('tabOneTitle'), headerShown: false }}
      />
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
        options={{ headerTitle: i18n.t('tabOneTitle'), headerShown: false }}
      />
      <MapStack.Screen
        name="FromToScreen"
        component={FromToScreen}
        options={{ headerTitle: i18n.t('tabOneTitle'), headerShown: false }}
      />
      <MapStack.Screen
        name="PlannerScreen"
        component={PlannerScreen}
        options={{ headerTitle: i18n.t('tabOneTitle') }}
      />
      <MapStack.Screen
        name="LineTimeline"
        component={LineTimeline}
        options={{
          headerTitle: i18n.t('lineTimeline', {
            lineNumber: globalstateContext.timeLineNumber,
          }),
        }}
      />
      <MapStack.Screen
        name="Timetable"
        component={Timetable}
        options={{
          headerTitle: i18n.t('timetable', {
            lineNumber: globalstateContext.timeLineNumber,
          }),
        }}
      />
      <MapStack.Screen name="ChooseLocation" component={ChooseLocation} />
      <MapStack.Screen
        name="Feedback"
        component={Feedback}
        options={{ headerShown: false }}
      />
    </MapStack.Navigator>
  )
}

const TabTwoStack = createStackNavigator<TabTwoParamList>()

function TabTwoNavigator() {
  return (
    <TabTwoStack.Navigator screenOptions={{ headerShown: false }}>
      <TabTwoStack.Screen name="TabTwoScreen" component={TabTwoScreen} />
      <TabTwoStack.Screen name="SmsScreen" component={SmsScreen} />
    </TabTwoStack.Navigator>
  )
}
