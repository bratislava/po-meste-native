import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import i18n from 'i18n-js'

import MapScreen from '@screens/MapScreen/MapScreen'
import FromToScreen from '@screens/MapScreen/FromToScreen'
import PlannerScreen from '@screens/MapScreen/PlannerScreen'
import LineTimelineScreen from '@screens/MapScreen/LineTimelineScreen'
import LineTimetableScreen from '@screens/MapScreen/LineTimetableScreen'
import ChooseLocationScreen from '@screens/MapScreen/ChooseLocationScreen'
import FeedbackScreen from '@screens/FeedbackScreen/FeedbackScreen'
import { MapParamList } from '@types'

import { Header } from '@components'
import { GlobalStateContext } from '@state/GlobalStateProvider'

const MapStack = createStackNavigator<MapParamList>()

const MapScreenNavigation = () => {
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

export default MapScreenNavigation
