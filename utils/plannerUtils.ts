import {
  ItinerariesWithProvider,
  LegModes,
  MicromobilityProvider,
  TravelModes,
} from '@types'
import {
  getMhdTicketPrice,
  getMicromobilityPrice,
  IteneraryProps,
} from '@utils'

export const getMinMaxDuration = (itineraries: ItinerariesWithProvider[]) => {
  let min = Infinity
  let max = -Infinity
  for (let i = 0; i < itineraries.length; i++) {
    for (let j = 0; j < itineraries[i].itineraries.length; j++) {
      const duration = itineraries[i].itineraries[j].duration
      if (duration && duration > max) max = duration
      if (duration && duration < min) min = duration
    }
  }
  return { min, max }
}

/** Get price in cents (€) from an itinerary */
export const getPriceFromItinerary = (
  itinerary: IteneraryProps,
  travelMode: TravelModes,
  provider?: MicromobilityProvider
): number => {
  if (
    travelMode === TravelModes.walk ||
    ((travelMode === TravelModes.bicycle ||
      travelMode === TravelModes.scooter) &&
      !provider)
  ) {
    return 0
  }
  let legModesPredicate: ((mode: LegModes) => boolean) | undefined = undefined
  switch (travelMode) {
    case TravelModes.mhd:
      legModesPredicate = (mode: LegModes) =>
        mode === LegModes.bus || mode === LegModes.tram
      break
    case TravelModes.bicycle:
      legModesPredicate = (mode: LegModes) => mode === LegModes.bicycle
      break
    case TravelModes.scooter:
      legModesPredicate = (mode: LegModes) => mode === LegModes.bicycle
      break
  }
  const legs = itinerary.legs?.concat()
  const firstStop = legs?.find((leg) =>
    legModesPredicate && leg.mode ? legModesPredicate(leg.mode) : true
  )
  if (!firstStop?.duration) {
    return 0
  }
  const originalDuration = Math.ceil(firstStop?.duration / 60)
  if (provider) {
    const providerPrice = getMicromobilityPrice(provider)
    return (
      (providerPrice.unlockPrice ?? 0) +
      Math.ceil(originalDuration / providerPrice.interval) * providerPrice.price
    )
  }
  const lastStop = legs
    ?.reverse()
    .find((leg) => leg.mode === LegModes.bus || LegModes.tram)
  if (!firstStop?.startTime || !lastStop?.endTime) {
    return 0
  }
  const duration = (lastStop?.endTime - +firstStop?.startTime) / 1000 / 60
  if (travelMode === TravelModes.mhd) {
    return getMhdTicketPrice(duration)
  }
  return 0
}

export const getMinMaxPrice = (
  itineraries: ItinerariesWithProvider[],
  travelMode: TravelModes
) => {
  let min = Infinity
  let max = -Infinity
  for (let i = 0; i < itineraries.length; i++) {
    for (let j = 0; j < itineraries[i].itineraries.length; j++) {
      const price = getPriceFromItinerary(
        itineraries[i].itineraries[j],
        travelMode,
        itineraries[i].provider
      )
      if (price && price > max) max = price
      if (price && price < min) min = price
    }
  }
  return { min, max }
}
