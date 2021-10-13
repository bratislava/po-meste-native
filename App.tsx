import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import * as translations from './translations'
import { QueryClient, QueryClientProvider } from 'react-query'
import * as Location from 'expo-location'
import Constants from 'expo-constants'
import * as Sentry from 'sentry-expo'

import useCachedResources from '@hooks/useCachedResources'
import useColorScheme from '@hooks/useColorScheme'
import Navigation from '@navigation/index'
import GlobalStateProvider from '@screens/ui/VehicleBar/GlobalStateProvider'

i18n.translations = translations

i18n.locale = Localization.locale
i18n.fallbacks = true

Sentry.init({
  dsn: 'https://939d2a9ea74b4121be8ba1e2e984a0b1@o701870.ingest.sentry.io/5993278', //found in Settings > Client Keys tab
  enableInExpoDevelopment: true,
  debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
})

const queryClient = new QueryClient()

Location.setGoogleApiKey(Constants.manifest?.extra?.googlePlacesApiKey)

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
