import { colors } from '@utils/theme'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabBar,
  TabView as ReactTabView,
  TabViewProps as ReactTabViewProps,
} from 'react-native-tab-view'

const renderTabBar = (
  props: SceneRendererProps & { navigationState: NavigationState<Route> },
  variant: 'small' | 'large'
) => {
  let index = -1
  return (
    <TabBar
      {...props}
      indicatorStyle={styles.tabBarIndicator}
      style={styles.tabBar}
      tabStyle={[
        styles.tabBarTab,
        variant === 'large' && styles.tabBarTabLarge,
      ]}
      renderLabel={({ route, focused }) => {
        const [title, subtitle] = route.title
          ? route.title.split('|')
          : ['', '']
        index++
        return (
          <View
            style={[
              styles.tabBarTabLabel,
              focused ? styles.tabBarTabLabelFocused : {},
              variant === 'large'
                ? index === 0
                  ? { borderTopLeftRadius: 0 }
                  : index > 0 //TODO: fix, very use case specific
                  ? { borderTopRightRadius: 0 }
                  : {}
                : {},
            ]}
          >
            <Text
              style={[
                styles.tabBarTabLabelTitle,
                variant === 'large' && styles.tabBarTabLabelTitleLarge,
                focused ? styles.tabBarTabLabelTextFocused : {},
              ]}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={[
                  styles.tabBarTabLabelSubtitle,
                  focused ? styles.tabBarTabLabelTextFocused : {},
                ]}
              >
                {subtitle}
              </Text>
            )}
          </View>
        )
      }}
    />
  )
}

interface TabViewProps {
  variant: 'small' | 'large'
}

const TabView = ({
  variant,
  ...props
}: ReactTabViewProps<Route> & TabViewProps) => {
  return (
    <ReactTabView
      style={{ zIndex: 0 }}
      {...props}
      renderTabBar={
        props.renderTabBar ?? ((props) => renderTabBar(props, variant))
      }
    />
  )
}

const styles = StyleSheet.create({
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
  tabBarTabLarge: {
    height: 68,
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
  tabBarTabLabelTitle: {
    textTransform: 'uppercase',
    color: colors.darkText,
    fontSize: 14,
    lineHeight: 16,
    marginBottom: 6,
  },
  tabBarTabLabelTitleLarge: {
    fontSize: 16,
    lineHeight: 19,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  tabBarTabLabelSubtitle: {
    color: colors.darkText,
    fontSize: 12,
    lineHeight: 14,
  },
  tabBarTabLabelTextFocused: {
    color: 'white',
  },
})

export default TabView
