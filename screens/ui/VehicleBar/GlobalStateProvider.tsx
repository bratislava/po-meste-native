import React, { useState, createContext, Dispatch, SetStateAction } from 'react'
import TicketSvg from '../../../assets/images/ticket.svg'
import MhdSvg from '../../../assets/images/mhd.svg'
import { VehicleType } from '../../../types'

interface VehicleFilterProps {
  children: React.ReactNode
}

interface VehicleProps {
  id: string
  show: boolean
  icon: (color: string) => React.ReactNode
}

interface VehicleFilterContextProps {
  vehicleTypes: VehicleProps[]
  setVehicleTypes: Dispatch<SetStateAction<VehicleProps[]>>
  timeLineNumber?: number
  setTimeLineNumber: React.Dispatch<React.SetStateAction<number | undefined>>
}

export const GlobalStateContext = createContext({} as VehicleFilterContextProps)

export default function GlobalStateProvider({ children }: VehicleFilterProps) {
  const [timeLineNumber, setTimeLineNumber] = useState<number>()
  const [vehicleTypes, setVehicleTypes] = useState<VehicleProps[]>([
    {
      id: VehicleType.mhd,
      show: true,
      icon: (color: string) => <MhdSvg fill={color} />, //TODO change for vehicle icon
    },
    {
      id: VehicleType.bicycle,
      show: true,
      icon: (color: string) => <TicketSvg fill={color} />, //TODO change for vehicle icon
    },
    {
      id: VehicleType.scooter,
      show: true,
      icon: (color: string) => <TicketSvg fill={color} />, //TODO change for vehicle icon
    },
    {
      id: VehicleType.chargers,
      show: true,
      icon: (color: string) => <TicketSvg fill={color} />, //TODO change for vehicle icon
    },
  ])

  return (
    <GlobalStateContext.Provider
      value={{
        vehicleTypes,
        setVehicleTypes,
        timeLineNumber,
        setTimeLineNumber,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  )
}
