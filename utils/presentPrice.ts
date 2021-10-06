import i18n from 'i18n-js'

export const presentPrice = (price: number /* in cents */) => {
  return i18n.t('presentPrice', { price: (price / 100).toFixed(2) })
}
