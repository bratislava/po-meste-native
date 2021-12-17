import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import { QueryClient, QueryClientProvider } from 'react-query'
import * as Location from 'expo-location'
import Constants from 'expo-constants'
import * as Sentry from 'sentry-expo'
import { AppState, AppStateStatus, LogBox, Platform } from 'react-native'
import { focusManager } from 'react-query'

import { useCachedResources, useColorScheme } from '@hooks'
import { GlobalStateProvider } from '@components'
import Navigation from '@screens/index'

import * as translations from './translations'

i18n.translations = translations

i18n.locale = Localization.locale?.split('-')[0]
i18n.fallbacks = true

i18n.pluralization['sk'] = function (count) {
  const key =
    count === 0
      ? 'zero'
      : count === 1
      ? 'one'
      : [2, 3, 4].indexOf(count) >= 0
      ? 'few'
      : 'many'
  return [key]
}

Sentry.init({
  dsn: 'https://939d2a9ea74b4121be8ba1e2e984a0b1@o701870.ingest.sentry.io/5993278', //found in Settings > Client Keys tab
  enableInExpoDevelopment: true,
  debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
})

LogBox.ignoreLogs(['Setting a timer']) // https://github.com/tannerlinsley/react-query/issues/1259#issuecomment-799630607
const queryClient = new QueryClient()

Location.setGoogleApiKey(
  Platform.select({
    ios: Constants.manifest?.extra?.googleIOsApiKey,
    android: Constants.manifest?.extra?.googleAndroidApiKey,
  })
)

focusManager.setEventListener((handleFocus) => {
  const focusOnActiveStatus = (state: AppStateStatus) => {
    if (state === 'active') {
      return handleFocus(true)
    } else {
      return handleFocus(false)
    }
  }
  AppState.addEventListener('change', focusOnActiveStatus)

  return () => {
    AppState.removeEventListener('change', focusOnActiveStatus)
  }
})

export default function App() {
  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <GlobalStateProvider>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </SafeAreaProvider>
        </QueryClientProvider>
      </GlobalStateProvider>
    )
  }
}
