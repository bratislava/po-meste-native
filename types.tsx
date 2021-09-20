/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { LegProps } from './utils/validation'

export type RootStackParamList = {
  Root: undefined
  NotFound: undefined
}

export type BottomTabParamList = {
  Map: undefined
  TabTwo: undefined
}

export type MapParamList = {
  MapScreen: undefined
  FromToScreen: { from: { name: string; latitude: number; longitude: number } }
  PlannerScreen: { legs: LegProps[] }
  LineTimeline: undefined
  Timetable: undefined
  ChooseLocation: {
    latitude?: number
    longitude?: number
    onConfirm: (latitude?: number, longitude?: number) => void
  }
}

export type TabTwoParamList = {
  TabTwoScreen: undefined
  SmsScreen: undefined
}

export enum SmsTicketNumbers {
  ticket40min = '1140',
  ticket70min = '1100',
  ticket24hours = '1124',
  ticketDuplicate = '1101',
}

export enum VehicleType {
  mhd = 'mhd',
  bicycle = 'bicycle',
  scooter = 'scooter',
  chargers = 'chargers',
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
