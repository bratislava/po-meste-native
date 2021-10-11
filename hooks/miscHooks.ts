import { useEffect } from 'react'
import { Alert, Platform } from 'react-native'

export const useAlert = (message?: string | false) =>
  useEffect(() => {
    if (message) {
      if (Platform.OS === 'android') {
        Alert.alert('', message)
      } else {
        Alert.alert(message)
      }
    }
  }, [message])
