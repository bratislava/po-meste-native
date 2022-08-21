/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {
  GooglePlaceData,
  GooglePlaceDetail,
} from 'react-native-google-places-autocomplete'
import { SvgProps } from 'react-native-svg'
import { LegProps } from './utils/validation'

export type TicketName = 'ticket40min' | 'ticket70min' | 'ticket24hours'

export enum TravelModes {
  mhd = 'MHD',
  bicycle = 'BICYCLE',
  scooter = 'SCOOTER',
  walk = 'WALK',
}

export enum TravelModesOtpApi {
  transit = 'TRANSIT,WALK',
  bicycle = 'BICYCLE',
  rented = 'WALK,BICYCLE_RENT',
  scooter = 'BICYCLE',
  walk = 'WALK',
}

export enum LegModes {
  tram = 'TRAM',
  bus = 'BUS',
  walk = 'WALK',
  bicycle = 'BICYCLE',
  scooter = '',
}

export enum ChargerStatus {
  busy = 'BUSY',
  available = 'AVAILABLE',
  disconnected = 'DISCONNECTED',
}

export enum ChargerTypes {
  chademo = 'CHAdeMO',
  mennekes = 'Mennekes Type 2',
  ccs = 'CCS',
}

export type VehicleData = {
  mode: TravelModes
  icon: React.FC<SvgProps>
  estimatedTimeMin: number | undefined
  estimatedTimeMax: number | undefined
  priceMin: number | undefined
  priceMax: number | undefined
}

export type RootStackParamList = {
  Root: undefined
  NotFound: undefined
}

export type BottomTabParamList = {
  Tickets: undefined
  Map: undefined
  Settings: undefined
}

export type TicketsParamList = {
  SMSScreen: undefined
}

export type MapParamList = {
  MapScreen: undefined
  FromToScreen: {
    from: { name: string; latitude: number; longitude: number }
    to: { name: string; latitude: number; longitude: number }
  }
  PlannerScreen: {
    legs: LegProps[]
    provider?: MicromobilityProvider
    isScooter?: boolean
    travelMode: TravelModes
  }
  LineTimelineScreen: { tripId: string; stopId: string }
  LineTimetableScreen: { stopId: string; lineNumber: string }
  ChooseLocationScreen: {
    latitude?: number
    longitude?: number
    fromNavigation: boolean
    toNavigation: boolean
    fromCoords: { latitude: number; longitude: number }
    toCoords: { latitude: number; longitude: number }
  }
  FeedbackScreen: undefined
}

export type SettingsParamList = {
  SettingsScreen: undefined
  AboutScreen: undefined
  FAQScreen: undefined
}

export enum SmsTicketNumbers {
  ticket40min = '1140',
  ticket70min = '1100',
  ticket24hours = '1124',
  ticketDuplicate = '1101',
}

export enum SmsTicketPrices {
  ticket40min = 100,
  ticket70min = 140,
  ticket24hours = 450,
}

export enum VehicleType {
  mhd = 'mhd',
  bicycle = 'bicycle',
  scooter = 'scooter',
  chargers = 'chargers',
  motorScooters = 'motorScooters',
  cars = 'cars',
}

export enum TimetableType {
  workDays = 'workDays',
  weekend = 'weekend',
  holidays = 'holidays',
}

export enum BikeProvider {
  rekola = 'rekola',
  slovnaftbajk = 'slovnaftbajk',
}

export enum MicromobilityProvider {
  rekola = 'Rekola',
  slovnaftbajk = 'Slovnaftbajk',
  tier = 'TIER',
  bolt = 'Bolt',
}

export enum TransitVehicleType {
  tram = '0',
  trolleybus = '800',
  bus = '3',
}

export enum IconType {
  mhd = 'mhd',
  tier = 'tier',
  slovnaftbajk = 'slovnaftbajk',
  rekola = 'rekola',
  zse = 'zse',
  bolt = 'bolt',
}

export enum ScheduleType {
  departure = 'departure',
  arrival = 'arrival',
}

export enum PreferredLanguage {
  en = 'en',
  sk = 'sk',
  auto = 'auto',
}

export type Departure = {
  lineNumber: string
  lineColor: string
  usualFinalStop?: string
  vehicleType?: TransitVehicleType
}

export type FavoritePlace = {
  id: string
  name: string
  isHardSetName?: boolean
  icon?: 'home' | 'work' | 'heart'
  placeData?: GooglePlaceData
  placeDetail?: GooglePlaceDetail
}

export type FavoriteStop = {
  placeData?: GooglePlaceData
  placeDetail?: GooglePlaceDetail
}

export type HistoryItem = FavoritePlace | FavoriteStop

export type FavoriteData = {
  favoritePlaces: FavoritePlace[]
  favoriteStops: FavoriteStop[]
  history: HistoryItem[]
}
