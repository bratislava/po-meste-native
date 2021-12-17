/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import React, { useContext } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import i18n from 'i18n-js'

import HomeSearchSvg from '@icons/home-search.svg'
import TicketSvg from '@icons/ticket-alt.svg'
import BurgerMenuSvg from '@icons/burger-menu.svg'

import SettingsScreen from '@screens/SettingsScreen'
import MapScreen from '@screens/MapScreen'
import { BottomTabParamList, MapParamList } from '@types'
import TicketsScreen from '@screens/TicketsScreen'
import FromToScreen from '@screens/MapScreen/FromToScreen'
import PlannerScreen from '@screens/MapScreen/PlannerScreen'
import LineTimelineScreen from '@screens/MapScreen/LineTimelineScreen'
import LineTimetableScreen from '@screens/MapScreen/LineTimetableScreen'
import ChooseLocationScreen from '@screens/MapScreen/ChooseLocationScreen'
import FeedbackScreen from '@screens/FeedbackScreen'
import { GlobalStateContext } from '@components/common/GlobalStateProvider'

import TabBar from '../_partials/TabBar'
import { Header } from '@components/layout/Header'

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
        component={TicketsScreen}
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
        component={SettingsScreen}
        options={{
          title: i18n.t('settings'),
          tabBarIcon: BurgerMenuSvg,
        }}
      />
    </BottomTab.Navigator>
  )
}

const MapStack = createStackNavigator<MapParamList>()

function MapNavigator() {
  const globalstateContext = useContext(GlobalStateContext)
  return (
    <MapStack.Navigator
      headerMode="screen"
      screenOptions={{
        header: (props) => <Header {...props} />,
      }}
    >
      <MapStack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <MapStack.Screen
        name="FromToScreen"
        component={FromToScreen}
        options={{
          header: (props) => <Header {...props} borderShown={false} />,
        }}
      />
      <MapStack.Screen name="PlannerScreen" component={PlannerScreen} />
      <MapStack.Screen
        name="LineTimelineScreen"
        component={LineTimelineScreen}
        options={{
          title: i18n.t('screens.LineTimelineScreen.screenTitle', {
            lineNumber: globalstateContext.timeLineNumber,
          }),
        }}
      />
      <MapStack.Screen
        name="LineTimetableScreen"
        component={LineTimetableScreen}
        options={{
          title: i18n.t('screens.LineTimetableScreen.screenTitle', {
            lineNumber: globalstateContext.timeLineNumber,
          }),
        }}
      />
      <MapStack.Screen
        name="ChooseLocationScreen"
        component={ChooseLocationScreen}
      />
      <MapStack.Screen name="FeedbackScreen" component={FeedbackScreen} />
    </MapStack.Navigator>
  )
}
