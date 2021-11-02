import i18n from 'i18n-js'

export const presentPrice = (price: number /* in cents */) => {
  return i18n.t('presentPrice', { price: (price / 100).toFixed(2) })
}

export const dateStringRegex =
  /^(?:[2]\d\d\d)-(?:[0]\d|1[012])-(?:0[1-9]|[12]\d|3[01])$/
export const timeStringRegex =
  /^(?:[01]\d|2[0123]):(?:[012345]\d):(?:[012345]\d)$/
export const colorRegex = /^([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
export const validateTime = (time: string) => {
  if (!time.match(timeStringRegex)) return 'errEmailNotValid'
  return null
}
