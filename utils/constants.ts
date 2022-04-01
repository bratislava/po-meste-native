import i18n from 'i18n-js'

export const STYLES = {
  borderRadius: 7,
}

export const rekolaPrice = {
  price: 100,
  duration: 30,
  unit: { translate: false, text: 'min' },
  translationOption: 'screens.MapScreen.micromobilityPriceFrom',
}
export const slovnaftbajkPrice = {
  price: 600,
  duration: 1,
  unit: { translate: true, text: 'screens.MapScreen.dailyTicket' },
  translationOption: 'screens.MapScreen.micromobilityPriceFrom',
}
export const tierPrice = {
  unlockPrice: 100,
  price: 19,
  duration: 1,
  unit: { translate: false, text: 'min' },
  translationOption: 'screens.MapScreen.micromobilityWithUnlockPriceFrom',
}

export const modeColors = {
  WALK: '#444',
  BICYCLE: '#0073e5',
  BUS: '#080',
  TRAM: '#800',
  DEFAULT: '#aaa',
}

export const trolleybusLineNumbers = [
  33, 40, 42, 44, 45, 47, 48, 49, 60, 64, 71, 72,
]

export const API_ERROR_TEXT = 'ApiErrorText'
