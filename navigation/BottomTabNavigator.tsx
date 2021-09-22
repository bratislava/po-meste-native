/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import React, { useContext } from 'react'
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native'
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import i18n from 'i18n-js'

import HomeSearchSvg from '../assets/images/home-search.svg'
import TicketSvg from '../assets/images/ticket-alt.svg'
import BurgerMenuSvg from '../assets/images/burger-menu.svg'

import TicketsScreen from '../screens/TicketsScreen'
import MapScreen from '../screens/MapScreen'
import TabTwoScreen from '../screens/TabTwoScreen'
import {
  BottomTabParamList,
  TicketsParamList,
  MapParamList,
  TabTwoParamList,
} from '../types'
import SmsScreen from '../screens/SmsScreen'
import FromToScreen from '../screens/FromToScreen'
import PlannerScreen from '../screens/PlannerScreen'
import LineTimeline from '../screens/LineTimeline'
import { GlobalStateContext } from '../screens/ui/VehicleBar/GlobalStateProvider'
import Timetable from '../screens/Timetable'
import ChooseLocation from '../screens/ChooseLocation'

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
        options={{ title: i18n.t('tickets'), tabBarIcon: TicketSvg }}
      />
      <BottomTab.Screen
        name="Map"
        component={MapNavigator}
        options={{ title: i18n.t('searching'), tabBarIcon: HomeSearchSvg }}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoNavigator}
        options={{ title: i18n.t('settings'), tabBarIcon: BurgerMenuSvg }}
      />
    </BottomTab.Navigator>
  )
}

const shadow = {
  shadowColor: '#000',
  shadowRadius: 5,
  shadowOpacity: 0.2,
}

const styles = StyleSheet.create({
  tabBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 55,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    ...shadow,
  },
  tabWrapper: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  tabShadow: {
    width: 80,
    height: 80,
    position: 'absolute',
    top: 1,
    backgroundColor: '#fff',
    borderRadius: 40,
    ...shadow,
  },
  tabBackground: {
    width: 95,
    height: 80,
    position: 'absolute',
    top: 12.5,
    left: -10,
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 2,
    width: 80,
    height: 80,
  },
})

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name

        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          })
        }

        return (
          <TouchableWithoutFeedback
            key={index}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            <View style={styles.tabWrapper}>
              <View
                style={{
                  ...styles.tabShadow,
                  opacity: isFocused ? 1 : 0,
                }}
              />
              <View style={styles.tabBackground} />
              <View style={styles.tab}>
                <options.tabBarIcon fill={isFocused ? '#FD4344' : 'gray'} />
                <Text>{label}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )
      })}
    </View>
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
        options={{ headerTitle: i18n.t('tabOneTitle') }}
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
