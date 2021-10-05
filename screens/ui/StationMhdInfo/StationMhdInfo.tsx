import React from 'react'
import { Text, View, StyleSheet, useWindowDimensions } from 'react-native'
import {
  TabView,
  TabBar,
  SceneRendererProps,
  NavigationState,
  Route,
} from 'react-native-tab-view'

import { MhdStopProps } from '@utils/validation'
import { colors } from '@utils/theme'

import UpcomingDepartures from './UpcomingDepartures'
import Timetables from './Timetables'

interface StationMhdInfoProps {
  station: MhdStopProps
}

enum Routes {
  upcomingDepartures = 'upcomingDepartures',
  timetables = 'timetables',
}

const renderTabBar = (
  props: SceneRendererProps & { navigationState: NavigationState<Route> }
) => (
  <TabBar
    {...props}
    indicatorStyle={styles.tabBarIndicator}
    style={styles.tabBar}
    tabStyle={styles.tabBarTab}
    renderLabel={({ route, focused }) => (
      <View
        style={[
          styles.tabBarTabLabel,
          focused ? styles.tabBarTabLabelFocused : {},
        ]}
      >
        <Text
          style={[
            styles.tabBarTabLabelText,
            focused ? styles.tabBarTabLabelTextFocused : {},
          ]}
        >
          {route.title}
        </Text>
      </View>
    )}
  />
)

const StationMhdInfo = ({ station }: StationMhdInfoProps) => {
  const layout = useWindowDimensions()
  const [index, setIndex] = React.useState(0)
  const routes = [
    { key: Routes.upcomingDepartures, title: 'Upcoming Departures' },
    { key: Routes.timetables, title: 'Timetables' },
  ]

  const renderScene = ({
    route,
  }: SceneRendererProps & {
    route: Route
  }) => {
    switch (route.key) {
      case 'upcomingDepartures':
        return <UpcomingDepartures station={station} />
      case 'timetables':
        return <Timetables station={station} />
    }
  }

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  tabBar: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
  },
  tabBarIndicator: { display: 'none' },
  tabBarTab: {
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'stretch',
    padding: 0,
    height: 36,
  },
  tabBarTabLabel: {
    backgroundColor: 'transparent',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  tabBarTabLabelFocused: {
    backgroundColor: colors.primary,
  },
  tabBarTabLabelText: {
    textTransform: 'uppercase',
    color: colors.darkText,
    position: 'absolute',
    top: 12,
  },
  tabBarTabLabelTextFocused: {
    color: 'white',
  },
})

export default StationMhdInfo
