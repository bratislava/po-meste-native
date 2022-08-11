import i18n from 'i18n-js'
import React from 'react'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view'

import { colors, MhdStopProps } from '@utils'

import Timetables from './_partials/Timetables'
import UpcomingDepartures from './_partials/UpcomingDepartures'

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
    {
      key: Routes.upcomingDepartures,
      title: i18n.t('screens.MapScreen.upcomingDepartures'),
    },
    { key: Routes.timetables, title: i18n.t('screens.MapScreen.timetables') },
  ]

  const renderScene = ({
    route,
  }: SceneRendererProps & {
    route: Route
  }) => {
    switch (route.key) {
      case Routes.upcomingDepartures:
        return <UpcomingDepartures station={station} />
      case Routes.timetables:
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
    borderBottomWidth: 5,
  },
  tabBarIndicator: { display: 'none' },
  tabBarTab: {
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'stretch',
    padding: 0,
    height: 34,
  },
  tabBarTabLabel: {
    backgroundColor: 'transparent',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tabBarTabLabelFocused: {
    backgroundColor: colors.primary,
  },
  tabBarTabLabelText: {
    textTransform: 'uppercase',
    color: colors.darkText,
    lineHeight: 16,
    marginBottom: 6,
  },
  tabBarTabLabelTextFocused: {
    color: 'white',
  },
})

export default StationMhdInfo
