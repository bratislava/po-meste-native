import * as Location from 'expo-location'
import i18n from 'i18n-js'
import { useCallback, useState } from 'react'
import {
  Alert,
  AlertButton,
  AlertOptions,
  Linking,
  Platform,
} from 'react-native'

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
  const [isDenied, setIsDenied] = useState(false)
  const getLocation = useCallback(
    async (reask = false) => {
      if (isDenied && !reask) return null
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        })
        return location
      } catch (e: any) {
        const { code } = e
        if (code === 'E_LOCATION_SETTINGS_UNSATISFIED') {
          //TODO Handle denied location permission
          setIsDenied(true)
          console.log('Denied location permission')
        }
        return null
      }
    },
    [isDenied]
  )

  const openAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:')
    } else {
      Linking.openSettings()
    }
  }

  const getLocationWithPermission = useCallback(
    async (shouldAlert: boolean, reask = false) => {
      const { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== Location.PermissionStatus.GRANTED) {
        if (shouldAlert) {
          nativeAlert(i18n.t('common.permissionLocation'), [
            {
              text: i18n.t('common.openSettings'),
              onPress: () => openAppSettings(),
            },
            {
              text: i18n.t('common.cancelLocationPermission'),
              onPress: undefined,
            },
          ])
        }
      } else {
        return getLocation(reask)
      }
      return
    },
    [getLocation]
  )
  return { getLocationWithPermission }
}
