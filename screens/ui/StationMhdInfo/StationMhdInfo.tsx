import React from 'react'
import { Text, View, StyleSheet, useWindowDimensions } from 'react-native'

import { MhdStopProps } from '../../../utils/validation'

import UpcomingDepartures from './UpcomingDepartures'
import Timetables from './Timetables'

import {
  TabView,
  TabBar,
  SceneRendererProps,
  NavigationState,
  Route,
} from 'react-native-tab-view'
import { colors } from '../../../utils/theme'

const renderTabBar = (
  props: SceneRendererProps & { navigationState: NavigationState<Route> }
) => (
  <TabBar
    {...props}
    indicatorStyle={{ display: 'none' }}
    style={{
      borderBottomColor: colors.primary,
      borderBottomWidth: 2,
    }}
    tabStyle={{
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'stretch',
      padding: 0,
      height: 36,
    }}
    renderLabel={({ route, focused }) => (
      <View
        style={{
          backgroundColor: focused ? colors.primary : 'transparent',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        }}
      >
        <Text
          style={{
            textTransform: 'uppercase',
            color: focused ? 'white' : colors.darkText,
            position: 'absolute',
            top: 12,
          }}
        >
          {route.title}
        </Text>
      </View>
    )}
  />
)

interface StationMhdInfoProps {
  station: MhdStopProps
}

const StationMhdInfo = ({ station }: StationMhdInfoProps) => {
  const layout = useWindowDimensions()
  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'upcomingDepartures', title: 'Upcoming Departures' },
    { key: 'timetables', title: 'Timetables' },
  ])

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
  },
})

export default StationMhdInfo
