import AsyncStorage from '@react-native-async-storage/async-storage'
import { PrefferedLanguage } from '../types'

export const loadPrefferedLanguageFromAsyncStorage =
  async (): Promise<PrefferedLanguage> => {
    try {
      const value = await AsyncStorage.getItem('preffered-language')
      if (
        value !== null &&
        (value == PrefferedLanguage.auto ||
          value == PrefferedLanguage.en ||
          value == PrefferedLanguage.sk)
      ) {
        return value
      }
    } catch (e) {
      console.error('ERROR: Load preffered language')
      return PrefferedLanguage.auto
    }
    return PrefferedLanguage.auto
  }

export const savePrefferedLanguageToAsyncStorage = async (
  language: PrefferedLanguage
) => {
  try {
    await AsyncStorage.setItem('preffered-language', language)
  } catch (e) {
    console.error('ERROR: Save preffered language')
  }
}
