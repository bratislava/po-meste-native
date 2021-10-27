import { useCallback } from 'react'
import {
  Alert,
  Platform,
  Linking,
  AlertButton,
  AlertOptions,
} from 'react-native'
import * as Location from 'expo-location'
import i18n from 'i18n-js'

export const nativeAlert = (
  message?: string | false,
  buttons?: AlertButton[] | undefined,
  options?: AlertOptions | undefined
) => {
  if (message) {
    if (Platform.OS === 'android') {
      Alert.alert('', message, buttons, options)
    } else {
      Alert.alert(message, undefined, buttons, options)
    }
  }
}

export const useLocationWithPermision = () => {
  const getLocation = useCallback(async () => {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    })
    return location
  }, [])

  const openAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:')
    } else {
      Linking.openSettings()
    }
  }

  const getLocationWithPermission = useCallback(
    async (shouldAlert: boolean) => {
      const { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== Location.PermissionStatus.GRANTED) {
        if (shouldAlert) {
          nativeAlert(i18n.t('permissionLocation'), [
            {
              text: i18n.t('openSettings'),
              onPress: () => openAppSettings(),
            },
            {
              text: i18n.t('cancelLocationPermission'),
              onPress: undefined,
            },
          ])
        }
      } else {
        return getLocation()
      }
      return
    },
    [getLocation]
  )

  return { getLocationWithPermission }
}
