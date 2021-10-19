import i18n from 'i18n-js'

export const presentPrice = (price: number /* in cents */) => {
  return i18n.t('presentPrice', { price: (price / 100).toFixed(2) })
}

export const getDateTimeFromDateAndTime = (date: string, time: string) => {
  const timeSplit = time.split(':')
  const dateSplit = date.split('-')
  const arriveTime =
    dateSplit.length === 3 &&
    timeSplit.length === 3 &&
    new Date(
      parseInt(dateSplit[0]),
      parseInt(dateSplit[1]) - 1,
      parseInt(dateSplit[2]),
      parseInt(timeSplit[0]) + 2,
      parseInt(timeSplit[1]),
      parseInt(timeSplit[2])
    )
  return arriveTime
}
