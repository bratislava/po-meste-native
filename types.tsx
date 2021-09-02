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
  FromToScreen: undefined
  PlannerScreen: { legs: LegProps[] }
  LineTimeline: undefined
}

export type TabTwoParamList = {
  TabTwoScreen: undefined
  SmsScreen: undefined
}

export const enum SmsTicketNumbers {
  ticket40min = '1140',
  ticket70min = '1100',
  ticket24hours = '1124',
  ticketDuplicate = '1101',
}

export const enum VehicleType {
  mhd = 'mhd',
  bicycle = 'bicycle',
  scooter = 'scooter',
  chargers = 'chargers',
}

export interface StationData {
  station_id: string
  name?: string | undefined
  lat?: number | undefined
  lon?: number | undefined
  is_virtual_station?: boolean | undefined
  num_bikes_available: number
  is_installed: number
  is_renting: number
  is_returning: number
  last_reported: string
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
// interface StationData extends StationInformationProps, StationStatusProps {}
