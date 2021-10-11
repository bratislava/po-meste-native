import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as Localization from 'expo-localization'
import i18n from 'i18n-js'
import * as translations from './translations'
import { QueryClient, QueryClientProvider } from 'react-query'

import useCachedResources from '@hooks/useCachedResources'
import useColorScheme from '@hooks/useColorScheme'
import Navigation from '@navigation/index'
import GlobalStateProvider from '@components/GlobalStateProvider'
import * as Location from 'expo-location'
import Constants from 'expo-constants'

i18n.translations = translations

i18n.locale = Localization.locale
i18n.fallbacks = true

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
